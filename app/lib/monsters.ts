import { prisma } from './prisma';

export interface Monster {
  id?: number;
  name: string;
  meta: string;
  ArmorClass: string;
  HitPoints: string;
  Speed: string;
  STR: string;
  STR_mod: string;
  DEX: string;
  DEX_mod: string;
  CON: string;
  CON_mod: string;
  INT: string;
  INT_mod: string;
  WIS: string;
  WIS_mod: string;
  CHA: string;
  CHA_mod: string;
  Skills?: string | null;
  Senses?: string | null;
  Languages?: string | null;
  Challenge: string;
  Traits?: string | null;
  Actions?: string | null;
  img_url?: string | null;
}

export async function getMonsters(): Promise<Monster[]> {
  const monsters = await prisma.monster.findMany({
    orderBy: { name: 'asc' }
  });

  return monsters.map(monster => ({
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
}