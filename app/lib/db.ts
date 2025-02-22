import mysql from 'mysql2/promise';
import { DatabaseConnection, MySQLConnection } from './types';

// Create database connection
export async function openDb(): Promise<DatabaseConnection> {
  // // Return in-memory database for test, build, or CI
  // if (
  //   process.env.NODE_ENV === 'test' ||
  //   process.env.CI === 'true' ||
  //   (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build')
  // ) {
  //   return createMemoryDb();
  // }

  // Use MySQL for development/production
  const host = process.env.DB_HOST || 'localhost';
  const connection = await mysql.createConnection({
    host: host,
    port: 3310,
    user: 'user',
    password: 'password',
    database: 'monsters'
  });
  return new MySQLConnection(connection);
}

// Check if database needs initialization
async function needsInitialization() {
  const db = await openDb();
  try {
    const result = await db.execute(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'monsters'
      AND table_name = 'monsters'
    `);

    if (!result.rows[0]?.count) return true;

    const countResult = await db.execute('SELECT COUNT(*) as count FROM monsters');
    return countResult.rows[0]?.count === 0;
  } finally {
    await db.close();
  }
}

// Initialize database schema
export async function initDb() {
  const db = await openDb();

  console.log('Checking database schema...');

  try {
    // Create table if it doesn't exist
    await db.execute(`
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

    // Only check for seeding during development or test
    if (process.env.NODE_ENV !== 'production') {
      const needsSeed = await needsInitialization();
      if (needsSeed) {
        console.log('Database needs seeding...');
        const seedDatabase = await import('../../scripts/seedDb');
        await seedDatabase.default();
      } else {
        console.log('Database already contains data');
      }
    }
  } finally {
    await db.close();
  }
}