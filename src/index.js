import express from "express"; 
import fs from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import { handleMyBarPost, handleMyBarGet, handleMyBarDelete } from "./controllers/mybar.controller.js";

const app = express();
const port = 3000;

app.use(express.json());


app.use((req, res, next) => {
    res.success = function (data) {
        // BigInt를 처리하는 방법
        const serializedData = JSON.parse(JSON.stringify(data, (key, value) => 
            typeof value === 'bigint' ? value.toString() : value
        ));
        
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
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));

// Swagger UI 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post("/api/v1/users/my-bar/post", handleMyBarPost);
app.get("/api/v1/users/my-bar/view", handleMyBarGet);
app.delete("/api/v1/users/my-bar/delete/:barId", handleMyBarDelete);


// app.js
app.use((err, req, res, next) => {
    console.error("Caught error:", err);

    if (res.headersSent) {
        return next(err);  // 헤더가 이미 전송되었으면 다음 미들웨어로 넘김
    }

    // JSON 형식으로 에러 응답
    res.status(err.statusCode || 500).json({
        resultType: "FAIL",
        error: {
            errorCode: err.errorCode || "unknown",
            reason: err.reason || err.message || null,
            data: err.data || null
        },
        success: null
    });
});




app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
});

