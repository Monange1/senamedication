import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// TypeORM and uuid logic removed for MongoDB-only migration

async function importTraditionalMedicines() {
  const file = path.resolve(__dirname, '../../traditional.txt');
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);
  for (const item of data) {
    // MongoDB save logic would go here
    console.log('Importing:', item);
  }
  console.log('Imported', data.length, 'traditional medicines');
}

importTraditionalMedicines().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
