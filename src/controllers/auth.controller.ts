import { Request, Response } from "express";
import status_code from "http-status";
import Model from "../models";
import Err from "../use_cases/error_handler";
import DB from "../db";
import crypto, { Sign } from "crypto";
import jwt from 'jsonwebtoken';
import { SignUp } from "../use_cases/obj/user.case";
import UserService from "../services/user.service";

async function sign_up(req: Request, res: Response) {
       try {
        let userInfo: SignUp;
        userInfo = req.body;
        // const user_model = Model.User;
        const role_model = Model.Roles;
        
        // const email_exist = await user_model.exists({ email: req.body.email })
        // if (email_exist) {
        //     res.status(status_code.BAD_REQUEST).json({ message: 'Email is already taken' })
        //     return
        // }

        // const username_exist = await user_model.exists({ username: req.body.username })
        // if (username_exist) {
        //     res.status(status_code.BAD_REQUEST).json({ message: 'Username is already taken' })
        //     return
        // }
    
        // const user = await user_model.create({ ...req.body })

        const user = await UserService.createUser(userInfo)
        console.log("User error", user)
        if (user instanceof Error) {
            res.status(status_code.BAD_REQUEST).json({ user });
        }

        // const save_role = {
        //     userId: user._id,
        //     role: "user"
        // }

        // const role = await role_model.create({ ...save_role })

        // res.status(status_code.CREATED).json({ data: { message: 'User created successfully' }})

       } catch (error) {
        res.status(status_code.BAD_REQUEST).json({ message: error })
       }
}

async function sign_in(req:Request, res: Response) {
    const { usernameOrEmail, password } = req.body;
    const isRefresh = {
        check: false,
        refreshToken: ""
    }
    let existingToken;
    const tokens = Model.Tokens;
    let isCache = true;

    if (!usernameOrEmail || !password) {
        res.status(status_code.BAD_REQUEST).json({ message: Err.ProvideLoginDetails });
        return;
    }

    try {
        const user_model = Model.User;
        
        const user = await user_model.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        });

        if (!user) {
            res.status(status_code.BAD_REQUEST).json({ mesaage: Err.InvalidUsernameOrEmail });
            return;
        }

        const is_password = await user.compare_password(password);
        if (!is_password) {
            res.status(status_code.BAD_REQUEST).json({ mesaage: Err.IncorrectPassword });
            return
        }

        const refresh_cache = await DB.caching.redis_client.v4.GET(user.username);

        if (refresh_cache) {
            existingToken = JSON.parse(refresh_cache);
        } else {
            existingToken = await tokens.findOne({ userId: user._id });
            isCache = false;
        }

        if (existingToken) {
            if (!isCache) {
                await DB.caching.redis_client.setEx(user.username, 60*60*24, JSON.stringify(existingToken));
            }

            if (!existingToken.isValid) {
                res.status(status_code.BAD_REQUEST).json({ mesaage: Err.InvalidToken });
                return;
            }

            isRefresh.check = true;
            isRefresh.refreshToken = existingToken.refreshToken;
            const access_token = await user.create_jwt(isRefresh);
            res.status(status_code.OK).json({
                data: { firstName: user.firstName, lastName: user.lastName },
                access_token
            })
            return;
        }

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

async function refresh_token(req:Request, res: Response) {
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
    sign_up,
    sign_in,
    refresh_token,
    forgot_password,
};

export default Auth_controller;