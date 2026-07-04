// config/s3.ts

import { S3Client } from "@aws-sdk/client-s3";
import { configs } from "./configs.js";

export const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: configs.minioEndpoint,
  credentials: {
    accessKeyId: configs.minioAccessKey!,
    secretAccessKey: configs.minioSecretKey!,
  },
  forcePathStyle: true,
});