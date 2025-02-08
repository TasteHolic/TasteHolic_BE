//controller

import express from "express";
import { searchAlcoholsAndCocktails } from "../services/search.service.js";
import { validateSearchBody, responseFromSearch } from "../dtos/search.dto.js";

const searchRouter = express.Router();

searchRouter.post("/", async (req, res) => {
  try {
    // 요청 데이터 검증
    const { category, minAbv, maxAbv } = validateSearchBody(req.body);

    // 검색 실행
    const results = await searchAlcoholsAndCocktails(category, minAbv, maxAbv);

    // 응답 변환 후 반환
    return res.status(200).json({ data: responseFromSearch(results) });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default searchRouter;