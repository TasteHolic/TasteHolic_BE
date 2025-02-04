const express = require('express');
const { registerUser, loginUser, logoutUser, deleteUser, socialLogin } = require('../controllers/auth.controller');

const router = express.Router();

// 회원가입
router.post('/register', registerUser);

// 로그인
router.post('/login', loginUser);

// 로그아웃 (JWT 블랙리스트 적용)
router.post('/logout', logoutUser);

// 회원 탈퇴
router.delete('/delete', deleteUser);

// 카카오 소셜 로그인
router.post('/social-login/kakao', socialLogin);

module.exports = router;
