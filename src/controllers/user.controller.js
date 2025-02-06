import { StatusCodes } from "http-status-codes";
import { validateRegister, validateLogin } from "../dtos/user.dto.js";
import * as userService from "../services/user.service.js";
import jwt from "jsonwebtoken";

// ✅ 인증 유틸 함수 개선 (에러 핸들링 추가)
const authenticateUser = (req) => {
  try {
    const token = req.cookies?.token;
    if (!token) throw new Error("인증이 필요합니다.");
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("유효하지 않은 토큰입니다.");
  }
};

// ✅ 함수 네이밍 일관성 유지
export const handleRegisterUser = async (req, res, next) => {
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
  }

  try {
    const result = await userService.registerUser(req.body);
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    next(err);
  }
};

export const handleLoginUser = async (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
  }

  try {
    const result = await userService.loginUser(req.body);
    res
      .status(StatusCodes.OK)
      .cookie("token", result.token, { httpOnly: true })
      .json({ message: "로그인 성공", token: result.token });
  } catch (err) {
    next(err);
  }
};

export const handleLogoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token", { httpOnly: true }).json({ message: "로그아웃 성공" });
  } catch (err) {
    next(err);
  }
};

// ✅ handleDeleteUser로 네이밍 변경
export const handleDeleteUser = async (req, res, next) => {
  try {
    const user = authenticateUser(req);
    if (!user?.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "사용자 인증 실패" });
    }

    const result = await userService.deleteUser(user.id);
    res.status(StatusCodes.OK).json({ message: "회원 삭제 완료", result });
  } catch (err) {
    next(err);
  }
};

export const handleSocialLogin = async (req, res, next) => {
  try {
    const result = await userService.socialLogin(req.body.accessToken);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    next(err);
  }
};
