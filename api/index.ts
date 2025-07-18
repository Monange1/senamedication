import express from 'express';
import { AppModule } from '../src/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

server.get('/', (req, res) => {
  res.json({ message: 'Express root route works!' });
});

let appPromise = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.init();
  return server;
}

export default async function handler(req, res) {
  // Remove manual CORS header, rely on NestJS app.enableCors
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }
  if (!appPromise) {
    appPromise = bootstrap();
  }
  const appServer = await appPromise;
  appServer(req, res);
} 