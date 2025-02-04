export const searchResultDto = (results) => {
    return {
        results: results.map(item => ({
            id: item.id,
            name: item.nameEng || item.nameKor,
            description: item.description || "",
            image: item.imageUrl || "",
            alcoholContent: item.abv ? `${item.abv}%` : "",
            taste: item.tastes || [],
            color: item.color || "",
            category: item.categoryKor || item.categoryEng || "",
            glassType: item.glassType || ""
        }))
    };
};
