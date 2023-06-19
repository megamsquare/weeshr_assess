import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IsRefresh } from "../use_cases/obj/user.case";

export interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    isEmailVerified: boolean;
    compare_password(input_password: string): Promise<boolean>;
    create_jwt(is_refresh: { check: boolean; refreshToken: string }): Promise<string>;
}

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide your email'],
        validate: {
            validator: (v: string) => validator.isEmail(v.toString()),
            message: 'Email already exist'
        }
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Please provide your username']
    },
    password: {
        type: String,
        required: [true, 'Please provide your password']
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string | Buffer , salt) as string;
});

UserSchema.method('compare_password', async function (input_password) {
    const isMatch = await bcrypt.compare(input_password, this.password);
    return isMatch;
});

UserSchema.method('create_jwt', async function (is_refresh: IsRefresh) {
    let jwtoken = '';
    let jwt_key = process.env.JWT_SECRET_KEY || ''
    if (!is_refresh.check) {
        jwtoken = jwt.sign(
            { userId: this._id, username: this.username, roles: is_refresh.roles, refresh: is_refresh.refreshToken },
            jwt_key,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        return jwtoken
    } else {
        jwtoken = jwt.sign(
            { userId: this._id,username: this.username, roles: is_refresh.roles, refresh: is_refresh.refreshToken },
            jwt_key,
            { expiresIn: process.env.REFRESH_JWT_EXPIRES_IN }
        );
        return jwtoken
    }
});

const User = mongoose.model<IUser>(
    'users',
    UserSchema
);

export default User;