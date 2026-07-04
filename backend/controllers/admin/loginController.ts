import { AdminRole } from "../../utils/enum.js";
import { adminRepository, permissionRepository, rolePermissionRepository } from "../../models/index.js";
import  { Response, Request } from "express";
import { apiResponse } from "../../utils/customResponse.js";
import { createToken } from "../../utils/jwt.js";
import { configs } from "../../config/configs.js";


export const adminLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const admin = await adminRepository().findOneBy({ username: username });
    if (!admin || !(await admin.checkPassword(password))) {
      return apiResponse(res, 
          {
              statusCode: 400,
              message: "username or password is incorrect!",
              success: false
          }
      );
    };
    let permissions = [];
    if (admin.role === AdminRole.SUPER_ADMIN) {
        permissions = (await permissionRepository().find()).map(p => ({ endpoint: p.endpoint, method: p.method }));
    }
    else {
        const rolePermissions = await rolePermissionRepository().findBy({ role: admin.role });
        permissions = rolePermissions.map(rp => ({ endpoint: rp.permission.endpoint, method: rp.permission.method }));
    }
    const accessToken = createToken(
        { 
            username: admin.username, 
            email: admin.email, 
            id: admin.id, 
            role: admin.role, 
            type: 'admin' 
        }, 
        configs.jwtExpireTime, "admin"
    )
    return apiResponse(res,
        {
            statusCode: 200,
            message: "Login successful",
            success: true,
            data: {
                type: "admin",
                username: admin.username,
                email: admin.email,
                id: admin.id,
                role: admin.role,
                permissions,
                accessToken
            }
        }
    )
};