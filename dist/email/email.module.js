"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const email_service_1 = require("./email.service");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    console.log('Environment variables:', {
                        SMTP_HOST: configService.get('SMTP_HOST'),
                        SMTP_PORT: configService.get('SMTP_PORT'),
                        SMTP_USER: configService.get('SMTP_USER'),
                        SMTP_PASSWORD: configService.get('SMTP_PASSWORD') ? '****' : undefined,
                        NODE_ENV: process.env.NODE_ENV,
                        PWD: process.cwd(),
                    });
                    const smtpHost = configService.get('SMTP_HOST');
                    const smtpPort = configService.get('SMTP_PORT');
                    const smtpUser = configService.get('SMTP_USER');
                    const smtpPass = configService.get('SMTP_PASSWORD');
                    const missingConfigs = [];
                    if (!smtpHost)
                        missingConfigs.push('SMTP_HOST');
                    if (!smtpPort)
                        missingConfigs.push('SMTP_PORT');
                    if (!smtpUser)
                        missingConfigs.push('SMTP_USER');
                    if (!smtpPass)
                        missingConfigs.push('SMTP_PASSWORD');
                    if (missingConfigs.length > 0) {
                        throw new Error(`Missing required SMTP configuration: ${missingConfigs.join(', ')}. ` +
                            'Please check your .env file and ensure these values are set correctly.');
                    }
                    const config = {
                        transport: {
                            host: smtpHost,
                            port: parseInt(smtpPort, 10),
                            secure: true,
                            auth: {
                                user: smtpUser,
                                pass: smtpPass,
                            },
                            debug: true,
                            logger: true,
                        },
                        defaults: {
                            from: `"SenayMed" <${smtpUser}>`,
                        },
                    };
                    console.log('Email configuration loaded successfully:', {
                        host: config.transport.host,
                        port: config.transport.port,
                        user: config.transport.auth.user,
                    });
                    return config;
                },
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [email_service_1.EmailService],
        exports: [email_service_1.EmailService],
    })
], EmailModule);
//# sourceMappingURL=email.module.js.map