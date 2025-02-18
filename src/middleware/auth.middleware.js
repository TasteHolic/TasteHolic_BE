import jwt from "jsonwebtoken";
import { NoPermissionError } from "../error.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

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

export const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null; // 로그인하지 않은 경우도 요청 허용
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
      return next();
    }
    req.user = user;
    next();
  });
};
