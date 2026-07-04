import { faqRepository } from "../../models/index.js"
import { apiResponse } from "../../utils/customResponse.js"
import { paginate } from "../../utils/pagination.js"
import {Request, Response} from 'express'

export const faqListCommonController = async (req: Request, res: Response) => {
    const {data, meta} = await paginate({
        repository: faqRepository(),
        req
    })

    return apiResponse(res, {
        data,
        pagination: {...meta}
    })
}