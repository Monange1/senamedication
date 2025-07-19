"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrugMongoModel = exports.DrugSchema = void 0;
const mongoose_1 = require("mongoose");
exports.DrugSchema = new mongoose_1.Schema({
    name: { type: String, required: true, index: true },
    lastFetched: { type: Date, default: Date.now },
});
exports.DrugMongoModel = (0, mongoose_1.model)('Drug', exports.DrugSchema);
//# sourceMappingURL=drug.mongo.schema.js.map