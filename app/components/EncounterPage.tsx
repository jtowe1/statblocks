'use client';

import { useState, useEffect } from 'react';
import { Monster } from '../lib/monsters';
import { Encounter } from '../lib/encounters';
import Link from 'next/link';
import Statblock from './Statblock';

interface EncounterPageProps {
  encounterId: number;
}

export default function EncounterPage({ encounterId }: EncounterPageProps) {
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);

  useEffect(() => {
    const fetchEncounter = async () => {
      try {
        // Fetch encounter details
        const encounterResponse = await fetch(`/api/encounters/${encounterId}`);
        if (!encounterResponse.ok) {
          throw new Error('Failed to fetch encounter');
        }
        const encounterData = await encounterResponse.json();
        setEncounter(encounterData);

        // Fetch monsters in the encounter
        const monstersResponse = await fetch(`/api/encounters/${encounterId}/monsters`);
        if (!monstersResponse.ok) {
          throw new Error('Failed to fetch encounter monsters');
        }
        const monstersData = await monstersResponse.json();
        setMonsters(monstersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEncounter();
  }, [encounterId]);

  const handleRemoveMonster = async (encounterMonsterId: number) => {
    try {
      const response = await fetch(`/api/encounters/monsters/${encounterMonsterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove monster from encounter');
      }

      // Update the monsters list
      setMonsters(prev => prev.filter(m => m.encounter_monster_id !== encounterMonsterId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove monster');
    }
  };

  const handleShowStatblock = (monster: Monster) => {
    setSelectedMonster(monster);
  };

  const handleCloseStatblock = () => {
    setSelectedMonster(null);
  };

  if (loading) return <div className="p-4">Loading encounter...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!encounter) return <div className="p-4">Encounter not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-amber-900">{encounter.name}</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-amber-900 text-amber-50 rounded hover:bg-amber-800"
        >
          Back to Home
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border-2 border-red-700 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-amber-50 border-2 border-amber-900 rounded-lg p-4">
        <h2 className="text-xl font-serif text-amber-900 mb-4">Monsters in this Encounter</h2>

        {monsters.length === 0 ? (
          <p className="text-amber-900">No monsters in this encounter yet.</p>
        ) : (
          <ul className="space-y-2">
            {monsters.map(monster => (
              <li
                key={monster.encounter_monster_id}
                className="flex justify-between items-center p-3 bg-amber-100 rounded hover:bg-amber-200"
              >
                <div className="flex-grow">
                  <h3
                    className="font-bold text-amber-900 cursor-pointer hover:underline"
                    onClick={() => handleShowStatblock(monster)}
                  >
                    {monster.name}
                  </h3>
                  <p className="text-sm text-amber-800">{monster.meta}</p>
                  <div className="flex space-x-4 text-sm mt-1">
                    <span>AC: {monster.ArmorClass}</span>
                    <span>HP: {monster.HitPoints}</span>
                    <span>CR: {monster.Challenge}</span>
                  </div>
                </div>
                <button
                  onClick={() => monster.encounter_monster_id && handleRemoveMonster(monster.encounter_monster_id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Statblock Modal */}
      {selectedMonster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative bg-amber-50 p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseStatblock}
              className="absolute top-2 right-2 text-amber-900 hover:text-amber-700 text-xl"
            >
              ×
            </button>
            <Statblock
              {...selectedMonster}
              isInEncounter={true}
              encounter_monster_id={selectedMonster.encounter_monster_id}
              onRemoveFromEncounter={handleRemoveMonster}
              onAddToEncounter={() => {}}
              onCopy={() => {}}
              onEdit={() => {}}
              showImage={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}