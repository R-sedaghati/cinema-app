import { Request, Response } from "express"
import { aboutUsRepository } from "../../models/index.js"
import { apiResponse } from "../../utils/customResponse.js"

export const aboutUsController = async (req: Request, res: Response) => {
    const data = await aboutUsRepository().find()
    return apiResponse(res, {
        data
    })
}