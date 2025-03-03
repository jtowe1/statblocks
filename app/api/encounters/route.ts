import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const encounters = await prisma.encounter.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(encounters);
  } catch (error) {
    console.error('Error fetching encounters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch encounters' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Encounter name is required' },
        { status: 400 }
      );
    }

    const encounter = await prisma.encounter.create({
      data: { name }
    });

    return NextResponse.json(encounter);
  } catch (error) {
    console.error('Error creating encounter:', error);
    return NextResponse.json(
      { error: 'Failed to create encounter' },
      { status: 500 }
    );
  }
}