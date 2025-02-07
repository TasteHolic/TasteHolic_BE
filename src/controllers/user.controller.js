import { StatusCodes } from "http-status-codes";
import { validateRegister, validateLogin } from "../dtos/user.dto.js";
import * as userService from "../services/user.service.js";
import jwt from "jsonwebtoken";

const authenticateUser = (req) => {
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

const jsonResponse = (res, status, data) => {
  const serializedData = JSON.parse(
    JSON.stringify(data, (key, value) => (typeof value === "bigint" ? value.toString() : value))
  );
  res.status(status).json({
    resultType: "SUCCESS",
    error: null,
    success: serializedData,
  });
};

const jsonErrorResponse = (res, status, errorCode, reason, data = null) => {
  res.status(status).json({
    resultType: "FAIL",
    error: { errorCode, reason, data },
    success: null,
  });
};

export const handleRegisterUser = async (req, res, next) => {
  const { error } = validateRegister(req.body);
  if (error) {
    return jsonErrorResponse(res, StatusCodes.BAD_REQUEST, "validation_error", error.details[0].message);
  }
  try {
    const result = await userService.registerUser(req.body);
    jsonResponse(res, StatusCodes.CREATED, result);
  } catch (err) {
    jsonErrorResponse(res, err.statusCode || StatusCodes.CONFLICT, "registration_error", err.message);
  }
};

export const handleLoginUser = async (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return jsonErrorResponse(res, StatusCodes.BAD_REQUEST, "validation_error", error.details[0].message);
  }

  try {
    const result = await userService.loginUser(req.body);
    res
      .status(StatusCodes.OK)
      .cookie("token", result.token, { httpOnly: true })
      .json({
        resultType: "SUCCESS",
        error: null,
        success: { message: "로그인 성공", token: result.token },
      });
  } catch (err) {
    jsonErrorResponse(res, StatusCodes.UNAUTHORIZED, "login_error", err.message);
  }
};

export const handleLogoutUser = async (req, res, next) => {
  try {
    res
      .clearCookie("token", { httpOnly: true })
      .json({
        resultType: "SUCCESS",
        error: null,
        success: { message: "로그아웃 성공" },
      });
  } catch (err) {
    next(err);
  }
};

export const handleDeleteUser = async (req, res, next) => {
  try {
    const user = authenticateUser(req);
    if (!user?.id) {
      return jsonErrorResponse(res, StatusCodes.UNAUTHORIZED, "auth_error", "사용자 인증 실패");
    }

    const result = await userService.deleteUser(user.id);
    jsonResponse(res, StatusCodes.OK, { message: "회원 삭제 완료", result });
  } catch (err) {
    jsonErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "delete_error", err.message);
  }
};

export const handleSocialLogin = async (req, res, next) => {
  try {
    const result = await userService.socialLogin(req.body.accessToken);
    jsonResponse(res, StatusCodes.OK, result);
  } catch (err) {
    jsonErrorResponse(res, StatusCodes.BAD_REQUEST, "social_login_error", err.message);
  }
};
