import Model from "../models";
import DB from "../db";
import Err from "../use_cases/error_handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AccessTokenCheck, LoginInfo } from "../use_cases/obj/user.case";

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
        const { header, checkExpire } = accessToken
        if (!header || !header.startsWith('Bearer')) {
            throw new Error(Err.Unauthentication);
        }

        let userToken = header.split(' ')[1];
        const refreshKey = process.env.JWT_SECRET_KEY || '';
        const payload = jwt.verify(userToken, refreshKey) as jwt.JwtPayload;

    } catch (error) {

    }
}

const AuthService = {
    loginUserCheck,
    validateUserAccessToken
}

export default AuthService;