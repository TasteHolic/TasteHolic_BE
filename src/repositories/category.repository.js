import { prisma } from "../../db.config.js";

export const searchAlcohols = async (filters) => {
    const conditions = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value === undefined || value === null || value === "") return acc;

        switch (key) {
            case "abv":
                acc.push({ abv: parseFloat(value) }); // 정확히 일치하는 도수만 검색
                break;
            case "aromas":
            case "tastes":
                acc.push({ [key]: value }); // 단일 값만 필터링
                break;
            case "category":
                acc.push({ categoryEng: value });
                break;
            default:
                acc.push({ [key]: value });
                break;
        }
        return acc;
    }, []);

    // AND 조건이 없으면 빈 객체 대신 빈 배열 방지
    const whereClause = conditions.length > 0 ? { AND: conditions } : {};

    const results = await prisma.alcohols.findMany({
        where: whereClause,
        select: { nameEng: true, nameKor: true }
    });

    return results.length > 0 ? results : [{ message: "해당되는 검색어가 없습니다." }];
};


export const searchCocktails = async (filters) => {
    const whereClause = { AND: Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) {
            if (key === "category") acc.push({ categoryEng: value });
            else if (key === "abv") acc.push({ abv: { lte: parseFloat(value) } });
            else if (key === "mood" || key === "timing" || key === "aromas" || key === "tastes" || key === "color") {
                acc.push({ [key]: { array_contains: value } });
            }
            else acc.push({ [key]: value });
        }
        return acc;
    }, [])};

    const results = await prisma.cocktails.findMany({
        where: whereClause,
        select: { nameEng: true, nameKor: true }
    });

    return results.length > 0 ? results : [{ message: "해당되는 검색어가 없습니다." }];
};
