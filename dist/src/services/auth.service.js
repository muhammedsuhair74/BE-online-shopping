import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserEntity from "../entities/users.entity.js";
export class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async login(email, password) {
        try {
            console.log(email, password);
            const user = await this.userRepository.getUserByEmail(email);
            console.log(user);
            if (!user) {
                throw new Error("Invalid username or password");
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                throw new Error("Invalid username or password");
            }
            const payload = {
                userId: user.id,
                email: user.email,
            };
            const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
                expiresIn: "1h",
            });
            return token;
        }
        catch (error) {
            throw error;
        }
    }
    async register(email, password, name) {
        try {
            const user = await this.userRepository.getUserByEmail(email);
            if (user?.email === email) {
                throw new Error("User already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserEntity();
            newUser.name = name;
            newUser.email = email;
            newUser.password = hashedPassword;
            await this.userRepository.createUser(newUser);
            const responseUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            };
            return responseUser;
        }
        catch (error) {
            throw error;
        }
    }
}
export default AuthService;
//# sourceMappingURL=auth.service.js.map