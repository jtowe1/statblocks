import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';

interface RequestBody {
  encounterId: number;
  monsterId: number;
}

export async function POST(request: Request) {
  try {
    const { encounterId, monsterId } = await request.json() as RequestBody;

    if (!encounterId || !monsterId) {
      return NextResponse.json(
        { error: 'Encounter ID and Monster ID are required' },
        { status: 400 }
      );
    }

    const db = await openDb();

    try {
      // First verify that both the encounter and monster exist
      const [encounterResult, monsterResult] = await Promise.all([
        db.execute('SELECT id FROM encounters WHERE id = ?', [encounterId]),
        db.execute('SELECT id FROM monsters WHERE id = ?', [monsterId])
      ]);

      if (!encounterResult.rows.length) {
        return NextResponse.json(
          { error: 'Encounter not found' },
          { status: 404 }
        );
      }

      if (!monsterResult.rows.length) {
        return NextResponse.json(
          { error: 'Monster not found' },
          { status: 404 }
        );
      }

      // Add the monster to the encounter
      const result = await db.execute(
        'INSERT INTO encounter_monsters (encounter_id, monster_id) VALUES (?, ?)',
        [encounterId, monsterId]
      );

      return NextResponse.json({
        id: result.insertId,
        encounter_id: encounterId,
        monster_id: monsterId,
        created_at: new Date()
      });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Error adding monster to encounter:', error);
    return NextResponse.json(
      { error: 'Failed to add monster to encounter' },
      { status: 500 }
    );
  }
}