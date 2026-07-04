import { Response } from "express";
import { MinioService } from "../../services/minio.js";
import { CustomRequest } from "../../types/controllers.types.js";
import { userRepository } from "../../models/index.js";
import { User } from "../../entities/User.js";
import { randomUUID } from "crypto";

export class UserMinioController {
  static async uploadAvatar(req: CustomRequest<{user : User}>, res: Response) {
    const userId = req.payload?.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const ext = file.originalname.split(".").pop();
    const path = `users/${userId}/avatar.${ext}`;

    await MinioService.uploadByPath(
      path,
      file.buffer,
      file.mimetype,
    );

    await userRepository().update(
      { id: userId },
      { avatar: path },
    );

    return res.json({
      path,
    });
  };
  static async uploadVideo(
    req: CustomRequest<{ user: User }>,
    res: Response,
  ) {
    const userId = req.payload?.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No video uploaded",
      });
    }

    if (!file.mimetype.startsWith("video/")) {
      return res.status(400).json({
        message: "Invalid file type",
      });
    }

    const ext = file.originalname.split(".").pop();
    const filename = `${randomUUID()}.${ext}`;

    const path = `users/${userId}/videos/${filename}`;

    await MinioService.uploadByPath(
      path,
      file.buffer,
      file.mimetype,
    );

    return res.status(201).json({
      path,
      filename,
    });
  };
  static async uploadImage(req: CustomRequest<{user : User}>, res: Response) {
    const userId = req.payload?.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const ext = file.originalname.split(".").pop();
    const filename = `${randomUUID()}.${ext}`
    const path = `users/${userId}/images/${filename}`;

    await MinioService.uploadByPath(
      path,
      file.buffer,
      file.mimetype,
    );

    return res.json({
      path,
      filename
    });
  };
}

