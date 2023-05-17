import { Request, Response } from "express";
import status_code from "http-status";
import Model from "../models";
import Err from "../use_cases/error_handler";

async function sign_up(req: Request, res: Response) {
       try {
        let account_details: any;

        const user_model = Model.User;
        const role_model = Model.Roles;
    
        const user = await user_model.create({ ...req.body })

        const save_role = {
            userId: user._id,
            role: "user"
        }

        const role = await role_model.create({ ...save_role })

        res.status(status_code.CREATED).json({ data: {user, role: role.role}})

       } catch (error) {
        res.status(status_code.BAD_REQUEST).json({ message: error })
       }
}