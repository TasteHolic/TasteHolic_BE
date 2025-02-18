export const bodyToCocktailTastingNote = (body,userId) => {
    return {
      userId,
      cocktailId: body.cocktailId,  // Cocktail의 id
      name: body.name || "",
      tasteRating: body.tasteRating || "",
      aromaRating: body.aromaRating || "",
      abv: body.abv || "",
      color: body.color || "",
      description: body.description || "",
    };
  };
  
  export const bodyToAlcoholTastingNote = (body,userId) => {
    return {
      userId,
      alcoholId: body.alcoholId,  // Alcohol의 id
      name: body.name || "",
      category: body.category || "",
      tasteRating: body.tasteRating || "",
      aromaRating: body.aromaRating || "",
      abv: body.abv || "",
      finishRating: body.finishRating || "",
      description: body.description || "",
    };
  };
   

export const responseFromUser = ({ tastingnote, type }) => {
    // type에 따라 반환하는 데이터가 다르므로 type을 기준으로 처리합니다.
    if (type === "cocktail") {
      // Cocktail 관련 테이스팅 노트 반환
      return {
        id: tastingnote.id,
        userId: tastingnote.userId,  // 테이블에 맞춰 'userId'로 수정
        cocktailId: tastingnote.cocktailId,
        tasteRating: tastingnote.tasteRating,
        aromaRating: tastingnote.aromaRating,
        abv: tastingnote.abv,
        color: tastingnote.color || null,
        description: tastingnote.description || "",
        createdAt: tastingnote.created_at || null,
        updatedAt: tastingnote.updated_at || null,
      };
    } else {
      // 그 외의 Alcohol 관련 테이스팅 노트 반환
      return {
        id: tastingnote.id,
        user_id: tastingnote.userId,  // 테이블에 맞춰 'userId'로 수정
        alcoholId: tastingnote.alcoholId,
        tasteRating: tastingnote.tasteRating,
        aromaRating: tastingnote.aromaRating,
        abv: tastingnote.abv,
        finishRating: tastingnote.finishRating || null,
        description: tastingnote.description || "",
        createdAt: tastingnote.created_at || null,
        updatedAt: tastingnote.updated_at || null,
      };
    }
  };

  // 테이스팅 노트 수정 DTO
export const updateTastingNoteDto = (body, type) => {
    if (type === "cocktail") {
      return {
        tasteRating: body.tasteRating,
        aromaRating: body.aromaRating,
        abv: body.abv,
        color: body.color,
        description: body.description,
      };
    } else {
      return {
        tasteRating: body.tasteRating,
        aromaRating: body.aromaRating,
        finishRating: body.finishRating,
        abv: body.abv,
        description: body.description,
      };
    }
  };

  export const toUserTastingNoteDTO = (tastingnote, type) => {
    // type에 따라 반환하는 데이터가 다르므로 type을 기준으로 처리합니다.
    if (type === "cocktail") {
      // Cocktail 관련 테이스팅 노트 반환
      return {
        id: Number(tastingnote.id),
        userId: Number(tastingnote.userId),
        cocktailId: tastingnote.cocktailId ? Number(tastingnote.cocktailId) : null,
        name: tastingnote.name,
        tasteRating: tastingnote.tasteRating,
        aromaRating: tastingnote.aromaRating,
        abv: tastingnote.abv,
        color: tastingnote.color || null,
        description: tastingnote.description || "",
        createdAt: tastingnote.createdAt,
        updatedAt: tastingnote.updatedAt
      };
    } else {
      // 그 외의 Alcohol 관련 테이스팅 노트 반환
      return {
        id: Number(tastingnote.id),
        userId: Number(tastingnote.userId),
        alcoholId: Number(tastingnote.alcoholId) || null,
        name:tastingnote.name,
        category:tastingnote.category,
        tasteRating: tastingnote.tasteRating,
        aromaRating: tastingnote.aromaRating,
        finishRating: tastingnote.finishRating || null,
        abv: tastingnote.abv,
        description: tastingnote.description || "",
        createdAt: tastingnote.createdAt,
        updatedAt: tastingnote.updatedAt
      };
    }
  };

  export const toExpertTastingNoteDTO = (tastingnote, type) => {
    // type에 따라 반환하는 데이터가 다르므로 type을 기준으로 처리합니다.
    if (type === "cocktail") {
      // Cocktail 관련 테이스팅 노트 반환
      return {
        id: Number(tastingnote.id),
        nameEng: tastingnote.nameEng,
        nameKor: tastingnote.nameKor,
        tastes: tastingnote.tastes,
        aromas: tastingnote.aromas,
        color: tastingnote.color,
        abv: tastingnote.abv,
        ingredientsEng: tastingnote.ingredientsEng,
        ingredientsKor: tastingnote.ingredientsKor
      };
    } else {
      // 그 외의 Alcohol 관련 테이스팅 노트 반환
      return {
        id: Number(tastingnote.id),
        nameEng:tastingnote.nameEng,
        nameKor: tastingnote.nameKor,
        categoryEng: tastingnote.catergoryEng,
        tastes: tastingnote.tastes,
        aromas: tastingnote.aromas,
        finishes: tastingnote.finishes,
        abv: tastingnote.abv,
        description: tastingnote.description || "",
      };
    }
  };
  
  
