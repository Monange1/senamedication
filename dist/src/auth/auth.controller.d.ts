import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        message: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            name: any;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    checkName(name: string): Promise<{
        available: boolean;
    }>;
    checkEmail(email: string): Promise<{
        available: boolean;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
}
