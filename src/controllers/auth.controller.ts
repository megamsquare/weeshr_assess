import { Request, Response } from "express";
import status_code from "http-status";
import Model from "../models";
import Err from "../use_cases/error_handler";
import DB from "../db";
import crypto from "crypto";
import jwt from 'jsonwebtoken';

async function sign_up(req: Request, res: Response) {
       try {

        const user_model = Model.User;
        const role_model = Model.Roles;
        
        const email_exist = await user_model.exists({ email: req.body.email })
        if (email_exist) {
            res.status(status_code.BAD_REQUEST).json({ message: 'Email is already taken' })
            return
        }

        const username_exist = await user_model.exists({ username: req.body.username })
        if (username_exist) {
            res.status(status_code.BAD_REQUEST).json({ message: 'Username is already taken' })
            return
        }
    
        const user = await user_model.create({ ...req.body })

        const save_role = {
            userId: user._id,
            role: "user"
        }

        const role = await role_model.create({ ...save_role })

        res.status(status_code.CREATED).json({ data: { message: 'User created successfully' }})

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

    if (!usernameOrEmail || password) {
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

        const access_token = await user.create_jwt(isRefresh);

        const refresh_cache = await DB.caching.redis_client.get(user.username);

        if (refresh_cache) {
            existingToken = JSON.parse(refresh_cache);
        } else {
            existingToken = await tokens.findOne({ userId: user._id });
            isCache = false;
        }

        if (existingToken) {
            if (!isCache) {
                await DB.caching.redis_client.set(user.username, JSON.stringify(existingToken), {
                    EX: 60 * 60 * 24,
                    NX: true
                });
            }

            if (!existingToken.isValid) {
                res.status(status_code.BAD_REQUEST).json({ mesaage: Err.InvalidToken });
                return;
            }

            isRefresh.check = true;
            isRefresh.refreshToken = existingToken.refreshToken;
            const refreshJWT = await user.create_jwt(isRefresh);
            res.status(status_code.OK).json({
                access_token,
                refresh_token: refreshJWT,
                data: { firstName: user.firstName, lastName: user.lastName }
            })
            return;
        }

        let refreshToken = crypto.randomBytes(40).toString('hex');
        const userToken = {userId: user._id, refreshToken}

        const savedToken = await tokens.create({...userToken});

        if (savedToken) {
            await DB.caching.redis_client.set(user.username, JSON.stringify(savedToken), {
                EX: 60 * 60 * 24,
                NX: true
            });
        }

        isRefresh.check = true;
        isRefresh.refreshToken = refreshToken;

        const refreshJWT = await user.create_jwt(isRefresh);
        res.status(status_code.OK).json({
            access_token,
            refresh_token: refreshJWT,
            data: { firstName: user.firstName, lastName: user.lastName }
        })

    } catch (error) {
        
    }
}

async function refresh_token(req:Request, res: Response) {
    const { refreshToken } = req.body;
    let userRefresh;
    if (!refreshToken) {
        res.status(status_code.BAD_REQUEST).json({ message: Err.RefreshTokenExists });
        return;
    }

    try {
        const isRefresh = {};
        const payload = jwt.v
    } catch (error) {
        
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