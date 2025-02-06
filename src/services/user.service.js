// user.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// ※ user.repository.js의 함수들 재활용 권장
import { getUserByEmail, createUser, deleteUserById } from "../repositories/user.repository.js";

dotenv.config();

const SALT_ROUNDS = 12;

// JWT 토큰 생성 함수
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// 회원가입
export const registerUser = async ({ email, password, nickname }) => {
  if (!email || !password || !nickname) {
    throw new Error("모든 필드를 입력해 주세요.");
  }

  // 이미 존재하는 이메일인지 확인
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  // 비밀번호 해시 후 유저 생성
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await createUser(email, hashedPassword, nickname);

  // 컨트롤러에서 결과를 받아 처리할 수 있도록 객체만 반환
  return { message: "회원가입 성공", userId: newUser.id };
};

// 로그인
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("이메일과 비밀번호를 입력해 주세요.");
  }

  // 이메일로 유저 검색
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  // 비밀번호 비교
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  // JWT 토큰 생성
  const token = generateToken(user.id);
  return { message: "로그인 성공", token };
};

// 로그아웃
export const logoutUser = async () => {
  // 필요한 로직이 있다면 추가(예: 세션 관리). 
  // 여기서는 단순히 성공 메시지만 반환한다고 가정
  return { message: "로그아웃 성공" };
};

// 회원 탈퇴
export const deleteUser = async (userId) => {
  if (!userId) {
    throw new Error("유효하지 않은 유저 ID입니다.");
  }

  // repository에서 삭제 처리
  await deleteUserById(userId);
  return { message: "회원 탈퇴 성공" };
};

// 카카오 소셜 로그인
export const socialLogin = async (accessToken) => {
  if (!accessToken) {
    throw new Error("액세스 토큰이 필요합니다.");
  }

  // 실제 카카오 API 호출 로직은 추후 추가
  const kakaoUser = { id: 12345 }; // 가짜 예시 데이터

  // 카카오 유저 정보로 JWT 발급
  const token = generateToken(kakaoUser.id);
  return { message: "카카오 로그인 성공", token };
};
