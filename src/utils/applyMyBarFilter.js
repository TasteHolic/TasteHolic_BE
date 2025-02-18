import { searchBar } from "../repositories/mybar.repository.js";


export const applyMyBarFilter = async (userId, item) => {
  if (!userId) {
    return false; // 로그인하지 않은 사용자는 항상 false 반환
  }

  const { cocktails, recipes } = await searchBar(userId);

  // 포함 여부 확인
  const isInCocktails = cocktails.some((cocktail) => cocktail.id === item.id);
  const isInRecipes = recipes.some((recipe) => recipe.id === item.id);

  return isInCocktails || isInRecipes;
};
