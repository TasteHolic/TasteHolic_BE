const express = require('express');
const { registerUser, loginUser, socialLogin } = require('./userController');

const router = express.Router();

// 회원가입
router.post('/register', registerUser);

// 로그인
router.post('/login', loginUser);

// 카카오 소셜 로그인
router.post('/social-login/kakao', socialLogin);

module.exports = router;

