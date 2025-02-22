import { Connection, RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2/promise';
import { Database } from 'sqlite';

export type SQLiteResult = {
  lastID?: number;
  changes?: number;
};

// For SELECT queries
export type MySQLSelectResult = [RowDataPacket[], FieldPacket[]];
// For INSERT/UPDATE/DELETE queries
export type MySQLModifyResult = [ResultSetHeader, FieldPacket[]];

export type DatabaseRow = RowDataPacket;

export type DatabaseResult = {
  rows: DatabaseRow[];
  insertId?: number;
  affectedRows?: number;
};

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
    const [rows] = await this.conn.execute(sql, params);
    if (Array.isArray(rows)) {
      // SELECT query
      return {
        rows: rows as RowDataPacket[],
      };
    } else {
      // INSERT/UPDATE/DELETE query
      return {
        rows: [],
        insertId: (rows as ResultSetHeader).insertId,
        affectedRows: (rows as ResultSetHeader).affectedRows,
      };
    }
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
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = await this.db.all(sql, params);
      return {
        rows: rows as DatabaseRow[],
      };
    } else {
      const result = await this.db.run(sql, params);
      return {
        rows: [],
        insertId: result.lastID,
        affectedRows: result.changes,
      };
    }
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