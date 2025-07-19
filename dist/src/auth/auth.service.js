"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const email_service_1 = require("../email/email.service");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(userService, jwtService, emailService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async register(body) {
        const { name, email, password } = body;
        const existing = await this.userService.findByEmail(email);
        if (existing) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = (0, uuid_1.v4)();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const user = await this.userService.create({
            name,
            email,
            password: hashedPassword,
            isEmailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationTokenExpires: verificationExpires,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await this.emailService.sendVerificationEmail(email, verificationToken);
        return { message: 'Registered successfully. Please check your email to verify your account.' };
    }
    async checkName(name) {
        return { available: true };
    }
    async checkEmail(email) {
        return { available: true };
    }
    async login(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Please verify your email before logging in');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email, role: user.role, name: user.name },
        };
    }
    async verifyEmail(token) {
        const user = await this.userService.findByVerificationToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        if (user.isEmailVerified) {
            return { message: 'Email already verified' };
        }
        if (user.emailVerificationTokenExpires && user.emailVerificationTokenExpires < new Date()) {
            throw new common_1.BadRequestException('Verification token expired');
        }
        await this.userService.update(user.id, {
            isEmailVerified: true,
            emailVerificationToken: null,
            emailVerificationTokenExpires: null,
        });
        return { message: 'Email verified successfully' };
    }
    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return { message: 'If that email is registered, a reset link has been sent.' };
        }
        const token = await this.userService.generatePasswordResetToken(email);
        await this.emailService.sendPasswordResetEmail(email, token);
        return { message: 'If that email is registered, a reset link has been sent.' };
    }
    async resetPassword(token, newPassword) {
        await this.userService.resetPassword(token, newPassword);
        return { message: 'Password has been reset successfully.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map