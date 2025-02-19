import { searchAllTypeDrinks } from "../repositories/alltypesearch.repository.js";

export const allTypeSearch = async (query) => {
    return await searchAllTypeDrinks(query); 
};