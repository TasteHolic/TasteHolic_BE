import { prisma } from "../../db.config.js";

export const changeProfile = async (userId, data) => {
  const updateData = {};

  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
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