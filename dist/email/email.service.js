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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    async sendVerificationEmail(email, token) {
        try {
            const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
            this.logger.log(`Sending verification email to ${email}`);
            this.logger.debug(`Verification URL: ${verificationUrl}`);
            await this.mailerService.sendMail({
                to: email,
                subject: 'Verify your SenayMed account',
                html: `
          <h1>Welcome to SenayMed!</h1>
          <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
          <p>
            <a href="${verificationUrl}" style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            ">Verify Email Address</a>
          </p>
          <p>If you did not create an account, you can safely ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>The SenayMed Team</p>
        `,
            });
            this.logger.log(`Verification email sent successfully to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send verification email to ${email}:`, error);
            this.logger.error('Error details:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
            });
            throw error;
        }
    }
    async sendPasswordResetEmail(email, token) {
        try {
            const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
            this.logger.log(`Sending password reset email to ${email}`);
            this.logger.debug(`Reset URL: ${resetUrl}`);
            await this.mailerService.sendMail({
                to: email,
                subject: 'Reset your SenayMed password',
                html: `
          <h1>Password Reset Request</h1>
          <p>You have requested to reset your password. Click the link below to proceed:</p>
          <p>
            <a href="${resetUrl}" style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            ">Reset Password</a>
          </p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Best regards,<br>The SenayMed Team</p>
        `,
            });
            this.logger.log(`Password reset email sent successfully to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send password reset email to ${email}:`, error);
            this.logger.error('Error details:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
            });
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map