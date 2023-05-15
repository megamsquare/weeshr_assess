import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

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
}, {
    timestamps: true
});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
});