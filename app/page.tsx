import Statblock from "./components/Statblock";
import monsters from "./data/monsters.json";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {monsters.map((monster, index) => (
          <Statblock key={index} {...monster} />
        ))}
      </div>
    </main>
  );
}
