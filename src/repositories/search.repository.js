// repository

import { prisma } from "../../db.config.js";

const selectCocktailFields = {
  id: true,
  nameKor: true,
  nameEng: true,
  abv: true,
  aromas: true,
  tastes: true,
  recipe: true,
  timing: true,
  imageUrl: true,
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
  imageUrl: true,
};

const selectUserRecipeFields = {
  id: true,
  name: true,
  abv: true,
  aromas: true,
  tastes: true,
  ingredients: true,
  recipe: true,
  imageUrl: true,
};

export const findCocktails = async (
  query,
  category,
  minAbv,
  maxAbv,
  aroma,
  taste,
  timing
) => {
  const conditions = { AND: [] };
  const userRecipeConditions = { AND: [] };

  // 🔹 검색어 필터 (칵테일)
  if (query) {
    conditions.AND.push({
      OR: [{ nameKor: { contains: query } }, { nameEng: { contains: query } }],
    });

    // 🔹 검색어 필터 (유저 레시피)
    userRecipeConditions.AND.push({
      name: { contains: query },
    });
  }

  // 🔹 도수 범위 필터
  if (minAbv !== undefined || maxAbv !== undefined) {
    const abvFilter = {
      abv: {
        gte: minAbv ?? 0,
        lte: maxAbv ?? 100,
      },
    };
    conditions.AND.push(abvFilter);
    userRecipeConditions.AND.push(abvFilter);
  }

  // 🔹 아로마 필터 (OR 조건으로 묶기)
  if (aroma?.length > 0) {
    conditions.AND.push({
      OR: aroma.map((a) => ({ aromas: { array_contains: a } })),
    });
    userRecipeConditions.AND.push({
      OR: aroma.map((a) => ({ aromas: { array_contains: a } })),
    });
  }

  // 🔹 맛 필터 (OR 조건으로 묶기)
  if (taste?.length > 0) {
    conditions.AND.push({
      OR: taste.map((t) => ({ tastes: { array_contains: t } })),
    });
    userRecipeConditions.AND.push({
      OR: taste.map((t) => ({ tastes: { array_contains: t } })),
    });
  }

  // 🔹 타이밍 필터 (OR 조건으로 묶기) - **유저 레시피에는 적용하지 않음!**
  let excludeUserRecipes = false;
  if (timing?.length > 0) {
    conditions.AND.push({
      OR: timing.map((time) => ({ timing: { array_contains: time } })),
    });

    excludeUserRecipes = true; // ✅ 타이밍 필터가 적용되었으므로 유저 레시피 제외
  }

  // 🔥 칵테일 검색 (좋아요 순 정렬)
  let cocktails = await prisma.cocktails.findMany({
    where: conditions,
    orderBy: {
      likes: "desc",
    },
  });

  // 🔥 유저 레시피 검색 (좋아요 순 정렬) - **타이밍 필터가 있으면 검색하지 않음!**
  let userRecipes = [];
  if (!excludeUserRecipes) {
    userRecipes = await prisma.userRecipes.findMany({
      where: userRecipeConditions,
      orderBy: {
        likes: "desc",
      },
    });
  }

  // 🔹 카테고리 필터링 적용
  if (category) {
    switch (category) {
      case "Whiskey":
        userRecipes = userRecipes.filter(
          (recipe) =>
            recipe.ingredients &&
            (Object.keys(recipe.ingredients).includes("Whiskey") ||
              Object.keys(recipe.ingredients).includes("위스키")) // ✅ 한글 추가
        );

        cocktails = cocktails.filter(
          (cocktail) =>
            cocktail.ingredientsEng &&
            Object.keys(cocktail.ingredientsEng || {}).includes("Whisk")
        );
        break;

      case "Gin/Rum/Tequila":
        userRecipes = userRecipes.filter(
          (recipe) =>
            recipe.ingredients &&
            ["Gin", "Rum", "Tequila", "진", "럼", "테킬라"].some(
              (
                ing // ✅ 한글 추가
              ) => Object.keys(recipe.ingredients).includes(ing)
            )
        );

        cocktails = cocktails.filter(
          (cocktail) =>
            cocktail.ingredientsEng &&
            ["Gin", "Rum", "Tequila"].some((ing) =>
              Object.keys(cocktail.ingredientsEng || {}).includes(ing)
            )
        );
        break;

      case "Others":
        userRecipes = userRecipes.filter(
          (recipe) =>
            recipe.ingredients &&
            ![
              "Whiskey",
              "Gin",
              "Rum",
              "Tequila",
              "위스키",
              "진",
              "럼",
              "테킬라",
            ].some((ing) => Object.keys(recipe.ingredients).includes(ing))
        );

        cocktails = cocktails.filter(
          (cocktail) =>
            cocktail.ingredientsEng &&
            !["Whiskey", "Gin", "Rum", "Tequila"].some((ing) =>
              Object.keys(cocktail.ingredientsEng || {}).includes(ing)
            )
        );
        break;
    }
  }

  return { cocktails, userRecipes };
};

