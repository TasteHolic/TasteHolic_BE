import { searchRepository } from "../repositories/search.repository.js";

export const searchService = {
    async searchCocktailsAndAlcohols(filters) {
        const [cocktails, alcohols] = await Promise.all([
            searchRepository.findCocktailsByFilters(filters),
            searchRepository.findAlcoholsByFilters(filters)
        ]);
        
        return [...cocktails, ...alcohols];
    }
};
