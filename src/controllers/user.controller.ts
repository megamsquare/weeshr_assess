import { Request, Response } from "express";
import status_code from "http-status";
import Model from "../models";
import { NewUser } from "../use_cases/obj/user.case";
import Services from "../services";

async function createUser(req: Request, res: Response) {
    try {
        let userInfo: NewUser;

        userInfo = req.body;

        const user = await Services.UserService.createUser(userInfo);
        if (user instanceof Error) {
            res.status(status_code.BAD_REQUEST).json({ message: user.message });
            return;
        }

        const userDetails = {
            userId: user._id,
            name: `${user.firstName} ${user.lastName}`,
            username: user.username,
            email: user.email
        }

        res.status(status_code.CREATED).json({ data: { user: userDetails } })

    } catch (error) {
        res.status(status_code.BAD_REQUEST).json({ message: error })
    }
}

async function updateUser(req: Request, res: Response) {

}

async function getUserById(req: Request, res: Response) {

}

async function getAllUser(req: Request, res: Response) {

}

async function getUserByUsername(req: Request, res: Response) {

}

async function getUserByEmail(req: Request, res: Response) {

}

const User_controller = {
};

export default User_controller;