import { Request, Response, NextFunction } from "express";
import status_code from "http-status";
import Err from "../use_cases/error_handler";
import jwt from "jsonwebtoken";
import AuthService from "../services/auth.service";
import { AccessTokenCheck } from "../use_cases/obj/user.case";

interface UserRequest extends Request {
    user?: { userId: string; role: string[] }
}

function verifyToken(req: UserRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    try {
        const accessInfo: AccessTokenCheck = {
            header: header,
            checkExpire: true
        }
        const payloadL = AuthService.validateUserAccessToken(accessInfo)
        if (payloadL instanceof Error) {
            res.status(status_code.UNAUTHORIZED).json({ message: payloadL.message });
            return;
        }

        if ('userId' in payloadL && 'role' in payloadL) {
            req.user = { userId: payloadL.userId as string, role: payloadL.role as string[] }
        }
        next();
    } catch (error) {
        res.status(status_code.UNAUTHORIZED).json({ message: Err.Unauthentication });
        return
    }
}

function verifyPermission(roles: string[] = []) {
    return (req: UserRequest, res: Response, next: NextFunction) => {
        const user_role = req.user?.role || [];
        const has_permission = roles.some(role => user_role.includes(role))
        if (!has_permission) {
            res.status(status_code.UNAUTHORIZED).json({ message: Err.UnauthorizedRoute });
            return;
        }
        next();
    };
}

const AuthMiddleware = {
    verifyToken,
    verifyPermission
}

export default AuthMiddleware;