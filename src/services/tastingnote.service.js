import { responseFromUser } from "../dtos/tastingnote.dto.js";
import {
  searchDrinksInDB,
  addTastingNote,
  getTastingNote,
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

