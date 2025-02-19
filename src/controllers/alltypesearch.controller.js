import { StatusCodes } from "http-status-codes";
import { searchAllTypeDrinks } from "../repositories/alltypesearch.repository.js";
import { applyMyBarFilter } from "..//utils/applyMyBarFilter.js";

export const handleAllTypeSearch = async (req, res) => {
    try {
      const { query } = req.query; // 쿼리 파라미터로 검색어 받기
      const userId = req.user ? req.user.id : null; // 로그인 여부 확인
  
      console.log("query: " + query);
  
      const { officialRecipes, userRecipes } = await searchAllTypeDrinks(query);
      console.log(officialRecipes);
  
      // officialRecipes에 myBar 필드를 추가
      const officialRecipesWithMyBar = await Promise.all(
        officialRecipes.map(async (recipe) => ({
          ...recipe,
          myBar: await applyMyBarFilter(userId, recipe),
        }))
      );
  
      // userRecipes에 myBar 필드를 추가
      const userRecipesWithMyBar = await Promise.all(
        userRecipes.map(async (recipe) => ({
          ...recipe,
          myBar: await applyMyBarFilter(userId, recipe),
        }))
      );
  
      // officialRecipes와 userRecipes 합치기
      const recipesWithMyBar = [...officialRecipesWithMyBar, ...userRecipesWithMyBar];
  
      res.status(200).json({ recipes: recipesWithMyBar });
    } catch (error) {
      console.error("getRecipeList 에러:", error.message);
      res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
  };
  