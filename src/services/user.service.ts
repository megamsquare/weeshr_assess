import { SignUp } from "../use_cases/obj/user.case";
import Model from "../models";
import Err from "../use_cases/error_handler";

async function createUser(user: SignUp) {
    try {
        const userModel = Model.User;

        const emailExist = await userModel.exists({ email: user.email });
        if (!emailExist) {
            throw new Error()
        }
    } catch (error) {
        
    }
}