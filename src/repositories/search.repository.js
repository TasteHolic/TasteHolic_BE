import { prisma } from "../../db.config.js";

export async function findAlcoholsAndCocktails(category, minAbv, maxAbv, aroma, taste) {
  const conditions = {
    AND: [
      { abv: { gte: minAbv, lte: maxAbv } },
      ...(aroma?.length > 0 ? [{ aromas: { array_contains: aroma } }] : []),
      ...(taste?.length > 0 ? [{ tastes: { array_contains: taste } }] : []),
    ],
  };

  if (category === "Cocktail") {
    return await prisma.cocktails.findMany({
      where: conditions,
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  } else if (category === "Whiskey") {
    return await prisma.alcohols.findMany({
      where: {
        AND: [
          { Category: "Whiskey" },
          conditions, // ✅ AND 적용
        ],
      },
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  } else if (category === "Gin/Rum/Tequila") {
    return await prisma.alcohols.findMany({
      where: {
        AND: [
          { Category: { in: ["Gin", "Rum", "Tequila"] } },
          conditions, // ✅ AND 적용
        ],
      },
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  } else if (category === "etc") {
    return await prisma.alcohols.findMany({
      where: {
        AND: [
          { Category: { notIn: ["Whiskey", "Gin", "Rum", "Tequila"] } },
          conditions, // ✅ AND 적용
        ],
      },
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  } else if (category === "All") {
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
  }
}
