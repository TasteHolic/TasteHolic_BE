import { StatusCodes } from "http-status-codes";
import { bodyToCocktailTastingNote, bodyToAlcoholTastingNote } from "../dtos/tasting-note.dto.js";
import { userTastingNote, searchDrinks, userTastingNoteDetail, expertTastingNoteDetail, tastingNoteDetail} from "../services/tasting-note.service.js";

export const handleSearchDrinks = async (req, res, next) => {
    try {
      const { query, type } = req.query;  // type을 함께 받아옴
  
      if (!query || query.trim() === "") {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "검색어를 입력하세요." });
      }
  
      if (!type) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "타입을 입력하세요." });
      }

      const results = await searchDrinks(query, type);  // type을 전달하여 검색
  
      res.status(StatusCodes.OK).json({ results });
    } catch (error) {
      console.error("검색 오류 발생:", error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

export const handleUserTastingNote = async (req, res, next) => {
  try {
    console.log("테이스팅 노트 작성을 요청했습니다!");
    console.log("body:", req.body);

    const {type} =req.query;
    let tastingnote;

    if (type === "cocktail") {
      // Cocktail 타입일 경우
      tastingnote = await userTastingNote(bodyToCocktailTastingNote(req.body), "cocktail");
    } else {
      // Alcohol 타입일 경우
      tastingnote = await userTastingNote(bodyToAlcoholTastingNote(req.body), "alcohol");
    }

    res.status(StatusCodes.OK).json({ result: tastingnote });
  } catch (error) {
    console.error("오류 발생:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const handleGetUserTastingNote = async (req, res, next) => {
  try {
    const { type, noteId } = req.query; // tasting-note ID

    const userTastingNote = await userTastingNoteDetail(type, noteId); // 서비스에서 사용자 테이스팅 노트 조회

    res.status(StatusCodes.OK).json({ userTastingNote });
  } catch (error) {
    console.error("오류 발생:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const handleGetExpertTastingNote = async (req, res, next) => {
  try {
    const { type, noteId } = req.query; // type과 id

    const expertTastingNote = await expertTastingNoteDetail(type,noteId); // 서비스에서 전문가 테이스팅 노트 조회

    if (!expertTastingNote) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "전문가의 테이스팅 노트가 없습니다." });
    }

    res.status(StatusCodes.OK).json({ expertTastingNote });
  } catch (error) {
    console.error("오류 발생:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

export const handleGetTastingNote = async (req, res, next) => {
    try {
      const { type, noteId } = req.query; // noteId와 userId를 받아옴
  
      const result = await tastingNoteDetail(type, noteId);
        res.status(200).json(result);
    } catch (error) {
      console.error("오류 발생:", error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  };