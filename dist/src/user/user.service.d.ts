export declare class UserService {
    create(userData: any): Promise<any>;
    findByEmail(email: string): Promise<any | null>;
    findByVerificationToken(token: string): Promise<any | null>;
    update(id: string, updateData: any): Promise<any>;
    generatePasswordResetToken(email: string): Promise<string>;
    findByPasswordResetToken(token: string): Promise<any | null>;
    setPassword(id: string, newPassword: string): Promise<any>;
    findById(id: string): Promise<any | null>;
    getAllUsers(): Promise<any[]>;
    delete(id: string): Promise<any>;
    resetPassword(token: string, newPassword: string): Promise<any>;
}
