import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your first name']
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
            validator: validator.isEmail,
            message: 'Please provide valid email'
        }
    },
    username: {},
    password: {},
})