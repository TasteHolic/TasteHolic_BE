import { StatusCodes } from "http-status-codes";
import { validateRegister, validateLogin } from "../dtos/user.dto.js";
import * as userService from "../services/user.service.js";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.middleware.js";

// ✅ 인증된 사용자 가져오기
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

// ✅ 이메일 중복 확인 API
export const handleCheckEmailDuplicate = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "이메일을 입력하세요." });
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ error: "이미 존재하는 이메일입니다." });
    }

    res.status(StatusCodes.OK).json({ message: "사용 가능한 이메일입니다." });
  } catch (err) {
    next(err);
  }
};

// ✅ 회원가입 API
export const handleRegisterUser = async (req, res, next) => {
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
  }

  try {
    const result = await userService.registerUser(req.body);
    res.status(StatusCodes.CREATED).json({ message: "회원가입 성공", user: result });
  } catch (err) {
    next(err);
  }
};

// ✅ 로그인 API
export const handleLoginUser = async (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
  }

  try {
    const result = await userService.loginUser(req.body);

    res.cookie("token", result.token, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(StatusCodes.OK).json({ message: "로그인 성공" });
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: err.message });
  }
};

// ✅ 로그아웃 API
export const handleLogoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(StatusCodes.OK).json({ message: "로그아웃 성공" });
  } catch (err) {
    next(err);
  }
};

// ✅ 회원탈퇴 API
export const handleDeleteUser = async (req, res, next) => {
  try {
    const user = await authenticateToken(req);
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




// ✅ 소셜 로그인 API (카카오)
export const handleSocialLogin = async (req, res, next) => {
  try {
    const { provider, accessToken } = req.body;
    if (!provider || !accessToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "provider와 accessToken을 입력하세요." });
    }

    const result = await userService.socialLogin({ provider, accessToken });

    res.cookie("token", result.token, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(StatusCodes.OK).json({ message: `${provider} 로그인 성공` });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};

// ✅ 구글 로그인 API
export const handleGoogleLogin = async (req, res, next) => {
  try {
    const result = await userService.googleLogin(req.body.accessToken);

    res.status(StatusCodes.OK).json({ message: "구글 로그인 성공", token: result.token });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};
