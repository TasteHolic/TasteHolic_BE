import { prisma } from "../../db.config.js";

export const changeProfile = async (data) => {
  const profile = await prisma.Users.update({
    where: { id: data.userId },
    data: {
           imageUrl: data.imageUrl, 
           nickname: data.nickname,
           message: data.message,
           password: data.password,
           updatedAt: data.updatedAt,
          }
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