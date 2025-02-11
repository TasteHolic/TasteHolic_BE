import { prisma } from "../../db.config.js";
import { Prisma } from "@prisma/client";
import { authenticateUser } from "../controllers/user.controller.js";

export const getBar = async (barId) => {
  const bar = await prisma.MyBars.findFirst({
    where: { id: barId },
  });

  if (!bar) {
    return null;
  }

  return bar;
};

export const addBar = async (data) => {
  const postExists = await prisma.MyBars.findFirst({
    where: {
      userId: data.userId,
      name: data.name,
    },
  });

  if (postExists) {
    console.log("이미 마이바에 추가되어있는 술입니다.", postExists);
    return null;
  }

  const alcohol = await prisma.Alcohols.findFirst({
    where: { nameKor: data.name },
  });
  const alcoholId = alcohol ? alcohol.id : null;

  const result = await prisma.MyBars.create({
    data: {
      userId: data.userId,
      alcoholId: alcoholId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      name: data.name,
      category: data.category,
    },
  });

  return result.id;
};

export const viewBar = async (userId) => {
  const bar = await prisma.MyBars.findMany({
    where: { userId: userId },
  });

  if (!bar || bar.length === 0) {
    return null;
  }

  return bar;
};

export const deleteBar = async (barId) => {
  const bar = await prisma.MyBars.findUnique({
    where: { id: barId },
  });

  if (!bar) {
    console.log("해당 술이 마이바에 존재하지 않습니다.");
    return null;
  }

  await prisma.MyBars.delete({
    where: { id: barId }, // id로 해당 데이터 삭제
  });

  return bar;
};

export const searchBar = async (userId) => {
  const mybar = await prisma.MyBars.findMany({
    where: { userId: userId },
    select: { category: true },
  });

  const categories = [...new Set(mybar.map((bar) => bar.category))];
  console.log("검색할 카테고리:", categories);

  if (categories.length === 0) {
    return {
      cocktails: [],
      recipes: [],
    };
  }

  // Cocktails 검색
  const cocktailsQuery = Prisma.sql`
        SELECT *
        FROM Cocktails
        WHERE ${Prisma.join(
          categories.map(
            (category) =>
              Prisma.sql`JSON_EXTRACT(ingredientsEng, ${`$."${category}"`}) IS NOT NULL`
          ),
          " OR "
        )}
      `;

  const cocktails = await prisma.$queryRaw(cocktailsQuery);

  // UserRecipes 검색
  const recipesQuery = Prisma.sql`
        SELECT *
        FROM UserRecipes
        WHERE ${Prisma.join(
          categories.map(
            (category) =>
              Prisma.sql`JSON_EXTRACT(ingredients, ${`$."${category}"`}) IS NOT NULL`
          ),
          " OR "
        )}
      `;

  const recipes = await prisma.$queryRaw(recipesQuery);

  return {
    cocktails,
    recipes,
  };
};
