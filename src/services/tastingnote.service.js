import { responseFromUser, toUserTastingNoteDTO, toExpertTastingNoteDTO } from "../dtos/tastingnote.dto.js";
import {
  searchDrinksInDB,
  addTastingNote,
  getTastingNote,
  getUserTastingNote,
  getExpertTastingNote
} from "../repositories/tastingnote.repository.js";

export const searchDrinks = async (query, type) => {
    return await searchDrinksInDB(query, type);  // type을 전달
};
 
export const userTastingNote = async (data, type) => {
  const tastingNoteId = await addTastingNote({
    userId: data.userId,
    cocktailId: data.cocktailId,
    alcoholId: data.alcoholId,
    name: data.name,
    tasteRating: data.tasteRating,
    aromaRating: data.aromaRating,
    finishRating: data.finishRating || null,
    abv: data.abv,
    abvRating: data.abvRating,
    color: data.color || null,
    description: data.description,
  },type);

  const tastingnote = await getTastingNote(tastingNoteId, type);
  return responseFromUser({ tastingnote });
};

export const userTastingNoteDetail = async (type, noteId) => {
    const tastingnote = await getUserTastingNote(type, noteId);
    return toUserTastingNoteDTO(type, tastingnote);
  };
  
  export const expertTastingNoteDetail = async (type, noteId) => {
    const userTastingNote = await getUserTastingNote(noteId);
    const id = type === "cocktail" ? userTastingNote.cocktailId : userTastingNote.alcoholId;
    const tastingnote = await getExpertTastingNote(type, id);
    return toExpertTastingNoteDTO(type, tastingnote);
  };

  export const tastingNoteDetail = async (type, noteId) => {
    // 사용자의 테이스팅 노트 조회
    const usertastingnote = await getUserTastingNote(type, noteId);
    const userTastingNote = toUserTastingNoteDTO(type,usertastingnote);
  
    // 전문가 테이스팅 노트 조회
    const id = type === "cocktail" ? userTastingNote.cocktailId : userTastingNote.alcoholId;
    const experttastingnote = await getExpertTastingNote(type, id);
    const expertTastingNote = toExpertTastingNoteDTO(type,experttastingnote);
  
    return { userTastingNote, expertTastingNote };
  };
  