export const parseRecipeList = (recipes) => {
  return recipes.map((recipe) => {
    return {
      ...recipe,
      name: recipe.nameKor || recipe.name || {},
      nameKor: undefined,
      ingredients: recipe.ingredientsEng || recipe.ingredients || {}, // `ingredientsEng` → `ingredients`로 변환
      ingredientsEng: undefined, // 기존 `ingredientsEng` 제거
    };
  });
};

export const parseRecipeDetail = (recipe, type) => {
  if (!recipe) return null;

  return {
    id: recipe.id,
    userId: recipe.userId || 0,
    name: recipe.name || recipe.nameKor,
    nameEng: recipe.nameEng || null, // 이름 통합
    imageUrl: recipe.imageUrl || null,
    ingredients: recipe.ingredients || recipe.ingredientsEng || {}, // 재료 통합
    ingredientsKor: recipe.ingredientsKor || null,
    recipe: recipe.recipe || [],
    glassType: recipe.glass || recipe.glassType || null, // 잔 종류 통합
    createdAt: recipe.createdAt || null,
    updatedAt: recipe.updatedAt || null,
    status: recipe.status || "from dataset",
    tastes: recipe.tastes || [],
    aromas: recipe.aromas || [],
    colors: recipe.colors || recipe.color || null, // 색상 통합
    likes: recipe.likes || 0,
    abv: recipe.abv ? parseFloat(recipe.abv) : 0, // ABV(도수) 통일
    views: recipe.views || 0,
    type: type, // `user` 또는 `cocktail` 구분
  };
};

export const parseMyrecipes = (recipes) => {
  if (!recipes) return null;

  return recipes.map((recipe) => {
    return {
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients,
      abv: recipe.abv
        ? parseFloat(recipe.abv) === 0
          ? "non-alcohol"
          : parseFloat(recipe.abv) >= 40
          ? "high"
          : parseFloat(recipe.abv) >= 20
          ? "medium"
          : "low"
        : "non-alcohol",
    };
  });
};
