import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

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

    const encounterMonster = await prisma.encounterMonster.create({
      data: {
        encounterId,
        monsterId
      },
      include: {
        monster: true
      }
    });

    const monster = encounterMonster.monster;
    return NextResponse.json({
      id: monster.id,
      name: monster.name,
      meta: monster.meta,
      ArmorClass: monster.armorClass,
      HitPoints: monster.hitPoints,
      Speed: monster.speed,
      STR: monster.str,
      STR_mod: monster.strMod,
      DEX: monster.dex,
      DEX_mod: monster.dexMod,
      CON: monster.con,
      CON_mod: monster.conMod,
      INT: monster.intelligence,
      INT_mod: monster.intelligenceMod,
      WIS: monster.wis,
      WIS_mod: monster.wisMod,
      CHA: monster.cha,
      CHA_mod: monster.chaMod,
      Skills: monster.skills,
      Senses: monster.senses,
      Languages: monster.languages,
      Challenge: monster.challenge,
      Traits: monster.traits,
      Actions: monster.actions,
      img_url: monster.imgUrl,
      encounter_monster_id: encounterMonster.id
    });
  } catch (error) {
    console.error('Error adding monster to encounter:', error);
    return NextResponse.json(
      { error: 'Failed to add monster to encounter' },
      { status: 500 }
    );
  }
}