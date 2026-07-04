import { Request, Response } from "express";
import { aboutUsRepository } from "../../models/index.js";
import { apiResponse } from "../../utils/customResponse.js";

export const aboutUsAdminController = async (req: Request, res: Response) => {
    const data = await aboutUsRepository().find()
    return apiResponse(res, {
        data
    })
}

export const updateAboutUsAdminController = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {text} = req.body;

    const instance = await aboutUsRepository().findOne({
        where: {id: Number(id)}
    })

    if (!instance) {
        return apiResponse(res, {
            message: 'no about us instance found!',
            statusCode: 400
        })
    }

    if (text !== undefined) {
        instance.text = text;
    }

    const data = aboutUsRepository().save(instance)
    return apiResponse(res, {
        data
    })
}