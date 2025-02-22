'use client';
import { useState } from "react";
import Statblock from "./components/Statblock";
import monsters from "./data/monsters.json";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonsters, setSelectedMonsters] = useState<Set<string>>(new Set());

  const handleToggleSelect = (monsterName: string) => {
    setSelectedMonsters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(monsterName)) {
        newSet.delete(monsterName);
      } else {
        newSet.add(monsterName);
      }
      return newSet;
    });
  };

  const filteredMonsters = monsters.filter(monster => {
    if (searchTerm) {
      // If there's a search term, only show search results
      return monster.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      // If no search term, show selected monsters or all if none selected
      return selectedMonsters.size === 0 || selectedMonsters.has(monster.name);
    }
  });

  return (
    <main className="container mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search monsters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border-2 border-amber-900 rounded-lg
                     bg-amber-50 text-amber-900 placeholder-amber-700
                     focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMonsters.map((monster, index) => (
          <Statblock
            key={index}
            {...monster}
            isSelected={selectedMonsters.has(monster.name)}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>
    </main>
  );
}
