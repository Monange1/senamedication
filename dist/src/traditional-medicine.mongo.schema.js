"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraditionalMedicineMongoModel = exports.TraditionalMedicineSchema = void 0;
const mongoose_1 = require("mongoose");
exports.TraditionalMedicineSchema = new mongoose_1.Schema({
    scientific_name: String,
    local_name: String,
    habit: String,
    habitat: String,
    parts_used: String,
    uses: String,
    amharic_name: String,
    amharic_uses: String,
});
exports.TraditionalMedicineMongoModel = (0, mongoose_1.model)('TraditionalMedicine', exports.TraditionalMedicineSchema);
//# sourceMappingURL=traditional-medicine.mongo.schema.js.map