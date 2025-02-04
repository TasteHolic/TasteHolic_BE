import express from "express"; 
import fs from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import { handleSearchDrinks, handleUserTastingNote } from "./controllers/tasting-note.controller.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("TasteHolic Server");
});

app.get("/api/v1/users/tasting-note/search", handleSearchDrinks);
app.post("/api/v1/users/tasting-note", handleUserTastingNote);

// Swagger
// YAML 파일 로드
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));

// Swagger UI 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
});
