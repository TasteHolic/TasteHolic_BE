import {
  createRecipeInDB,
  updateRecipeInDB,
  findRecipeInDB,
  deleteRecipeInDB,
  readCocktailInDB,
  readUserRecipeInDB,
  updateLikeOnCocktailInDB,
  updateLikeOnUserRecipeInDB,
  cancelLikeOnUserRecipeInDB,
  cancelLikeOnCocktailInDB,
  getUserRecipesFromDB,
  getFilteredRecipesFromDB,
  getFruityRecipesFromDB,
  getUnder2RecipesFromDB,
  getMyRecipesFromDB,
  getFavRecipesFromDB,
} from "../repositories/recipe.repository.js";
import {
  NoRecipeError,
  NoPermission,
  ExistingFavError,
  UnavailableType,
  TokenExpiredError,
} from "../error.js";
import { getMyRecipes } from "../controllers/recipe.controller.js";

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
      throw new NoPermission("글 삭제 권한이 없습니다.");
    }
    await deleteRecipeInDB(recipeId, userId);
    return { success: true };
  } catch (err) {
    console.error("알 수 없는 오류 발생:", err);
    throw err;
  }
};

export const cocktailViewService = async (cocktailId) => {
  try {
    const recipe = await readCocktailInDB(cocktailId);
    if (!recipe) {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    return recipe;
  } catch (err) {
    throw err;
  }
};

export const userRecipeViewService = async (recipeId) => {
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

export const updateUserRecipeLikeCancelService = async (recipeId, userId) => {
  try {
    const { recipe, fav } = await cancelLikeOnUserRecipeInDB(recipeId, userId);
    return recipe;
  } catch (err) {
    console.error("업데이트 중 오류 발생:", err.message || err);
    throw err;
  }
};

export const updateCocktailLikeCancelService = async (cocktailId, userId) => {
  try {
    const { recipe, fav } = await cancelLikeOnCocktailInDB(cocktailId, userId);

    return recipe;
  } catch (err) {
    console.error("업데이트 중 오류 발생:", err.message || err);
    throw err;
  }
};

export const getRecipeListService = async (type, cursor, limit, userId) => {
  try {
    let recipes = null;
    let nextCursor = null;

    switch (type) {
      case "user":
        ({ recipes, nextCursor } = await getUserRecipesFromDB(cursor, limit));
        break;
      case "zero":
        ({ recipes, nextCursor } = await getFilteredRecipesFromDB(
          type,
          cursor,
          limit
        ));
        break;
      case "high":
        ({ recipes, nextCursor } = await getFilteredRecipesFromDB(
          type,
          cursor,
          limit
        ));
        break;
      case "fruity":
        ({ recipes, nextCursor } = await getFruityRecipesFromDB(cursor, limit));
        break;
      case "under2":
        ({ recipes, nextCursor } = await getUnder2RecipesFromDB(cursor, limit));
        break;
      default:
        throw new UnavailableType(
          "타입 값이 잘못되었습니다. (user, zero, high, fruity, under2 가능)"
        );
    }
    return { recipes, nextCursor };
  } catch (err) {
    console.error("리스트 조회 중 오류 발생:", err.message || err);
    throw err;
  }
};

export const getMyRecipesService = async (id) => {
  try {
    const recipes = getMyRecipesFromDB(id);
    return recipes;
  } catch (err) {
    console.error("리스트 조회 중 오류 발생:", err.message || err);
    throw err;
  }
};


export const getFavRecipesService = async (userId, cursor, limit) => {
  try {
    return await getFavRecipesFromDB(userId, cursor, limit);
  } catch (err) {
    console.error("❌ 좋아요한 레시피 서비스 오류:", err.message || err);
    throw err;
  }
};
