import { NewUser } from "../dto/obj/user.dto";
import Model from "../models";
import Err from "../dto/error_dto";
import { IUser } from "../models/users.model";
import { Types } from "mongoose";

async function createUser(user: NewUser): Promise<IUser & { _id: Types.ObjectId } | Error> {
    try {
        const userModel = Model.User;

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

const UserService = {
    createUser
}

export default UserService;