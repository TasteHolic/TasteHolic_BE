import { StatusCodes } from "http-status-codes";
import {
  createRecipeService,
  getRecipeListService,
  updateRecipeService,
  deleteRecipeService,
  cocktailViewService,
  userRecipeViewService,
  updateCocktailLikeService,
  updateUserRecipeLikeService,
  updateCocktailLikeCancelService,
  updateUserRecipeLikeCancelService,
} from "../services/recipe.service.js";
import { authenticateUser } from "./user.controller.js";
import { NoQuery, NoParameter, UnavailableType } from "../error.js";

export const createRecipe = async (req, res, next) => {
  console.log("레시피 생성 요청!");
  try {
    const user = authenticateUser(req);
    if (!user?.id) {
      return jsonErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "auth_error",
        "사용자 인증 실패"
      );
    }
    const userId = user.id;

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
  console.log("레시피 수정 요청!");
  console.log("body:", req.body);
  try {
    const user = authenticateUser(req);
    if (!user?.id) {
      return jsonErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "auth_error",
        "사용자 인증 실패"
      );
    }
    const userId = user.id;

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
  console.log("레시피 삭제 요청!");
  console.log("body:", req.body);
  try {
    const user = authenticateUser(req);
    if (!user?.id) {
      return jsonErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "auth_error",
        "사용자 인증 실패"
      );
    }
    const userId = user.id;

    const { recipeId } = req.params;

    const deleteResponse = await deleteRecipeService(
      BigInt(recipeId),
      BigInt(userId)
    );

    if (deleteResponse.success) {
      return res.status(StatusCodes.OK).success(deleteResponse);
    }
  } catch (err) {
    next(err);
  }
};

export const getRecipeList = async (req, res, next) => {
  console.log("레시피 목록 조회 요청!");

  try {
    const { type, cursor, limit = 10 } = req.query;

    if (!type) {
      throw new NoQuery(
        "입력된 타입이 없습니다. (user/zero/high/fruity/under2)"
      );
    }

    const { recipes, nextCursor } = await getRecipeListService(
      type,
      cursor,
      parseInt(limit)
    );

    res.status(StatusCodes.OK).success({
      recipes,
      nextCursor,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecipe = async (req, res, next) => {
  console.log("레시피 상세 조회 요청!");
  try {
    const { type } = req.query;
    const { recipeId } = req.params;

    if (!recipeId) {
      throw new NoParameter("입력된 레시피 아이디가 없습니다.");
    }
    if (!type) {
      throw new NoQuery("입력된 타입이 없습니다.(user/cocktail)");
    }

    let id = BigInt(recipeId);
    let recipe = null;

    if (type === "cocktail") {
      recipe = await cocktailViewService(recipeId);
    } else if (type === "user") {
      recipe = await userRecipeViewService(id);
    } else {
      throw new UnavailableType("user 또는 cocktail만 가능합니다.");
    }

    res.status(StatusCodes.OK).success(recipe);
  } catch (err) {
    next(err);
  }
};

export const updateRecipeLike = async (req, res, next) => {
  console.log("특정 레시피 찜 요청!");
  try {
    const user = authenticateUser(req);

    if (!user?.id) {
      return jsonErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "auth_error",
        "사용자 인증 실패"
      );
    }
    const userId = user.id;

    const { type } = req.query;
    const { recipeId } = req.params;

    if (!recipeId) {
      throw new NoParameter("입력된 레시피 아이디가 없습니다.");
    }
    if (!type) {
      throw new NoQuery("입력된 타입이 없습니다.(user/cocktail)");
    }

    let id = BigInt(recipeId);
    let recipe = null;

    if (type === "cocktail") {
      recipe = await updateCocktailLikeService(id, BigInt(userId));
    } else if (type === "user") {
      recipe = await updateUserRecipeLikeService(id, BigInt(userId));
    } else {
      throw new UnavailableType("user 또는 cocktail만 가능합니다.");
    }

    res
      .status(StatusCodes.OK)
      .success({ recipeId: id, likeCount: recipe.likes });
  } catch (err) {
    next(err);
  }
};

export const updateCancelRecipeLike = async (req, res, next) => {
  console.log("특정 레시피 찜 취소 요청!");
  try {
    const user = authenticateUser(req);
    if (!user?.id) {
      return jsonErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "auth_error",
        "사용자 인증 실패"
      );
    }
    const userId = user.id;

    const { type } = req.query;
    const { recipeId } = req.params;

    if (!recipeId) {
      throw new NoParameter("입력된 레시피 아이디가 없습니다.");
    }
    if (!type) {
      throw new NoQuery("입력된 타입이 없습니다.(user/cocktail)");
    }

    let id = BigInt(recipeId);
    let recipe = null;

    if (type === "cocktail") {
      recipe = await updateCocktailLikeCancelService(
        BigInt(id),
        BigInt(userId)
      );
    } else if (type === "user") {
      recipe = await updateUserRecipeLikeCancelService(
        BigInt(id),
        BigInt(userId)
      );
    } else {
      throw new UnavailableType("user 또는 cocktail만 가능합니다.");
    }

    res.status(StatusCodes.OK).success({ recipeId, likeCount: recipe.likes });
  } catch (err) {
    next(err);
  }
};
