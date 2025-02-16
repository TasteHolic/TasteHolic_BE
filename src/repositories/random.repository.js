import { prisma } from "../../db.config.js";

export const fetchRandomCocktails = async () => {
  // DB에서 존재하는 칵테일 ID 목록 조회
  const cocktailIds = await prisma.cocktails.findMany({
    select: { id: true },
  });

  // 존재하는 ID 목록에서 랜덤하게 3개 선택
  const idList = cocktailIds.map((c) => c.id);
  const randomIds = [];

  while (randomIds.length < 3 && idList.length > 0) {
    const randIndex = Math.floor(Math.random() * idList.length);
    randomIds.push(...idList.splice(randIndex, 1)); // 중복 없이 선택
  }

  const cocktails = await prisma.cocktails.findMany({
    where: { id: { in: randomIds } },
    select: {
      id: true,
      nameEng: true,
      images: true, // null이면 그대로 반환
      aromas: true,
      tastes: true,
      timing: true,
      ingredientsKor: true,
      abv: true,
    },
  });

  return cocktails.map((c) => ({
    ...c,
    images: c.images ?? null, // undefined 방지, null이면 그대로 반환
  }));
};
