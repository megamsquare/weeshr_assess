export interface IsRefresh {
    check: boolean;
    refreshToken: string;
    roles: string[] | undefined;
}

export interface LoginInfo {
    usernameOrEmail: string;
    password: string;
}

export interface AccessTokenCheck {
    header: string | undefined;
    checkExpire: boolean;
}

export interface ForgottenPassword {
    email: string;
    oldPassword: string;
    newPassword: string;
}