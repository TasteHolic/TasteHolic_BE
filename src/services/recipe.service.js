import {
  createRecipeInDB,
  updateRecipeInDB
} from "../repositories/recipe.repository.js";

export const createRecipeService = async (data) => {
  const recipe = await createRecipeInDB(data);
  return recipe;
};

export const getRecipeListService = async (data) => {
  
}

export const getRecipeService = async (data) => {
  
}

export const updateRecipeService = async (data) => {
  
}

export const deleteRecipeService = async (data) => {
  
