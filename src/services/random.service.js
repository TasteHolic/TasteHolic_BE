import { fetchRandomCocktails } from "../repositories/random.repository.js";
import { formatCocktailResponse } from "../dtos/random.dto.js";

export const getRandomCocktails = async () => {
  const cocktails = await fetchRandomCocktails();
  return cocktails.map(formatCocktailResponse);
};
