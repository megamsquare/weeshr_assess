import mongoose from "mongoose";

const VerifyAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    verificationCode: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
    }
},
{
    timestamps: true
});

const VerifyAccount = mongoose.model(
    "verifyAccount",
    VerifyAccountSchema
);

export default VerifyAccount;