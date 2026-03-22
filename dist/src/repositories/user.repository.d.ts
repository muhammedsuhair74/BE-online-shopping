import { Repository, UpdateResult } from "typeorm";
import UserEntity from "../entities/users.entity.js";
declare class UserRepository {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    createUser(user: UserEntity): Promise<UserEntity>;
    getAllUsers({ isDeleted, }: {
        isDeleted?: boolean;
    }): Promise<UserEntity[]>;
    recoverSoftDeletedUser(id: number): Promise<UpdateResult>;
    getUserById(id: number): Promise<UserEntity | null>;
    updateUser(id: number, user: UserEntity): Promise<UserEntity | null>;
    deleteUser(id: number): Promise<void>;
    getUserByEmail(email: string): Promise<UserEntity | null>;
}
export default UserRepository;
//# sourceMappingURL=user.repository.d.ts.map