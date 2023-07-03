export interface IsRefresh {
    check: boolean;
    refreshToken: string;
    roles: string[] | undefined;
}

export interface LoginInfo {
    usernameOrEmail: string;
    password: string;
}