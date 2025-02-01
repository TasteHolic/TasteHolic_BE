import { StatusCodes } from "http-status-codes";
import {
  createRecipeService,
  getRecipeListService,
  getRecipeService,
  updateRecipeService,
  deleteRecipeService,
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

    res.status(StatusCodes.CREATED).json({ success: true, data: newRecipe });
  } catch (err) {
    next(err);
  }
};

export const getRecipeList = async (req, res, next) => {
  try {
    console.log("레시피 목록 조회 요청!");

    const { cursor, limit } = req.query;
    const recipes = await readRecipeListService({ cursor, limit });

    res.status(StatusCodes.OK).json({ success: true, data: recipes });
  } catch (err) {
    next(err);
  }
};

export const getRecipe = async (req, res, next) => {
  try {
    console.log("특정 레시피 조회 요청!");

    const { recipeId } = req.params;
    const recipe = await readRecipeService(recipeId);

    res.status(StatusCodes.OK).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    console.log("레시피 수정 요청!");

    const { recipeId } = req.params;
    const updatedRecipe = await updateUserRecipeService(recipeId, req.body);

    res.status(StatusCodes.OK).json({ success: true, data: updatedRecipe });
  } catch (err) {
    next(err);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    console.log("레시피 삭제 요청!");

    const { recipeId } = req.params;
    await deleteUserRecipeService(recipeId);

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
};
