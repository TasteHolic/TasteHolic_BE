import { prisma } from "../../db.config.js";
import { NoRecipeError, NoPermission, ExistingFavError } from "../error.js";

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

export const readCocktailInDB = async (cocktailId) => {
  try {
    const cocktail = await prisma.cocktails.update({
      where: {
        id: cocktailId,
      },
      data: { views: { increment: 1 } },
    });
    return cocktail;
  } catch (error) {
    return null;
  }
};

export const readUserRecipeInDB = async (recipeId) => {
  try {
    const userRecipe = await prisma.userRecipes.update({
      where: {
        id: recipeId,
      },
      data: { views: { increment: 1 } },
    });
    return userRecipe;
  } catch (error) {
    return null;
  }
};

export const updateLikeOnUserRecipeInDB = async (recipeId, userId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingFav = await tx.userRecipeFavorites.findFirst({
        where: {
          recipeId: recipeId,
          userId: userId,
        },
      });

      if (existingFav) {
        throw new ExistingFavError("이미 좋아요를 눌렀습니다.");
      }

      const updatedRecipe = await tx.userRecipes.update({
        where: { id: recipeId },
        data: { likes: { increment: 1 } },
      });

      const fav = await tx.userRecipeFavorites.create({
        data: {
          recipeId: recipeId,
          userId: userId,
        },
      });

      return { recipe: updatedRecipe, fav };
    });
  } catch (err) {
    if (err.code === "P2025") {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    console.error("좋아요 업데이트 중 오류 발생:", err);
    throw err;
  }
};

export const updateLikeOnCocktailInDB = async (recipeId, userId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingFav = await tx.cocktailFavorites.findFirst({
        where: {
          cocktailId: recipeId,
          userId: userId,
        },
      });

      if (existingFav) {
        throw new ExistingFavError("이미 좋아요를 눌렀습니다.");
      }

      const updatedRecipe = await tx.cocktails.update({
        where: { id: recipeId },
        data: { likes: { increment: 1 } },
      });

      const fav = await tx.cocktailFavorites.create({
        data: {
          cocktailId: recipeId,
          userId: userId,
        },
      });

      return { recipe: updatedRecipe, fav };
    });
  } catch (err) {
    if (err.code === "P2025") {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    console.error("좋아요 업데이트 중 오류 발생:", err);
    throw err;
  }
};
