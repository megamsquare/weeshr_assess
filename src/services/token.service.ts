import Model from "../models";
import { UserToken } from "../use_cases/obj/user.case";
import DB from "../db";
import Err from "../use_cases/error_handler";
import crypto from "crypto";

async function createToken(userInfo: UserToken) {
    try {
        const tokenModel = Model.Tokens;
        let refreshToken = crypto.randomBytes(40).toString('hex');
        const userToken = { userId: userInfo.userId, refreshToken }

        const savedToken = await tokenModel.create({ ...userToken });

        if (savedToken) {
            await DB.caching.redis_client.setEx(userInfo.username, 60 * 60 * 24, JSON.stringify(savedToken));
        }

        return savedToken;
    } catch (error) {
        console.error(`Create token Error: ${error}`)
    }

}

async function getUserToken(userInfo: UserToken) {
    try {
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
    } catch (error) {
        console.log("Error in get user Token", error);
    }
}

const TokenService = {
    createToken,
    getUserToken
};

export default TokenService;