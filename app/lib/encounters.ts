import { prisma } from './prisma';

export interface Encounter {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export async function getEncounters(): Promise<Encounter[]> {
  const encounters = await prisma.encounter.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return encounters.map(encounter => ({
    id: encounter.id,
    name: encounter.name,
    created_at: encounter.createdAt,
    updated_at: encounter.updatedAt
  }));
}

export interface EncounterMonster {
  id: number;
  encounter_id: number;
  monster_id: number;
  created_at: Date;
}