import express from "express";
import fs from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { handleSearch } from "./controllers/search.controller.js";

dotenv.config();

const app = express();
const port = 3000

app.use(express.json());

app.get("/", (req, res) => {
    res.send("TasteHolic Server");
});

// 검색 API 추가
app.post("/api/v1/users/search", handleSearch);

// Swagger
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
});
