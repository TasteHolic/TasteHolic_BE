// search.repository.js
import { prisma } from "../../db.config.js";

export const searchRepository = {
    async findCocktailsByFilters({ keyword, category, alcoholContent, taste, glassType }) {
        return prisma.cocktails.findMany({
            where: {
                AND: [
                    keyword ? { OR: [
                        { nameEng: { contains: keyword.toLowerCase() } },
                        { nameKor: { contains: keyword.toLowerCase() } }
                    ] } : {},
                    category ? { categoryKor: category } : {},
                    alcoholContent ? { abv: alcoholContent } : {},
                    taste ? { tastes: { array_contains: taste } } : {},
                    glassType ? { glassType } : {}
                ]
            }
        });
    },

    async findAlcoholsByFilters({ keyword, category, alcoholContent, taste, glassType }) {
        return prisma.alcohols.findMany({
            where: {
                AND: [
                    keyword ? { OR: [
                        { nameEng: { contains: keyword.toLowerCase() } },
                        { nameKor: { contains: keyword.toLowerCase() } }
                    ] } : {},
                    category ? { categoryKor: category } : {},
                    alcoholContent ? { abv: alcoholContent } : {},
                    taste ? { tastes: { array_contains: taste } } : {},
                    glassType ? { glassType } : {}
                ]
            }
        });
    }
};
