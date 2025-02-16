export const formatCocktailResponse = (cocktail) => ({
    id: cocktail.id,
    nameEng: cocktail.nameEng,
    images: cocktail.images,
    aromas: cocktail.aromas,
    tastes: cocktail.tastes,
    timing: cocktail.timing,
    ingredientsKor: cocktail.ingredientsKor,
    abv: cocktail.abv,
  });
  