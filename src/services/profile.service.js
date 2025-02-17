import bcrypt from "bcryptjs";
import { changeProfile, getProfile } from "../repositories/profile.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";

const SALT_ROUNDS = 12;

export const profileChange = async (data, userId, imageUrl) => {
  const updatedData = {};

  if (imageUrl) {
    updatedData.imageUrl = imageUrl;
  }

  if (data.nickname) {
    updatedData.nickname = data.nickname;
  }

  if (data.message) {
    updatedData.message = data.message;
  }

  if (data.password) {
    updatedData.password = data.password;
  }

  updatedData.updatedAt = new Date().toISOString(); 

  const profile = await changeProfile(userId, updatedData);

  return { message: "프로필 업데이트 성공" };
};

export const profileGet = async (userId) => {
  
  const profile = await getProfile(userId);

  return responseFromUser(profile);
};