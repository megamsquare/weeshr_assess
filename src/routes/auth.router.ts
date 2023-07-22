import express from 'express';
import Auth_controller from '../controllers/auth.controller';
import Middleware from '../middleware';
import { validateLogin, validateSignin } from '../dto/obj/auth.dto';

const router = express.Router();

/**
 * @swagger
 *
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - "Auth"
 *     summary: "User register"
 *     description: Register user to the application
 *     requestBody:
 *       description: "Register user to perform action for post"
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username or email.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User is authenticated, provided jwt token to be used in all future requests, and user object is returned
 *       400:
 *         description: User does not exist or password mismatch
 */
router.post('/register', validateSignin, Middleware.ValidationResponse.checkValidationResult, Auth_controller.signUp);

/**
 * @swagger
 *
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - "Auth"
 *     summary: "User login"
 *     description: Login to the application
 *     requestBody:
 *       description: "Blog post"
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username or email.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User is authenticated, provided jwt token to be used in all future requests, and user object is returned
 *       400:
 *         description: User does not exist or password mismatch
 */
router.post('/login', validateLogin, Middleware.ValidationResponse.checkValidationResult, Auth_controller.signIn);

export default router;