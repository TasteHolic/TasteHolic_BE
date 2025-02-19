import { prisma } from "../../db.config.js";
import { deleteOldImage } from "../middleware/imageUpload.middleware.js";

export const changeProfile = async (userId, data) => {
  const updateData = {};

  if (data.imageUrl !== undefined) {
    const oldUrl = await prisma.Users.findUnique({
      where: { id: userId },
      select: { imageUrl: true }
    });
    console.log(oldUrl);
    
    // oldUrl.imageUrl로 S3에서 기존 이미지 삭제
    if (oldUrl && oldUrl.imageUrl) {
      await deleteOldImage(oldUrl.imageUrl);
    }

    // 새로운 이미지 URL 업데이트
    updateData.imageUrl = data.imageUrl;
  }
  if (data.nickname !== undefined) updateData.nickname = data.nickname;
  if (data.message !== undefined) updateData.message = data.message;
  if (data.password !== undefined) updateData.password = data.password;
  if (data.updatedAt !== undefined) updateData.updatedAt = data.updatedAt;

  const profile = await prisma.Users.update({
    where: { id: userId },
    data: updateData,
  });

  return profile;
};

export const getProfile = async (userId) => {
  const profile = await prisma.Users.findUnique({
    where: { id: userId },
    select: {
      imageUrl: true,
      nickname: true,
      message: true,  
      email: true,  
    },
  });


  return profile;
};