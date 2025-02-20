import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserByEmail, getUserById, createUser, deleteUserById } from "../repositories/user.repository.js";

dotenv.config();

const SALT_ROUNDS = 12;

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const registerUser = async ({ email, password, nickname }) => {
  if (!email || !password || !nickname) {
    throw new Error("모든 필드를 입력해 주세요.");
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    const error = new Error("이미 존재하는 이메일입니다.");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await createUser({
    email,
    password: hashedPassword,
    nickname,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return { message: "회원가입 성공", userId: newUser.id.toString() };
};

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

export const deleteUser = async (userId) => {
  if (!userId) {
    throw new Error("유효하지 않은 유저 ID입니다.");
  }

  await deleteUserById(userId);
  return { message: "회원 탈퇴 성공" };
};

export const socialLogin = async (accessToken) => {
  if (!accessToken) {
    throw new Error("액세스 토큰이 필요합니다.");
  }

  const kakaoUser = { id: 12345 }; // 예시 데이터
  const token = generateToken(kakaoUser.id);
  return { message: "카카오 로그인 성공", token };
};

export const logoutUser = async () => {
  return { message: "로그아웃 성공" };
};


export const checkEmailDuplicate = async (email) => {
  const existingUser = await getUserByEmail(email);
  return !!existingUser; // 존재하면 true, 없으면 false 반환
};


export const verifyUserPassword = async (userId, password) => {
  const user = await getUserById(userId); // 여기서 호출

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return bcrypt.compare(password, user.password);
};
