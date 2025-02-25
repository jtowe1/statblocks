import ClientHome from './components/ClientHome';
import { getMonsters } from './lib/monsters';
import { getEncounters } from './lib/encounters';

async function getData() {
  try {
    const [monsters, encounters] = await Promise.all([
      getMonsters(),
      getEncounters()
    ]);
    return { monsters, encounters };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { monsters: [], encounters: [] };
  }
}

export default async function Home() {
  const { monsters, encounters } = await getData();
  return <ClientHome initialMonsters={monsters} initialEncounters={encounters} />;
}

// Mark this page as dynamic to prevent static optimization
export const dynamic = 'force-dynamic';
