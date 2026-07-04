import  { Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { configs } from "../config/configs.js";
import { CustomRequest } from "../types/controllers.types.js";
import { Admin } from "../entities/Admin.js";
import { adminRepository } from "../models/index.js";
import { AdminRole } from "../utils/enum.js";

const adminAuth = async (req: CustomRequest<{ admin: Admin }>, res: Response, next: () => void) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Auth failed' })
    }
    try {
        jwt.verify(token, configs.adminJwtSecret)
    } catch (error) {
        return res.status(401).json({ message: "jwt expired!" })
    }
    
    const decoded = jwt.decode(token, { json: true });
    if (decoded) {
        const type = decoded.type;
        if (type === "admin") {
            const admin = adminRepository().findOneBy({ id: decoded.id })
            if (!admin) {
                return res.status(401).json({ message: "Admin not found!" })
            }
            const role = decoded.role;
            if (role === AdminRole.SUPER_ADMIN) {
                req.payload = { admin: await admin } as { admin: Admin }
                next()
                return
            }
            req.payload = { admin: await admin } as { admin: Admin }
            next()
        } else {
            return res.status(403).json({ message: "Access denied!" })
        }
    }
    return res.status(403).json({ message: "Access denied!" })
}

export default adminAuth;