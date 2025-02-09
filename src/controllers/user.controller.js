import { StatusCodes } from "http-status-codes";
import { validateRegister, validateLogin } from "../dtos/user.dto.js";
import * as userService from "../services/user.service.js";
import jwt from "jsonwebtoken";

export const authenticateUser = (req) => {
  try {
    const token = req.cookies?.token;
    if (!token) throw new Error("인증이 필요합니다.");
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("토큰이 만료되었습니다.");
    }
    throw new Error("유효하지 않은 토큰입니다.");
  }
};

export const handleRegisterUser = async (req, res, next) => {
  const { error } = validateRegister(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }
  try {
    const result = await userService.registerUser(req.body);
    res.status(StatusCodes.CREATED).success(result);
  } catch (err) {
    next(err);
  }
};

export const handleLoginUser = async (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error.details[0].message });
  }

  try {
    const result = await userService.loginUser(req.body);
    res
      .status(StatusCodes.OK)
      .cookie("token", result.token, { httpOnly: true })
      .success({ message: "로그인 성공", token: result.token });
  } catch (err) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: err.message });
  }
};

export const handleLogoutUser = async (req, res, next) => {
  try {
    res
      .clearCookie("token", { httpOnly: true })
      .success({ message: "로그아웃 성공" });
  } catch (err) {
    next(err);
  }
};

export const handleDeleteUser = async (req, res, next) => {
  try {
    const user = authenticateUser(req);
    if (!user?.id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "사용자 인증 실패" });
    }

    const result = await userService.deleteUser(user.id);
    res
      .status(StatusCodes.OK)
      .success({ message: "회원 삭제 완료", result });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

export const handleSocialLogin = async (req, res, next) => {
  try {
    const result = await userService.socialLogin(req.body.accessToken);
    res.status(StatusCodes.OK).success(result);
  } catch (err) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: err.message });
  }
};
