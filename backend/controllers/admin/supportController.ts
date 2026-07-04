import { Request, Response } from "express";
import { supportRepository } from "../../models/index.js";
import { paginate } from "../../utils/pagination.js";
import { apiResponse } from "../../utils/customResponse.js";

export const getSupportController = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        const { data, meta } = await paginate({
            repository: supportRepository(),
            req
        })
        return apiResponse(
            res, 
            {
                data,
                pagination: meta,
                req
            },
        )
    }
    const data = await supportRepository().findOne({
        where: { id: Number(id) }
    })
    return apiResponse(res, {
        data: data
    })
}

export const updateSupportConstoller = async (req: Request, res: Response) => {
    const { status } = req.body;
    const { id } = req.params;
    
    const support = await supportRepository().findOne({
        where: { id: Number(id) }
    })

    if (!support) {
        return apiResponse(res, {
            message: "support not found",
            statusCode: 404
        })
    }

    support.status = status
    const updatedSupport = await supportRepository().save(support)
    return apiResponse(res, {
        data: updatedSupport
    })
} 