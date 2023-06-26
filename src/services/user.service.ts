import { NewUser } from "../use_cases/obj/user.case";
import Model from "../models";
import Err from "../use_cases/error_handler";
import { IUser } from "../models/users.model";
import { Types } from "mongoose";

async function createUser(user: NewUser): Promise<IUser & {_id: Types.ObjectId} | Error> {
    try {
        const userModel = Model.User;

        const emailExist = await userModel.exists({ email: user.email });
        if (emailExist) {
            throw new Error(Err.EmailExists);
        }

        const usernameExist = await userModel.exists({ username: user.username });
        if (usernameExist) {
            throw new Error(Err.UsernameExists)
        }

        const saveUser = await userModel.create({ ...user })

        return saveUser;
    } catch (error) {
        return error as Error;
    }
}

async function getUserById(userId:string) {
    try {
        const userModel = Model.User;
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            throw new Error(Err.UserDoesNotExists);
        }

        return user;
    } catch (error) {
        return error as Error
    }
}

async function updateUser() {
    
}

async function changeUserPassword() {
    
}

const UserService = {
    createUser,
    getUserById,
    updateUser
}

export default UserService;