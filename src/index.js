const app = require('./app');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const PORT = 8080;

// Swagger 설정 (예외 처리 추가)
let swaggerDocument;
try {
  swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('✅ Swagger 문서 로드 성공');
} catch (error) {
  console.error('❌ Swagger 문서를 찾을 수 없습니다:', error.message);
}

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중`);
});
