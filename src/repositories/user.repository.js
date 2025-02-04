// src/repositories/user.repository.js

const prisma = require('../prisma/client');

exports.getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

exports.createUser = async (email, password, nickname) => {
  return await prisma.user.create({
    data: {
      email,
      password,
      nickname,
    },
  });
};

exports.deleteUserById = async (userId) => {
  return await prisma.user.delete({
    where: { id: userId },
  });
};
