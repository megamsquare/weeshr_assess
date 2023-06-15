import { Request, Response } from "express";
import status_code from "http-status";
import Model from "../models";
import Err from "../use_cases/error_handler";
import DB from "../db";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { NewRole, NewUser, IsRefresh, LoginInfo, GetUserToken } from "../use_cases/obj/user.case";
import UserService from "../services/user.service";
import RoleService from "../services/role.service";
import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";

async function signUp(req: Request, res: Response) {
       try {
        let userInfo: NewUser;
        let roleInfo: NewRole
        userInfo = req.body;

        const user = await UserService.createUser(userInfo)
        if (user instanceof Error) {
            res.status(status_code.BAD_REQUEST).json({ message: user.message});
            return;
        }

        if ('_id' in user) {
            const { _id } = user;

            roleInfo = {
                userId: _id,
                role: "user"
            }
            const role = await RoleService.createRole(roleInfo);
            if (role instanceof Error) {
                console.error(role.message);
            }

            res.status(status_code.CREATED).json({ data: { message: 'User created successfully' }})
            return;
        }

       } catch (error) {
        res.status(status_code.BAD_REQUEST).json({ message: error })
       }
}

async function signIn(req:Request, res: Response) {
    const userInfo: LoginInfo = req.body;
    const isRefresh: IsRefresh = {
        check: false,
        refreshToken: "",
        roles: []
    }
    let existingToken;
    const tokens = Model.Tokens;

    try {
        const user_model = Model.User;
        
        // const user = await user_model.findOne({
        //     $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        // });

        // if (!user) {
        //     res.status(status_code.BAD_REQUEST).json({ mesaage: Err.InvalidUsernameOrEmail });
        //     return;
        // }

        // const is_password = await user.compare_password(password);
        // if (!is_password) {
        //     res.status(status_code.BAD_REQUEST).json({ mesaage: Err.IncorrectPassword });
        //     return
        // }
        const user = await AuthService.loginUserCheck(userInfo);
        if (user instanceof Error) {
            res.status(status_code.BAD_REQUEST).json({ message: user.message});
        }

        if (user !== undefined && '_id' in user) {
            const getRoles = await RoleService.getRoleByUserId(user._id);
            const roles = getRoles?.map((role) => role.role);
            isRefresh.roles = roles

            const getUserToken: GetUserToken = {
                userId: user._id,
                username: user.username
            }

            existingToken = await TokenService.getUserToken(getUserToken);
            if ('_id' in existingToken) {
                
            }
        }

        // const refresh_cache = await DB.caching.redis_client.v4.GET(user.username);

        // if (refresh_cache) {
        //     existingToken = JSON.parse(refresh_cache);
        // } else {
        //     existingToken = await tokens.findOne({ userId: user._id });
        //     isCache = false;
        // }

        // if (existingToken) {
        //     if (!isCache) {
        //         await DB.caching.redis_client.setEx(user.username, 60*60*24, JSON.stringify(existingToken));
        //     }

        //     if (!existingToken.isValid) {
        //         res.status(status_code.BAD_REQUEST).json({ mesaage: Err.InvalidToken });
        //         return;
        //     }

        //     isRefresh.check = true;
        //     isRefresh.refreshToken = existingToken.refreshToken;
        //     const access_token = await user.create_jwt(isRefresh);
        //     res.status(status_code.OK).json({
        //         data: { firstName: user.firstName, lastName: user.lastName },
        //         access_token
        //     })
        //     return;
        // }

        let refreshToken = crypto.randomBytes(40).toString('hex');
        const userToken = {userId: user._id, refreshToken}

        const savedToken = await tokens.create({...userToken});

        if (savedToken) {
            await DB.caching.redis_client.setEx(user.username, 60*60*24, JSON.stringify(savedToken));
        }

        isRefresh.check = true;
        isRefresh.refreshToken = refreshToken;
        const access_token = await user.create_jwt(isRefresh);
        res.status(status_code.OK).json({
            data: { firstName: user.firstName, lastName: user.lastName },
            access_token
        })

    } catch (error) {
        res.status(status_code.BAD_REQUEST).json({ message: error });
        return;
    }
}

async function refreshToken(req:Request, res: Response) {
    const header = req.headers.authorization;
    let userRefresh;
    if (!header || !header.startsWith('Bearer')) {
        res.status(status_code.BAD_REQUEST).json({ message: Err.Unauthentication });
        return;
    }

    let userToken = header.split(' ')[1];

    const refreshKey = process.env.JWT_SECRET_KEY || '';

    try {
        const isRefresh = {
            check: true,
            refreshToken: ""
        };
        let isCached = true;
        // const payload = jwt.verify(userToken, refreshKey, {clockTimestamp: new Date().getTime()}) as jwt.JwtPayload;
        const payload = jwt.verify(userToken, refreshKey) as jwt.JwtPayload;
        const user = await Model.User.findOne({_id: payload.userId});
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
                await DB.caching.redis_client.setEx(user.username, 60*60*24, JSON.stringify(userRefresh));
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
        res.status(status_code.BAD_REQUEST).json({ message: error });
        return;
    }
}

async function forgot_password(req:Request, res: Response) {
    
}

const Auth_controller = {
    signUp,
    signIn,
    refreshToken,
    forgot_password,
};

export default Auth_controller;