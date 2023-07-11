import { Request, Response } from "express";
import status_code from "http-status";
import Err from "../use_cases/error_handler";
import { NewUser } from "../use_cases/obj/user.case";
import Services from "../services";
import { NewRole } from "../use_cases/obj/role.case";
import { AccessTokenCheck, IsRefresh, LoginInfo } from "../use_cases/obj/auth.case";
import { UserToken } from "../use_cases/obj/token.case";
import { SendEmail } from "../use_cases/obj/email.case";
import SuccessMsg from "../use_cases/success_handler";

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
            const roles = await Services.RoleService.getRolesByUserId(user._id);
            isRefresh.roles = roles

            const userToken: UserToken = {
                userId: user._id,
                username: user.username
            }

            const existingToken = await Services.TokenService.getUserToken(userToken);
            if (existingToken instanceof Error) {
                res.status(status_code.BAD_REQUEST).json({ message: existingToken.message });
                return;
            }

            const sendMail: SendEmail = {
                name: user.firstName,
                intro: SuccessMsg.LoginMsg,
                outro: 'Thank you for chosing us',
                email: user.email,
                subject: 'Welcome to our platform!'
            }

            const email = await Services.EmailService.sendEmail(sendMail);
            console.log('mail sent:', JSON.stringify(email));

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

    try {
        const accessInfo: AccessTokenCheck = {
            header: header,
            checkExpire: false
        };

        const isRefresh: IsRefresh = {
            check: false,
            refreshToken: "",
            roles: []
        };

        const payload = Services.AuthService.validateUserAccessToken(accessInfo);
        if (payload instanceof Error) {
            res.status(status_code.BAD_REQUEST).json({ mesaage: payload.message });
            return;
        }

        const user = await Services.UserService.getUserById(payload.userId);
        if (user instanceof Error) {
            res.status(status_code.BAD_REQUEST).json({ mesaage: user.message });
            return;
        }

        const userToken: UserToken = {
            userId: user._id,
            username: user.username,
        }

        const roles = await Services.RoleService.getRolesByUserId(user._id);
        isRefresh.roles = roles;
        const existingToken = await Services.TokenService.getUserToken(userToken);
        if (existingToken instanceof Error) {
            res.status(status_code.UNAUTHORIZED).json({ message: existingToken.message });
            return;
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
    } catch (error) {
        if (error instanceof Error) {
            res.status(status_code.UNAUTHORIZED).json({ message: error.message });
            return;
        }
        res.status(status_code.BAD_REQUEST).json({ message: Err.InvalidToken });
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