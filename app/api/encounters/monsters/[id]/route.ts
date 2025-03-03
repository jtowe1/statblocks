import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid encounter monster ID' },
        { status: 400 }
      );
    }

    await prisma.encounterMonster.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing monster from encounter:', error);
    return NextResponse.json(
      { error: 'Failed to remove monster from encounter' },
      { status: 500 }
    );
  }
}