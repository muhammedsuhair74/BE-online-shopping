import express from "express";
import AuthService from "../services/auth.service.js";
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: P@ssw0rd
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: P@ssw0rd
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *     responses:
 *       201:
 *         description: Created user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 */
export class AuthController {
    authService;
    router;
    constructor(authService) {
        this.authService = authService;
        this.router = express.Router();
        this.router.post("/login", this.login.bind(this));
        this.router.post("/register", this.register.bind(this));
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            console.log(email, password);
            const token = await this.authService.login(email, password);
            res.status(200).json({ token });
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            const user = await this.authService.register(email, password, name);
            res.status(201).json(user).redirect("/login");
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=auth.controller.js.map