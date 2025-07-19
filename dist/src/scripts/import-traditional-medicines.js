"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
async function importTraditionalMedicines() {
    const file = path.resolve(__dirname, '../../traditional.txt');
    const raw = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(raw);
    for (const item of data) {
        console.log('Importing:', item);
    }
    console.log('Imported', data.length, 'traditional medicines');
}
importTraditionalMedicines().catch((err) => {
    console.error('Import failed:', err);
    process.exit(1);
});
//# sourceMappingURL=import-traditional-medicines.js.map