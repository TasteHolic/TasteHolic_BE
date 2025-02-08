// repository
import { prisma } from "../../db.config.js";

export async function findAlcoholsAndCocktails(category, minAbv, maxAbv) {
  if (category === "Cocktail") {
    return await prisma.cocktails.findMany({
      where: {
        abv: {
          gte: minAbv,
          lte: maxAbv,
        },
      },
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  } else if (category === "Whiskey") {
    return await prisma.alcohols.findMany({
      where: {
        Category: "Whiskey", // 문자열 비교
        abv: {
          gte: minAbv,
          lte: maxAbv,
        },
      },
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  } else if (category === "Gin/Rum/Tequila") {
    return await prisma.alcohols.findMany({
      where: {
        Category: {
          in: ["Gin", "Rum", "Tequila"], // 'in'을 사용하여 여러 값을 비교
        },
        abv: {
          gte: minAbv,
          lte: maxAbv,
        },
      },
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  } else if (category === "etc") {
    return await prisma.alcohols.findMany({
      where: {
        Category: {
          notIn: ["Whiskey", "Gin", "Rum", "Tequila"], // 'notIn'을 사용하여 제외된 값들
        },
        abv: {
          gte: minAbv,
          lte: maxAbv,
        },
      },
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  } else if (category === "All") {
    const cocktails = await prisma.cocktails.findMany({
      where: {
        abv: {
          gte: minAbv,
          lte: maxAbv,
        },
      },
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  
    const alcohols = await prisma.alcohols.findMany({
      where: {
        abv: {
          gte: minAbv,
          lte: maxAbv,
        },
      },
      select: {
        nameKor: true,
        nameEng: true,
      },
    });
  
    // 두 배열을 병합하여 반환
    return [...cocktails, ...alcohols];
  }
  
}
