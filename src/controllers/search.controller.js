// controller

import { StatusCodes } from "http-status-codes";
import { toSearchParams, responseFromSearch } from "../dtos/search.dto.js";
import { searchAlcoholsAndCocktails } from "../services/search.service.js";

export const handleSearch = async (req, res, next) => {
  console.log("술과 칵테일 검색을 요청했습니다!");

  try {

    // 요청 데이터 검증
    const { category, minAbv, maxAbv, aroma, taste, timing} = toSearchParams(req.body);

    // 검색 실행
    const results = await searchAlcoholsAndCocktails(category, minAbv, maxAbv, aroma, taste, timing);

    // 응답 변환 후 반환
    res.status(StatusCodes.OK).json({ success: responseFromSearch(results, category) });
  } catch (err) {
    next(err); // 에러가 발생하면 next로 넘겨서 에러 미들웨어로 전달
  }
};