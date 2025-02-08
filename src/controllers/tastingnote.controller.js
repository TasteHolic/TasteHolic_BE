import { StatusCodes } from "http-status-codes";
import { bodyToCocktailTastingNote, bodyToAlcoholTastingNote, updateTastingNoteDto } from "../dtos/tastingnote.dto.js";
import { userTastingNote, searchDrinks, updateTastingNote, getTastingNoteById, deleteTastingNote} from "../services/tastingnote.service.js";
import { authenticateUser } from "./user.controller.js";

export const handleSearchDrinks = async (req, res, next) => {
    try {
      const { query, type } = req.query;  // type을 함께 받아옴
  
      if (!query || query.trim() === "") {
        return jsonErrorResponse(res, StatusCodes.BAD_REQUEST, "empty_query", "검색어를 입력하세요.");
      }
  
      if (!type) {
        return jsonErrorResponse(res, StatusCodes.BAD_REQUEST, "missing_type", "타입을 입력하세요.");
      }

      const results = await searchDrinks(query, type);  // type을 전달하여 검색
  
      res.status(StatusCodes.OK).success(results);
    } catch (error) {
      console.error("검색 오류 발생:", error.message);
      jsonErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "search_error", error.message);
    }
};

export const handleUserTastingNote = async (req, res, next) => {
  try {
    console.log("테이스팅 노트 작성을 요청했습니다!");
    console.log("body:", req.body);

    const {type} =req.query;
    let tastingnote;
    const user = authenticateUser(req);
    if (!user?.id) {
        return jsonErrorResponse(res, StatusCodes.UNAUTHORIZED, "auth_error", "사용자 인증 실패");
    }

    if (type === "cocktail") {
      // Cocktail 타입일 경우
      tastingnote = await userTastingNote(user.id, bodyToCocktailTastingNote(req.body, user.id), "cocktail");
    } else {
      // Alcohol 타입일 경우
      tastingnote = await userTastingNote(user.id, bodyToAlcoholTastingNote(req.body, user.id), "alcohol");
    }

    res.status(StatusCodes.OK).success(tastingnote);
  } catch (error) {
    console.error("오류 발생:", error.message);
    jsonErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "creation_error", error.message);
  }
};

// 테이스팅 노트 수정
export const handleUpdateTastingNote = async (req, res, next) => {
  try {
    const { noteId } = req.params; // 수정할 테이스팅 노트 ID
    const { type } = req.query;
    const user = authenticateUser(req);
    if (!user?.id) {
        return jsonErrorResponse(res, StatusCodes.UNAUTHORIZED, "auth_error", "사용자 인증 실패");
    }

    console.log(`테이스팅 노트 ID: ${noteId} 수정 요청`);

    // 테이스팅 노트 조회
    const existingNote = await getTastingNoteById(noteId, type);
    if (!existingNote) {
      return jsonErrorResponse(res, StatusCodes.NOT_FOUND, "note_not_found", "테이스팅 노트를 찾을 수 없습니다.");
    }

    // 사용자 권한 확인
    if (Number(existingNote.userId) !== Number(user.id)) {
      return jsonErrorResponse(res, StatusCodes.FORBIDDEN, "no_permission", "수정 권한이 없습니다.");
    }

    if (!type) {
      return jsonErrorResponse(res, StatusCodes.BAD_REQUEST, "missing_type", "type (cocktail 또는 alcohol)을 query로 전달해야 합니다.");
    }

    const updatedTastingNote = await updateTastingNote(
      noteId,
      updateTastingNoteDto(req.body, type),
      type
    );

    if (!updatedTastingNote) {
      return jsonErrorResponse(res, StatusCodes.NOT_FOUND, "note_not_found", "해당 테이스팅 노트를 찾을 수 없습니다.");
    }

    res.status(StatusCodes.OK).success(updatedTastingNote);
  } catch (error) {
    console.error("테이스팅 노트 수정 오류:", error.message);
    jsonErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "update_error", error.message);
  }
};


// 테이스팅 노트 삭제
export const handleDeleteTastingNote = async (req, res, next) => {
  try {
    const { noteId } = req.params; // 삭제할 테이스팅 노트 ID
    const { type } = req.query;
    const user = authenticateUser(req);
    if (!user?.id) {
        return jsonErrorResponse(res, StatusCodes.UNAUTHORIZED, "auth_error", "사용자 인증 실패");
    }

    console.log(`테이스팅 노트 ID: ${noteId} 삭제 요청`);

    // 테이스팅 노트 조회
    const existingNote = await getTastingNoteById(noteId, type);
    if (!existingNote) {
      return jsonErrorResponse(res, StatusCodes.NOT_FOUND, "note_not_found", "테이스팅 노트를 찾을 수 없습니다.");
    }

    // 사용자 권한 확인
    if (Number(existingNote.userId) !== Number(user.id)) {
      return jsonErrorResponse(res, StatusCodes.FORBIDDEN, "no_permission", "삭제 권한이 없습니다.");
    }

    // 테이스팅 노트 삭제
    const deletedNote = await deleteTastingNote(noteId, type);
    if (!deletedNote) {
      return jsonErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "delete_error", "테이스팅 노트 삭제에 실패했습니다.");
    }

    res.status(StatusCodes.OK).success("테이스팅 노트가 성공적으로 삭제되었습니다.");
  } catch (error) {
    console.error("테이스팅 노트 삭제 오류:", error.message);
    jsonErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "delete_error", error.message);
  }
};