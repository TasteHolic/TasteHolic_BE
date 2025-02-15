export const formatCocktailResponse = (cocktail) => ({
    id: cocktail.id,
    aromas: cocktail.aromas,
    tastes: cocktail.tastes,
    timing: cocktail.timing,
    ingredientsKor: cocktail.ingredientsKor,
    abv: cocktail.abv,
  });
  