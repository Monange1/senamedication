"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../src/user/entities/user.entity");
const drug_entity_1 = require("../src/drugs/entities/drug.entity");
const traditional_medicine_entity_1 = require("../src/traditional-medicine.entity");
const mongoose_1 = require("mongoose");
const user_mongo_schema_1 = require("../src/user/user.mongo.schema");
const drug_mongo_schema_1 = require("../src/drugs/drug.mongo.schema");
const traditional_medicine_mongo_schema_1 = require("../src/traditional-medicine.mongo.schema");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [user_entity_1.User, drug_entity_1.Drug, traditional_medicine_entity_1.TraditionalMedicine],
});
async function migrate() {
    await AppDataSource.initialize();
    await mongoose_1.default.connect(process.env.MONGODB_URI);
    const users = await AppDataSource.getRepository(user_entity_1.User).find();
    if (users.length) {
        await user_mongo_schema_1.UserMongoModel.insertMany(users.map(u => {
            const { id } = u, rest = __rest(u, ["id"]);
            return Object.assign(Object.assign({}, rest), { pgId: id });
        }));
        console.log(`Migrated ${users.length} users.`);
    }
    const drugs = await AppDataSource.getRepository(drug_entity_1.Drug).find();
    if (drugs.length) {
        await drug_mongo_schema_1.DrugMongoModel.insertMany(drugs.map(d => {
            const { id } = d, rest = __rest(d, ["id"]);
            return Object.assign(Object.assign({}, rest), { pgId: id });
        }));
        console.log(`Migrated ${drugs.length} drugs.`);
    }
    const tradMeds = await AppDataSource.getRepository(traditional_medicine_entity_1.TraditionalMedicine).find();
    if (tradMeds.length) {
        await traditional_medicine_mongo_schema_1.TraditionalMedicineMongoModel.insertMany(tradMeds.map(t => {
            const { id } = t, rest = __rest(t, ["id"]);
            return Object.assign(Object.assign({}, rest), { pgId: id });
        }));
        console.log(`Migrated ${tradMeds.length} traditional medicines.`);
    }
    await mongoose_1.default.disconnect();
    await AppDataSource.destroy();
    console.log('Migration complete!');
}
migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
//# sourceMappingURL=migrate-postgres-to-mongo.js.map