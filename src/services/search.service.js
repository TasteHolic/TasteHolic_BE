// service
import {
  findAlcoholsAndCocktails,
  findCocktails,
} from "../repositories/search.repository.js";
import { searchAllTypeDrinks } from "../repositories/alltypesearch.repository.js";
import { InvalidFilterError } from "../error.js";

export const searchCocktails = async (
  query,
  category,
  minAbv,
  maxAbv,
  aroma,
  taste,
  timing
) => {
  validateSearchParams(category, minAbv, maxAbv, timing);
  const { cocktails, userRecipes } = await findCocktails(
    query,
    category,
    minAbv,
    maxAbv,
    aroma,
    taste,
    timing
  );
  // 🔥 `type` 추가
  const formattedCocktails = cocktails.map((item) => ({
    ...item,
    type: "cocktail",
  }));

  const formattedUserRecipes = userRecipes.map((item) => ({
    ...item,
    type: "user",
  }));
  
  return [...formattedCocktails, ...formattedUserRecipes];
};

export const searchAlcoholsAndCocktails = async (
  category,
  minAbv,
  maxAbv,
  aroma,
  taste,
  timing
) => {
  validateSearchParams(category, minAbv, maxAbv, timing);
  const result = await findAlcoholsAndCocktails(
    category,
    minAbv,
    maxAbv,
    aroma,
    taste,
    timing
  );
  return result ?? []; // 결과가 null이면 빈 배열 반환
};

const validateSearchParams = (category, minAbv, maxAbv, timing) => {
  const validCategories = [
    "All",
    "Cocktail",
    "Whiskey",
    "Gin/Rum/Tequila",
    "Others",
  ];

  if (category && !validCategories.includes(category)) {
    throw new InvalidFilterError("유효한 카테고리를 선택해야 합니다.");
  }

  const parsedMinAbv = minAbv != null && minAbv !== "" ? Number(minAbv) : 0;
  const parsedMaxAbv = maxAbv != null && maxAbv !== "" ? Number(maxAbv) : 100;

  if (
    isNaN(parsedMinAbv) ||
    isNaN(parsedMaxAbv) ||
    parsedMinAbv < 0 ||
    parsedMaxAbv > 100
  ) {
    throw new InvalidFilterError("도수 값은 0~100 사이의 숫자여야 합니다.");
  }

  if (parsedMinAbv > parsedMaxAbv) {
    throw new InvalidFilterError("minAbv는 maxAbv보다 작거나 같아야 합니다.");
  }
};
