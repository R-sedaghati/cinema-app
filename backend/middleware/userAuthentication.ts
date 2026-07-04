import  { Response } from "express";
import jwt from 'jsonwebtoken';
import { userRepository } from "../models/index.js";
import { CustomRequest } from "../types/controllers.types.js";
import { configs } from "../config/configs.js";
import { apiResponse } from "../utils/customResponse.js";
import { User } from "../entities/User.js";

const userAuth = async (req: CustomRequest<{user : User}>, res: Response, next: () => void) => {
    const token = req.headers.authorization;
    if (!token) {
        return apiResponse(res, {
            statusCode: 401,
            message: "Authorization Failed!",
            success: false
        });
    }
    try {
        jwt.verify(token, configs.userJwtSecret)
    } catch (error) {
        return apiResponse(res, {
            statusCode: 401,
            message: "Authorization Failed!!",
            success: false
        })
    }
    
    const decoded = jwt.decode(token, { json: true });
    if (decoded) {
        const user = await userRepository().findOneBy({ id: decoded.id })
        if (!user) {
            return apiResponse(res, {
                statusCode: 401,
                message: "Authorization Failed!",
                success: false
            })
        }
        if (user) {
            req.payload = { user }
        }
    }
    next()
    
}

export default userAuth;