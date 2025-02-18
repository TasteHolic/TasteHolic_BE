import { responseFromUser, toUserTastingNoteDTO, toExpertTastingNoteDTO } from "../dtos/tastingnote.dto.js";
import {
  searchDrinksInDB,
  addTastingNote,
  getTastingNote,
  modifyTastingNote,
  findTastingNoteById,
  removeTastingNote,
  getUserTastingNote,
  getExpertTastingNote,
  listTastingNotes
} from "../repositories/tastingnote.repository.js";

export const searchDrinks = async (query, type) => {
    return await searchDrinksInDB(query, type);  // type을 전달
};
 
export const userTastingNote = async (userId, data, type) => {
  const tastingNoteId = await addTastingNote({
    userId,
    cocktailId: data.cocktailId,
    alcoholId: data.alcoholId,
    name: data.name,
    tasteRating: data.tasteRating,
    aromaRating: data.aromaRating,
    abv: data.abv,
    color: data.color || null,
    finishRating: data.finishRating || null,
    description: data.description,
  },type);

  const tastingnote = await getTastingNote(tastingNoteId, type);
  return responseFromUser({ tastingnote, type });
};

// 테이스팅 노트 ID로 조회
export const getTastingNoteById = async (noteId, type) => {
    return await findTastingNoteById(noteId, type);
  };

// 테이스팅 노트 수정
export const updateTastingNote = async (noteId, updatedData, type) => {
    return await modifyTastingNote(noteId, updatedData, type);
  };

// 테이스팅 노트 삭제
export const deleteTastingNote = async (noteId, type) => {
    return await removeTastingNote(noteId, type);
}

// 테이스팅 노트 상세 조회
export const tastingNoteDetail = async (type, noteId) => {
  // 사용자의 테이스팅 노트 조회
  const usertastingnote = await getUserTastingNote(type, noteId);
  console.log("DTO 변환 시작");
  const userTastingNote = toUserTastingNoteDTO(usertastingnote, type);
  console.log("사용자 테이스팅 노트 조회 완료");

  // 전문가 테이스팅 노트 조회
const id = type === "cocktail" ? userTastingNote.cocktailId : userTastingNote.alcoholId;
let experttastingnote = null;

if (id) {
  experttastingnote = await getExpertTastingNote(type, id);
}

const expertTastingNote = experttastingnote ? toExpertTastingNoteDTO(experttastingnote, type) : null;

return { userTastingNote, expertTastingNote };

};

// 테이스팅 노트 전체 조회
export const getAllTastingNotes = async (userId, type) => {
  console.log(userId);
  return await listTastingNotes(userId, type);
};


