import { Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { Database } from 'sqlite';

export type SQLiteResult = {
  lastID?: number;
  changes?: number;
};

export type MySQLResult = ResultSetHeader;
export type DatabaseRow = RowDataPacket;

export type DatabaseResult = [DatabaseRow[], MySQLResult | null];

export interface DatabaseConnection {
  execute(sql: string, params?: (string | number | null)[]): Promise<DatabaseResult>;
  run?(sql: string, params?: (string | number | null)[]): Promise<SQLiteResult>;
  exec?(sql: string): Promise<void>;
  close(): Promise<void>;
}

export class MySQLConnection implements DatabaseConnection {
  private conn: Connection;

  constructor(connection: Connection) {
    this.conn = connection;
  }

  async execute(sql: string, params?: (string | number | null)[]): Promise<DatabaseResult> {
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

  async execute(sql: string, params?: (string | number | null)[]): Promise<DatabaseResult> {
    const result = await this.db.all(sql, params);
    return [result as DatabaseRow[], null];
  }

  async run(sql: string, params?: (string | number | null)[]): Promise<SQLiteResult> {
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