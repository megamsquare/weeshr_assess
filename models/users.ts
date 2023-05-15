import mongoose from "mongoose";
import validator from "validator"

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
        type: String
    },
    password: {
        type: String
    },
}, {
    timestamps: true
})