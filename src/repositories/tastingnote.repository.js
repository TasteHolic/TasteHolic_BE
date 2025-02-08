import { pool, prisma } from "../../db.config.js";

// 작성 전 이름 검색
export const searchDrinksInDB = async (query, type) => {
    const conn = await pool.getConnection();

    try {
      let results;
      
      // 'cocktail' 타입이면 Cocktails 테이블을 사용하고, 그 외는 Alcohols 테이블을 사용
      if (type === "cocktail") {
        // 'cocktail' 타입에 대한 검색 (칵테일만 Cocktails 테이블 사용)
        [results] = await conn.query(
          `SELECT id, nameEng, nameKor, 'cocktail' AS type
           FROM Cocktails
           WHERE nameEng LIKE ? OR nameKor LIKE ?;`,
          [`%${query}%`, `%${query}%`]
        );
      } else {
        // 그 외의 타입들은 Alcohols 테이블을 사용 (whiskey, gin, rum 등)
        [results] = await conn.query(
          `SELECT id, nameEng, nameKor, ? AS type
           FROM Alcohols
           WHERE nameEng LIKE ? OR nameKor LIKE ?;`,
          [type, `%${query}%`, `%${query}%`]
        );
      }

      return results;
    } catch (err) {
      console.error("검색 중 오류 발생:", err.message);
      throw new Error(`검색 실패: ${err.message}`);
    } finally {
      conn.release();
    }
};



