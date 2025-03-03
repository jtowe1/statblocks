import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid encounter ID' },
        { status: 400 }
      );
    }

    await prisma.encounter.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting encounter:', error);
    return NextResponse.json(
      { error: 'Failed to delete encounter' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid encounter ID' }, { status: 400 });
    }

    const encounter = await prisma.encounter.findUnique({
      where: { id }
    });

    if (!encounter) {
      return NextResponse.json({ error: 'Encounter not found' }, { status: 404 });
    }

    return NextResponse.json(encounter);
  } catch (error) {
    console.error('Error fetching encounter:', error);
    return NextResponse.json({ error: 'Failed to fetch encounter' }, { status: 500 });
  }
}