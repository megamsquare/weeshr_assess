import { Request } from "express";

export interface NewUser {
    username: string;
    password: string;
}

export interface UserRequest extends Request {
    user?: { userId: string; role: string[] };
}
