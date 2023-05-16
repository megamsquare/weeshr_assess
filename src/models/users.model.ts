import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
            message: 'Please provide valid email'
        }
    },
    username: {
        type: String,
        required: [true, 'Please provide your username'],
        unique: true
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
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.method('compare_password', async function (input_password) {
    const isMatch = await bcrypt.compare(input_password, this.password);
    return isMatch;
});

UserSchema.method('create_jwt', async function (is_refresh) {
    let jwtoken = '';
    let jwt_key = process.env.JWT_SECRET_KEY || ''
    if (!is_refresh.check) {
        jwtoken = jwt.sign(
            { userId: this._id },
            jwt_key,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        return jwtoken
    } else {
        jwtoken = jwt.sign(
            { userId: this._id,username: this.username, refresh: is_refresh.refreshToken },
            jwt_key,
            { expiresIn: process.env.REFRESH_JWT_EXPIRES_IN }
        );
        return jwtoken
    }
});

const User = mongoose.model(
    'users',
    UserSchema
);

export default User;