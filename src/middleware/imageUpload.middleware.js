import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'

// S3 설정
const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
  },
})


export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'tasteholic-bucket', // 버킷 이름
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // 원본 파일명 포함
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB 파일 크기 제한
});