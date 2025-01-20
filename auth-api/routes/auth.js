const express = require('express');
const { signup, login, kakaoLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/kakao', kakaoLogin);

module.exports = router;
