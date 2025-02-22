import mysql from 'mysql2/promise';

async function setupDatabase() {
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

    console.log('Database and table created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

setupDatabase().catch(console.error);