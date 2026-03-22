import { AuthController } from "../controllers/auth.controller.js";
import dataSource from "../db/data-source.js";
import UserEntity from "../entities/users.entity.js";
import UserRepository from "../repositories/user.repository.js";
import AuthService from "../services/auth.service.js";
const userRepository = new UserRepository(dataSource.getRepository(UserEntity));
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);
const authRoutes = authController.router;
export default authRoutes;
//# sourceMappingURL=auth.routes.js.map