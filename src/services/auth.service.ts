import type UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserEntity from "../entities/users.entity.js";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(email: string, password: string) {
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
      const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
        expiresIn: "1h",
      });
      return token;
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string, name: string) {
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
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
