"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'https://senamedicationwebapp.vercel.app',
            /^https:\/\/senamedicationwebapp-[^.]+\.vercel\.app$/,
            /^https:\/\/senamedicationwebapp-[^.]+-mks-projects-a14cd4a0\.vercel\.app$/,
            'https://senamedicationwebapp-ecru.vercel.app',
            'https://senamedicationwebapp-267rl6yu7-mks-projects-a14cd4a0.vercel.app',
            'https://senamedicationwebapp-algrkason-mks-projects-a14cd4a0.vercel.app',
            'https://senamedicationwebapp-p17ydoowt-mikiyas-projects-02e778d3.vercel.app',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(3001, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map