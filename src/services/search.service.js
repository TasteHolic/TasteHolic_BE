// service

import { findAlcoholsAndCocktails } from "../repositories/search.repository.js";

const validCategories = ["All", "Cocktail", "Whiskey", "Gin/Rum/Tequila", "Others"];
const validAromas = ["라임", "시트러스", "아몬드", "바닐라", "민트", "베리", "오크", "커피", "오렌지", "토피", "캐러멜", "과일", "향신료"];
const validTastes = ["달콤함", "시트러스", "상쾌함", "드라이함", "강렬함", "부드러움", "프루티", "허브", "짭짤함"];

export const searchAlcoholsAndCocktails = async (category, minAbv, maxAbv, aroma, taste) => {
  validateSearchParams(category, minAbv, maxAbv, aroma, taste);
  return await findAlcoholsAndCocktails(category, minAbv, maxAbv, aroma, taste);
};

const validateSearchParams = (category, minAbv, maxAbv, aroma, taste) => {
  if (category && !validCategories.includes(category)) {
    throw new Error("유효한 카테고리를 선택해야 합니다.");
  }

  const parsedMinAbv = minAbv !== undefined ? Number(minAbv) : 0;
  const parsedMaxAbv = maxAbv !== undefined ? Number(maxAbv) : 100;

  if (!isNaN(parsedMinAbv) && (parsedMinAbv < 0 || parsedMinAbv > 100)) {
    throw new Error("minAbv는 0~100 사이의 숫자여야 합니다.");
  }

  if (!isNaN(parsedMaxAbv) && (parsedMaxAbv < 0 || parsedMaxAbv > 100)) {
    throw new Error("maxAbv는 0~100 사이의 숫자여야 합니다.");
  }

  if (minAbv !== undefined && maxAbv !== undefined && parsedMinAbv > parsedMaxAbv) {
    throw new Error("minAbv는 maxAbv보다 작거나 같아야 합니다.");
  }

  if (aroma?.length > 0 && !aroma.every(a => validAromas.includes(a))) {
    throw new Error("유효한 향 필터 값을 선택해야 합니다.");
  }

  if (taste?.length > 0 && !taste.every(t => validTastes.includes(t))) {
    throw new Error("유효한 맛 필터 값을 선택해야 합니다.");
  }
};
