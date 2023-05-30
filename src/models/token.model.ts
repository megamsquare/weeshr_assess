import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

const Tokens = mongoose.model(
    "token",
    TokenSchema
)

export default Tokens;