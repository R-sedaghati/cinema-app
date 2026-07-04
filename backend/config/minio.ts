import { Client } from "minio";
import { configs } from "./configs.js";

export const minioClient = new Client({
  endPoint: configs.minioEndpoint || "localhost",
  port: Number(configs.minioPort) || 9000,
  useSSL: configs.minioUseSSL === true,
  accessKey: configs.minioAccessKey || "minioadmin",
  secretKey: configs.minioSecretKey || "minioadmin",
});
