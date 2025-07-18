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
exports.DrugsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const drug_entity_1 = require("./entities/drug.entity");
let DrugsService = class DrugsService {
    constructor(drugRepository) {
        this.drugRepository = drugRepository;
    }
    async getDrugsByFirstLetter(letter) {
        var _a, _b, _c, _d;
        console.log(`Fetching drugs starting with letter: ${letter}`);
        const brandNameUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${letter}*&limit=100`;
        const genericNameUrl = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${letter}*&limit=100`;
        console.log(`Fetching brand names from OpenFDA: ${brandNameUrl}`);
        console.log(`Fetching generic names from OpenFDA: ${genericNameUrl}`);
        try {
            const [brandResponse, genericResponse] = await Promise.all([
                fetch(brandNameUrl),
                fetch(genericNameUrl)
            ]);
            if (!brandResponse.ok || !genericResponse.ok) {
                console.error('OpenFDA API error:', {
                    brandStatus: brandResponse.status,
                    genericStatus: genericResponse.status
                });
                throw new Error('Failed to fetch from OpenFDA API');
            }
            const [brandData, genericData] = await Promise.all([
                brandResponse.json(),
                genericResponse.json()
            ]);
            console.log(`Brand names response status: ${brandResponse.status}`);
            console.log(`Generic names response status: ${genericResponse.status}`);
            console.log(`Number of brand name results: ${((_a = brandData.results) === null || _a === void 0 ? void 0 : _a.length) || 0}`);
            console.log(`Number of generic name results: ${((_b = genericData.results) === null || _b === void 0 ? void 0 : _b.length) || 0}`);
            const brandDrugs = ((_c = brandData.results) === null || _c === void 0 ? void 0 : _c.flatMap((item) => {
                const brandNames = item.openfda.brand_name || [];
                const genericNames = item.openfda.generic_name || [];
                return [...brandNames, ...genericNames];
            })) || [];
            const genericDrugs = ((_d = genericData.results) === null || _d === void 0 ? void 0 : _d.flatMap((item) => {
                const brandNames = item.openfda.brand_name || [];
                const genericNames = item.openfda.generic_name || [];
                return [...brandNames, ...genericNames];
            })) || [];
            const allDrugs = [...brandDrugs, ...genericDrugs];
            console.log(`Total drugs before deduplication: ${allDrugs.length}`);
            console.log('Sample of drugs before deduplication:', allDrugs.slice(0, 5));
            const uniqueDrugs = Array.from(new Set(allDrugs))
                .filter((name) => {
                if (!name || typeof name !== 'string' || name.trim() === '') {
                    return false;
                }
                const trimmedName = name.trim();
                if (!trimmedName.toLowerCase().startsWith(letter.toLowerCase())) {
                    return false;
                }
                if (trimmedName.toLowerCase().includes('cream') ||
                    trimmedName.toLowerCase().includes('diaper') ||
                    trimmedName.toLowerCase().includes('lotion') ||
                    trimmedName.toLowerCase().includes('shampoo') ||
                    trimmedName.toLowerCase().includes('soap')) {
                    return false;
                }
                return true;
            })
                .map(name => name.trim())
                .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
            console.log(`Total unique drugs after deduplication: ${uniqueDrugs.length}`);
            console.log('First few drugs after deduplication:', uniqueDrugs.slice(0, 5));
            await this.drugRepository.delete({
                name: (0, typeorm_2.ILike)(`${letter}%`)
            });
            await this.drugRepository.save(uniqueDrugs.map(name => ({ name })));
            return uniqueDrugs;
        }
        catch (error) {
            console.error('Error fetching drugs:', error);
            const cached = await this.drugRepository.find({
                where: { name: (0, typeorm_2.ILike)(`${letter}%`) },
                order: { name: 'ASC' }
            });
            console.log(`Falling back to cache, found ${cached.length} drugs`);
            return cached.map(d => d.name);
        }
    }
    async getDrugDetailByName(name) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:%22${encodeURIComponent(name)}%22&limit=1`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return Object.assign({ name, description: ((_a = result.description) === null || _a === void 0 ? void 0 : _a[0]) || null, indications_and_usage: ((_b = result.indications_and_usage) === null || _b === void 0 ? void 0 : _b[0]) || null, purpose: ((_c = result.purpose) === null || _c === void 0 ? void 0 : _c[0]) || null, warnings: ((_d = result.warnings) === null || _d === void 0 ? void 0 : _d[0]) || null, dosage_and_administration: ((_e = result.dosage_and_administration) === null || _e === void 0 ? void 0 : _e[0]) || null, adverse_reactions: ((_f = result.adverse_reactions) === null || _f === void 0 ? void 0 : _f[0]) || null, contraindications: ((_g = result.contraindications) === null || _g === void 0 ? void 0 : _g[0]) || null, active_ingredient: ((_h = result.active_ingredient) === null || _h === void 0 ? void 0 : _h[0]) || null, inactive_ingredient: ((_j = result.inactive_ingredient) === null || _j === void 0 ? void 0 : _j[0]) || null, precautions: ((_k = result.precautions) === null || _k === void 0 ? void 0 : _k[0]) || null, drug_interactions: ((_l = result.drug_interactions) === null || _l === void 0 ? void 0 : _l[0]) || null, overdosage: ((_m = result.overdosage) === null || _m === void 0 ? void 0 : _m[0]) || null, how_supplied: ((_o = result.how_supplied) === null || _o === void 0 ? void 0 : _o[0]) || null, storage_and_handling: ((_p = result.storage_and_handling) === null || _p === void 0 ? void 0 : _p[0]) || null }, result);
        }
        return { name, description: null };
    }
};
exports.DrugsService = DrugsService;
exports.DrugsService = DrugsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(drug_entity_1.Drug)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DrugsService);
//# sourceMappingURL=drugs.service.js.map