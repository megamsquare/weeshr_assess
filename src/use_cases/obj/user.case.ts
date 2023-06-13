export interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

export interface NewRole {
    userId: string;
    role: string;
}

export interface IsRefresh {
    check: boolean;
    refreshToken: string;
    roles: string[] | undefined
}