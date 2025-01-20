const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 회원가입
exports.registerUser = async (req, res) => {
  const { email, password, nickname } = req.body;
  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: DB에 email 중복 체크 및 데이터 삽입
    return res.status(201).json({ message: '회원가입 성공', userId: 12345 });
  } catch (error) {
    return res.status(500).json({ message: '회원가입 실패', error: error.message });
  }
};

// 로그인
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // TODO: DB에서 이메일로 사용자 조회 및 비밀번호 검증
    const token = jwt.sign({ userId: 12345 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: '로그인 성공', token });
  } catch (error) {
    return res.status(401).json({ message: '로그인 실패', error: error.message });
  }
};

// 카카오 소셜 로그인
exports.socialLogin = async (req, res) => {
  const { accessToken } = req.body;
  try {
    // TODO: 카카오 API 호출 및 토큰 검증
    const token = jwt.sign({ userId: 12345 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: '카카오 로그인 성공', token });
  } catch (error) {
    return res.status(401).json({ message: '카카오 로그인 실패', error: error.message });
  }
};
