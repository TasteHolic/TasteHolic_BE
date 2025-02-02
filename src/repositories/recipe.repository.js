import { prisma } from "../../db.config.js";
import { NoRecipeError, NoPermission } from "../error.js";

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

export const findRecipeInDB = async (recipeId) => {
  return await prisma.userRecipes.findFirst({
    where: {
      id: recipeId,
    },
  });
};

export const updateRecipeInDB = async (recipeId, userId, data) => {
  return await prisma.userRecipes.update({
    where: {
      id: recipeId,
      userId: userId,
    },
    data,
  });
};

export const deleteRecipeInDB = async (recipeId, userId) => {
  try {
    await prisma.userRecipes.delete({
      where: {
        id: recipeId,
        userId: userId,
      },
    });
    return { success: true };
  } catch (err) {
    throw err;
  }
};
