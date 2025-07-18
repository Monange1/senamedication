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
    async register(name, email, password) {
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = (0, uuid_1.v4)();
        const verificationTokenExpires = new Date();
        verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);
        const user = await this.userService.create({
            name,
            email,
            password: hashedPassword,
            emailVerificationToken: verificationToken,
            emailVerificationTokenExpires: verificationTokenExpires,
        });
        await this.emailService.sendVerificationEmail(email, verificationToken);
        return {
            message: 'Registration successful. Please check your email to verify your account.',
        };
    }
    async verifyEmail(token) {
        const user = await this.userService.findByVerificationToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Invalid verification token');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        if (user.emailVerificationTokenExpires < new Date()) {
            throw new common_1.BadRequestException('Verification token has expired');
        }
        await this.userService.update(user.id, {
            isEmailVerified: true,
            emailVerificationToken: null,
            emailVerificationTokenExpires: null,
        });
        return {
            message: 'Email verified successfully. You can now login.',
        };
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
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async forgotPassword(email) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return {
                message: 'If your email is registered, you will receive a password reset link.',
            };
        }
        const resetToken = (0, uuid_1.v4)();
        const resetTokenExpires = new Date();
        resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);
        await this.userService.update(user.id, {
            passwordResetToken: resetToken,
            passwordResetTokenExpires: resetTokenExpires,
        });
        await this.emailService.sendPasswordResetEmail(email, resetToken);
        return {
            message: 'If your email is registered, you will receive a password reset link.',
        };
    }
    async resetPassword(token, newPassword) {
        const user = await this.userService.findByResetToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Invalid reset token');
        }
        if (user.passwordResetTokenExpires < new Date()) {
            throw new common_1.BadRequestException('Reset token has expired');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userService.update(user.id, {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetTokenExpires: null,
        });
        return {
            message: 'Password reset successful. You can now login with your new password.',
        };
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