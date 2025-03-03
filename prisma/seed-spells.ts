import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    // Read the spells data from the JSON file
    const spellsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'app/data/spells-seed-data.json'), 'utf8')
    );

    console.log(`Found ${spellsData.length} spells to import.`);

    // Process spells in batches to avoid overwhelming the database
    const batchSize = 100;
    for (let i = 0; i < spellsData.length; i += batchSize) {
      const batch = spellsData.slice(i, i + batchSize);

      // Create spells in the database
      await Promise.all(
        batch.map(async (spell: any) => {
          try {
            await prisma.spell.upsert({
              where: { name: spell.spell_name },
              update: {
                ritual: spell.ritual,
                school: spell.school,
                tags: spell.tags,
                level: spell.level,
                castingTime: spell.casting_time,
                range: spell.range,
                components: spell.components,
                duration: spell.duration,
                description: spell.description,
                classes: spell.classes,
                sourceBook: spell.source_book,
              },
              create: {
                name: spell.spell_name,
                ritual: spell.ritual,
                school: spell.school,
                tags: spell.tags,
                level: spell.level,
                castingTime: spell.casting_time,
                range: spell.range,
                components: spell.components,
                duration: spell.duration,
                description: spell.description,
                classes: spell.classes,
                sourceBook: spell.source_book,
              },
            });
          } catch (error) {
            console.error(`Error importing spell ${spell.spell_name}:`, error);
          }
        })
      );

      console.log(`Imported batch ${i / batchSize + 1} (${Math.min(i + batchSize, spellsData.length)} / ${spellsData.length} spells)`);
    }

    console.log('Spells import completed successfully.');
  } catch (error) {
    console.error('Error importing spells:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });