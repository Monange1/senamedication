require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Client } = require('pg');
const translate = require('@vitalets/google-translate-api');

const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

async function translateRemedies() {
  await client.connect();
  const res = await client.query('SELECT id, scientific_name, uses FROM traditional_medicines WHERE amharic_name IS NULL OR amharic_uses IS NULL');
  for (const row of res.rows) {
    try {
      const amName = row.scientific_name ? (await translate(row.scientific_name, { to: 'am' })).text : null;
      const amUses = row.uses ? (await translate(row.uses, { to: 'am' })).text : null;
      await client.query(
        'UPDATE traditional_medicines SET amharic_name = $1, amharic_uses = $2 WHERE id = $3',
        [amName, amUses, row.id]
      );
      console.log(`Translated ID ${row.id}`);
    } catch (err) {
      console.error(`Failed to translate ID ${row.id}:`, err.message);
    }
  }
  await client.end();
  console.log('Translation complete.');
}

translateRemedies(); 