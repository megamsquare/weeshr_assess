import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Roles = mongoose.model(
    "roles",
    RoleSchema
)

export default Roles;