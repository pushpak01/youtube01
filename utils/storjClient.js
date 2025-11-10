// utils/storjClient.js
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  endpoint: process.env.STORJ_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY,
    secretAccessKey: process.env.STORJ_SECRET_KEY,
  },
  forcePathStyle: true,
});

export const STORJ_CONFIG = {
  bucket: process.env.STORJ_BUCKET,
  endpoint: process.env.STORJ_ENDPOINT,
};