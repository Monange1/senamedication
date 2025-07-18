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
exports.DrugsController = void 0;
const common_1 = require("@nestjs/common");
const drugs_service_1 = require("./drugs.service");
let DrugsController = class DrugsController {
    constructor(drugsService) {
        this.drugsService = drugsService;
    }
    async getDrugs(startsWith) {
        try {
            if (!startsWith) {
                throw new common_1.HttpException('Missing startsWith query parameter', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.drugsService.getDrugsByFirstLetter(startsWith);
        }
        catch (error) {
            console.error(`Error getting drugs starting with ${startsWith}:`, error);
            throw new common_1.HttpException(error.message || 'Failed to fetch drugs', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDrugDetail(name) {
        try {
            if (!name) {
                throw new common_1.HttpException('Missing name query parameter', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.drugsService.getDrugDetailByName(name);
        }
        catch (error) {
            console.error(`Error getting drug detail for ${name}:`, error);
            throw new common_1.HttpException(error.message || 'Failed to fetch drug detail', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.DrugsController = DrugsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('startsWith')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugsController.prototype, "getDrugs", null);
__decorate([
    (0, common_1.Get)('detail'),
    __param(0, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugsController.prototype, "getDrugDetail", null);
exports.DrugsController = DrugsController = __decorate([
    (0, common_1.Controller)('drugs'),
    __metadata("design:paramtypes", [drugs_service_1.DrugsService])
], DrugsController);
//# sourceMappingURL=drugs.controller.js.map