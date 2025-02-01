import { prisma } from "../../db.config.js";

export const createRecipeInDB = async (data) => {
  return await prisma.userRecipes.create({
    data: {
      userId: data.userId,
      name: data.name,
      imageUrl: data.imageUrl,
      ingredients: data.ingredients,
      recipe: data.recipe,
      glassType: data.glassType,
      status: data.status,
      tastes: data.tastes,
      aromas: data.aromas,
      abv: data.abv,
    },
  });
};
