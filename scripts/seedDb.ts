import mysql from 'mysql2/promise';
import monsters from '../app/data/monsters-seed-data.json';

export default async function seedDatabase() {
  // Connect to MySQL without database selected
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: 3310,
    user: 'user',
    password: 'password'
  });

  try {
    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS monsters');

    // Switch to the monsters database
    await connection.query('USE monsters');

    // Create monsters table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS monsters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        meta TEXT NOT NULL,
        armor_class TEXT NOT NULL,
        hit_points TEXT NOT NULL,
        speed TEXT NOT NULL,
        str TEXT NOT NULL,
        str_mod TEXT NOT NULL,
        dex TEXT NOT NULL,
        dex_mod TEXT NOT NULL,
        con TEXT NOT NULL,
        con_mod TEXT NOT NULL,
        intelligence TEXT NOT NULL,
        intelligence_mod TEXT NOT NULL,
        wis TEXT NOT NULL,
        wis_mod TEXT NOT NULL,
        cha TEXT NOT NULL,
        cha_mod TEXT NOT NULL,
        skills TEXT,
        senses TEXT,
        languages TEXT,
        challenge TEXT NOT NULL,
        traits TEXT,
        actions TEXT,
        img_url TEXT
      )
    `);

    // Clear existing data
    await connection.query('DELETE FROM monsters');

    // Insert monsters
    for (const monster of monsters) {
      const query = `
        INSERT INTO monsters (
          name, meta, armor_class, hit_points, speed,
          str, str_mod, dex, dex_mod, con, con_mod,
          intelligence, intelligence_mod, wis, wis_mod, cha, cha_mod,
          skills, senses, languages, challenge,
          traits, actions, img_url
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?
        )
      `;

      await connection.query(query, [
        monster.name || '',
        monster.meta || '',
        monster.ArmorClass || '',
        monster.HitPoints || '',
        monster.Speed || '',
        monster.STR || '',
        monster.STR_mod || '',
        monster.DEX || '',
        monster.DEX_mod || '',
        monster.CON || '',
        monster.CON_mod || '',
        monster.INT || '',
        monster.INT_mod || '',
        monster.WIS || '',
        monster.WIS_mod || '',
        monster.CHA || '',
        monster.CHA_mod || '',
        monster.Skills || null,
        monster.Senses || null,
        monster.Languages || null,
        monster.Challenge || '',
        monster.Traits || null,
        monster.Actions || null,
        monster.img_url || null
      ]);
    }

    console.log('Database setup and seeded successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Only run directly if called from command line
if (require.main === module) {
  seedDatabase().catch(console.error);
}