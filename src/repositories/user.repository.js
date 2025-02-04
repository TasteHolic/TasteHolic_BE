const db = require('../db.config'); // 가정된 DB 연결 모듈

// 이메일로 사용자 조회
exports.getUserByEmail = async (email) => {
  return db.user.findUnique({ where: { email } });
};

// 새 사용자 생성
exports.createUser = async (email, hashedPassword, nickname) => {
  return db.user.create({ data: { email, password: hashedPassword, nickname } });
};