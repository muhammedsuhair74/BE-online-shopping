import { UserController } from "../controllers/user.controller.js";
import dataSource from "../db/data-source.js";
import UserEntity from "../entities/users.entity.js";
import UserRepository from "../repositories/user.repository.js";
import UserService from "../services/user.service.js";
const userRepository = new UserRepository(dataSource.getRepository(UserEntity));
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const userRoutes = userController.router;
export default userRoutes;
//# sourceMappingURL=user.routes.js.map