import { StatusCodes } from "http-status-codes";
import { allTypeSearch } from "../services/alltypesearch.service.js";

export const handleAllTypeSearch = async (req, res, next) => {
    try {
      const { query } = req.query;
  
      if (!query || query.trim() === "") {
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "검색어를 입력하세요" });
      }

      const results = await allTypeSearch(query);
  
      res.status(StatusCodes.OK).success(results);
    } catch (error) {
      console.error("검색 오류 발생:", error.message);
    }
};