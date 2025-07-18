"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_config_1 = require("../../typeorm.config");
async function clearDatabase() {
    try {
        await typeorm_config_1.default.initialize();
        console.log('Connected to database');
        await typeorm_config_1.default.destroy();
        console.log('Database connection closed');
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
clearDatabase();
//# sourceMappingURL=clear-db.js.map