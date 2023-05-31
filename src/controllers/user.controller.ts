import { Request, Response } from "express";
import status_code from "http-status";
import Model from "../models";
import Err from "../use_cases/error_handler";
import DB from "../db";

async function createUser(req: Request, res: Response) {
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

        const userDetails = {
            name: `${user.firstName} ${user.lastName}`,
            username: user.username,
            email: user.email,
            role: role.role
        }

        res.status(status_code.CREATED).json({ data: {user: userDetails}})

       } catch (error) {
        res.status(status_code.BAD_REQUEST).json({ message: error })
       }
}

async function updateUser(req:Request, res: Response) {

}

async function getUserById(req:Request, res: Response) {
    
}

async function getAllUser(req:Request, res: Response) {
    
}

async function getUserByUsername(req:Request, res: Response) {
    
}

async function getUserByEmail(req:Request, res: Response) {
    
}

const User_controller = {
};

export default User_controller;