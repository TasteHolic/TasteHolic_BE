export const formatCocktailResponse = (cocktail) => ({
  id: cocktail.id,
  nameEng: cocktail.nameEng,
  imageUrl: cocktail.imageUrl,
  aromas: cocktail.aromas,
  tastes: cocktail.tastes,
  timing: cocktail.timing,
  ingredientsKor: cocktail.ingredientsKor,
  intro: cocktail.intro,
  abv: cocktail.abv,
});
