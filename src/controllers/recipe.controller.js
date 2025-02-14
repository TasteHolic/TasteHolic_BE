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
  getMyRecipesService,
  getFavRecipesService,
} from "../services/recipe.service.js";
import {
  parseRecipeList,
  parseRecipeDetail,
  parseMyrecipes,
} from "../dtos/recipe.dto.js";
import {
  NoQuery,
  NoParameter,
  UnavailableType,
  TokenExpiredError,
} from "../error.js";

export const createRecipe = async (req, res, next) => {
  console.log("레시피 생성 요청!");
  try {
    const userId = req.user.id;

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
    const userId = req.user.id;

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
    const userId = req.user.id;

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
    const parsedRecipes = parseRecipeList(recipes);

    res.status(StatusCodes.OK).success({
      recipes: parsedRecipes,
      nextCursor,
    });
  } catch (err) {
    next(err);
  }
};

export const getFavRecipes = async (req, res, next) => {
  console.log("⭐ 좋아요한 레시피 목록 조회 요청!");

  try {
    const { cursor, limit = 10 } = req.query;

    // 인증된 사용자만 가능
    if (!req.user || !req.user.id) {
      throw new TokenExpiredError("로그인 하지 않은 사용자입니다.");
    }

    const userId = req.user.id;

    // 서비스 호출
    const { recipes, nextCursor } = await getFavRecipesService(
      userId,
      cursor,
      parseInt(limit)
    );

    // 결과 파싱
    const parsedRecipes = parseRecipeList(recipes);

    res.status(StatusCodes.OK).json({
      recipes: parsedRecipes,
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

    const parsedRecipe = parseRecipeDetail(recipe, type);

    res.status(StatusCodes.OK).success({ recipe: parsedRecipe });
  } catch (err) {
    next(err);
  }
};

export const updateRecipeLike = async (req, res, next) => {
  console.log("특정 레시피 찜 요청!");
  try {
    const userId = req.user.id;
    console.log(userId);

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
    const userId = req.user.id;

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

export const getMyRecipes = async (req, res, next) => {
  console.log("내가 등록한 레시피 리스트 조회 요청!");
  try {
    const userId = req.user.id;

    const recipes = await getMyRecipesService(userId);
    const parsedRecipes = parseMyrecipes(recipes);

    res.status(StatusCodes.OK).success({
      recipes: parsedRecipes,
    });
  } catch (err) {
    next(err);
  }
};
