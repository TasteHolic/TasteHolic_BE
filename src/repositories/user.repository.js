import  prisma  from "../../db.config.js";

export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (email, password, nickname) => {
  return await prisma.user.create({
    data: {
      email,
      password,
      nickname,
    },
  });
};

export const deleteUserById = async (userId) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};
