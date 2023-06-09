import { Request, Response, NextFunction } from "express";
import status_code from "http-status";
import Err from "../use_cases/error_handler";
import jwt from "jsonwebtoken";

interface UserRequest extends Request {
    user?: { userId: string; role: string[] }
}

function verify_token(req: UserRequest, res: Response, next: NextFunction) {
    let token;
    const jwt_key = process.env.JWT_SECRET_KEY || ''
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer')) {
        res.status(status_code.UNAUTHORIZED).json({ message: Err.Unauthentication });
        return;
    }

    token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, jwt_key, {clockTimestamp: new Date().getTime()}) as jwt.JwtPayload;

        req.user = { userId: payload.userId, role: payload.role }
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(status_code.UNAUTHORIZED).json({ message: error.message });
            return;
        }
        res.status(status_code.UNAUTHORIZED).json({ message: Err.Unauthentication });
        return
    }
}

function verify_permission(roles: string[] = []) {
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