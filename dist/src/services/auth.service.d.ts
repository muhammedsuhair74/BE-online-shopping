import type UserRepository from "../repositories/user.repository.js";
export declare class AuthService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    login(email: string, password: string): Promise<string>;
    register(email: string, password: string, name: string): Promise<{
        id: number;
        name: string;
        email: string;
    }>;
}
export default AuthService;
//# sourceMappingURL=auth.service.d.ts.map