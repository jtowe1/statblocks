'use client';
import { useState } from "react";
import Statblock from "./Statblock";
import CreateMonsterForm from "./CreateMonsterForm";
import type { Monster } from '../lib/monsters';
import { PrintIcon } from "../icons/PrintIcon";
import PrintModal from "./PrintModal";

interface ClientHomeProps {
  initialMonsters: Monster[];
}

export default function ClientHome({ initialMonsters }: ClientHomeProps) {
  const [monsters, setMonsters] = useState<Monster[]>(initialMonsters);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonsters, setSelectedMonsters] = useState<Set<string>>(new Set());
  const [showImages, setShowImages] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

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

  const handleSaveMonster = async (monster: Monster) => {
    try {
      const response = await fetch('/api/monsters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(monster),
      });

      if (!response.ok) {
        throw new Error('Failed to save monster');
      }

      const savedMonster = await response.json();
      setMonsters(prev => [...prev, savedMonster]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error saving monster:', error);
      // TODO: Add error handling UI
    }
  };

  const filteredMonsters = monsters.filter(monster => {
    if (searchTerm) {
      return monster.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return selectedMonsters.size === 0 || selectedMonsters.has(monster.name);
    }
  });

  return (
    <div className="flex">
      {/* Selected Monsters Sidebar */}
      <div className="w-64 h-screen bg-amber-50 border-r-2 border-amber-900 p-4 sticky top-0">
        <button
          className="w-full mb-4 p-2 bg-amber-900 text-amber-50 rounded-lg
                     hover:bg-amber-800 transition-colors font-serif"
          onClick={() => setShowCreateForm(true)}
        >
          Create Monster
        </button>
        <div className="flex justify-between items-center border-b-2 border-amber-900 pb-2 mb-4">
          <h2 className="text-xl text-amber-900 font-serif">Selected Monsters</h2>
          {selectedMonsters.size > 0 && (
            <button
              onClick={() => setShowPrintModal(true)}
              className="text-amber-900 hover:text-amber-700"
              title="Print Selected Monsters"
            >
              <PrintIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        {selectedMonsters.size === 0 ? (
          <p className="text-amber-700 italic">No monsters selected</p>
        ) : (
          <ul className="space-y-2">
            {Array.from(selectedMonsters).map(name => (
              <li
                key={name}
                className="flex justify-between items-center text-amber-900 hover:bg-amber-100 p-2 rounded"
              >
                <span>{name}</span>
                <button
                  onClick={() => handleToggleSelect(name)}
                  className="text-amber-700 hover:text-amber-900"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search monsters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-2 border-amber-900 rounded-lg
                       bg-amber-50 text-amber-900 placeholder-amber-700
                       focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
          <div className="flex items-center">
            <label className="flex items-center text-amber-900 cursor-pointer">
              <input
                type="checkbox"
                checked={showImages}
                onChange={(e) => setShowImages(e.target.checked)}
                className="mr-2 w-4 h-4 accent-amber-900"
              />
              Show Images
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start justify-items-start">
          {filteredMonsters.map((monster, index) => (
            <Statblock
              key={index}
              {...monster}
              isSelected={selectedMonsters.has(monster.name)}
              onToggleSelect={handleToggleSelect}
              showImages={showImages}
            />
          ))}
        </div>
      </main>

      {/* Create Monster Form Modal */}
      {showCreateForm && (
        <CreateMonsterForm
          onClose={() => setShowCreateForm(false)}
          onSave={handleSaveMonster}
        />
      )}

      {showPrintModal && (
        <PrintModal
          monsters={monsters}
          selectedMonsters={selectedMonsters}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}