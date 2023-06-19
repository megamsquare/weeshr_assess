import { Request, Response } from "express";
import status_code from "http-status";
import Model from "../models";
import Err from "../use_cases/error_handler";
import DB from "../db";
import jwt from 'jsonwebtoken';
import {
    NewRole,
    NewUser,
    IsRefresh,
    LoginInfo,
    UserToken,
    AccessTokenCheck
} from "../use_cases/obj/user.case";
import Services from "../services";

async function signUp(req: Request, res: Response) {
    try {
        let userInfo: NewUser;
        let roleInfo: NewRole
        userInfo = req.body;

        const user = await Services.UserService.createUser(userInfo)
        if (user instanceof Error) {
            res.status(status_code.BAD_REQUEST).json({ message: user.message });
            return;
        }

        if ('_id' in user) {
            const { _id } = user;

            roleInfo = {
                userId: _id,
                role: "user"
            }
            const role = await Services.RoleService.createRole(roleInfo);
            if (role instanceof Error) {
                console.error(role.message);
            }

            res.status(status_code.CREATED).json({ data: { message: 'User created successfully' } })
            return;
        }

    } catch (error) {
        res.status(status_code.BAD_REQUEST).json({ message: error })
    }
}

async function signIn(req: Request, res: Response) {
    try {
        const userInfo: LoginInfo = req.body;
        const isRefresh: IsRefresh = {
            check: false,
            refreshToken: "",
            roles: []
        }
        const user = await Services.AuthService.loginUserCheck(userInfo);
        if (user instanceof Error) {
            res.status(status_code.BAD_REQUEST).json({ message: user.message });
        }

        if (user !== undefined && '_id' in user) {
            const roles = await Services.RoleService.getRoleByUserId(user._id);
            isRefresh.roles = roles

            const userToken: UserToken = {
                userId: user._id,
                username: user.username
            }

            const existingToken = await Services.TokenService.getUserToken(userToken);
            if (existingToken instanceof Error) {
                res.status(status_code.BAD_REQUEST).json({ message: existingToken.message, badR: "from get token" });
            }

            if (existingToken !== null && '_id' in existingToken) {
                isRefresh.check = true;
                isRefresh.refreshToken = existingToken.refreshToken;
                const accessToken = await user.create_jwt(isRefresh);
                res.status(status_code.OK).json({
                    data: { firstName: user.firstName, lastName: user.lastName },
                    accessToken
                });
                return;
            }

            const savedToken = await Services.TokenService.createToken(userToken);

            if (savedToken) {
                isRefresh.check = true;
                isRefresh.refreshToken = savedToken.refreshToken;
                const accessToken = await user.create_jwt(isRefresh);
                res.status(status_code.OK).json({
                    data: { firstName: user.firstName, lastName: user.lastName },
                    accessToken
                });
                return;
            }
        }

    } catch (error) {
        res.status(status_code.BAD_REQUEST).json({ message: error, badR: "from error catch" });
        return;
    }
}

async function refreshToken(req: Request, res: Response) {
    const header = req.headers.authorization;
    let userRefresh;
    if (!header || !header.startsWith('Bearer')) {
        res.status(status_code.BAD_REQUEST).json({ message: Err.Unauthentication });
        return;
    }

    let userToken = header.split(' ')[1];

    const refreshKey = process.env.JWT_SECRET_KEY || '';

    try {
        const accessInfo: AccessTokenCheck = {
            header: header,
            checkExpire: false
        }
        const payload = Services.AuthService.validateUserAccessToken(accessInfo)
        const isRefresh = {
            check: true,
            refreshToken: ""
        };
        let isCached = true;

        if (payload instanceof Error) {
            console.log(`payload error: ${payload}`)
            res.status(status_code.BAD_REQUEST).json({ mesaage: payload.message });
            return;
        }

        const user = await Model.User.findOne({ _id: payload.userId });
        if (!user) {
            res.status(status_code.BAD_REQUEST).json({ mesaage: Err.InvalidUsernameOrEmail });
            return;
        }
        const refreshCache = await DB.caching.redis_client.v4.GET(payload.username);
        if (refreshCache) {
            userRefresh = JSON.parse(refreshCache);
        } else {
            userRefresh = await Model.Tokens.findOne({ userId: payload.userId });
            isCached = false;
        }

        if (userRefresh) {
            if (!isCached) {
                await DB.caching.redis_client.setEx(user.username, 60 * 60 * 24, JSON.stringify(userRefresh));
            }

            if (!userRefresh.isValid || userRefresh.refreshToken !== payload.refresh) {
                res.status(status_code.BAD_REQUEST).json({ mesaage: Err.InvalidToken });
                return;
            }
        } else {
            res.status(status_code.BAD_REQUEST).json({ mesaage: Err.InvalidToken });
            return;
        }

        isRefresh.refreshToken = userRefresh.refreshToken;
        const access_token = await user.create_jwt(isRefresh);
        res.status(status_code.OK).json({
            data: { firstName: user.firstName, lastName: user.lastName },
            access_token
        })
    } catch (error) {
        console.log(`error: ${error}`)
        if (error instanceof Error) {
            res.status(status_code.BAD_REQUEST).json({ message: error.message });
            return;
        }
        res.status(status_code.BAD_REQUEST).json({ message: error});
        return;
    }
}

async function forgot_password(req: Request, res: Response) {

}

const Auth_controller = {
    signUp,
    signIn,
    refreshToken,
    forgot_password,
};

export default Auth_controller;