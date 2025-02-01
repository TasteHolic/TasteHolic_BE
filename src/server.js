import express from "express";
import fs from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes/index.js"; // 통합된 API 라우트 가져오기

const app = express();
const port = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// 커스텀 응답 미들웨어
app.use((req, res, next) => {
  res.success = function (data) {
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

// 기본 라우트
app.get("/", (req, res) => {
  res.send("TasteHolic Server");
});

// Swagger 설정
const swaggerDocument = yaml.load(fs.readFileSync("./swagger.yaml", "utf8"));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API 라우트 적용
app.use("/api/v1", apiRoutes);

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error("Caught error:", err);

  if (res.headersSent) {
    return next(err);
  }

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

// 서버 실행
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
