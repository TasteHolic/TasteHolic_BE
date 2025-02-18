// dto

export const toSearchParams = (body) => {
  const { category, minAbv, maxAbv, aroma, taste, timing } = body;

  return {
    category: category || "All",
    minAbv: minAbv !== undefined ? Number(minAbv) : 0,
    maxAbv: maxAbv !== undefined ? Number(maxAbv) : 100,
    aroma: aroma || [],
    taste: taste || [],
    timing: timing || []
  };
};

export const responseFromSearch = (results, category) => {
  return results.map((item) => {
    if (category === "Cocktail") {
      return {
        id: item.id,
        nameKor: item.nameKor,
        nameEng: item.nameEng,
        abv: item.abv ? parseFloat(item.abv) : null,
        aromas: item.aromas,
        tastes: item.tastes,
        recipe: item.recipe ?? null,  // undefined 방지
        timing: item.timing ?? null   // undefined 방지
      };
    } else {
      return {
        id: item.id,
        nameKor: item.nameKor,
        nameEng: item.nameEng,
        abv: item.abv ? parseFloat(item.abv) : null,
        aromas: item.aromas,
        tastes: item.tastes,
        categoryEng: item.categoryEng,
        categoryKor: item.categoryKor
      };
    }
  });
};
