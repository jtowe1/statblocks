import { NextResponse } from 'next/server';
import { openDb, initDb } from '@/app/lib/db';
import type { Monster } from '@/app/lib/monsters';

export async function POST(request: Request) {
  try {
    // Initialize database first
    await initDb();

    const monster = await request.json() as Monster;
    const db = await openDb();

    try {
      const result = await db.run(`
        INSERT INTO monsters (
          name, meta, armor_class, hit_points, speed,
          str, str_mod, dex, dex_mod, con, con_mod,
          int, int_mod, wis, wis_mod, cha, cha_mod,
          skills, senses, languages, challenge,
          traits, actions, img_url
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?
        )
      `, [
        monster.name,
        monster.meta,
        monster.ArmorClass,
        monster.HitPoints,
        monster.Speed,
        monster.STR,
        monster.STR_mod,
        monster.DEX,
        monster.DEX_mod,
        monster.CON,
        monster.CON_mod,
        monster.INT,
        monster.INT_mod,
        monster.WIS,
        monster.WIS_mod,
        monster.CHA,
        monster.CHA_mod,
        monster.Skills || null,
        monster.Senses || null,
        monster.Languages || null,
        monster.Challenge,
        monster.Traits || null,
        monster.Actions || null,
        monster.img_url || null
      ]);

      return NextResponse.json({
        ...monster,
        id: result.lastID
      });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Error saving monster:', error);
    return NextResponse.json(
      { error: 'Failed to save monster' },
      { status: 500 }
    );
  }
}