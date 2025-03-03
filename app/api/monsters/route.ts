import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import type { Monster } from '@/app/lib/monsters';

export async function GET() {
  try {
    const monsters = await prisma.monster.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    // Transform the data to match your existing Monster interface
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
      img_url: monster.imgUrl
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

export async function POST(request: Request) {
  try {
    const monsterData: Monster = await request.json();

    const monster = await prisma.monster.create({
      data: {
        name: monsterData.name,
        meta: monsterData.meta,
        armorClass: monsterData.ArmorClass,
        hitPoints: monsterData.HitPoints,
        speed: monsterData.Speed,
        str: monsterData.STR,
        strMod: monsterData.STR_mod,
        dex: monsterData.DEX,
        dexMod: monsterData.DEX_mod,
        con: monsterData.CON,
        conMod: monsterData.CON_mod,
        intelligence: monsterData.INT,
        intelligenceMod: monsterData.INT_mod,
        wis: monsterData.WIS,
        wisMod: monsterData.WIS_mod,
        cha: monsterData.CHA,
        chaMod: monsterData.CHA_mod,
        skills: monsterData.Skills,
        senses: monsterData.Senses,
        languages: monsterData.Languages,
        challenge: monsterData.Challenge,
        traits: monsterData.Traits,
        actions: monsterData.Actions,
        imgUrl: monsterData.img_url
      }
    });

    const transformedMonster: Monster = {
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
      img_url: monster.imgUrl
    };

    return NextResponse.json(transformedMonster);
  } catch (error) {
    console.error('Error creating monster:', error);
    return NextResponse.json(
      { error: 'Failed to create monster' },
      { status: 500 }
    );
  }
}