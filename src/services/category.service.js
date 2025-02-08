import { searchAlcohols, searchCocktails } from "../repositories/category.repository.js";
import { InvalidFilterError } from "../error.js";

export const searchDrinks = async (filters) => {
    // 주종 필터에 한국어 이름도 허용하기 위해 매핑
    const categoryMap = {
        "위스키": "Whiskey",
        "진": "Gin",
        "럼": "Rum",
        "데낄라": "Tequila",
        "기타": "Other",
        "칵테일": "Cocktail"
    };

    const category = filters.category ? categoryMap[filters.category] || filters.category : null;

    // 분위기 필터와 alcohol 테이블 카테고리 동시 선택 시 에러 처리
    if (category && category !== "Cocktail" && filters.mood) {
        throw new InvalidFilterError("alcohol 테이블에 속하는 주종과 분위기를 동시에 선택할 수 없습니다.", filters);
    }

    // 필터 값 변환 및 검색 실행
    const updatedFilters = {
        ...filters,
        category: category
    };

    return category === "Cocktail" 
        ? await searchCocktails(updatedFilters) 
        : await searchAlcohols(updatedFilters);
};
