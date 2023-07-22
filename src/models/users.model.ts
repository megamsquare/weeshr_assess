import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  compare_password(input_password: string): Promise<boolean>;
  create_jwt(roles: string[] | undefined): Promise<string>;
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please provide your username"],
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = (await bcrypt.hash(
    this.password as string | Buffer,
    salt
  )) as string;
});

UserSchema.method("compare_password", async function (input_password) {
  const isMatch = await bcrypt.compare(input_password, this.password);
  return isMatch;
});

UserSchema.method("create_jwt", async function (roles: string[] | undefined) {
  let jwtoken = "";
  let jwt_key = process.env.JWT_SECRET_KEY || "weeshrsecret101";
  let expire = process.env.JWT_EXPIRES_IN || "1h"
  jwtoken = jwt.sign(
    { userId: this._id, username: this.username, roles: roles },
    jwt_key,
    { expiresIn: expire }
  );
  return jwtoken;
});

const User = mongoose.model<IUser>("users", UserSchema);

export default User;
