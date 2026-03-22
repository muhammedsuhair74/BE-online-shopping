import { UpdateResult } from "typeorm";
import UserEntity from "../entities/users.entity.js";
import type UserRepository from "../repositories/user.repository.js";
declare class UserService {
    private userRepository;
    constructor(userRepository: UserRepository);
    createUser(email: string, name: string, password: string): Promise<UserEntity>;
    getAllUsers({ isDeleted, }: {
        isDeleted?: boolean;
    }): Promise<UserEntity[]>;
    recoverSoftDeletedUser(id: number): Promise<UpdateResult>;
    getUserById(id: number): Promise<UserEntity | null>;
    updateUser(id: number, user: UserEntity): Promise<UserEntity | null>;
    deleteUser(id: number): Promise<void>;
}
export default UserService;
//# sourceMappingURL=user.service.d.ts.map