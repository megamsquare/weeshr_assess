import { SignUp } from "../use_cases/obj/user.case";
import Model from "../models";
import Err from "../use_cases/error_handler";

async function createUser(user: SignUp) {
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
        return error;
    }
}

const UserService = {
    createUser
}

export default UserService;