import UserEntity from "../entities/users.entity.js";
import UserService from "../services/user.service.js";
import express from "express";
import bcrypt from "bcrypt";
import { IsNull, Not } from "typeorm";
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
export class UserController {
    userService;
    router;
    constructor(userService) {
        this.userService = userService;
        this.router = express.Router();
        this.router.get("/", this.getAllUsers.bind(this));
        // this.router.get(
        //   "/soft-deleted-users",
        //   this.getAllSoftDeletedUsers.bind(this),
        // );
        this.router.put("/recover-soft-deleted-user/:id", this.recoverSoftDeletedUser.bind(this));
        this.router.get("/:id", this.getUserById.bind(this));
        this.router.post("/", this.createUser.bind(this));
        this.router.put("/:id", this.updateUser.bind(this));
        this.router.delete("/:id", this.deleteUser.bind(this));
    }
    async createUser(req, res, next) {
        const { email, name, password } = req.body;
        try {
            const savedUser = await this.userService.createUser(email, name, password);
            res.status(201).json(savedUser);
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const queryParams = req.query;
            const parsedId = Number(id);
            if (!Number.isInteger(parsedId) || parsedId <= 0) {
                throw new Error("Invalid user id");
            }
            const user = await this.userService.getUserById(parsedId);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    //   async getAllSoftDeletedUsers(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction,
    //   ): Promise<void> {
    //     try {
    //       const users = await this.userService.getAllSoftDeletedUsers();
    //       res.status(200).json(users);
    //     } catch (error) {
    //       next(error);
    //     }
    //   }
    async recoverSoftDeletedUser(req, res, next) {
        try {
            const { id } = req.params;
            const parsedId = Number(id);
            if (!Number.isInteger(parsedId) || parsedId <= 0) {
                throw new Error("Invalid user id");
            }
            const user = await this.userService.recoverSoftDeletedUser(parsedId);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const parsedId = Number(id);
            if (!Number.isInteger(parsedId) || parsedId <= 0) {
                throw new Error("Invalid user id");
            }
            const { email, name, password } = req.body;
            const user = new UserEntity();
            user.email = email;
            user.name = name;
            user.password = await bcrypt.hash(password, 10);
            const isUserExists = await this.userService.getUserById(parsedId);
            if (isUserExists?.id !== parsedId) {
                throw new Error("User not found");
            }
            const updatedUser = await this.userService.updateUser(parsedId, user);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllUsers(req, res, next) {
        try {
            const { isDeleted } = req.query;
            console.log("isDeleted", isDeleted);
            let users;
            if (isDeleted === "true") {
                console.log("isDeleted is true");
                users = await this.userService.getAllUsers({ isDeleted: true });
            }
            else {
                users = await this.userService.getAllUsers({});
            }
            res.status(200).json(users);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const parsedId = Number(id);
            if (!Number.isInteger(parsedId) || parsedId <= 0) {
                throw new Error("Invalid user id");
            }
            await this.userService.deleteUser(parsedId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=user.controller.js.map