import express from "express";
import { pool } from "../db.config.js";
import cookieParser from "cookie-parser"; // 추가
import cors from "cors";
import fs from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
  handleDeleteUser,
  handleSocialLogin,
  handleVerifyPassword,
  handleCheckEmail,
} from "./controllers/user.controller.js";

import {
  handleMyBarPost,
  handleMyBarGet,
  handleMyBarDelete,
  handleMyBarSearch,
  handleGetAlcoholsByCategory,
} from "./controllers/mybar.controller.js";
import {
  createRecipe,
  getRecipeList,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  updateRecipeLike,
  updateCancelRecipeLike,
  getMyRecipes,
  getFavRecipes,
} from "./controllers/recipe.controller.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  socialLogin,
} from "./services/user.service.js";
import {
  handleUserTastingNote,
  handleSearchDrinks,
  handleUpdateTastingNote,
  handleDeleteTastingNote,
  handleGetTastingNote,
  handleGetAllTastingNotes,
} from "./controllers/tastingnote.controller.js";
import { handleSearch } from "./controllers/search.controller.js";
import {
  authenticateToken,
  optionalAuthenticateToken,
} from "./middleware/auth.middleware.js";
import { handleGetBestTaste } from "./controllers/besttaste.controller.js";
import { handleGetRandomCocktails } from "./controllers/random.controller.js";
import {
  handleProfileChange,
  handleUserInfo,
} from "./controllers/profile.controller.js";
import { upload } from "./middleware/imageUpload.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, "public/uploads");
console.log("🚀 정적 파일 실제 제공 경로:", uploadsPath);

// BigInt 변환 설정
BigInt.prototype.toJSON = function () {
  return Number(this);
};

const app = express();
const port = 3000;

// Load environment variables
dotenv.config();

app.use(cors()); // CORS 설정
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(uploadsPath));

app.use((req, res, next) => {
  res.success = function (data) {
    // BigInt를 처리하는 방법
    const serializedData = JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    this.status(this.statusCode || 200).json({
      resultType: "SUCCESS",
      error: null,
      success: serializedData,
    });
    return this;
  };

  res.error = function ({ errorCode = "unknown", reason = null, data = null }) {
    this.status(this.statusCode || 500).json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
    return this;
  };

  next();
});

app.get("/", (req, res) => {
  res.send("TasteHolic Server");
});

// Swagger
// YAML 파일 로드
const swaggerDocument = yaml.load(fs.readFileSync("./swagger.yaml", "utf8"));

// Swagger UI 설정
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API
app.get("/api/v1/users/my-bar/search", authenticateToken, handleMyBarSearch);
app.post("/api/v1/users/my-bar/post", authenticateToken, handleMyBarPost);
app.get("/api/v1/users/my-bar/view", authenticateToken, handleMyBarGet);
app.delete(
  "/api/v1/users/my-bar/delete/:barId",
  authenticateToken,
  handleMyBarDelete
);
app.post(
  "/api/v1/users/my-bar/show-alcohols",
  authenticateToken,
  handleGetAlcoholsByCategory
);

app.post("/api/v1/recipes", authenticateToken, createRecipe);
app.get("/api/v1/recipes", optionalAuthenticateToken, getRecipeList);
app.patch("/api/v1/recipes/:recipeId", authenticateToken, updateRecipe);
app.delete("/api/v1/recipes/:recipeId", authenticateToken, deleteRecipe);
app.get("/api/v1/recipes/:recipeId", getRecipe);
app.patch(
  "/api/v1/recipes/:recipeId/like",
  authenticateToken,
  updateRecipeLike
);
app.patch(
  "/api/v1/recipes/:recipeId/like/cancel",
  authenticateToken,
  updateCancelRecipeLike
);
app.get("/api/v1/users/recipes", authenticateToken, getMyRecipes);
app.get("/api/v1/users/recipes/fav", authenticateToken, getFavRecipes);

