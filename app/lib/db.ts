import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

// Create database connection
export async function openDb() {
  return open({
    filename: join(process.cwd(), 'app', 'data', 'monsters.db'),
    driver: sqlite3.Database
  });
}

// Check if database needs initialization
async function needsInitialization() {
  const db = await openDb();
  try {
    const tableExists = await db.get(`
      SELECT name
      FROM sqlite_master
      WHERE type='table' AND name='monsters'
    `);

    if (!tableExists) return true;

    const count = await db.get('SELECT COUNT(*) as count FROM monsters');
    return count.count === 0;
  } finally {
    await db.close();
  }
}

// Initialize database schema
export async function initDb() {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS monsters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
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
      int TEXT NOT NULL,
      int_mod TEXT NOT NULL,
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
    const { default: seedDatabase } = await import('../../scripts/seedDb');
    await seedDatabase();
  }

  return db;
}