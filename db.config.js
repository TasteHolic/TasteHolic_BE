import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({ log: ["query"] });

import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// DB 연결 테스트
(async () => {
    try {
      const connection = await pool.getConnection();
      console.log("✅ MySQL 데이터베이스 연결 성공!");
      connection.release();
    } catch (error) {
      console.error("❌ MySQL 연결 실패:", error.message);
    }
  })();
