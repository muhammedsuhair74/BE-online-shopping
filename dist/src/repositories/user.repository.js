import { IsNull, Not, Repository, UpdateResult } from "typeorm";
import UserEntity from "../entities/users.entity.js";
class UserRepository {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(user) {
        try {
            return await this.userRepository.save(user);
        }
        catch (error) {
            throw error;
        }
    }
    async getAllUsers({ isDeleted, }) {
        try {
            return await this.userRepository.find({
                where: { deletedAt: isDeleted ? Not(IsNull()) : IsNull() },
                withDeleted: isDeleted ? true : false,
            });
        }
        catch (error) {
            throw error;
        }
    }
    //   async getAllSoftDeletedUsers(): Promise<UserEntity[]> {
    //     try {
    //       return await this.userRepository.find({
    //         where: { deletedAt: Not(IsNull()) },
    //         withDeleted: true,
    //       });
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    async recoverSoftDeletedUser(id) {
        try {
            return await this.userRepository.restore(id);
        }
        catch (error) {
            throw error;
        }
    }
    async getUserById(id) {
        try {
            return await this.userRepository.findOne({ where: { id } });
        }
        catch (error) {
            throw error;
        }
    }
    async updateUser(id, user) {
        try {
            const updatedUser = await this.userRepository.update(id, user);
            return updatedUser.raw[0];
        }
        catch (error) {
            throw error;
        }
    }
    async deleteUser(id) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error("User not found");
            }
            await this.userRepository.softDelete(id);
        }
        catch (error) {
            throw error;
        }
    }
    async getUserByEmail(email) {
        console.log("getUserByEmail repository \n email: ", email);
        console.log("\n \n");
        try {
            return await this.userRepository.findOne({ where: { email } });
        }
        catch (error) {
            throw error;
        }
    }
}
export default UserRepository;
//# sourceMappingURL=user.repository.js.map