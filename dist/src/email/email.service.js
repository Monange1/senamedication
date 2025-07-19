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
            const localhostUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
            const lanUrl = `${this.configService.get('FRONTEND_LAN_URL')}/verify-email?token=${token}`;
            const logoUrl = "https://res.cloudinary.com/dmx5wka5r/image/upload/f_png/v1749281877/senaymed_im4vb6.png";
            const heading = 'Welcome to SenayMed!';
            const message = 'Thank you for signing up. Please verify your email address by clicking one of the buttons below.';
            const buttonTextLocal = 'Verify on this device (localhost)';
            const buttonTextLAN = 'Verify from another device (LAN)';
            const footerNote = 'If you did not create an account, you can safely ignore this email.';
            const expiryNote = 'This link will expire in 24 hours.';
            this.logger.log(`Sending verification email to ${email}`);
            this.logger.debug(`Localhost URL: ${localhostUrl}`);
            this.logger.debug(`LAN URL: ${lanUrl}`);
            await this.mailerService.sendMail({
                to: email,
                subject: 'Verify your SenayMed account',
                html: `
          <div style="background:#f6f8fa;padding:40px 0;">
            <div style="max-width:440px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px #0002;padding:40px 32px;text-align:center;font-family:'Segoe UI',Arial,sans-serif;">
              <img src="${logoUrl}" alt="SenayMed Logo" style="height:64px;margin-bottom:28px;display:block;margin-left:auto;margin-right:auto;" />
              <h2 style="color:#1BAD88;font-size:26px;margin-bottom:10px;">${heading}</h2>
              <p style="color:#333;font-size:16px;margin-bottom:28px;">${message}</p>
              <a href="${localhostUrl}" style="display:inline-block;background:#1BAD88;color:#fff;text-decoration:none;font-weight:600;padding:16px 36px;border-radius:8px;font-size:17px;margin-bottom:20px;box-shadow:0 2px 8px #1BAD8822;">${buttonTextLocal}</a><br/><br/>
              <a href="${lanUrl}" style="display:inline-block;background:#1BAD88;color:#fff;text-decoration:none;font-weight:600;padding:16px 36px;border-radius:8px;font-size:17px;margin-bottom:20px;box-shadow:0 2px 8px #1BAD8822;">${buttonTextLAN}</a>
              <p style="color:#888;font-size:13px;margin-top:28px;">${footerNote}</p>
              <p style="color:#bbb;font-size:12px;margin-top:36px;">${expiryNote}<br/>&copy; SenayMed ${new Date().getFullYear()}</p>
            </div>
          </div>
        `,
            });
            this.logger.log(`Verification email sent successfully to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send verification email to ${email}:`, error);
            if (error instanceof Error) {
                this.logger.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                });
            }
            else {
                this.logger.error('Error details:', error);
            }
            throw error;
        }
    }
    async sendPasswordResetEmail(email, token) {
        try {
            const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
            const logoUrl = "https://res.cloudinary.com/dmx5wka5r/image/upload/f_png/v1749281877/senaymed_im4vb6.png";
            const heading = 'Reset Your Password';
            const message = 'You requested to reset your password. Click the button below to set a new password.';
            const actionUrl = resetUrl;
            const buttonText = 'Reset Password';
            const footerNote = 'If you did not request this, you can safely ignore this email.';
            const expiryNote = 'This link will expire in 1 hour.';
            this.logger.log(`Sending password reset email to ${email}`);
            this.logger.debug(`Reset URL: ${resetUrl}`);
            await this.mailerService.sendMail({
                to: email,
                subject: 'Reset your SenayMed password',
                html: `
          <div style="background:#f6f8fa;padding:40px 0;">
            <div style="max-width:440px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px #0002;padding:40px 32px;text-align:center;font-family:'Segoe UI',Arial,sans-serif;">
              <img src="${logoUrl}" alt="SenayMed Logo" style="height:64px;margin-bottom:28px;display:block;margin-left:auto;margin-right:auto;" />
              <h2 style="color:#1BAD88;font-size:26px;margin-bottom:10px;">${heading}</h2>
              <p style="color:#333;font-size:16px;margin-bottom:28px;">${message}</p>
              <a href="${actionUrl}" style="display:inline-block;background:#1BAD88;color:#fff;text-decoration:none;font-weight:600;padding:16px 36px;border-radius:8px;font-size:17px;margin-bottom:20px;box-shadow:0 2px 8px #1BAD8822;">${buttonText}</a>
              <p style="color:#888;font-size:13px;margin-top:28px;">${footerNote}</p>
              <p style="color:#bbb;font-size:12px;margin-top:36px;">${expiryNote}<br/>&copy; SenayMed ${new Date().getFullYear()}</p>
            </div>
          </div>
        `,
            });
            this.logger.log(`Password reset email sent successfully to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send password reset email to ${email}:`, error);
            if (error instanceof Error) {
                this.logger.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                });
            }
            else {
                this.logger.error('Error details:', error);
            }
            throw error;
        }
    }
    async sendReminderEmail(email, subject, message) {
        try {
            this.logger.log(`Sending medication reminder email to ${email}`);
            await this.mailerService.sendMail({
                to: email,
                subject,
                html: `<div style="font-family:Arial,sans-serif;font-size:16px;">${message}</div>`
            });
            this.logger.log(`Reminder email sent successfully to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send reminder email to ${email}:`, error);
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