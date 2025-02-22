import ClientHome from './components/ClientHome';
import { getMonsters } from './lib/monsters';

async function getData() {
  const monsters = await getMonsters();
  return { monsters };
}

export default async function Home() {
  const { monsters } = await getData();

  return <ClientHome initialMonsters={monsters} />;
}
