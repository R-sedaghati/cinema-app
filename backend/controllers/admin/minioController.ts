import { Response } from "express";
import { MinioService } from "../../services/minio.js";
import { CustomRequest } from "../../types/controllers.types.js";
import { Admin } from "../../entities/Admin.js";
import { randomUUID } from "crypto";

export class AdminMinioController {
  static async uploadImage(req: CustomRequest<{ admin: Admin }>, res: Response) {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const ext = file.originalname.split(".").pop();
    const filename = `${randomUUID()}.${ext}`;
    const path = `banners/${filename}`;

    await MinioService.uploadByPath(
      path,
      file.buffer,
      file.mimetype,
    );

    return res.json({
      path,
    });
  }
}
