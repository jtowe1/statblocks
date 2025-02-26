import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const encounterMonsterId = parseInt(params.id);

    if (isNaN(encounterMonsterId)) {
      return NextResponse.json(
        { error: 'Invalid encounter monster ID' },
        { status: 400 }
      );
    }

    const db = await openDb();

    try {
      await db.execute(
        'DELETE FROM encounter_monsters WHERE id = ?',
        [encounterMonsterId]
      );

      return NextResponse.json({ success: true });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Error removing monster from encounter:', error);
    return NextResponse.json(
      { error: 'Failed to remove monster from encounter' },
      { status: 500 }
    );
  }
}