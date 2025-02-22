import mysql from 'mysql2/promise';
import { DatabaseConnection, MySQLConnection } from './types';
import { InMemoryConnection } from './memoryDb';

// Create database connection
export async function openDb(): Promise<DatabaseConnection> {
  // Return in-memory database for build, test, or CI
  if (
    process.env.NODE_ENV === 'test' ||
    process.env.CI === 'true' ||
    (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build')
  ) {
    return new InMemoryConnection();
  }

  // Use MySQL for development/production
  const host = process.env.DB_HOST || 'localhost';
  const connection = await mysql.createConnection({
    host: host,
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

  console.log('Initializing database...');

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

  if (await needsInitialization()) {
    console.log('Database needs initialization, seeding...');
    const { default: seedDatabase } = await import('../../scripts/seedDb');
    await seedDatabase();
  } else {
    console.log('Database already initialized');
  }

  return db;
}