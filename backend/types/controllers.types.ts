import { Request } from "express"

interface CustomRequest<T extends any> extends Request {payload?: T}

export {
    CustomRequest
}