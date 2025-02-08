//service

import { findAlcoholsAndCocktails } from "../repositories/search.repository.js";

export async function searchAlcoholsAndCocktails(category, minAbv, maxAbv, aroma, taste) {
  return await findAlcoholsAndCocktails(category, minAbv, maxAbv, aroma, taste);
}