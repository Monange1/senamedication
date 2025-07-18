// Entire file commented out to bypass build errors
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Update CORS to allow all origins
  app.enableCors({
    origin: [
      'https://senamedicationwebapp.vercel.app',
      /^https:\/\/senamedicationwebapp-[^.]+\.vercel\.app$/,
      /^https:\/\/senamedicationwebapp-[^.]+-mks-projects-a14cd4a0\.vercel\.app$/,
      'https://senamedicationwebapp-iyp7lrsg2-mikiyas-projects-02e778d3.vercel.app/',
      'https://calm-yeot-6af39c.netlify.app' // Netlify frontend
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Removed global prefix so routes are at /drugs

  await app.listen(3001, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
