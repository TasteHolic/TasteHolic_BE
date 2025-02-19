import { searchBar } from "../repositories/mybar.repository.js";

export const applyMyBarFilter = async (userId, items) => {
  // 로그인하지 않은 사용자는 모두 false 처리
  if (!userId) {
    return items.map((item) => ({ ...item, myBar: false }));
  }

  // 사용자의 바 정보 (칵테일과 유저 레시피) 가져오기
  const { cocktails, recipes } = await searchBar(userId);

  // 각 요소의 타입에 따라 myBar 필드를 추가
  return items.map((item) => {
    if (item.type === "user") {
      return {
        ...item,
        myBar: recipes.some((recipe) => recipe.id === item.id),
      };
    } else {
      return {
        ...item,
        myBar: cocktails.some((cocktail) => cocktail.id === item.id),
      };
    }
  });
};

