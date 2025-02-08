export const bodyToSearch = (body) => {
    return {
        category: body.category || null,
        abv: body.abv || null,
        aromas: body.aromas || null,
        taste: body.taste || null,
        mood: body.mood || null
    };
};