import { validateRegister, validateLogin } from "../dtos/user.dto.js";
import * as userService from "../services/user.service.js";
import jwt from "jsonwebtoken";

const authenticateUser = (req) => {
  const token = req.cookies?.token;
  if (!token) throw new Error("인증이 필요합니다.");
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new Error("유효하지 않은 토큰입니다.");
  }
};

export const registerUser = async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const result = await userService.loginUser(req.body);
    res
      .status(200)
      .cookie("token", result.token, { httpOnly: true })
      .json({ message: "로그인 성공", token: result.token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true }).json({ message: "로그아웃 성공" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = authenticateUser(req);
    await userService.deleteUser(user.id);
    res.status(200).json({ message: "회원 탈퇴 성공" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const socialLogin = async (req, res) => {
  try {
    const result = await userService.socialLogin(req.body.accessToken);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
