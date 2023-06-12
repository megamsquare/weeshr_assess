import Model from "../models";
import DB from "../db";
import Err from "../use_cases/error_handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";

async function login() {
    
}

async function signUp() {
    try {
        const userModel = Model.User;
        const roleModel = Model.Roles;

        // const emailExist = await userModel.exists({email: })
    } catch (error) {
        
    }
}

const Auth = {
    login,
    signUp
}

export default Auth;