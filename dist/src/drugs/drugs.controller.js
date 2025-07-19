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
    async searchOpenFda(startsWith, onlyTablets) {
        if (!startsWith) {
            throw new common_1.HttpException('Missing startsWith query parameter', common_1.HttpStatus.BAD_REQUEST);
        }
        const tablets = onlyTablets !== 'false';
        return { drugs: await this.drugsService.searchOpenFdaDrugsByLetter(startsWith, tablets) };
    }
    async searchOpenFdaByName(query) {
        if (!query) {
            throw new common_1.HttpException('Missing query parameter', common_1.HttpStatus.BAD_REQUEST);
        }
        return { drugs: await this.drugsService.searchOpenFdaDrugsByName(query) };
    }
    async getDailyMedDetail(name) {
        if (!name) {
            throw new common_1.HttpException('Missing name query parameter', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.drugsService.getDrugDetailByName(name);
    }
    async searchDailyMedByName(query) {
        if (!query) {
            throw new common_1.HttpException('Missing query parameter', common_1.HttpStatus.BAD_REQUEST);
        }
        return { drugs: await this.drugsService.searchDailyMedDrugsByName(query) };
    }
    async searchRxImage(imprint, color, shape) {
        if (!imprint) {
            throw new common_1.HttpException('Missing imprint query parameter', common_1.HttpStatus.BAD_REQUEST);
        }
        return await this.drugsService.searchRxImage({ imprint, color, shape });
    }
    async searchRxNavByName(query) {
        if (!query) {
            throw new common_1.HttpException('Missing query parameter', common_1.HttpStatus.BAD_REQUEST);
        }
        return { drugs: await this.drugsService.searchRxNavDrugsByName(query) };
    }
    async searchDrugsDotComByName(query) {
        if (!query) {
            throw new common_1.HttpException('Missing query parameter', common_1.HttpStatus.BAD_REQUEST);
        }
        return { drugs: await this.drugsService.searchDrugsDotComByName(query) };
    }
};
exports.DrugsController = DrugsController;
__decorate([
    (0, common_1.Get)('openfda'),
    __param(0, (0, common_1.Query)('startsWith')),
    __param(1, (0, common_1.Query)('onlyTablets')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DrugsController.prototype, "searchOpenFda", null);
__decorate([
    (0, common_1.Get)('openfda/search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugsController.prototype, "searchOpenFdaByName", null);
__decorate([
    (0, common_1.Get)('dailymed/detail'),
    __param(0, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugsController.prototype, "getDailyMedDetail", null);
__decorate([
    (0, common_1.Get)('dailymed/search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugsController.prototype, "searchDailyMedByName", null);
__decorate([
    (0, common_1.Get)('rximage'),
    __param(0, (0, common_1.Query)('imprint')),
    __param(1, (0, common_1.Query)('color')),
    __param(2, (0, common_1.Query)('shape')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DrugsController.prototype, "searchRxImage", null);
__decorate([
    (0, common_1.Get)('rxnav/search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugsController.prototype, "searchRxNavByName", null);
__decorate([
    (0, common_1.Get)('drugsdotcom/search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrugsController.prototype, "searchDrugsDotComByName", null);
exports.DrugsController = DrugsController = __decorate([
    (0, common_1.Controller)('drugs'),
    __metadata("design:paramtypes", [drugs_service_1.DrugsService])
], DrugsController);
//# sourceMappingURL=drugs.controller.js.map