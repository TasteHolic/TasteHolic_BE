import bcrypt from "bcryptjs";
import { changeProfile, getProfile } from "../repositories/profile.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";

const SALT_ROUNDS = 12;

export const profileChange = async (data, userId, imageUrl) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  
  const profile = await changeProfile({
      userId: userId,
      imageUrl: imageUrl,
      nickname: data.nickname,
      message: data.message,
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    });

  return { message: "프로필 업데이트 성공"};
};

export const profileGet = async (userId) => {
  
  const profile = await getProfile(userId);

  return responseFromUser(profile);
};