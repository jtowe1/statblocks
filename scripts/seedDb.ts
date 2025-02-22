import { openDb } from '../app/lib/db';
import monsters from '../app/data/monsters-seed-data.json';

export default async function seedDatabase() {
  const db = await openDb();
  const isSqlite = process.env.NODE_ENV === 'test';

  try {
    // Clear existing data
    if (isSqlite) {
      await db.exec('DELETE FROM monsters');
    } else {
      await db.execute('DELETE FROM monsters');
    }

    // Insert monsters
    for (const monster of monsters) {
      const query = `
        INSERT INTO monsters (
          name, meta, armor_class, hit_points, speed,
          str, str_mod, dex, dex_mod, con, con_mod,
          ${isSqlite ? 'int' : 'intelligence'}, ${isSqlite ? 'int_mod' : 'intelligence_mod'},
          wis, wis_mod, cha, cha_mod,
          skills, senses, languages, challenge,
          traits, actions, img_url
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?
        )
      `;

      if (isSqlite) {
        await db.run(query, [
          monster.name || '',
          monster.meta || '',
          monster.ArmorClass || '',
          monster.HitPoints || '',
          monster.Speed || '',
          monster.STR || '',
          monster.STR_mod || '',
          monster.DEX || '',
          monster.DEX_mod || '',
          monster.CON || '',
          monster.CON_mod || '',
          monster.INT || '',
          monster.INT_mod || '',
          monster.WIS || '',
          monster.WIS_mod || '',
          monster.CHA || '',
          monster.CHA_mod || '',
          monster.Skills || null,
          monster.Senses || null,
          monster.Languages || null,
          monster.Challenge || '',
          monster.Traits || null,
          monster.Actions || null,
          monster.img_url || null
        ]);
      } else {
        await db.execute(query, [
          monster.name || '',
          monster.meta || '',
          monster.ArmorClass || '',
          monster.HitPoints || '',
          monster.Speed || '',
          monster.STR || '',
          monster.STR_mod || '',
          monster.DEX || '',
          monster.DEX_mod || '',
          monster.CON || '',
          monster.CON_mod || '',
          monster.INT || '',
          monster.INT_mod || '',
          monster.WIS || '',
          monster.WIS_mod || '',
          monster.CHA || '',
          monster.CHA_mod || '',
          monster.Skills || null,
          monster.Senses || null,
          monster.Languages || null,
          monster.Challenge || '',
          monster.Traits || null,
          monster.Actions || null,
          monster.img_url || null
        ]);
      }
    }

    console.log(`Inserted ${monsters.length} monsters into the database`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    if (isSqlite) {
      await db.close();
    } else {
      await (db as any).end();
    }
  }
}

// Only run directly if called from command line
if (require.main === module) {
  seedDatabase().catch(console.error);
}