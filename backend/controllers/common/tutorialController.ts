import { Request, Response } from "express";
import { tutorialRepository } from "../../models/index.js";
import { apiResponse } from "../../utils/customResponse.js";
import { MinioService } from "../../services/minio.js";

export const tutorialListCommonController = async (req: Request, res: Response) => {
    const tutorials = await tutorialRepository().find({
        where: { isActive: true },
        order: { priority: "ASC", id: "ASC" },
    });

    const thumbnailPaths = tutorials.map((t) => t.thumbnail).filter((path): path is string => Boolean(path));
    const urlMap = await MinioService.getPublicUrls(thumbnailPaths);

    const data = tutorials.map((tutorial) => ({
        ...tutorial,
        thumbnail: tutorial.thumbnail ? urlMap[tutorial.thumbnail] ?? null : null,
    }));

    return apiResponse(res, {
        data
    })
}
