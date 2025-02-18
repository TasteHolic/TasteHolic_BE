// service
import { findAlcoholsAndCocktails } from "../repositories/search.repository.js";
import { InvalidFilterError } from "../error.js";

export const searchAlcoholsAndCocktails = async (category, minAbv, maxAbv, aroma, taste, timing) => {
  validateSearchParams(category, minAbv, maxAbv, timing);
  const result = await findAlcoholsAndCocktails(category, minAbv, maxAbv, aroma, taste, timing);
  return result ?? []; // 결과가 null이면 빈 배열 반환
};

const validateSearchParams = (category, minAbv, maxAbv, timing) => {
  const validCategories = ["All", "Cocktail", "Whiskey", "Gin/Rum/Tequila", "Others"];

  if (category && !validCategories.includes(category)) {
    throw new InvalidFilterError("유효한 카테고리를 선택해야 합니다.");
  }

  const parsedMinAbv = minAbv != null && minAbv !== "" ? Number(minAbv) : 0;
  const parsedMaxAbv = maxAbv != null && maxAbv !== "" ? Number(maxAbv) : 100;

  if (isNaN(parsedMinAbv) || isNaN(parsedMaxAbv) || parsedMinAbv < 0 || parsedMaxAbv > 100) {
    throw new InvalidFilterError("도수 값은 0~100 사이의 숫자여야 합니다.");
  }

  if (parsedMinAbv > parsedMaxAbv) {
    throw new InvalidFilterError("minAbv는 maxAbv보다 작거나 같아야 합니다.");
  }

  // timing 필터와 카테고리 검증
  if (timing && Array.isArray(timing) && timing.length > 0 && category !== "Cocktail") {
    throw new InvalidFilterError("Cocktail이 아닌 주종에 timing 필터를 적용할 수 없습니다.");
  }

};