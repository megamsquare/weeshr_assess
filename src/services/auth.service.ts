import Model from "../models";
import DB from "../db";
import Err from "../use_cases/error_handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AccessTokenCheck, LoginInfo } from "../use_cases/obj/user.case";
import UserService from "./user.service";

async function loginUserCheck(loginInfo: LoginInfo) {
    try {
        const userModel = Model.User;

        if (!loginInfo.usernameOrEmail || !loginInfo.password) {
            throw new Error(Err.ProvideLoginDetails);
        }

        const user = await userModel.findOne({
            $or: [{ username: loginInfo.usernameOrEmail }, { email: loginInfo.usernameOrEmail }]
        })

        if (!user) {
            throw new Error(Err.InvalidUsernameOrEmail);
        }

        const isPassword = await user.compare_password(loginInfo.password);
        if (!isPassword) {
            throw new Error(Err.IncorrectPassword);
        }

        return user;

    } catch (error) {

    }
}

async function validateUserAccessToken(accessToken: AccessTokenCheck) {
    try {
        const { header, checkExpire } = accessToken;
        if (!header || !header.startsWith('Bearer')) {
            throw new Error(Err.Unauthentication);
        }

        let userToken = header.split(' ')[1];
        const refreshKey = process.env.JWT_SECRET_KEY || '';

        if (!checkExpire) {
            const payload = jwt.verify(userToken, refreshKey) as jwt.JwtPayload;
            const user = await UserService.getUserById(payload.userId)
            return user;
        } else {
            const payload = jwt.verify(userToken, refreshKey, {clockTimestamp: new Date().getTime()}) as jwt.JwtPayload;
            return { userId: payload.userId, role: payload.role }
        }

    } catch (error) {

    }
}

const AuthService = {
    loginUserCheck,
    validateUserAccessToken
}

export default AuthService;