app.get("/api/v1/users/tasting-note/search", handleSearchDrinks);
app.post(
  "/api/v1/users/tasting-note",
  authenticateToken,
  handleUserTastingNote
);
app.patch(
  "/api/v1/users/tasting-note/:noteId",
  authenticateToken,
  handleUpdateTastingNote
);
app.delete(
  "/api/v1/users/tasting-note/:noteId",
  authenticateToken,
  handleDeleteTastingNote
);
app.get(
  "/api/v1/users/tasting-note/:noteId",
  authenticateToken,
  handleGetTastingNote
);
app.get(
  "/api/v1/users/tasting-notes",
  authenticateToken,
  handleGetAllTastingNotes
);

app.post("/api/v1/users/register", handleRegisterUser);
app.post("/api/v1/users/login", handleLoginUser);
app.post("/api/v1/users/logout", authenticateToken, handleLogoutUser);
app.delete("/api/v1/users/delete-user", authenticateToken, handleDeleteUser);

app.get("/api/v1/users/info", authenticateToken, handleUserInfo);
app.patch(
  "/api/v1/users/profile/change",
  authenticateToken,
  upload.single("image"),
  handleProfileChange
);

app.post(
  "/api/v1/users/verify-password",
  authenticateToken,
  handleVerifyPassword
);
app.post("/api/v1/users/check-email", handleCheckEmail);

app.post("/api/v1/users/search/category", handleSearch);

app.get("/api/v1/home/best", handleGetBestTaste);
app.get("/api/v1/home/pick", handleGetRandomCocktails);

// 카카오 설정
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const REDIRECT_URI = "http://54.180.45.230:3000/api/auth/kakao/callback";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // JWT 비밀 키

// 🔹 1️⃣ 프론트엔드에서 카카오 로그인 요청 → 카카오 로그인 페이지로 리디렉트 (GET ✅)
app.get("/api/auth/kakao/login", (req, res) => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  res.redirect(kakaoAuthUrl);
});

// 🔹 2️⃣ 카카오에서 Authorization Code 수신 → Access Token 요청 & JWT 발급 (POST ✅)
app.post("/api/auth/kakao/callback", async (req, res) => {
  const { code } = req.body; // GET → POST 변경했으므로 body에서 code를 받아야 함
  if (!code)
    return res.status(400).json({ error: "Authorization code is missing" });

  try {
    // Authorization Code → Access Token 변환
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenResponse.data;

    // Access Token으로 사용자 정보 요청
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const kakaoUser = userResponse.data;

    // JWT 발급 (7일 동안 유효)
    const token = jwt.sign(
      { id: kakaoUser.id, email: kakaoUser.kakao_account?.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 프론트엔드 리디렉트 + JWT 전달
    res.redirect(`http://54.180.45.230:3000/oauth/kakao?token=${token}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 3️⃣ 카카오 사용자 정보 요청 (GET ✅)
app.get("/api/auth/kakao/user", async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: "JWT token required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ id: decoded.id, email: decoded.email });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// 🔹 4️⃣ 로그아웃 (POST ✅)
app.post("/api/auth/kakao/logout", async (req, res) => {
  const { accessToken } = req.body; // GET → POST 변경했으므로 body에서 accessToken을 받아야 함
  if (!accessToken) return res.status(401).json({ error: "Access Token required" });

  try {
    await axios.post(
      "https://kapi.kakao.com/v1/user/logout",
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json({ message: "로그아웃 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// app.js
app.use((err, req, res, next) => {
  console.error("Caught error:", err);

  if (res.headersSent) {
    return next(err); // 헤더가 이미 전송되었으면 다음 미들웨어로 넘김
  }

  // JSON 형식으로 에러 응답
  res.status(err.statusCode || 500).json({
    resultType: "FAIL",
    error: {
      errorCode: err.errorCode || "unknown",
      reason: err.reason || err.message || null,
      data: err.data || null,
    },
    success: null,
  });
});

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

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
