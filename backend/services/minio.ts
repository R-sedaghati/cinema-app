import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

import { s3Client } from "../config/s3.js";
import { configs } from "../config/configs.js";

export class MinioService {
  static BUCKET = configs.minioBucketName;

  static async uploadByPath(
    path: string,
    buffer: Buffer,
    mimeType?: string,
  ) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: this.BUCKET,
        Key: path,
        Body: buffer,
        ContentType:
          mimeType || "application/octet-stream",
      }),
    );
  }

  static async getFileStreamByPath(
    path: string,
  ): Promise<Readable> {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: this.BUCKET,
        Key: path,
      }),
    );

    return response.Body as Readable;
  }

  static async getPresignedLinkByPath(
    path: string,
    expiresInSeconds = 3600,
  ): Promise<string | null> {
    try {
      return await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: this.BUCKET,
          Key: path,
        }),
        {
          expiresIn: expiresInSeconds,
        },
      );
    } catch {
      return null;
    }
  }

  static async deleteByPath(path: string) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.BUCKET,
        Key: path,
      }),
    );
  }

  static async getPresignedLinks(
    paths: string[],
    expiresInSeconds = 3600,
  ): Promise<Record<string, string>> {
    const result: Record<string, string> = {};

    const originalPrefix =
      `${configs.minioEndpoint}/${this.BUCKET}`;

    const customPrefix =
      `${configs.minioCustomDomain}`;

    await Promise.all(
      paths.map(async (path) => {
        try {
          let url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: this.BUCKET,
              Key: path,
            }),
            {
              expiresIn: expiresInSeconds,
            },
          );

          url = url.replace(
            originalPrefix,
            customPrefix,
          );

          result[path] = url;
        } catch (err) {
          console.error(err);
          result[path] = null as any;
        }
      }),
    );

    return result;
  };

  static async getPublicUrls(
    paths: string[],
  ): Promise<Record<string, string>> {
    const result: Record<string, string> = {};

    const baseUrl = `${configs.minioCustomDomain}`;

    paths.forEach(path => {
      result[path] = `${baseUrl}/${path}`;
    });

    return result;
  }
}