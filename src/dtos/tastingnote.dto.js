export const bodyToCocktailTastingNote = (body,type) => {
    return {
      userId: 1,  // 예시로 하드코딩된 userId (실제로는 인증된 사용자의 ID)
      cocktailId: body.cocktailId,  // Cocktail의 id
      name: body.name || "",
      tasteRating: body.tasteRating || "",
      aromaRating: body.aromaRating || "",
      abv: body.abv || "",
      color: body.color || "",
      description: body.description || "",
    };
  };
  
  export const bodyToAlcoholTastingNote = (body,type) => {
    return {
      userId: 1,  // 예시로 하드코딩된 userId (실제로는 인증된 사용자의 ID)
      alcoholId: body.alcoholId,  // Alcohol의 id
      name: body.name || "",
      category: body.category || "",
      tasteRating: body.tasteRating || "",
      aromaRating: body.aromaRating || "",
      finishRating: body.finishRating || "",
      abvRating: body.abvRating || "",
      description: body.description || "",
    };
  };
   

export const responseFromUser = ({ tastingnote, type }) => {
    // type에 따라 반환하는 데이터가 다르므로 type을 기준으로 처리합니다.
    if (type === "cocktail") {
      // Cocktail 관련 테이스팅 노트 반환
      return {
        id: tastingnote.id || null,
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
        id: tastingnote.id || null,
        user_id: tastingnote.userId,  // 테이블에 맞춰 'userId'로 수정
        alcoholId: tastingnote.alcoholId,
        tasteRating: tastingnote.tasteRating,
        aromaRating: tastingnote.aromaRating,
        finishRating: tastingnote.finishRating || null,
        abvRating: tastingnote.abvRating,
        description: tastingnote.description || "",
        createdAt: tastingnote.created_at || null,
        updatedAt: tastingnote.updated_at || null,
      };
    }
  };
  
  export const toUserTastingNoteDTO = ({ tastingnote, type }) => {
    // type에 따라 반환하는 데이터가 다르므로 type을 기준으로 처리합니다.
    if (type === "cocktail") {
      // Cocktail 관련 테이스팅 노트 반환
      return {
        nameEng:tastingnote.nameEng,
        nameKor: tastingnote.nameKor,
        tasteRating: tastingnote.tasteRating,
        aromaRating: tastingnote.aromaRating,
        abv: tastingnote.abv,
        color: tastingnote.color || null,
        description: tastingnote.description || "",
      };
    } else {
      // 그 외의 Alcohol 관련 테이스팅 노트 반환
      return {
        nameEng:tastingnote.nameEng,
        nameKor: tastingnote.nameKor,
        categoryEng:tastingnote.categoryEng,
        categoryKor: tastingnote.categoryKor,
        tasteRating: tastingnote.tasteRating,
        aromaRating: tastingnote.aromaRating,
        finishRating: tastingnote.finishRating || null,
        abvRating: tastingnote.abvRating,
        description: tastingnote.description || "",
      };
    }
  };

  export const toExpertTastingNoteDTO = ({ tastingnote, type }) => {
    // type에 따라 반환하는 데이터가 다르므로 type을 기준으로 처리합니다.
    if (type === "cocktail") {
      // Cocktail 관련 테이스팅 노트 반환
      return {
        nameEng:tastingnote.nameEng,
        nameKor: tastingnote.nameKor,
        tastes: tastingnote.tastes,
        aromas: tastingnote.aromas,
        color: tastingnote.color,
        abv: tastingnote.abv,
        ingredients: tastingnote.ingredients,
      };
    } else {
      // 그 외의 Alcohol 관련 테이스팅 노트 반환
      return {
        nameEng:tastingnote.nameEng,
        nameKor: tastingnote.nameKor,
        categoryEng: tastingnote.catergoryEng,
        categoryKor:tastingnote.categoryKor,
        tastes: tastingnote.tastes,
        aromas: tastingnote.aromas,
        finishes: tastingnote.finishes,
        abv: tastingnote.abv,
        description: tastingnote.description || "",
      };
    }
  };
  
  