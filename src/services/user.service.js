const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { getUserByEmail, createUser, deleteUserById } = require('../models/userModel'); // DB 관련 함수 가정

dotenv.config();

const SALT_ROUNDS = 12;

// JWT 토큰 생성 함수
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// JWT 인증 미들웨어 함수
const authenticateUser = (req) => {
  const token = req.cookies?.token;
  if (!token) throw new Error('인증이 필요합니다.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    throw new Error('유효하지 않은 토큰입니다.');
  }
};

// 회원가입
exports.registerUser = async (req, res) => {
  const { email, password, nickname } = req.body;
  if (!email || !password || !nickname) {
    return res.status(400).json({ message: '모든 필드를 입력해 주세요.' });
  }
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await createUser(email, hashedPassword, nickname);

    return res.status(201).json({ message: '회원가입 성공', userId: newUser.id });
  } catch (error) {
    return res.status(500).json({ message: '회원가입 실패', error: error.message });
  }
};

// 로그인
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해 주세요.' });
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = generateToken(user.id);
    return res
      .status(200)
      .cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Strict' })
      .json({ message: '로그인 성공', token });
  } catch (error) {
    return res.status(500).json({ message: '로그인 실패', error: error.message });
  }
};

// 로그아웃 (쿠키 삭제)
exports.logoutUser = (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Strict' })
      .json({ message: '로그아웃 성공' });
  } catch (error) {
    return res.status(500).json({ message: '로그아웃 실패', error: error.message });
  }
};

// 회원 탈퇴
exports.deleteUser = async (req, res) => {
  try {
    const userId = authenticateUser(req);
    await deleteUserById(userId);
    return res.status(200).json({ message: '회원 탈퇴 성공' });
  } catch (error) {
    return res.status(500).json({ message: '회원 탈퇴 실패', error: error.message });
  }
};

// 카카오 소셜 로그인
exports.socialLogin = async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).json({ message: '액세스 토큰이 필요합니다.' });
  }
  try {
    // TODO: 실제 카카오 API 호출 로직 추가
    const user = { id: 12345 }; // 가짜 데이터 (실제 API 호출 필요)

    const token = generateToken(user.id);
    return res.status(200).json({ message: '카카오 로그인 성공', token });
  } catch (error) {
    return res.status(401).json({ message: '카카오 로그인 실패', error: error.message });
  }
};
