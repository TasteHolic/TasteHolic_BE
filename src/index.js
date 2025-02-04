import express from "express";
import fs from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import userController from "./controllers/user.controller.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// 기본 라우트
app.get("/", (req, res) => {
  res.send("TasteHolic Server");
});

// Swagger 설정
const swaggerDocument = yaml.load(fs.readFileSync("./swagger.yaml", "utf8"));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 사용자 관련 API 엔드포인트
app.post("/api/register", userController.registerUser);
app.post("/api/login", userController.loginUser);
app.post("/api/logout", userController.logoutUser);
app.delete("/api/deleteUser", userController.deleteUser);
app.post("/api/socialLogin", userController.socialLogin);

app.listen(port, "0.0.0.0", () => {
  console.log(`TasteHolic Server listening on port ${port}`);
});
