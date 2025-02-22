import { DatabaseConnection, DatabaseResult, DatabaseRow } from './types';

type SQLParam = string | number | null;

class InMemoryDatabase {
  private data: Record<string, DatabaseRow[]> = {};
  private autoIncrementIds: Record<string, number> = {};

  getTable(tableName: string): DatabaseRow[] {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
      this.autoIncrementIds[tableName] = 1;
    }
    return this.data[tableName];
  }

  execute(sql: string, params: SQLParam[] = []): DatabaseResult {
    const trimmedSql = sql.trim().toUpperCase();

    if (trimmedSql.startsWith('CREATE TABLE')) {
      return { rows: [], affectedRows: 0 };
    }

    if (trimmedSql.startsWith('SELECT')) {
      return { rows: this.getTable('monsters') };
    }

    if (trimmedSql.startsWith('INSERT')) {
      const table = this.getTable('monsters');
      const newRow = {
        id: this.autoIncrementIds['monsters']++,
        ...Object.fromEntries(
          ['name', 'meta', 'armor_class', 'hit_points', 'speed',
           'str', 'str_mod', 'dex', 'dex_mod', 'con', 'con_mod',
           'intelligence', 'intelligence_mod', 'wis', 'wis_mod',
           'cha', 'cha_mod', 'skills', 'senses', 'languages',
           'challenge', 'traits', 'actions', 'img_url']
          .map((key, i) => [key, params[i]])
        )
      } as DatabaseRow;
      table.push(newRow);
      return {
        rows: [],
        insertId: newRow.id,
        affectedRows: 1
      };
    }

    if (trimmedSql.startsWith('DELETE')) {
      this.data['monsters'] = [];
      return { rows: [], affectedRows: 0 };
    }

    return { rows: [], affectedRows: 0 };
  }
}

export class InMemoryConnection implements DatabaseConnection {
  private db: InMemoryDatabase;

  constructor() {
    this.db = new InMemoryDatabase();
  }

  async execute(sql: string, params?: SQLParam[]): Promise<DatabaseResult> {
    return this.db.execute(sql, params || []);
  }

  async close(): Promise<void> {}
}