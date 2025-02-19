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
  imageUrl: true
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
  imageUrl: true
};

const selectUserRecipeFields = {
  id: true,
  name: true,
  abv: true,
  aromas: true,
  tastes: true,
  ingredients: true,
  recipe: true,
  imageUrl: true
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

  let cocktails = [];
  let alcohols = [];
  let userRecipes = await prisma.userRecipes.findMany({ select: selectUserRecipeFields });

  if (timing?.length > 0 || category === "Cocktail") {
    if (timing?.length > 0) {
      conditions.AND.push(...timing.map(time => ({ timing: { array_contains: time } })));
    }
    cocktails = await prisma.cocktails.findMany({ where: conditions, select: selectCocktailFields });
    return cocktails;
  }

  if (category) {
    switch (category) {
      case "Whiskey":
        conditions.AND.push({ Category: "Whiskey" });
        alcohols = await prisma.alcohols.findMany({ where: conditions, select: selectAlcoholFields });
        userRecipes = userRecipes.filter(recipe => recipe.ingredients && Object.keys(recipe.ingredients).includes("Whiskey"));
        break;

      case "Gin/Rum/Tequila":
        conditions.AND.push({ Category: { in: ["Gin", "Rum", "Tequila"] } });
        alcohols = await prisma.alcohols.findMany({ where: conditions, select: selectAlcoholFields });
        userRecipes = userRecipes.filter(recipe => 
          recipe.ingredients && ["Gin", "Rum", "Tequila"].some(ing => Object.keys(recipe.ingredients).includes(ing))
        );
        break;

      case "Others":
        conditions.AND.push({ Category: { notIn: ["Whiskey", "Gin", "Rum", "Tequila"] } });
        alcohols = await prisma.alcohols.findMany({ where: conditions, select: selectAlcoholFields });
        userRecipes = userRecipes.filter(recipe => 
          recipe.ingredients && !["Whiskey", "Gin", "Rum", "Tequila"].some(ing => Object.keys(recipe.ingredients).includes(ing))
        );
        break;

      case "All":
        cocktails = await prisma.cocktails.findMany({ where: conditions, select: selectCocktailFields });
        alcohols = await prisma.alcohols.findMany({ where: conditions, select: selectAlcoholFields });
        break;
    }
  }

  return [...cocktails, ...alcohols, ...userRecipes];
};
