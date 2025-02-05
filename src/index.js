import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import cors from "cors";

import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  deleteUser, 
  socialLogin 
} from "./controllers/user.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // CORS 설정
app.use(express.json());

// 기본 라우팅
app.get("/", (req, res) => {
  res.send("TasteHolic Server");
});

app.post("/api/register", registerUser);
app.post("/api/login", loginUser);
app.post("/api/logout", logoutUser);
app.delete("/api/user", deleteUser);
app.post("/api/social-login", socialLogin);

// 경로 설정 관련 수정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger 설정
try {
  const swaggerPath = path.resolve(__dirname, "../swagger.yaml");
  if (!fs.existsSync(swaggerPath)) {
    throw new Error(`Swagger 파일이 존재하지 않습니다: ${swaggerPath}`);
  }
  const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8"));
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger 설정 완료: /swagger 에서 확인 가능");
} catch (error) {
  console.error("Swagger 설정 중 오류 발생:", error.message);
}

// 서버 실행
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
