import { Request, Response } from "express";
import { tutorialRepository } from "../../models/index.js";
import { apiResponse } from "../../utils/customResponse.js";
import { SearchAndFilterService } from "../../services/searchAndFilter.js";
import { Tutorial } from "../../entities/Tutorial.js";
import { MinioService } from "../../services/minio.js";

const serializeTutorial = async (tutorial: Tutorial) => ({
    ...tutorial,
    thumbnail: await tutorial.getThumbnailUrl(),
});

export const tutorialListController = async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.count) || 10));

    const query = tutorialRepository()
        .createQueryBuilder("tutorial")
        .orderBy("tutorial.priority", "ASC")
        .addOrderBy("tutorial.id", "ASC")
        .skip((page - 1) * limit)
        .take(limit);

    const queryBuilder = new SearchAndFilterService<Tutorial>(query, {
        filterable: {
            isActive: "tutorial.isActive",
        },
        searchable: ["tutorial.title"],
        sortable: {},
    });

    const [tutorials, total]: [Tutorial[], number] = await queryBuilder.apply(req.query).getManyAndCount();

    const thumbnailPaths = tutorials.map((t) => t.thumbnail).filter((path): path is string => Boolean(path));
    const urlMap = await MinioService.getPublicUrls(thumbnailPaths);
    const data = tutorials.map((tutorial) => ({
        ...tutorial,
        thumbnail: tutorial.thumbnail ? urlMap[tutorial.thumbnail] ?? null : null,
    }));

    return apiResponse(res, {
        data,
        pagination: { page, limit, total },
        req,
    });
};

export const tutorialRetrieveController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tutorial = await tutorialRepository().findOne({
        where: { id: Number(id) }
    })

    if (!tutorial) {
        return apiResponse(res, {
            message: 'no tutorial found!',
            statusCode: 400
        })
    }

    return apiResponse(res, {
        data: await serializeTutorial(tutorial)
    })
}

export const tutorialCreateController = async (req: Request, res: Response) => {
    const { title, content, videoUrl, thumbnail, priority, isActive, isMain } = req.body;

    if (!title || !content || !videoUrl) {
        return apiResponse(res, {
            message: 'title, content and videoUrl are required!',
            statusCode: 400,
        });
    }

    if (isMain) {
        await tutorialRepository().update({ isMain: true }, { isMain: false });
    }

    const tutorial = tutorialRepository().create({
        title,
        content,
        videoUrl,
        thumbnail: thumbnail ?? null,
        priority: priority ?? 0,
        isActive: isActive ?? true,
        isMain: isMain ?? false,
    });
    const saved = await tutorialRepository().save(tutorial);

    return apiResponse(res, {
        statusCode: 201,
        data: await serializeTutorial(saved),
    });
};

export const tutorialUpdateController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, videoUrl, thumbnail, priority, isActive, isMain } = req.body;

    const tutorial = await tutorialRepository().findOne({
        where: { id: Number(id) }
    })

    if (!tutorial) {
        return apiResponse(res, {
            message: 'no tutorial found!',
            statusCode: 400
        })
    }

    if (title !== undefined) tutorial.title = title;
    if (content !== undefined) tutorial.content = content;
    if (videoUrl !== undefined) tutorial.videoUrl = videoUrl;
    if (thumbnail !== undefined) tutorial.thumbnail = thumbnail;
    if (priority !== undefined) tutorial.priority = priority;
    if (isActive !== undefined) tutorial.isActive = isActive;

    if (isMain !== undefined) {
        if (isMain) {
            await tutorialRepository().update({ isMain: true }, { isMain: false });
        }
        tutorial.isMain = isMain;
    }

    const saved = await tutorialRepository().save(tutorial)

    return apiResponse(res, {
        data: await serializeTutorial(saved)
    })
}

export const tutorialDeleteController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tutorial = await tutorialRepository().findOne({
        where: { id: Number(id) }
    })

    if (!tutorial) {
        return apiResponse(res, {
            message: 'no tutorial found!',
            statusCode: 400
        })
    }

    await tutorialRepository().softRemove(tutorial);

    return apiResponse(res, {
        data: null
    })
}
