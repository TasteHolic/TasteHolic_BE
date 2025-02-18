import { StatusCodes } from "http-status-codes";
import { bodyToCocktailTastingNote, bodyToAlcoholTastingNote, updateTastingNoteDto } from "../dtos/tastingnote.dto.js";
import { userTastingNote, searchDrinks, updateTastingNote, getTastingNoteById, deleteTastingNote, tastingNoteDetail, getAllTastingNotes} from "../services/tastingnote.service.js";

export const handleSearchDrinks = async (req, res, next) => {
    try {
      const { query, type } = req.query;  // type을 함께 받아옴
  
      if (!query || query.trim() === "") {
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "검색어를 입력하세요" });
      }
  
      if (!type) {
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "타입을 입력하세요" });
      }

      const results = await searchDrinks(query, type);  // type을 전달하여 검색
  
      res.status(StatusCodes.OK).success(results);
    } catch (error) {
      console.error("검색 오류 발생:", error.message);
    }
};

export const handleUserTastingNote = async (req, res, next) => {
  try {
    console.log("테이스팅 노트 작성을 요청했습니다!");
    console.log("body:", req.body);

    const {type} =req.query;
    let tastingnote;
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "사용자 인증 실패" });
    }

    if (type === "cocktail") {
      // Cocktail 타입일 경우
      tastingnote = await userTastingNote(userId, bodyToCocktailTastingNote(req.body, userId), "cocktail");
    } else {
      // Alcohol 타입일 경우
      tastingnote = await userTastingNote(userId, bodyToAlcoholTastingNote(req.body, userId), type);
    }

    res.status(StatusCodes.OK).success(tastingnote);
  } catch (error) {
    console.error("오류 발생:", error.message);
    next(err);
  }
};

// 테이스팅 노트 수정
export const handleUpdateTastingNote = async (req, res, next) => {
  try {
    const { noteId } = req.params; // 수정할 테이스팅 노트 ID
    const { type } = req.query;
    const userId = req.user.id;
    if (!userId) {
      return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "사용자 인증 실패" });
    }

    console.log(`테이스팅 노트 ID: ${noteId} 수정 요청`);

    // 테이스팅 노트 조회
    const existingNote = await getTastingNoteById(noteId, type);
    if (!existingNote) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "테이스팅 노트를 찾을 수 없습니다." });
    }

    // 사용자 권한 확인
    if (Number(existingNote.userId) !== Number(userId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "수정 권한이 없습니다." });
    }

    if (!type) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "타입을 전달해야 합니다." });
    }

    const updatedTastingNote = await updateTastingNote(
      noteId,
      updateTastingNoteDto(req.body, type),
      type
    );

    if (!updatedTastingNote) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "해당 테이스팅 노트를 찾을 수 없습니다." });
    }

    res.status(StatusCodes.OK).success(updatedTastingNote);
  } catch (error) {
    console.error("테이스팅 노트 수정 오류:", error.message);
    next(err);
  }
};


// 테이스팅 노트 삭제
export const handleDeleteTastingNote = async (req, res, next) => {
  try {
    const { noteId } = req.params; // 삭제할 테이스팅 노트 ID
    const { type } = req.query;
    const userId = req.user.id;
    if (!userId) {
      return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "사용자 인증 실패" });
    }

    console.log(`테이스팅 노트 ID: ${noteId} 삭제 요청`);

    // 테이스팅 노트 조회
    const existingNote = await getTastingNoteById(noteId, type);
    if (!existingNote) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "테이스팅 노트를 찾을 수 없습니다." });
    }

    // 사용자 권한 확인
    if (Number(existingNote.userId) !== Number(userId)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "삭제 권한이 없습니다." });
    }

    // 테이스팅 노트 삭제
    const deletedNote = await deleteTastingNote(noteId, type);
    if (!deletedNote) {
      next(err);
    }

    res.status(StatusCodes.OK).success("테이스팅 노트가 성공적으로 삭제되었습니다.");
  } catch (error) {
    console.error("테이스팅 노트 삭제 오류:", error.message);
    next(err);
  }
};


// 테이스팅 노트 상세 조회
export const handleGetTastingNote = async (req, res, next) => {
    try {
      const { noteId } = req.params; // 조회할 테이스팅 노트 ID
      const { type } = req.query; 
      const userId = req.user.id;
      if (!userId) {
        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "사용자 인증 실패" });
      }  

      const result = await tastingNoteDetail(type, noteId);
        res.status(200).json(result);
    } catch (error) {
      console.error("오류 발생:", error.message);
    }
  };

// 테이스팅 노트 전체 조회
export const handleGetAllTastingNotes = async (req, res, next) => {
  console.log("Request received for /api/v1/users/tasting-note/list"); // 이 로그가 콘솔에 출력되는지 확인

  try {
    const { type } = req.query; // 타입 쿼리 파라미터 (cocktail, whiskey, gin, rum, tequila, wine, beer, other)
    console.log(type);
    const userId = req.user.id;
    
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "사용자 인증 실패" });
    }

    let tastingNotes;

    console.log("시작");
    tastingNotes = await getAllTastingNotes(userId,type);

    // 테이스팅 노트가 없으면 빈 배열로 응답
    if (!tastingNotes) {
      return res.status(200).json({ tastingNotes: [] });
    }

    return res.status(200).json({ tastingNotes });
  } catch (error) {
    console.error("오류 발생:", error.message);
    return res.status(500).json({ error: "서버 오류" });
  }
};

