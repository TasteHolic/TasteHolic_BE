import { pool } from "../db.config.js";

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
        query = `INSERT INTO ${tableName} (userId, cocktailId, name, tasteRating, aromaRating, abv, color, description, createdAt, updatedAt) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
        values = [
          1, // userId 하드코딩
          data.cocktailId, 
          data.name, 
          JSON.stringify(data.tasteRating), 
          JSON.stringify(data.aromaRating), 
          data.abv, 
          JSON.stringify(data.color), // color도 JSON으로 변경
          data.description
        ];
      }
      
      else {
        query = `INSERT INTO ${tableName} (userId, alcoholId, tasteRating, aromaRating, finishRating, abvRating, description, name, category, createdAt, updatedAt) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
        
        values = [
          data.userId,
          data.alcoholId,
          JSON.stringify(data.tasteRating),  
          JSON.stringify(data.aromaRating), 
          JSON.stringify(data.finishRating),
          JSON.stringify(data.abvRating),  
          data.description,
          data.name,
          type
        ];
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
  