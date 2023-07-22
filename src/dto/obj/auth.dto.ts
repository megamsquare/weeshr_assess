import { body, ValidationChain } from "express-validator";
import Err from "../error_dto";

export interface LoginInfo {
  username: string;
  password: string;
}

export interface AccessTokenCheck {
  header: string | undefined;
}

export const validateLogin: ValidationChain[] = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email or Username is required"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is required"),
];

export const validateSignin: ValidationChain[] = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("username is required"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is required"),
];
