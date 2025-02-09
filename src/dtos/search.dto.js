// dto

export const toSearchParams = (body) => {
  const { category, minAbv, maxAbv, aroma, taste } = body;

  return {
    category: category || "All",
    minAbv: minAbv !== undefined ? Number(minAbv) : 0,
    maxAbv: maxAbv !== undefined ? Number(maxAbv) : 100,
    aroma: aroma || [],
    taste: taste || []
  };
};

export const responseFromSearch = (results, category) => {
  return results.map((item) => {
    if (category === "Cocktail") {
      return {
        id: item.id,
        nameKor: item.nameKor,
        nameEng: item.nameEng,
        aromas: item.aromas,
        tastes: item.tastes,
        recipe: item.recipe
      };
    } else {
      return {
        id: item.id,
        nameKor: item.nameKor,
        nameEng: item.nameEng,
        aromas: item.aromas,
        tastes: item.tastes,
        categoryEng: item.categoryEng,
        categoryKor: item.categoryKor
      };
    }
  });
};
