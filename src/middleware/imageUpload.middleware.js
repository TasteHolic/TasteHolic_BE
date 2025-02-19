import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'

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
    bucket: 'tasteholic-bucket', 
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); 
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB 파일 크기 제한
});

export const deleteOldImage = async (imageUrl) => {
  try {
    // 버킷 이름과 파일 키를 추출
    const params = {
      Bucket: 'tasteholic-bucket', // S3 버킷 이름
      Key: imageUrl.split('.com/')[1], // 이미지 URL에서 키를 추출
    };

    // S3에서 파일 삭제
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log("Image successfully deleted from S3.");
  } catch (error) {
    console.error("Error deleting old image: ", error);
  }
};

