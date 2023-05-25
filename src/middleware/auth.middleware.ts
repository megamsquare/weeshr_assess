import { Request, Response, NextFunction } from "express";
import status_code from "http-status"
import Err from "../use_cases/error_handler";

function verify_token(req: Request, res: Response, next: NextFunction) {
    let token;
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer')) {
        res.status(status_code.UNAUTHORIZED).json({ message: Err.Unauthentication });
        return;
    }
}

function verify_permission(roles: string[]) {}