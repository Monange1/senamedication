"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugsService = void 0;
const common_1 = require("@nestjs/common");
const drug_mongo_schema_1 = require("./drug.mongo.schema");
let DrugsService = class DrugsService {
    async findAll() {
        return drug_mongo_schema_1.DrugMongoModel.find();
    }
    async findByName(name) {
        return drug_mongo_schema_1.DrugMongoModel.findOne({ name });
    }
    async searchOpenFdaDrugsByLetter(startsWith, tablets) {
        return [];
    }
    async searchOpenFdaDrugsByName(query) {
        return [];
    }
    async getDrugDetailByName(name) {
        return { name, description: null };
    }
    async searchDailyMedDrugsByName(query) {
        return [];
    }
    async searchRxImage({ imprint, color, shape }) {
        return { results: [] };
    }
    async searchRxNavDrugsByName(query) {
        return [];
    }
    async searchDrugsDotComByName(query) {
        return [];
    }
};
exports.DrugsService = DrugsService;
exports.DrugsService = DrugsService = __decorate([
    (0, common_1.Injectable)()
], DrugsService);
//# sourceMappingURL=drugs.service.js.map