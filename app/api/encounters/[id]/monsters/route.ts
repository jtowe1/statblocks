import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const encounterId = parseInt(params.id);

    if (isNaN(encounterId)) {
      return NextResponse.json(
        { error: 'Invalid encounter ID' },
        { status: 400 }
      );
    }

    const db = await openDb();

    try {
      const result = await db.execute(`
        SELECT
          m.id,
          m.name,
          m.meta,
          m.armor_class as ArmorClass,
          m.hit_points as HitPoints,
          m.speed as Speed,
          m.str as STR,
          m.str_mod as STR_mod,
          m.dex as DEX,
          m.dex_mod as DEX_mod,
          m.con as CON,
          m.con_mod as CON_mod,
          m.intelligence,
          m.intelligence_mod,
          m.wis as WIS,
          m.wis_mod as WIS_mod,
          m.cha as CHA,
          m.cha_mod as CHA_mod,
          m.skills as Skills,
          m.senses as Senses,
          m.languages as Languages,
          m.challenge as Challenge,
          m.traits as Traits,
          m.actions as Actions,
          m.img_url,
          em.id as encounter_monster_id
        FROM monsters m
        JOIN encounter_monsters em ON m.id = em.monster_id
        WHERE em.encounter_id = ?
        ORDER BY em.created_at ASC
      `, [encounterId]);

      // Transform the results to match the Monster interface
      const monsters = result.rows.map(monster => ({
        ...monster,
        INT: monster.intelligence,
        INT_mod: monster.intelligence_mod
      }));

      return NextResponse.json(monsters);
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Error fetching encounter monsters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch encounter monsters' },
      { status: 500 }
    );
  }
}