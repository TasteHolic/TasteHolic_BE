import {
  saveRecipe
} from "../repositories/recipe.repository.js"

export const createRecipeService = async (data) => {
  const savedRecipe = await saveRecipe(data);
  return savedRecipe;
};

export const getRecipeListService = async (data) => {
  
}

export const getRecipeService = async (data) => {
  
}

export const updateRecipeService = async (data) => {
  
}

export const deleteRecipeService = async (data) => {
  
}