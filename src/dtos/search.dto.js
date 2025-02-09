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

export const responseFromSearch = (results) => {
  return results.map((item) => ({
    nameKor: item.nameKor,
    nameEng: item.nameEng,
  }));
};