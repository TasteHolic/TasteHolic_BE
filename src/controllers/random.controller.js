import { StatusCodes } from "http-status-codes";
import { getRandomCocktails } from "../services/random.service.js";

export const handleGetRandomCocktails = async (req, res, next) => {
    console.log("검색어 기반 칵테일 추천 요청!");
    try {
      const cocktails = await getRandomCocktails();
      res.status(StatusCodes.OK).success(cocktails);
    } catch (error) {
      next(error);
    }
  };
