import ClientHome from './components/ClientHome';
import { getMonsters } from './lib/monsters';

async function getData() {
  try {
    const monsters = await getMonsters();
    return { monsters };
  } catch (error) {
    console.error('Error fetching monsters:', error);
    return { monsters: [] };
  }
}

export default async function Home() {
  const { monsters } = await getData();
  return <ClientHome initialMonsters={monsters} />;
}

// Mark this page as dynamic to prevent static optimization
export const dynamic = 'force-dynamic';
