import { PrismaClient } from '@prisma/client';
import monsters from '../app/data/monsters-seed-data.json';
import './seed-spells';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.encounterMonster.deleteMany();
  await prisma.encounter.deleteMany();
  await prisma.monster.deleteMany();

  // Insert monsters
  for (const monster of monsters) {
    await prisma.monster.create({
      data: {
        name: monster.name || '',
        meta: monster.meta || '',
        armorClass: monster.ArmorClass || '',
        hitPoints: monster.HitPoints || '',
        speed: monster.Speed || '',
        str: monster.STR || '',
        strMod: monster.STR_mod || '',
        dex: monster.DEX || '',
        dexMod: monster.DEX_mod || '',
        con: monster.CON || '',
        conMod: monster.CON_mod || '',
        intelligence: monster.INT || '',
        intelligenceMod: monster.INT_mod || '',
        wis: monster.WIS || '',
        wisMod: monster.WIS_mod || '',
        cha: monster.CHA || '',
        chaMod: monster.CHA_mod || '',
        skills: monster.Skills || null,
        senses: monster.Senses || null,
        languages: monster.Languages || null,
        challenge: monster.Challenge || '',
        traits: monster.Traits || null,
        actions: monster.Actions || null,
        imgUrl: monster.img_url || null,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });