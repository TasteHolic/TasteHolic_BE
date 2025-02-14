import { prisma } from "../../db.config.js";
import {
  NoRecipeError,
  NoPermission,
  ExistingFavError,
  NoExistingFavError,
} from "../error.js";

export const createRecipeInDB = async (data) => {
  return await prisma.userRecipes.create({
    data: {
      userId: data.userId,
      name: data.name,
      imageUrl: data.imageUrl,
      ingredients: data.ingredients,
      recipe: data.recipe,
      glassType: data.glassType,
      status: data.status,
      tastes: data.tastes,
      aromas: data.aromas,
      abv: data.abv,
    },
  });
};

export const findRecipeInDB = async (recipeId) => {
  return await prisma.userRecipes.findFirst({
    where: {
      id: recipeId,
    },
  });
};

export const updateRecipeInDB = async (recipeId, userId, data) => {
  return await prisma.userRecipes.update({
    where: {
      id: recipeId,
      userId: userId,
    },
    data,
  });
};

export const deleteRecipeInDB = async (recipeId, userId) => {
  try {
    const [deletedFavs, deletedRecipe] = await prisma.$transaction([
      prisma.userRecipeFavorites.deleteMany({
        where: { recipeId: recipeId },
      }),
      prisma.userRecipes.delete({
        where: {
          id: recipeId,
          userId: userId,
        },
      }),
    ]);

    return {
      success: true,
    };
  } catch (err) {
    throw err;
  }
};

export const readCocktailInDB = async (cocktailId) => {
  try {
    console.log("?");
    const cocktail = await prisma.cocktails.update({
      where: {
        id: cocktailId,
      },
      data: { views: { increment: 1 } },
    });
    return cocktail;
  } catch (error) {
    return null;
  }
};

export const readUserRecipeInDB = async (recipeId) => {
  try {
    const userRecipe = await prisma.userRecipes.update({
      where: {
        id: recipeId,
      },
      data: { views: { increment: 1 } },
    });
    return userRecipe;
  } catch (error) {
    return null;
  }
};

export const updateLikeOnUserRecipeInDB = async (recipeId, userId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingFav = await tx.userRecipeFavorites.findFirst({
        where: {
          recipeId: recipeId,
          userId: userId,
        },
      });

      if (existingFav) {
        throw new ExistingFavError("이미 좋아요를 눌렀습니다.");
      }

      const updatedRecipe = await tx.userRecipes.update({
        where: { id: recipeId },
        data: { likes: { increment: 1 } },
      });

      const fav = await tx.userRecipeFavorites.create({
        data: {
          recipeId: recipeId,
          userId: userId,
        },
      });

      return { recipe: updatedRecipe, fav };
    });
  } catch (err) {
    if (err.code === "P2025") {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    console.error("좋아요 업데이트 중 오류 발생:", err);
    throw err;
  }
};

export const updateLikeOnCocktailInDB = async (recipeId, userId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingFav = await tx.cocktailFavorites.findFirst({
        where: {
          cocktailId: recipeId,
          userId: userId,
        },
      });

      if (existingFav) {
        throw new ExistingFavError("이미 좋아요를 눌렀습니다.");
      }

      const updatedRecipe = await tx.cocktails.update({
        where: { id: recipeId },
        data: { likes: { increment: 1 } },
      });

      const fav = await tx.cocktailFavorites.create({
        data: {
          cocktailId: recipeId,
          userId: userId,
        },
      });

      return { recipe: updatedRecipe, fav };
    });
  } catch (err) {
    if (err.code === "P2025") {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    console.error("좋아요 업데이트 중 오류 발생:", err);
    throw err;
  }
};

export const cancelLikeOnUserRecipeInDB = async (recipeId, userId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingFav = await tx.userRecipeFavorites.findFirst({
        where: {
          recipeId: recipeId,
          userId: userId,
        },
      });

      if (!existingFav) {
        throw new NoExistingFavError("좋아요 기록이 없습니다.");
      }

      const updatedRecipe = await tx.userRecipe.update({
        where: { id: recipeId },
        data: { likes: { decrement: 1 } },
      });

      const fav = await tx.userRecipeFavorites.deleteMany({
        where: {
          recipeId: recipeId,
          userId: userId,
        },
      });

      return { recipe: updatedRecipe, fav };
    });
  } catch (err) {
    if (err.code === "P2025") {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    console.error("좋아요 업데이트 중 오류 발생:", err);
    throw err;
  }
};

export const cancelLikeOnCocktailInDB = async (recipeId, userId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingFav = await tx.cocktailFavorites.findFirst({
        where: {
          cocktailId: recipeId,
          userId: userId,
        },
      });

      if (!existingFav) {
        throw new NoExistingFavError("좋아요 기록이 없습니다.");
      }

      const updatedRecipe = await tx.cocktails.update({
        where: { id: recipeId },
        data: { likes: { decrement: 1 } },
      });

      const fav = await tx.cocktailFavorites.deleteMany({
        where: {
          cocktailId: recipeId,
          userId: userId,
        },
      });

      return { recipe: updatedRecipe, fav };
    });
  } catch (err) {
    if (err.code === "P2025") {
      throw new NoRecipeError("존재하지 않는 레시피입니다.");
    }
    console.error("좋아요 업데이트 중 오류 발생:", err);
    throw err;
  }
};

// 🔹 공통적인 커서 기반 페이지네이션 옵션 생성 함수
const getPaginationOptions = (cursor, limit) => {
  const options = {
    take: parseInt(limit),
    orderBy: { id: "desc" }, // ID 기준 오름차순 정렬
  };

  if (cursor) {
    options.cursor = { id: parseInt(cursor) };
    options.skip = 1; // 커서 이후부터 가져오기
  }

  return options;
};

// 🔹 사용자 레시피 가져오기
export const getUserRecipesFromDB = async (cursor, limit) => {
  const options = getPaginationOptions(cursor, limit);
  const recipes = await prisma.userRecipes.findMany(options);
  const nextCursor =
    recipes.length === limit ? recipes[recipes.length - 1].id : null;

  return { recipes, nextCursor };
};

export const getFilteredRecipesFromDB = async (filter, cursor, limit) => {
  try {
    // 최신순 정렬을 위한 페이지네이션 옵션 적용
    const paginationOptions = getPaginationOptions(cursor, limit);

    let query;
    let values = [];

    // 필터별 SQL 쿼리 설정 (최신순 적용)
    if (filter === "zero") {
      query = `
        SELECT id, nameKor, ingredientsEng, likes, views, 'cocktail' as type
        FROM Cocktails
        WHERE abv = 0
      `;
    } else {
      query = `
        SELECT id, nameKor, ingredientsEng, likes, views, 'cocktail' as type
        FROM Cocktails
        WHERE abv > 30
      `;
    }

    if (cursor) {
      query += ` AND id < ? `; // 최신순이므로 id < cursor 적용
      values.push(cursor);
    }

    // UNION ALL 추가 (userRecipes 포함)
    query += `
      UNION ALL
      SELECT id, name, ingredients, likes, views, 'user' as type
      FROM UserRecipes
    `;

    if (filter === "zero") {
      query += ` WHERE abv = 0 `;
    } else {
      query += ` WHERE abv > 30 `;
    }

    if (cursor) {
      query += ` AND id < ? `;
      values.push(cursor);
    }

    query += `
      ORDER BY id DESC
      LIMIT ?
    `;
    values.push(limit); // LIMIT 추가

    // Prisma raw query 실행
    const recipes = await prisma.$queryRawUnsafe(query, ...values);

    // `nextCursor` 설정 (가장 마지막 항목의 ID)
    const nextCursor =
      recipes.length === limit ? recipes[recipes.length - 1].id : null;

    return { recipes, nextCursor };
  } catch (err) {
    console.error("❌ 데이터 조회 실패:", err.message || err);
    throw err;
  }
};

export const getFruityRecipesFromDB = async (cursor, limit) => {
  try {
    let query = `
      SELECT id, name, ingredients, likes, views, 'user' as type
      FROM UserRecipes
      WHERE JSON_CONTAINS(tastes, '["프루티"]') 
        OR JSON_CONTAINS(aromas, '["프루티"]') 
        OR JSON_CONTAINS(tastes, '["fruity"]') 
        OR JSON_CONTAINS(aromas, '["fruity"]')
`;

    let values = [];

    if (cursor) {
      query += ` AND id < ? `;
      values.push(cursor);
    }

    query += `
      UNION ALL
      SELECT id, nameKor, ingredientsEng, likes, views, 'cocktail' as type
      FROM Cocktails
      WHERE JSON_CONTAINS(tastes, '["프루티"]') 
        OR JSON_CONTAINS(aromas, '["프루티"]') 
        OR JSON_CONTAINS(tastes, '["fruity"]') 
        OR JSON_CONTAINS(aromas, '["fruity"]')
    `;

    if (cursor) {
      query += ` AND id < ? `;
      values.push(cursor);
    }

    query += `
      ORDER BY id DESC
      LIMIT ?
    `;
    values.push(limit);

    // Prisma raw query 실행
    const recipes = await prisma.$queryRawUnsafe(query, ...values);

    // `nextCursor` 설정 (가장 마지막 항목의 ID)
    const nextCursor =
      recipes.length === limit ? recipes[recipes.length - 1].id : null;

    return { recipes, nextCursor };
  } catch (err) {
    console.error("❌ 데이터 조회 실패:", err.message || err);
    throw err;
  }
};

export const getUnder2RecipesFromDB = async (cursor, limit) => {
  try {
    let query = `
      SELECT id, name, ingredients, likes, views, 'user' as type
      FROM UserRecipes
      WHERE JSON_LENGTH(ingredients) <= 2
    `;

    let values = [];

    if (cursor) {
      query += ` AND id < ? `;
      values.push(cursor);
    }

    query += `
      UNION ALL
      SELECT id, nameKor, ingredientsEng, likes, views, 'cocktail' as type
      FROM Cocktails
      WHERE JSON_LENGTH(ingredientsEng) <= 2
    `;

    if (cursor) {
      query += ` AND id < ? `;
      values.push(cursor);
    }

    query += `
      ORDER BY id DESC
      LIMIT ?
    `;
    values.push(limit);

    // Prisma raw query 실행
    const recipes = await prisma.$queryRawUnsafe(query, ...values);

    // `nextCursor` 설정 (가장 마지막 항목의 ID)
    const nextCursor =
      recipes.length === limit ? recipes[recipes.length - 1].id : null;

    return { recipes, nextCursor };
  } catch (err) {
    console.error("❌ 데이터 조회 실패:", err.message || err);
    throw err;
  }
};

export const getFavRecipesFromDB = async (userId, cursor, limit) => {
  try {
    let values = [];
    let query = `
      SELECT ur.id, ur.name, ur.ingredients, ur.likes, ur.views, 'user' as type
      FROM UserRecipeFavorites uf
      JOIN UserRecipes ur ON uf.recipeId = ur.id
      WHERE uf.userId = ?
    `;

    values.push(userId);

    if (cursor) {
      query += ` AND ur.id < ? `;
      values.push(cursor);
    }

    query += `
      UNION ALL
      SELECT c.id, c.nameKor AS name, c.ingredientsEng AS ingredients, c.likes, c.views, 'cocktail' as type
      FROM CocktailFavorites cf
      JOIN Cocktails c ON cf.cocktailId = c.id
      WHERE cf.userId = ?
    `;

    values.push(userId);

    if (cursor) {
      query += ` AND c.id < ? `;
      values.push(cursor);
    }

    query += `
      ORDER BY id DESC
      LIMIT ?
    `;
    values.push(limit);

    // Prisma raw query 실행
    const recipes = await prisma.$queryRawUnsafe(query, ...values);

    // `nextCursor` 설정 (가장 마지막 항목의 ID)
    const nextCursor =
      recipes.length === limit ? recipes[recipes.length - 1].id : null;

    return { recipes, nextCursor };
  } catch (err) {
    console.error("❌ 좋아요한 레시피 조회 실패:", err.message || err);
    throw err;
  }
};

export const getMyRecipesFromDB = async (id) => {
  console.log(id);
  return await prisma.userRecipes.findMany({
    where: {
      userId: id,
    },
    orderBy: { id: "desc" },
  });
};