export const findAlcoholsAndCocktails = async (
  category,
  minAbv,
  maxAbv,
  aroma,
  taste,
  timing
) => {
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
    conditions.AND.push(
      ...aroma.map((a) => ({ aromas: { array_contains: a } }))
    );
  }

  // 맛 필터
  if (taste?.length > 0) {
    conditions.AND.push(
      ...taste.map((t) => ({ tastes: { array_contains: t } }))
    );
  }

  let cocktails = [];
  let alcohols = [];
  let userRecipes = await prisma.userRecipes.findMany({
    select: selectUserRecipeFields,
  });

  if (timing?.length > 0 || category === "Cocktail") {
    if (timing?.length > 0) {
      conditions.AND.push(
        ...timing.map((time) => ({ timing: { array_contains: time } }))
      );
    }
    cocktails = await prisma.cocktails.findMany({
      where: conditions,
      select: selectCocktailFields,
    });
    return cocktails;
  }

  if (category) {
    switch (category) {
      case "Whiskey":
        conditions.AND.push({ Category: "Whiskey" });
        alcohols = await prisma.alcohols.findMany({
          where: conditions,
          select: selectAlcoholFields,
        });
        userRecipes = userRecipes.filter(
          (recipe) =>
            recipe.ingredients &&
            Object.keys(recipe.ingredients).includes("Whiskey")
        );

        break;

      case "Gin/Rum/Tequila":
        conditions.AND.push({ Category: { in: ["Gin", "Rum", "Tequila"] } });
        alcohols = await prisma.alcohols.findMany({
          where: conditions,
          select: selectAlcoholFields,
        });
        userRecipes = userRecipes.filter(
          (recipe) =>
            recipe.ingredients &&
            ["Gin", "Rum", "Tequila"].some((ing) =>
              Object.keys(recipe.ingredients).includes(ing)
            )
        );
        break;

      case "Others":
        conditions.AND.push({
          Category: { notIn: ["Whiskey", "Gin", "Rum", "Tequila"] },
        });
        alcohols = await prisma.alcohols.findMany({
          where: conditions,
          select: selectAlcoholFields,
        });
        userRecipes = userRecipes.filter(
          (recipe) =>
            recipe.ingredients &&
            !["Whiskey", "Gin", "Rum", "Tequila"].some((ing) =>
              Object.keys(recipe.ingredients).includes(ing)
            )
        );
        break;

      case "All":
        cocktails = await prisma.cocktails.findMany({
          where: conditions,
          select: selectCocktailFields,
        });
        alcohols = await prisma.alcohols.findMany({
          where: conditions,
          select: selectAlcoholFields,
        });
        break;
    }
  }

  return [...cocktails, ...alcohols, ...userRecipes];
};
