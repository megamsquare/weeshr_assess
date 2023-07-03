import { Request } from "express";

export interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

export interface AccessTokenCheck {
    header: string | undefined;
    checkExpire: boolean;
}

export interface UserRequest extends Request {
    user?: { userId: string; role: string[] };
}

export interface UpdateUser {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}

export interface UpdatePassword {
    userId: string;
    password: string;
}

export interface ForgottenPassword {
    email: string;
    oldPassword: string;
    newPassword: string;
}
