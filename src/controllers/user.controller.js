import { StatusCodes } from "http-status-codes";
import { validateRegister, validateLogin } from "../dtos/user.dto.js";
import * as userService from "../services/user.service.js";

import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.middleware.js";
import axios from 'axios';

import passport from '../config/passport.js';


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

export const handleCheckEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "이메일을 입력하세요." });
    }

    const isDuplicate = await userService.checkEmailDuplicate(email);

    if (isDuplicate) {
      return res.status(StatusCodes.CONFLICT).json({ error: "이미 사용 중인 이메일입니다." });
    }

    res.status(StatusCodes.OK).json({ message: "사용 가능한 이메일입니다." });
  } catch (err) {
    next(err);
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
      .success({ message: "로그인 성공", token: result.token });
  } catch (err) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: err.message });
  }
};

export const handleLogoutUser = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({ message: "로그아웃 성공" });
  } catch (err) {
    next(err);
  }
};
export const handleVerifyPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "비밀번호를 입력하세요." });
    }

    const userId = req.user.id;
    const isValid = await userService.verifyUserPassword(userId, password);

    if (!isValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: "비밀번호가 올바르지 않습니다." });
    }

    res.status(StatusCodes.OK).json({ message: "비밀번호 확인 성공" });
  } catch (err) {
    next(err);
  }
};


export const handleDeleteUser = async (req, res, next) => {
  try {

    const userId = req.user.id;
    const result = await userService.deleteUser(userId);
    res
      .status(StatusCodes.OK)
      .success({ message: "회원 삭제 완료", result });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

// 카카오 로그인
export const handleKakaoLogin = async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "인증 코드가 필요합니다." });
  }

  try {
    const result = await userService.kakaoLogin(code); // 서비스 함수 호출
    return res.status(StatusCodes.OK).json(result); // 성공 응답
  } catch (error) {
    next(error);
  }
};

// 카카오 사용자 정보 가져오기
const getKakaoUserInfo = async (accessToken) => {
  try {
    const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      id: response.data.id,
      email: response.data.kakao_account?.email || "",
      nickname: response.data.properties?.nickname || "사용자",
    };
  } catch (error) {
    throw new Error("카카오 사용자 정보를 가져오는 데 실패했습니다.");
  }
};



// 카카오 액세스 토큰을 받아오기 위한 요청
const getKakaoAccessToken = async (code) => {
  try {
    const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY, // 카카오 REST API 키
        redirect_uri: process.env.KAKAO_REDIRECT_URI, // 리디렉션 URI
        code, // 위에서 받은 `code`
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error("액세스 토큰 요청에 실패했습니다.");
  }
};

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Authentication failed' });

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
};