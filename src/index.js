const express = require('express');
const cookieParser = require('cookie-parser');
const userController = require('./controllers/user.controller');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

// 라우터 설정
app.post('/api/register', userController.registerUser);
app.post('/api/login', userController.loginUser);
app.post('/api/logout', userController.logoutUser);
app.delete('/api/user', userController.deleteUser);
app.post('/api/social-login', userController.socialLogin);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
