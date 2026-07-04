import jwt from "jsonwebtoken";
import { configs } from "../config/configs.js";

export function createToken(payload: object, expiresIn: number, role: string = "user") {
    const secret: string = role === "admin"
        ? configs.adminJwtSecret
        : configs.userJwtSecret;

    const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: expiresIn })
    return token;
}
