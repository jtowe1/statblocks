import ClientHome from './components/ClientHome';
import { getMonsters } from './lib/monsters';

async function getData() {
  console.log('getData: Starting...');
  try {
    const monsters = await getMonsters();
    console.log('getData: Got monsters:', monsters.length);
    return { monsters };
  } catch (error) {
    console.error('Error fetching monsters:', error);
    return { monsters: [] };
  }
}

export default async function Home() {
  console.log('Home: Starting...');
  const { monsters } = await getData();
  console.log('Home: Rendering with', monsters.length, 'monsters');
  return <ClientHome initialMonsters={monsters} />;
}

// Mark this page as dynamic to prevent static optimization
export const dynamic = 'force-dynamic';
