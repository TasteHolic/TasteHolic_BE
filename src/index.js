import express from "express"; 
import fs from "fs";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("TasteHolic Server");
});



// Swagger
// YAML 파일 로드
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));

// Swagger UI 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
});
