const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { getUserByEmail, createUser, deleteUserById } = require('../models/userModel'); // DB 관련 함수 가정

dotenv.config(); // 환경 변수 로드

const SALT_ROUNDS = 12; // 비밀번호 해싱 강도

// JWT 토큰 생성 함수
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// 회원가입
exports.registerUser = async (req, res) => {
  const { email, password, nickname } = req.body;
  try {
    // 이메일 중복 체크
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // DB에 사용자 저장
    const newUser = await createUser(email, hashedPassword, nickname);

    return res.status(201).json({ message: '회원가입 성공', userId: newUser.id });
  } catch (error) {
    return res.status(500).json({ message: '회원가입 실패', error: error.message });
  }
};

// 로그인
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = generateToken(user.id);
    return res
      .status(200)
      .cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }) // 쿠키 보안 설정 추가
      .json({ message: '로그인 성공' });
  } catch (error) {
    return res.status(500).json({ message: '로그인 실패', error: error.message });
  }
};

// 로그아웃 (쿠키 삭제)
exports.logoutUser = (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' })
      .json({ message: '로그아웃 성공' });
  } catch (error) {
    return res.status(500).json({ message: '로그아웃 실패', error: error.message });
  }
};

// 회원 탈퇴
exports.deleteUser = async (req, res) => {
  const userId = req.user?.id; // JWT 토큰에서 사용자 ID 가져오기
  if (!userId) {
    return res.status(401).json({ message: '인증이 필요합니다.' });
  }

  try {
    await deleteUserById(userId);
    return res.status(200).json({ message: '회원 탈퇴 성공' });
  } catch (error) {
    return res.status(500).json({ message: '회원 탈퇴 실패', error: error.message });
  }
};

// 카카오 소셜 로그인
exports.socialLogin = async (req, res) => {
  const { accessToken } = req.body;
  try {
    // TODO: 카카오 API 호출 및 사용자 검증
    const user = { id: 12345 }; // 가짜 데이터 (실제로는 카카오 API에서 사용자 정보를 받아야 함)

    const token = generateToken(user.id);
    return res.status(200).json({ message: '카카오 로그인 성공', token });
  } catch (error) {
    return res.status(401).json({ message: '카카오 로그인 실패', error: error.message });
  }
};
