import { prisma } from "../../db.config.js";
import { Prisma } from "@prisma/client";

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

  let id = null;
  let image = null;

  if (alcohol != null) {
    id = alcohol.id;
    image = alcohol.imageUrl;
  }

  const result = await prisma.MyBars.create({
    data: {
      userId: data.userId,
      alcoholId: id,
      name: data.name,
      category: data.category,
      imageUrl: image,
    },
  });

  return result.id;
};

export const viewBar = async (userId) => {
  const bar = await prisma.MyBars.findMany({
    where: { userId: userId },
    select: {
      id: true,
      alcoholId: true,
      name: true,
      category: true,
      imageUrl: true,
    },
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
  // 🔹 유저가 보유한 술 정보 가져오기
  const mybar = await prisma.MyBars.findMany({
    where: { userId: userId },
    select: { category: true, name: true }, // ✅ 카테고리 + 술 이름 가져오기
  });

  // 🔹 유저가 보유한 술 이름과 카테고리 목록 만들기
  const ingredients = [...new Set(mybar.map((bar) => bar.name))]; // ✅ 술 이름 리스트
  const categories = [...new Set(mybar.map((bar) => bar.category))]; // ✅ 카테고리 리스트

  if (ingredients.length === 0 && categories.length === 0) {
    return {
      cocktails: [],
      recipes: [],
    };
  }

  // 사용할 재료 및 카테고리 리스트 합치기
  const searchItems = [...ingredients, ...categories];

  // 🔹 Cocktails 검색 (이름 + 카테고리 포함)
  // JSON_KEYS로 JSON 객체의 모든 키를 문자열로 변환한 후, LIKE로 부분 매칭
  const cocktailsQuery = Prisma.sql`
        SELECT *
        FROM Cocktails
        WHERE (${Prisma.join(
          searchItems.map(
            (item) =>
              Prisma.sql`
                CAST(JSON_KEYS(ingredientsEng) AS CHAR) LIKE CONCAT('%', ${item}, '%')
                OR CAST(JSON_KEYS(ingredientsKor) AS CHAR) LIKE CONCAT('%', ${item}, '%')
              `
          ),
          " OR "
        )})
      `;

  const cocktails = await prisma.$queryRaw(cocktailsQuery);

  // 🔹 UserRecipes 검색 (이름 + 카테고리 포함)
  const recipesQuery = Prisma.sql`
        SELECT *
        FROM UserRecipes
        WHERE (${Prisma.join(
          searchItems.map(
            (item) =>
              Prisma.sql`
                CAST(JSON_KEYS(ingredients) AS CHAR) LIKE CONCAT('%', ${item}, '%')
              `
          ),
          " OR "
        )})
      `;

  const recipes = await prisma.$queryRaw(recipesQuery);
  return {
    cocktails,
    recipes,
  };
};

export const findAlcoholsByCategory = async (category) => {
  return await prisma.alcohols.findMany({
    where: {
      OR: [{ categoryEng: category }, { categoryKor: category }],
    },
    select: {
      id: true,
      nameEng: true,
      nameKor: true,
    },
  });
};