export const addTastingNote = async (data, type) => {
  const conn = await pool.getConnection();
  console.log("type: ",type);
  const tableName = type === "cocktail" ? "CocktailTastingNotes" : "AlcoholTastingNotes";
  const userId=1;

  try {
    let query;
    let values;

    if (type === "cocktail") {
        let cocktailId = null; // 기본값 null
    
        // 사용자가 입력한 name으로 Cocktails 테이블에서 id 조회
        const getCocktailIdQuery = `SELECT id FROM Cocktails WHERE nameEng = ? LIMIT 1`;
    
        try {
            const [rows] = await pool.query(getCocktailIdQuery, [data.name]); // name을 기반으로 id 조회
    
            if (rows.length > 0) {
                cocktailId = rows[0].id; // 칵테일 ID가 존재하면 할당
            }
    
            if (cocktailId) {
                // 칵테일 ID가 있는 경우
                query = `INSERT INTO ${tableName} (userId, cocktailId, name, tasteRating, aromaRating, abv, color, description, createdAt, updatedAt) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
                values = [
                    data.userId, // userId 하드코딩
                    cocktailId, // 조회된 칵테일 ID
                    data.name,
                    JSON.stringify(data.tasteRating),
                    JSON.stringify(data.aromaRating),
                    data.abv,
                    JSON.stringify(data.color), // color도 JSON으로 변환
                    data.description
                ];
            } else {
                // 칵테일 ID가 없는 경우 (cocktailId 없이 INSERT)
                query = `INSERT INTO ${tableName} (userId, name, tasteRating, aromaRating, abv, color, description, createdAt, updatedAt) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
                values = [
                    data.userId,
                    data.name,
                    JSON.stringify(data.tasteRating),
                    JSON.stringify(data.aromaRating),
                    data.abv,
                    JSON.stringify(data.color), // color도 JSON으로 변환
                    data.description
                ];
            }
        } catch (error) {
            console.error("CocktailTastingNotes 오류:", error.message);
            throw error; // 상위 호출 스택으로 오류 전달
        }
    }else {
        // 알코올 테이스팅 노트
        let alcoholId = null; // 기본값 null
        let category = null; // 기본값 null

    // 사용자가 입력한 name으로 Alcohols 테이블에서 id 조회
    const getAlcoholIdQuery = `SELECT id FROM Alcohols WHERE nameEng = ? LIMIT 1`;
    const getAlcoholCategoryQuery = `SELECT categoryEng FROM Alcohols WHERE nameEng = ? LIMIT 1`;

    try {
        const [idRows] = await pool.query(getAlcoholIdQuery, [data.name]); // name을 기반으로 id 조회
        const [categoryRows] = await pool.query(getAlcoholCategoryQuery, [data.name]); // name을 기반으로 category 조회

        if (idRows.length > 0) {
            alcoholId = idRows[0].id; // 주류 ID가 존재하면 할당
        }
        if (categoryRows.length > 0) {
            category = categoryRows[0].categoryEng; // 주류 Category가 존재하면 할당
        }

        if (alcoholId) {
            // 주류 ID가 있는 경우
            query = `INSERT INTO ${tableName} (userId, alcoholId, name, category, tasteRating, aromaRating, finishRating, abvRating, description, createdAt, updatedAt) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
            values = [
                data.userId,
                alcoholId, // 조회된 주류 ID
                data.name,
                category,
                JSON.stringify(data.tasteRating),
                JSON.stringify(data.aromaRating),
                JSON.stringify(data.finishRating),
                data.abvRating,
                data.description
            ];
        } else {
            // 주류 ID가 없는 경우 (alcoholId 없이 INSERT)
            query = `INSERT INTO ${tableName} (userId, name, tasteRating, aromaRating, finishRating, abvRating, description, createdAt, updatedAt) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
            values = [
                data.userId,
                data.name,
                JSON.stringify(data.tasteRating),
                JSON.stringify(data.aromaRating),
                JSON.stringify(data.finishRating),
                data.abvRating,
                data.description
            ];
        }
    } catch (error) {
        console.error("AlcoholTastingNotes 오류:", error.message);
        throw error; // 상위 호출 스택으로 오류 전달
    }
      }

    const [result] = await conn.query(query, values);
    return result.insertId;  // 새로 추가된 테이스팅 노트의 id 반환
  } catch (err) {
    console.error("데이터베이스에 테이스팅 노트 추가 중 오류 발생:", err.message);
    throw new Error("데이터베이스 오류 발생");
  } finally {
    conn.release();
  }
};

  
  //TastingNote 데이터 불러오기
  export const getTastingNote = async (tastingNoteId, type) => {
    const conn = await pool.getConnection();
    const tableName = type === "cocktail" ? "CocktailTastingNotes" : "AlcoholTastingNotes";
  
    try {
      const [result] = await conn.query(
        `SELECT * FROM ${tableName} WHERE id = ?;`,
        [tastingNoteId]
      );
  
      if (result.length === 0) {
        throw new Error("해당 테이스팅 노트를 찾을 수 없습니다.");
      }
  
      return result[0];
    } catch (err) {
      console.error("테이스팅 노트 조회 중 오류 발생:", err.message);
      throw new Error(`테이스팅 노트 조회 실패: ${err.message}`);
    } finally {
      conn.release();
    }
  };
  
// 테이스팅 노트 ID로 해당 노트 정보 조회
export const findTastingNoteById = async (noteId, type) => {
    if (type === "cocktail"){
        return await prisma.cocktailTastingNotes.findUnique({
            where: { id: noteId },
          });
    } else {
        return await prisma.alcoholTastingNotes.findUnique({
            where: { id: noteId },
          });
    }
  };

  // 테이스팅 노트 수정
export const modifyTastingNote = async (noteId, updatedData, type) => {
    if (type === "cocktail") {
      return await prisma.cocktailTastingNotes.update({
        where: { id: noteId },
        data: updatedData,
      });
    } else {
      return await prisma.alcoholTastingNotes.update({
        where: { id: noteId },
        data: updatedData,
      });
    }
  };

  // 테이스팅 노트 삭제
export const removeTastingNote = async (noteId, type) => {
    if (type === "cocktail") {
      return await prisma.cocktailTastingNotes.delete({
        where: { id: noteId },
      });
    } else {
      return await prisma.alcoholTastingNotes.delete({
        where: { id: noteId },
      });
    }
  };