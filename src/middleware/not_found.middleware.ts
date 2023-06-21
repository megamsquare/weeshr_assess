import { Request, Response } from "express";
import status_code from 'http-status';

function NotFoundMiddleware(req: Request, res: Response) {
    res.status(status_code.NOT_FOUND).json({message: 'route does not exist'});
    return;
}

export default NotFoundMiddleware;