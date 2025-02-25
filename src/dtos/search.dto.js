// dto

export const toSearchParams = (body) => {
  const { query, category, minAbv, maxAbv, aroma, taste, timing } = body;

  return {
    query: query || "",
    category: category || "All",
    minAbv: minAbv !== undefined ? Number(minAbv) : 0,
    maxAbv: maxAbv !== undefined ? Number(maxAbv) : 100,
    aroma: aroma || [],
    taste: taste || [],
    timing: timing || [],
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
        recipe: item.recipe ?? null, // undefined 방지
        timing: item.timing ?? null, // undefined 방지
        imageUrl: item.imageUrl,
      };
    } else if (item.categoryEng || item.categoryKor) {
      return {
        id: item.id,
        nameKor: item.nameKor,
        nameEng: item.nameEng,
        abv: item.abv ? parseFloat(item.abv) : null,
        aromas: item.aromas,
        tastes: item.tastes,
        categoryEng: item.categoryEng,
        categoryKor: item.categoryKor,
        imageUrl: item.imageUrl,
      };
    } else {
      // User Recipe
      return {
        id: item.id,
        name: item.name,
        abv: item.abv ? parseFloat(item.abv) : null,
        aromas: item.aromas,
        tastes: item.tastes,
        ingredients: item.ingredients,
        recipe: item.recipe ?? null,
        imageUrl: item.imageUrl,
      };
    }
  });
};
