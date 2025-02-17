import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserByEmail = async (email) => {
  const user = await prisma.users.findFirst({
    where: { email },
  });
  return user ? { ...user, id: user.id.toString() } : null;
};

export const createUser = async (data) => {
  const result = await prisma.users.create({
    data: {
      email: data.email,
      password: data.password,
      nickname: data.nickname,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  });
  return { ...result, id: result.id.toString() };
};

export const deleteUserById = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: BigInt(userId) },
  });

  if (!user) {
    throw new Error("해당 ID의 사용자가 존재하지 않습니다.");
  }

  await prisma.users.delete({
    where: { id: BigInt(userId) },
  });

  return { ...user, id: user.id.toString() };
};


export const getUserById = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });
  return user ? { ...user, id: user.id.toString() } : null;
};
