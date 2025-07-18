"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const express_1 = require("express");
const app_module_1 = require("../src/app.module");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const server = (0, express_1.default)();
server.get('/', (req, res) => {
    res.json({ message: 'Express root route works!' });
});
let appPromise = null;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    await app.init();
    return server;
}
async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
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
//# sourceMappingURL=index.js.map