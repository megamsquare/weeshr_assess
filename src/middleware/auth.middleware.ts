import { Response, NextFunction } from "express";
import status_code from "http-status";
import Err from "../use_cases/error_handler";
import AuthService from "../services/auth.service";
import { UserRequest } from "../use_cases/obj/user.case";
import { AccessTokenCheck } from "../use_cases/obj/auth.case";



function verifyToken(req: UserRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    try {
        const accessInfo: AccessTokenCheck = {
            header: header,
            checkExpire: true
        }
        const payload = AuthService.validateUserAccessToken(accessInfo)
        if (payload instanceof Error) {
            res.status(status_code.UNAUTHORIZED).json({ message: payload.message });
            return;
        }

        if ('userId' in payload && 'role' in payload) {
            req.user = { userId: payload.userId as string, role: payload.role as string[] }
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
    verifyPermission,
}

export default AuthMiddleware;