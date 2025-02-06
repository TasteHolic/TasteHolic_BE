import { prisma } from "../../db.config.js";

export const getUserByEmail = async (email) => {
    const user = await prisma.Users.findFirst({
        where: { email },
    });

    if (!user) {
        return null;
    }

    return user;
};

export const createUser = async (data) => {
    const userExists = await prisma.Users.findFirst({
        where: { email: data.email },
    });

    if (userExists) {
        console.log("이미 존재하는 이메일입니다.", userExists);
        return null;
    }

    const result = await prisma.Users.create({
        data: {
            email: data.email,
            password: data.password,
            nickname: data.nickname,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        },
    });

    return result.id;
};

export const deleteUserById = async (userId) => {
    const user = await prisma.Users.findUnique({
        where: { id: userId },
    });

    if (!user) {
        console.log("해당 ID의 사용자가 존재하지 않습니다.");
        return null;
    }

    await prisma.Users.delete({
        where: { id: userId },
    });

    return user;
};
