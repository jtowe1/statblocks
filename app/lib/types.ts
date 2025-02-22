import { Connection } from 'mysql2/promise';
import { Database } from 'sqlite';

export type DatabaseResult = [any[], any];

export interface DatabaseConnection {
  execute(sql: string, params?: any[]): Promise<DatabaseResult>;
  run?(sql: string, params?: any[]): Promise<any>;
  exec?(sql: string): Promise<void>;
  close(): Promise<void>;
}

export class MySQLConnection implements DatabaseConnection {
  private conn: Connection;

  constructor(connection: Connection) {
    this.conn = connection;
  }

  async execute(sql: string, params?: any[]): Promise<DatabaseResult> {
    return this.conn.execute(sql, params);
  }

  async close(): Promise<void> {
    return this.conn.end();
  }
}

export class SQLiteConnection implements DatabaseConnection {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async execute(sql: string, params?: any[]): Promise<DatabaseResult> {
    const result = await this.db.all(sql, params);
    return [result, null];
  }

  async run(sql: string, params?: any[]): Promise<any> {
    return this.db.run(sql, params);
  }

  async exec(sql: string): Promise<void> {
    return this.db.exec(sql);
  }

  async close(): Promise<void> {
    return this.db.close();
  }
}

// Type guard functions
export function isSQLiteConnection(db: DatabaseConnection): db is SQLiteConnection {
  return 'run' in db && 'exec' in db;
}

export function isMySQLConnection(db: DatabaseConnection): db is MySQLConnection {
  return !('run' in db) && !('exec' in db);
}