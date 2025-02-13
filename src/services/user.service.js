import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import { getUserByEmail, createUser, deleteUserById } from "../repositories/user.repository.js";

dotenv.config();

const SALT_ROUNDS = 12;

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET 환경 변수가 설정되지 않았습니다.");
    throw new Error("서버 오류: JWT 설정이 올바르지 않습니다.");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ 회원가입 서비스
export const registerUser = async ({ email, password, passwordConfirm, nickname, termsAgreement, privacyAgreement, ageAgreement }) => {
  if (!email || !password || !passwordConfirm || !nickname) {
    throw new Error("모든 필드를 입력해 주세요.");
  }
  if (password !== passwordConfirm) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }
  if (password.length < 8) {
    throw new Error("비밀번호는 최소 8자 이상이어야 합니다.");
  }
  if (!termsAgreement || !privacyAgreement || !ageAgreement) {
    throw new Error("필수 약관에 동의해야 합니다.");
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await createUser({
    email,
    password: hashedPassword,
    nickname,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!newUser?.id) {
    throw new Error("회원가입 처리 중 오류가 발생했습니다.");
  }

  return { message: "회원가입 성공", userId: newUser.id.toString() };
};

// ✅ 로그인 서비스
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("이메일과 비밀번호를 입력해 주세요.");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const token = generateToken(user.id);
  return { message: "로그인 성공", token };
};

// ✅ 회원탈퇴 서비스
export const deleteUser = async (userId) => {
  if (!userId) {
    throw new Error("유효하지 않은 유저 ID입니다.");
  }

  await deleteUserById(userId);
  return { message: "회원 탈퇴 성공" };
};

// ✅ 소셜 로그인 서비스 (카카오 & 구글)
export const socialLogin = async ({ provider, accessToken }) => {
  if (!accessToken) {
    throw new Error("액세스 토큰이 필요합니다.");
  }

  try {
    let userInfo;
    const providerEndpoints = {
      kakao: "https://kapi.kakao.com/v2/user/me",
      google: "https://www.googleapis.com/oauth2/v3/userinfo",
    };

    if (!providerEndpoints[provider]) {
      throw new Error("지원되지 않는 소셜 로그인 방식입니다.");
    }

    const response = await axios.get(providerEndpoints[provider], {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    userInfo = response.data;

    if (!userInfo?.id) {
      throw new Error(`${provider} 사용자 정보를 가져오는 데 실패했습니다.`);
    }

    const token = generateToken(userInfo.id);
    return { message: `${provider} 로그인 성공`, token };
  } catch (error) {
    console.error(`${provider} 로그인 오류:`, error.response?.data || error.message);
    throw new Error(`${provider} 인증 실패`);
  }
};

// ✅ Google OAuth 로그인
export const googleLogin = async (accessToken) => {
  return socialLogin({ provider: "google", accessToken });
};

// ✅ 로그아웃 서비스
export const logoutUser = async () => {
  return { message: "로그아웃 성공" };
};
