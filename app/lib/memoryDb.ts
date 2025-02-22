import { DatabaseConnection, DatabaseResult } from './types';
import monsters from '../data/monsters-seed-data.json';
import { RowDataPacket } from 'mysql2/promise';

type SQLParam = string | number | null;

class InMemoryDatabase {
  private data: Record<string, RowDataPacket[]> = {};
  private autoIncrementIds: Record<string, number> = {};

  constructor() {
    // Initialize monsters table with seed data
    this.data['monsters'] = monsters.map((monster, index) => {
      return {
        id: index + 1,
        name: monster.name || '',
        meta: monster.meta || '',
        armor_class: monster.ArmorClass || '',
        hit_points: monster.HitPoints || '',
        speed: monster.Speed || '',
        str: monster.STR || '',
        str_mod: monster.STR_mod || '',
        dex: monster.DEX || '',
        dex_mod: monster.DEX_mod || '',
        con: monster.CON || '',
        con_mod: monster.CON_mod || '',
        int: monster.INT || '',
        int_mod: monster.INT_mod || '',
        wis: monster.WIS || '',
        wis_mod: monster.WIS_mod || '',
        cha: monster.CHA || '',
        cha_mod: monster.CHA_mod || '',
        skills: monster.Skills || null,
        senses: monster.Senses || null,
        languages: monster.Languages || null,
        challenge: monster.Challenge || '',
        traits: monster.Traits || null,
        actions: monster.Actions || null,
        img_url: monster.img_url || null,
        constructor: { name: 'RowDataPacket' }
      } as RowDataPacket;
    });
    this.autoIncrementIds['monsters'] = monsters.length + 1;
  }

  getTable(tableName: string): RowDataPacket[] {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
      this.autoIncrementIds[tableName] = 1;
    }
    return this.data[tableName];
  }

  async execute(sql: string, params: SQLParam[] = []): Promise<DatabaseResult> {
    const trimmedSql = sql.trim().toUpperCase();

    if (trimmedSql.startsWith('CREATE TABLE')) {
      return { rows: [], affectedRows: 0 };
    }

    if (trimmedSql.startsWith('SELECT')) {
      const rows = this.getTable('monsters').map(row => ({
        ...row,
        INT: row.int,
        INT_mod: row.int_mod,
        intelligence: row.int,
        intelligence_mod: row.int_mod,
        constructor: { name: 'RowDataPacket' }
      })) as RowDataPacket[];
      return { rows };
    }

    if (trimmedSql.startsWith('INSERT')) {
      const table = this.getTable('monsters');
      const newRow = {
        id: this.autoIncrementIds['monsters']++,
        ...Object.fromEntries(
          ['name', 'meta', 'armor_class', 'hit_points', 'speed',
           'str', 'str_mod', 'dex', 'dex_mod', 'con', 'con_mod',
           'int', 'int_mod', 'wis', 'wis_mod',
           'cha', 'cha_mod', 'skills', 'senses', 'languages',
           'challenge', 'traits', 'actions', 'img_url']
          .map((key, i) => [key, params[i]])
        ),
        constructor: { name: 'RowDataPacket' }
      } as RowDataPacket;
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

export function createMemoryDb(): DatabaseConnection {
  const db = new InMemoryDatabase();
  return {
    execute: (sql: string, params?: SQLParam[]) => db.execute(sql, params),
    close: async () => {},
  };
}