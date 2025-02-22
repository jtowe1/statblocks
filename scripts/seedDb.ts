import { openDb } from '../app/lib/db';
import monsters from '../app/data/monsters-seed-data.json';

export default async function seedDatabase() {
  const db = await openDb();

  try {
    // Clear existing data
    await db.exec('DELETE FROM monsters');

    // Prepare insert statement
    const stmt = await db.prepare(`
      INSERT INTO monsters (
        name, meta, armor_class, hit_points, speed,
        str, str_mod, dex, dex_mod, con, con_mod,
        int, int_mod, wis, wis_mod, cha, cha_mod,
        skills, senses, languages, challenge,
        traits, actions, img_url
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?
      )
    `);

    // Insert monsters
    for (const monster of monsters) {
      await stmt.run(
        monster.name,
        monster.meta,
        monster.ArmorClass,
        monster.HitPoints,
        monster.Speed,
        monster.STR,
        monster.STR_mod,
        monster.DEX,
        monster.DEX_mod,
        monster.CON,
        monster.CON_mod,
        monster.INT,
        monster.INT_mod,
        monster.WIS,
        monster.WIS_mod,
        monster.CHA,
        monster.CHA_mod,
        monster.Skills,
        monster.Senses,
        monster.Languages,
        monster.Challenge,
        monster.Traits,
        monster.Actions,
        monster.img_url
      );
    }

    // Finalize the statement
    await stmt.finalize();

    console.log(`Inserted ${monsters.length} monsters into the database`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await db.close();
  }
}

// Only run directly if called from command line
if (require.main === module) {
  seedDatabase().catch(console.error);
}