import {
  createRecipeInDB,
  updateRecipeInDB,
  findRecipeInDB,
  deleteRecipeInDB,
  readCocktailInDB,
  readUserRecipeInDB,
  updateLikeOnCocktailInDB,
  updateLikeOnUserRecipeInDB,
} from "../repositories/recipe.repository.js";
import { NoRecipeError, NoPermission, ExistingFavError } from "../error.js";

export const createRecipeService = async (data) => {
  const recipe = await createRecipeInDB(data);
  return recipe;
};

export const updateRecipeService = async (recipeId, userId, data) => {
  try {
    const recipe = await findRecipeInDB(recipeId);
    if (!recipe) {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    if (recipe.userId !== userId) {
      throw new NoPermission("글 수정 권한이 없습니다.");
    }
    const updatedRecipe = await updateRecipeInDB(recipeId, userId, data);
    return updatedRecipe;
  } catch (err) {
    console.error("알 수 없는 오류 발생:", err);
    throw err;
  }
};

export const deleteRecipeService = async (recipeId, userId) => {
  try {
    const recipe = await findRecipeInDB(recipeId);
    if (!recipe) {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    if (recipe.userId !== userId) {
      throw new NoPermission("글 수정 권한이 없습니다.");
    }
    const response = await deleteRecipeInDB(recipeId, userId);
    return response;
  } catch (err) {
    console.error("알 수 없는 오류 발생:", err);
    throw err;
  }
};

export const getCocktailRecipeService = async (cocktailId) => {
  try {
    const recipe = await readCocktailInDB(cocktailId);
    if (!recipe) {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    return recipe;
  } catch (err) {
    console.error("알 수 없는 오류 발생:", err);
    throw err;
  }
};

export const getUserRecipeService = async (recipeId) => {
  try {
    const recipe = await readUserRecipeInDB(recipeId);
    if (!recipe) {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    return recipe;
  } catch (err) {
    console.error("알 수 없는 오류 발생:", err);
    throw err;
  }
};

export const updateUserRecipeLikeService = async (recipeId, userId) => {
  try {
    const { recipe, fav } = await updateLikeOnUserRecipeInDB(recipeId, userId);

    return recipe;
  } catch (err) {
    console.error("업데이트 중 오류 발생:", err.message || err);
    throw err;
  }
};

export const updateCocktailLikeService = async (cocktailId, userId) => {
  try {
    const { recipe, fav } = await updateLikeOnCocktailInDB(cocktailId, userId);

    return recipe;
  } catch (err) {
    console.error("업데이트 중 오류 발생:", err.message || err);
    throw err;
  }
};

export const getRecipeListService = async (data) => {};
