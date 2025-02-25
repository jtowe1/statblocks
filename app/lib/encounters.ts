import { openDb } from './db';

export interface Encounter {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export async function getEncounters(): Promise<Encounter[]> {
  const db = await openDb();
  try {
    const result = await db.execute(`
      SELECT id, name, created_at, updated_at
      FROM encounters
      ORDER BY created_at DESC
    `);
    return result.rows as Encounter[];
  } finally {
    await db.close();
  }
}

export interface EncounterMonster {
  id: number;
  encounter_id: number;
  monster_id: number;
  created_at: Date;
}