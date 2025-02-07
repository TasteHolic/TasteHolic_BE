import { StatusCodes } from "http-status-codes";
import { bodyToCocktailTastingNote, bodyToAlcoholTastingNote, updateTastingNoteDto } from "../dtos/tastingnote.dto.js";
import { userTastingNote, searchDrinks, updateTastingNote, getTastingNoteById} from "../services/tastingnote.service.js";

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

// 테이스팅 노트 수정
export const handleUpdateTastingNote = async (req, res, next) => {
  try {
    const { noteId } = req.params; // 수정할 테이스팅 노트 ID
    const { type } = req.query;
    const userId = 1;

    console.log(`테이스팅 노트 ID: ${noteId} 수정 요청`);

    // 테이스팅 노트 조회
    const existingNote = await getTastingNoteById(noteId, type);
    if (!existingNote) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "테이스팅 노트를 찾을 수 없습니다." });
    }

    // 사용자 권한 확인
    if (Number(existingNote.userId) !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "수정 권한이 없습니다." });
    }

    if (!type) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "type (cocktail 또는 alcohol)을 query로 전달해야 합니다.",
      });
    }

    const updatedTastingNote = await updateTastingNote(
      noteId,
      updateTastingNoteDto(req.body, type),
      type
    );

    if (!updatedTastingNote) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "해당 테이스팅 노트를 찾을 수 없습니다." });
    }

    res.status(StatusCodes.OK).json({ result: updatedTastingNote });
  } catch (error) {
    console.error("테이스팅 노트 수정 오류:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};
