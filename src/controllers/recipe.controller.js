import { StatusCodes } from "http-status-codes";
import {
  createRecipeService,
  getRecipeListService,
  updateRecipeService,
  deleteRecipeService,
  getCocktailRecipeService,
  getUserRecipeService,
} from "../services/recipe.service.js";

export const createRecipe = async (req, res, next) => {
  try {
    console.log("레시피 생성 요청!");
    console.log("body:", req.body);

    //mock user Id
    const userId = 1;

    const userRecipeDTO = {
      ...req.body,
      userId,
    };

    const newRecipe = await createRecipeService(userRecipeDTO);

    res.status(StatusCodes.CREATED).success(newRecipe);
  } catch (err) {
    next(err);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    console.log("레시피 수정 요청!");

    // mock user Id
    const userId = 1;

    const { recipeId } = req.params;

    const updatedRecipe = await updateRecipeService(
      BigInt(recipeId),
      BigInt(userId),
      req.body
    );

    res.status(StatusCodes.OK).success(updatedRecipe);
  } catch (err) {
    next(err);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    console.log("레시피 삭제 요청!");

    // mock user Id
    const userId = 1;

    const { recipeId } = req.params;

    const deleteResponse = await deleteRecipeService(
      BigInt(recipeId),
      BigInt(userId)
    );

    if (deleteResponse.success) {
      return res.status(StatusCodes.OK).success(deleteResponse);
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: deleteResponse.message });
    }
  } catch (err) {
    next(err);
  }
};

export const getRecipeList = async (req, res, next) => {
  try {
    console.log("레시피 목록 조회 요청!");

    const { cursor, limit } = req.query;
    const recipes = await readRecipeListService({ cursor, limit });

    res.status(StatusCodes.OK).success(recipes);
  } catch (err) {
    next(err);
  }
};

export const getRecipe = async (req, res, next) => {
  try {
    console.log("특정 레시피 조회 요청!");

    const { recipeId } = req.params;
    let id = "";
    let recipe = null;

    if (recipeId.startsWith("cocktail-")) {
      id = recipeId.replace("cocktail-", "");
      recipe = await getCocktailRecipeService(BigInt(id));
    } else if (recipeId.startsWith("user-")) {
      id = recipeId.replace("user-", "");
      recipe = await getUserRecipeService(BigInt(id));
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "잘못된 recipeId 형식입니다." });
    }

    res.status(StatusCodes.OK).success(recipe);
  } catch (err) {
    next(err);
  }
};

// export const updateRecipeLike = async (req, res, next) => {
//   console.log("특정 레시피 조회 요청!");

//   const { recipeId } = req.params;
//   let id = "";
//   let recipe = null;

//   if (recipeId.startsWith("cocktail-")) {
//     id = recipeId.replace("cocktail-", "");
//     recipe = await updateCocktaillikeService(BigInt(id));
//   } else if (recipeId.startsWith("user-")) {
//     id = recipeId.replace("user-", "");
//     recipe = await updateUserRecipelikeService(BigInt(id));
//   } else {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ success: false, message: "잘못된 recipeId 형식입니다." });
//   }

//   res
//     .status(StatusCodes.OK)
//     .json({ success: true, data: RecipeStepsDto(recipe) });
// };

// export const updateCancelRecipeLike = async (req, res, next) => {
//   console.log("특정 레시피 조회 요청!");

//   const { recipeId } = req.params;
//   let id = "";
//   let recipe = null;

//   if (recipeId.startsWith("cocktail-")) {
//     id = recipeId.replace("cocktail-", "");
//     recipe = await updateCocktaillikeService(BigInt(id));
//   } else if (recipeId.startsWith("user-")) {
//     id = recipeId.replace("user-", "");
//     recipe = await updateUserRecipelikeService(BigInt(id));
//   } else {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ success: false, message: "잘못된 recipeId 형식입니다." });
//   }

//   res
//     .status(StatusCodes.OK)
//     .json({ success: true, data: RecipeStepsDto(recipe) });
// };
