import { NextResponse } from 'next/server';
import { openDb } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Encounter name is required' },
        { status: 400 }
      );
    }

    const db = await openDb();

    try {
      const result = await db.execute(
        'INSERT INTO encounters (name) VALUES (?)',
        [name]
      );

      return NextResponse.json({
        id: result.insertId,
        name,
        created_at: new Date(),
        updated_at: new Date()
      });
    } catch (error: unknown) {
      // Handle specific MySQL errors if needed
      throw error;
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('Error creating encounter:', error);
    return NextResponse.json(
      { error: 'Failed to create encounter' },
      { status: 500 }
    );
  }
}