import { pool } from "../../db.config.js";

export const searchAllTypeDrinks = async (query) => {
  const conn = await pool.getConnection();
  try {
    // 칵테일 테이블에서 검색 (name, nameEng, nameKor 모두 포함)
    const [officialRecipes] = await conn.query(
      `SELECT * FROM Cocktails
       WHERE nameEng LIKE ? OR nameKor LIKE ?`,
      [`%${query}%`, `%${query}%`] // LIKE 구문을 사용해서 %를 양쪽에 붙임
    );

    // 유저 레시피 테이블에서 검색
    const [userRecipes] = await conn.query(
      `SELECT * FROM UserRecipes WHERE name LIKE ?`,
      [`%${query}%`] // LIKE 구문을 사용해서 %를 양쪽에 붙임
    );

    return {
      officialRecipes,
      userRecipes,
    };
  } catch (error) {
    console.error("searchAllTypeDrinks 에러:", error.message);
    throw new Error("데이터 검색 중 오류가 발생했습니다.");
  } finally {
    conn.release(); // 연결 반환
  }
};
