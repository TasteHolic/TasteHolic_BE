//repository

import { prisma } from "../../db.config.js";

const selectCocktailFields = {
  id: true,
  nameKor: true,
  nameEng: true,
  abv: true,
  aromas: true,
  tastes: true,
  recipe: true,
  timing: true
};

const selectAlcoholFields = {
  id: true,
  nameKor: true,
  nameEng: true,
  abv: true,
  aromas: true,
  tastes: true,
  categoryEng: true,
  categoryKor: true,
};

export const findAlcoholsAndCocktails = async (category, minAbv, maxAbv, aroma, taste, timing) => {
  const conditions = { AND: [] };

  // 도수 범위 필터
  if (minAbv !== undefined || maxAbv !== undefined) {
    conditions.AND.push({
      abv: {
        gte: minAbv ?? 0,
        lte: maxAbv ?? 100,
      },
    });
  }

  // 아로마 필터
  if (aroma?.length > 0) {
    conditions.AND.push(...aroma.map(a => ({ aromas: { array_contains: a } })));
  }

  // 맛 필터
  if (taste?.length > 0) {
    conditions.AND.push(...taste.map(t => ({ tastes: { array_contains: t } })));
  }

  // timing 필터 (Cocktail 전용)
  if (timing?.length > 0) {
    conditions.AND.push(...timing.map(time => ({ timing: { array_contains: time } })));
  }

  // 카테고리 필터 적용
  if (category) {
    switch (category) {
      case "Cocktail":
        return await prisma.cocktails.findMany({ where: conditions, select: selectCocktailFields });

      case "Whiskey":
        conditions.AND.push({ Category: "Whiskey" });
        return await prisma.alcohols.findMany({ where: conditions, select: selectAlcoholFields });

      case "Gin/Rum/Tequila":
        conditions.AND.push({ Category: { in: ["Gin", "Rum", "Tequila"] } });
        return await prisma.alcohols.findMany({ where: conditions, select: selectAlcoholFields });

      case "Others":
        conditions.AND.push({ Category: { notIn: ["Whiskey", "Gin", "Rum", "Tequila"] } });
        return await prisma.alcohols.findMany({ where: conditions, select: selectAlcoholFields });

      case "All": 
        const cocktails = await prisma.cocktails.findMany({ where: conditions, select: selectCocktailFields });
        const alcohols = await prisma.alcohols.findMany({ where: conditions, select: selectAlcoholFields });
        return [...cocktails, ...alcohols];

    }
  }

  // category가 없으면 모든 데이터를 가져옴
  const cocktails = await prisma.cocktails.findMany({ where: conditions, select: selectCocktailFields });
  const alcohols = await prisma.alcohols.findMany({ where: conditions, select: selectAlcoholFields });

  return [...cocktails, ...alcohols];
};