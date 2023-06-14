import Model from "../models";
import { GetUserToken, NewToken } from "../use_cases/obj/user.case";
import DB from "../db";
import Err from "../use_cases/error_handler";
import crypto from "crypto";

async function createToken(userInfo: NewToken) {
    try {
        const tokenModel = Model.Tokens;
        let refreshToken = crypto.randomBytes(40).toString('hex');
        const userToken = { userId: userInfo.userId, refreshToken }

        const savedToken = await tokenModel.create({ ...userToken });

        if (savedToken) {
            await DB.caching.redis_client.setEx(userInfo.username, 60 * 60 * 24, JSON.stringify(savedToken));
        }
    } catch (error) {

    }

}

async function getUserToken(userInfo: GetUserToken) {
    let existingToken;
    const tokenModel = Model.Tokens;
    const refreshCache = await DB.caching.redis_client.v4.GET(userInfo.username);

    if (refreshCache) {
        existingToken = JSON.parse(refreshCache);
    } else {
        existingToken = await tokenModel.findOne({ userId: userInfo.userId });
        await DB.caching.redis_client.setEx(userInfo.username, 60 * 60 * 24, JSON.stringify(existingToken));
    }

    if (existingToken) {
        if (!existingToken.isValid) {
            throw new Error(Err.InvalidToken);
        }
    }

    return existingToken;
}

async function getTokenByUserId(userId: string) {

}

const TokenService = {};

export default TokenService;