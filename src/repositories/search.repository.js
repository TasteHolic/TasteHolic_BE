// repository

import { prisma } from "../../db.config.js";
import { Prisma } from "@prisma/client";

export const findAlcoholsAndCocktails = async (category, minAbv, maxAbv, aroma, taste) => {
  const conditions = {
    AND: [
      { abv: { gte: minAbv, lte: maxAbv } },
      ...(aroma?.length > 0 ? [{ aromas: { array_contains: aroma } }] : []),
      ...(taste?.length > 0 ? [{ tastes: { array_contains: taste } }] : []),
    ],
  };

  switch (category) {
    case "Cocktail":
      return await prisma.cocktails.findMany({
        where: conditions,
        select: {
          nameKor: true,
          nameEng: true,
        },
      });

    case "Whiskey":
      return await prisma.alcohols.findMany({
        where: {
          AND: [
            { Category: "Whiskey" },
            conditions,
          ],
        },
        select: {
          nameKor: true,
          nameEng: true,
        },
      });

    case "Gin/Rum/Tequila":
      return await prisma.alcohols.findMany({
        where: {
          AND: [
            { Category: { in: ["Gin", "Rum", "Tequila"] } },
            conditions,
          ],
        },
        select: {
          nameKor: true,
          nameEng: true,
        },
      });

    case "etc":
      return await prisma.alcohols.findMany({
        where: {
          AND: [
            { Category: { notIn: ["Whiskey", "Gin", "Rum", "Tequila"] } },
            conditions,
          ],
        },
        select: {
          nameKor: true,
          nameEng: true,
        },
      });

    case "All":
      const cocktails = await prisma.cocktails.findMany({
        where: conditions,
        select: {
          nameKor: true,
          nameEng: true,
        },
      });

      const alcohols = await prisma.alcohols.findMany({
        where: conditions,
        select: {
          nameKor: true,
          nameEng: true,
        },
      });

      return [...cocktails, ...alcohols];

    default:
      return [];
  }
};