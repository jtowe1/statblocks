import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { Monster } from '@/app/lib/monsters';

export async function GET(
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

    const monsters = await prisma.monster.findMany({
      where: {
        encounters: {
          some: {
            encounterId: id
          }
        }
      },
      include: {
        encounters: {
          where: {
            encounterId: id
          },
          select: {
            id: true
          }
        }
      }
    });

    const transformedMonsters = monsters.map(monster => ({
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
      encounter_monster_id: monster.encounters[0]?.id
    }));

    return NextResponse.json(transformedMonsters);
  } catch (error) {
    console.error('Error fetching monsters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monsters' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const { monsterId } = await request.json();
    if (!monsterId) {
      return NextResponse.json(
        { error: 'Monster ID is required' },
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
    const transformedMonster: Monster & { encounter_monster_id: number } = {
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
    };

    return NextResponse.json(transformedMonster);
  } catch (error) {
    console.error('Error adding monster to encounter:', error);
    return NextResponse.json(
      { error: 'Failed to add monster to encounter' },
      { status: 500 }
    );
  }
}