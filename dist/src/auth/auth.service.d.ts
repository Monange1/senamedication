import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private userService;
    private jwtService;
    private emailService;
    constructor(userService: UserService, jwtService: JwtService, emailService: EmailService);
    register(body: any): Promise<{
        message: string;
    }>;
    checkName(name: string): Promise<{
        available: boolean;
    }>;
    checkEmail(email: string): Promise<{
        available: boolean;
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            name: any;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
