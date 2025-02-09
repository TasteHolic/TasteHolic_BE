import { searchService } from "../services/search.service.js";
import { searchResultDto } from "../dtos/search.dto.js";
import { NoAlcoholError } from "../error.js";

export const handleSearch = async (req, res) => {
    try {
        const { keyword, category, alcoholContent, taste, glassType } = req.body;

        if (!(keyword || category || alcoholContent || taste || glassType)) {
            return res.status(400).json({
                errorCode: "INVALID_INPUT",
                reason: "검색어 또는 필터 중 하나는 반드시 입력해야 합니다.",
            });
        }        

        const results = await searchService.searchCocktailsAndAlcohols({
            keyword,
            category,
            alcoholContent,
            taste,
            glassType,
        });

        if (results.length === 0) {
            throw new NoAlcoholError("검색된 술이 없습니다.", {
                keyword,
                category,
                alcoholContent,
                taste,
                glassType,
            });
        }

        res.json(searchResultDto(results));
    } catch (error) {
        console.error("Search error:", error);
        res.status(error.statusCode || 500).json({
            errorCode: error.errorCode || "INTERNAL_ERROR",
            reason: error.reason || "서버 오류가 발생했습니다.",
            data: error.data || error.message,
        });
    }
};