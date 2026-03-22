import { Repository, UpdateResult } from "typeorm";
import UserEntity from "../entities/users.entity.js";
import type UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";

class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(email: string, name: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserEntity();
      user.email = email;
      user.name = name;
      user.password = hashedPassword;
      const isUserAlreadyExists =
        await this.userRepository.getUserByEmail(email);
      if (isUserAlreadyExists?.email === email) {
        throw new Error("User already exists");
      }
      return this.userRepository.createUser(user);
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers({
    isDeleted,
  }: {
    isDeleted?: boolean;
  }): Promise<UserEntity[]> {
    try {
      const users = await this.userRepository.getAllUsers({
        isDeleted: isDeleted ?? false,
      });
      if (users.length === 0) {
        throw new Error("No users found");
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  //   async getAllSoftDeletedUsers(): Promise<UserEntity[]> {
  //     try {
  //       const users = await this.userRepository.getAllSoftDeletedUsers();
  //       if (users.length === 0) {
  //         throw new Error("No soft deleted users found");
  //       }
  //       return users;
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  async recoverSoftDeletedUser(id: number): Promise<UpdateResult> {
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      if (user.deletedAt === null) {
        throw new Error("User is not soft deleted");
      }
      return await this.userRepository.recoverSoftDeletedUser(id);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      //   if (user.deletedAt === null) {
      //     throw new Error("User is not soft deleted");
      //   }
      return await this.userRepository.getUserById(id);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, user: UserEntity): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      //   if (user.deletedAt === null) {
      //     throw new Error("User is not soft deleted");
      //   }
      return await this.userRepository.updateUser(id, user);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      //   if (user.deletedAt === null) {
      //     throw new Error("User is not soft deleted");
      //   }
      await this.userRepository.deleteUser(id);
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
