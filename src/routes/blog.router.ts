import express from "express";
import BlogController from "../controllers/blog.controller";
import { validateBlog } from "../dto/obj/blog.dto";
import Middleware from "../middleware";

const router = express.Router();

/**
 * @swagger
 *
 * /api/v1/blog:
 *   post:
 *     tags:
 *       - "Blog"
 *     summary: "User create blog"
 *     description: User create blog to the application
 *     requestBody:
 *       description: "Login user to create blog"
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog title.
 *               content:
 *                 type: string
 *                 description: Blog contents.
 *               author:
 *                 type: string
 *                 description: Blog author user id.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User is authenticated, provided jwt token to be used in all future requests, and user object is returned
 *       400:
 *         description: User does not exist or password mismatch
 *       401:
 *         description: Unauthorized, token was not provided
 * securityDefinitions:     # Define the security schemes here
 *   bearerAuth:            # Security definition named "bearerAuth"
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */
router.post(
  "/",
  Middleware.AuthMiddleware.verifyToken,
  Middleware.AuthMiddleware.verifyPermission(["user"]),
  validateBlog,
  Middleware.ValidationResponse.checkValidationResult,
  BlogController.create
);

/**
 * @swagger
 *
 * /api/v1/blog/{blog_id}:
 *   get:
 *     tags:
 *       - "Blog"
 *     summary: "Fetch blog using blog id"
 *     description: This route should return a blog
 *     parameters:
 *      - name: "blog_id"
 *        in: "path"
 *        description: "ID of blog"
 *        required: true
 *        type: "string"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfull retrieval
 *       401:
 *         description: Unauthorized, token was not provided
 */
router.get("/:id", BlogController.getById);

/**
 * @swagger
 *
 * /api/v1/blog:
 *   get:
 *     tags:
 *       - "Blog"
 *     summary: "Fetch all available blogs"
 *     description: This route should return a list of all blogs
 *     parameters:
 *      - name: "page"
 *        in: "query"
 *        description: "Page number you want to display"
 *        type: "integer"
 *      - name: "items"
 *        in: "query"
 *        description: "number of items per page you want to display"
 *        type: "integer"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfull retrieval
 */
router.get("/", BlogController.getAll);

/**
 * @swagger
 *
 * /api/v1/blog/{blog_id}:
 *   put:
 *     tags:
 *       - "Blog"
 *     summary: "Edit blog information"
 *     description: Allow the author of the blog to edit the information
 *     parameters:
 *       - name: "blog_id"
 *         in: "path"
 *         description: "ID of blog"
 *         required: true
 *         type: "string"
 *     requestBody:
 *       description: "Blog information to be edited"
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     produces:
 *       - application/json
 *     security:            # Add the security schemes here
 *       - bearerAuth: []   # This refers to the security definition named "bearerAuth"
 *     responses:
 *       200:
 *         description: Successfully edited the blog information
 *       400:
 *         description: Missing parameters
 *       401:
 *         description: Unauthorized, token was not provided
 * securityDefinitions:     # Define the security schemes here
 *   bearerAuth:            # Security definition named "bearerAuth"
 *     type: apiKey
 *     name: Authorization
 *     in: header
 */
router.put(
  "/",
  Middleware.AuthMiddleware.verifyToken,
  Middleware.AuthMiddleware.verifyPermission(["user"]),
  validateBlog,
  Middleware.ValidationResponse.checkValidationResult,
  BlogController.update
);

/**
 * @swagger
 *
 * /api/v1/blog/{blog_id}:
 *   delete:
 *     tags:
 *       - "Blog"
 *     summary: "Delete blog by blog id"
 *     description: This route should return the deleted blog
 *     parameters:
 *      - name: "blog_id"
 *        in: "path"
 *        description: "ID of blog"
 *        required: true
 *        type: "string"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfull retrieval
 */
router.delete(
  "/:id",
  Middleware.AuthMiddleware.verifyToken,
  Middleware.AuthMiddleware.verifyPermission(["user"]),
  BlogController.deleteById
);

export default router;
