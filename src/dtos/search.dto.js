//dto

export function validateSearchBody(body) {
  const { category, minAbv, maxAbv, aroma, taste } = body;

  // 유효한 주종 필터 값
  
  const validCategories = ["All", "Cocktail", "Whiskey", "Gin/Rum/Tequila", "Others"];
  const validAromas = ["라임", "시트러스", "아몬드", "바닐라", "민트", "베리", "오크", "커피", "오렌지", "토피", "캐러멜", "과일", "향신료"];
  const validTastes = ["달콤함", "시트러스", "상쾌함", "드라이함", "강렬함", "부드러움", "프루티", "허브", "짭짤함"];

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

  return {
    category: category || "All",
    minAbv: parsedMinAbv,
    maxAbv: parsedMaxAbv,
    aroma: aroma?.filter(a => validAromas.includes(a)) || [],
    taste: taste?.filter(t => validTastes.includes(t)) || []
  };
}

export function responseFromSearch(results) {
  return results.map((item) => ({
    nameKor: item.nameKor,
    nameEng: item.nameEng,
  }));
}