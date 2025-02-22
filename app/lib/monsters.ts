import { openDb, initDb } from './db';

export interface Monster {
  name: string;
  meta: string;
  ArmorClass: string;
  HitPoints: string;
  Speed: string;
  STR: string;
  STR_mod: string;
  DEX: string;
  DEX_mod: string;
  CON: string;
  CON_mod: string;
  INT: string;
  INT_mod: string;
  WIS: string;
  WIS_mod: string;
  CHA: string;
  CHA_mod: string;
  Skills?: string;
  Senses?: string;
  Languages?: string;
  Challenge: string;
  Traits?: string;
  Actions?: string;
  img_url?: string;
}

export async function getMonsters(): Promise<Monster[]> {
  await initDb();

  const db = await openDb();
  try {
    const [rows] = await db.execute(`
      SELECT
        id,
        name,
        meta,
        armor_class as ArmorClass,
        hit_points as HitPoints,
        speed as Speed,
        str as STR,
        str_mod as STR_mod,
        dex as DEX,
        dex_mod as DEX_mod,
        con as CON,
        con_mod as CON_mod,
        intelligence as \`INT\`,
        intelligence_mod as \`INT_mod\`,
        wis as WIS,
        wis_mod as WIS_mod,
        cha as CHA,
        cha_mod as CHA_mod,
        skills as Skills,
        senses as Senses,
        languages as Languages,
        challenge as Challenge,
        traits as Traits,
        actions as Actions,
        img_url
      FROM monsters
      ORDER BY name ASC
    `);

    return rows as Monster[];
  } catch (error) {
    console.error('Error fetching monsters:', error);
    throw error;
  } finally {
    await db.end();
  }
}