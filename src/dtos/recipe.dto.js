export const RecipeStepsDto = (data) => ({
  ...data,
  recipe: data.recipe
    .split(".") // "."을 기준으로 나누기
    .map((step) => step.trim()) // 앞뒤 공백 제거
    .filter((step) => step !== ""), // 빈 문자열 제거
});
