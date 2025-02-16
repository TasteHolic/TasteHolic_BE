import jwt from 'jsonwebtoken';
import { NoPermissionError } from '../error.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      throw new NoPermissionError("인증 토큰이 없습니다.");
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        throw new NoPermissionError("유효하지 않은 토큰입니다.");
      }
      req.user = user;
      next();
    });
  };

  export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.status(401).json({ message: 'Unauthorized' });
  };
  