import UserService from "../services/user.service.js";
import express from "express";
/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: List users
 *     parameters:
 *       - in: query
 *         name: isDeleted
 *         schema:
 *           type: string
 *           enum: [ "true" ]
 *         description: When "true", returns soft-deleted users
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     tags:
 *       - User
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created user
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User
 *   put:
 *     tags:
 *       - User
 *     summary: Update user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user
 *   delete:
 *     tags:
 *       - User
 *     summary: Soft-delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No content
 * /user/recover-soft-deleted-user/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Recover soft-deleted user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recovered user
 */
export declare class UserController {
    private readonly userService;
    router: express.Router;
    constructor(userService: UserService);
    createUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    getUserById(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    recoverSoftDeletedUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    updateUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    deleteUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map