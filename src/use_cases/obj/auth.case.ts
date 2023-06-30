export interface IsRefresh {
    check: boolean;
    refreshToken: string;
    roles: string[] | undefined;
}