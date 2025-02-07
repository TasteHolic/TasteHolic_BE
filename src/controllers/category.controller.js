import { bodyToSearch } from "../dtos/category.dto.js";
import { searchDrinks } from "../services/category.service.js";
import { StatusCodes } from "http-status-codes";

export const handleSearchCategory = async (req, res, next) => {
    console.log("카테고리 검색을 요청했습니다!");
    console.log("body:", req.body);
    
    try {
        const filters = bodyToSearch(req.body);
        const results = await searchDrinks(filters);
        res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.error("검색 중 오류 발생:", err);
        next(err);
    }
};