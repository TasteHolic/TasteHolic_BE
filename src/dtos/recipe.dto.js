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
