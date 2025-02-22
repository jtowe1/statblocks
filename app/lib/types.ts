import { Connection, RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2/promise';

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