// controller

import { StatusCodes } from "http-status-codes";
import { toSearchParams, responseFromSearch } from "../dtos/search.dto.js";
import { searchCocktails } from "../services/search.service.js";
import { applyMyBarFilter } from "../utils/applyMyBarFilter.js";
import { parseRecipeDetail } from "../dtos/recipe.dto.js";

export const handleSearch = async (req, res, next) => {
  console.log("칵테일 검색을 요청했습니다!");

  try {
    const userId = req.user ? req.user.id : null; // 로그인 여부 확인
    console.log(userId);
    // 요청 데이터 검증
    const { query, category, minAbv, maxAbv, aroma, taste, timing } =
      toSearchParams(req.body);

    // 검색 실행
    const results = await searchCocktails(
      query,
      category,
      minAbv,
      maxAbv,
      aroma,
      taste,
      timing
    );
    // 각 아이템의 데이터를 파싱
    const parsedResults = results.map((item) =>
      parseRecipeDetail(item, item.type)
    );

    // applyMyBarFilter가 리스트 전체를 처리하도록 변경되었으므로,
    // 전체 파싱된 결과에 대해 한 번에 myBar 필드를 추가합니다.
    const formattedResults = await applyMyBarFilter(userId, parsedResults);

    // 응답 변환 후 반환
    res.status(StatusCodes.OK).success(formattedResults);
  } catch (err) {
    next(err); // 에러가 발생하면 next로 넘겨서 에러 미들웨어로 전달
  }
};
