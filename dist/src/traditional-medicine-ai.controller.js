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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraditionalMedicineAiController = void 0;
const common_1 = require("@nestjs/common");
const traditional_medicine_mongo_schema_1 = require("./traditional-medicine.mongo.schema");
const node_fetch_1 = require("node-fetch");
let TraditionalMedicineAiController = class TraditionalMedicineAiController {
    async recommendTraditional(body) {
        const remedies = await traditional_medicine_mongo_schema_1.TraditionalMedicineMongoModel.find();
        const prompt = `
User symptoms: ${body.symptoms}
Traditional remedies: ${JSON.stringify(remedies)}
Which remedies are most relevant for these symptoms? Return a list with explanations in both English and Amharic if available.`;
        const geminiResponse = await this.geminiApiCall(prompt);
        return { recommendations: geminiResponse };
    }
    async geminiApiCall(prompt) {
        var _a, _b, _c, _d, _e;
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await (0, node_fetch_1.default)(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });
        const data = await response.json();
        return ((_e = (_d = (_c = (_b = (_a = data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || '';
    }
};
exports.TraditionalMedicineAiController = TraditionalMedicineAiController;
__decorate([
    (0, common_1.Post)('recommend-traditional'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TraditionalMedicineAiController.prototype, "recommendTraditional", null);
exports.TraditionalMedicineAiController = TraditionalMedicineAiController = __decorate([
    (0, common_1.Controller)('ai')
], TraditionalMedicineAiController);
//# sourceMappingURL=traditional-medicine-ai.controller.js.map