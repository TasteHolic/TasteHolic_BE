const bcrypt = require('bcryptjs');
const { getUserByEmail, createUser } = require('../repositories/user.repository');
const SALT_ROUNDS = 12;

exports.registerUser = async (email, password, nickname) => {
  // 이메일 중복 체크
  const existingUser = await getUserByEmail(email);
  if (existingUser) throw new Error('이미 존재하는 이메일입니다.');

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // DB에 사용자 저장
  const newUser = await createUser(email, hashedPassword, nickname);
  return { message: '회원가입 성공', userId: newUser.id };
};