import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';

export async function DELETE(
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
      // The encounter_monsters entries will be automatically deleted due to ON DELETE CASCADE
      await db.execute(
        'DELETE FROM encounters WHERE id = ?',
        [encounterId]
      );

      return NextResponse.json({ success: true });
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Error deleting encounter:', error);
    return NextResponse.json(
      { error: 'Failed to delete encounter' },
      { status: 500 }
    );
  }
}