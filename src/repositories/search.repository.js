// repository

import { prisma } from "../../db.config.js";
import { Prisma } from "@prisma/client";

const selectAlcoholFields = {
  id: true,
  nameKor: true,
  nameEng: true,
  aromas: true,
  tastes: true,
  categoryEng: true,
  categoryKor: true
};

const selectCocktailFields = {
  id: true,
  nameKor: true,
  nameEng: true,
  aromas: true,
  tastes: true,
  recipe: true
};

export const findAlcoholsAndCocktails = async (category, minAbv, maxAbv, aroma, taste) => {
  const conditions = {
    AND: [
      { abv: { gte: minAbv, lte: maxAbv } },
      ...(aroma?.length > 0 && !aroma.includes("전체 선택") 
          ? [{ OR: aroma.map(a => ({ aromas: { array_contains: a } })) }] 
          : []),
      ...(taste?.length > 0 && !taste.includes("전체 선택") 
          ? [{ OR: taste.map(t => ({ tastes: { array_contains: t } })) }] 
          : []),
    ],
  };

  switch (category) {
    case "Cocktail":
      return await prisma.cocktails.findMany({
        where: conditions,
        select: selectCocktailFields,
      });

    case "Whiskey":
      return await prisma.alcohols.findMany({
        where: {
          OR: [
            { Category: "Whiskey" },
            conditions,
          ],
        },
        select: selectAlcoholFields,
      });

    case "Gin/Rum/Tequila":
      return await prisma.alcohols.findMany({
        where: {
          OR: [
            { Category: { in: ["Gin", "Rum", "Tequila"] } },
            conditions,
          ],
        },
        select: selectAlcoholFields,
      });

    case "etc":
      return await prisma.alcohols.findMany({
        where: {
          OR: [
            { Category: { notIn: ["Whiskey", "Gin", "Rum", "Tequila"] } },
            conditions,
          ],
        },
        select: selectAlcoholFields,
      });

    case "All":
      const cocktails = await prisma.cocktails.findMany({
        where: conditions,
        select: selectCocktailFields,
      });

      const alcohols = await prisma.alcohols.findMany({
        where: conditions,
        select: selectAlcoholFields,
      });

      return [...cocktails, ...alcohols];

    default:
      return [];
  }
};