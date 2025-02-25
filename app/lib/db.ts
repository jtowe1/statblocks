import mysql from 'mysql2/promise';
import { DatabaseConnection, MySQLConnection } from './types';

// Create database connection
export async function openDb(): Promise<DatabaseConnection> {
  // Use MySQL for development/production
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.CI === 'true' ? 3310 : 3306;

  const connection = await mysql.createConnection({
    host: host,
    port: port,
    user: 'user',
    password: 'password',
    database: 'monsters'
  });
  return new MySQLConnection(connection);
}
