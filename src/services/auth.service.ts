import Model from "../models";
import Err from "../dto/error_dto";
import jwt from "jsonwebtoken";
import {
  LoginInfo,
  AccessTokenCheck,
} from "../dto/obj/auth.dto";

async function loginUserCheck(loginInfo: LoginInfo) {
  try {
    const userModel = Model.User;

    const user = await userModel.findOne({ username: loginInfo.username });

    if (!user) {
      throw new Error(Err.InvalidUsernameOrEmail);
    }

    const isPassword = await user.compare_password(loginInfo.password);
    if (!isPassword) {
      throw new Error(Err.IncorrectPassword);
    }

    return user;
  } catch (error) {}
}

function validateUserAccessToken(accessToken: AccessTokenCheck) {
  try {
    const { header } = accessToken;
    if (!header || !header.startsWith("Bearer")) {
      throw new Error(Err.Unauthentication);
    }

    let userToken = header.split(" ")[1];
    const jwtKey = process.env.JWT_SECRET_KEY || "";

    const payload: jwt.JwtPayload = jwt.verify(
      userToken,
      jwtKey
    ) as jwt.JwtPayload;

    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log(error.message);
      throw new Error(error.message);
    }
    return error as Error;
  }
}

function logoutUser() {}

const AuthService = {
  loginUserCheck,
  validateUserAccessToken,
};

export default AuthService;
