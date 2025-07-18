import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    findByVerificationToken(token: string): Promise<User | null>;
    findByResetToken(token: string): Promise<User | null>;
    update(id: string, userData: Partial<User>): Promise<User>;
    generatePasswordResetToken(email: string): Promise<string>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
