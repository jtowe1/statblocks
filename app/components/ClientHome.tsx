'use client';
import { useState } from "react";
import Statblock from "./Statblock";
import CreateMonsterForm from "./CreateMonsterForm";
import type { Monster } from '../lib/monsters';
import CreateEncounterForm from "./CreateEncounterForm";
import { Encounter } from '../lib/encounters';
import AddToEncounterModal from './AddToEncounterModal';

interface ClientHomeProps {
  initialMonsters: Monster[];
  initialEncounters: Encounter[];
}

export default function ClientHome({ initialMonsters, initialEncounters }: ClientHomeProps) {
  const [monsters, setMonsters] = useState<Monster[]>(initialMonsters);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImages, setShowImages] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [monsterToCopy, setMonsterToCopy] = useState<Monster | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCreateEncounter, setShowCreateEncounter] = useState(false);
  const [encounterError, setEncounterError] = useState<string | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>(initialEncounters);
  const [monsterToAdd, setMonsterToAdd] = useState<Monster | null>(null);
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const [encounterMonsters, setEncounterMonsters] = useState<Monster[]>([]);
  const [monsterToEdit, setMonsterToEdit] = useState<Monster | null>(null);

  const handleSaveMonster = async (monster: Monster) => {
    try {
      setError(null);

      // Determine if this is an edit or a new monster
      const isEdit = !!monsterToEdit;
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/monsters/${monsterToEdit.id}` : '/api/monsters';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(monster),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEdit ? 'update' : 'save'} monster`);
      }

      if (isEdit) {
        // Update the monster in the state
        setMonsters(prev => prev.map(m => m.id === data.id ? data : m));
      } else {
        // Add the new monster to the state
        setMonsters(prev => [...prev, data]);
      }

      setShowCreateForm(false);
      setMonsterToEdit(null);
    } catch (error) {
      console.error(`Error ${monsterToEdit ? 'updating' : 'saving'} monster:`, error);
      setError(error instanceof Error ? error.message : `Failed to ${monsterToEdit ? 'update' : 'save'} monster`);
    }
  };

  const handleCopyMonster = (monster: Monster) => {
    setMonsterToCopy(monster);
    setShowCreateForm(true);
  };

  const handleSaveEncounter = async (name: string) => {
    try {
      setEncounterError(null);
      const response = await fetch('/api/encounters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create encounter');
      }

      setEncounters(prev => [data, ...prev]);
      setShowCreateEncounter(false);
    } catch (error) {
      console.error('Error creating encounter:', error);
      setEncounterError(error instanceof Error ? error.message : 'Failed to create encounter');
    }
  };

  const handleAddToEncounter = (monsterId: number) => {
    const monster = monsters.find(m => m.id === monsterId);
    if (monster) {
      setMonsterToAdd(monster);
    }
  };

  const handleAddMonsterToEncounter = async (encounterId: number) => {
    if (!monsterToAdd) return;

    try {
      const response = await fetch('/api/encounters/monsters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encounterId,
          monsterId: monsterToAdd.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add monster to encounter');
      }

      setMonsterToAdd(null);
    } catch (error) {
      console.error('Error adding monster to encounter:', error);
    }
  };

  const fetchEncounterMonsters = async (encounterId: number) => {
    try {
      const response = await fetch(`/api/encounters/${encounterId}/monsters`);
      if (!response.ok) {
        throw new Error('Failed to fetch encounter monsters');
      }
      const data = await response.json();
      setEncounterMonsters(data);
    } catch (error) {
      console.error('Error fetching encounter monsters:', error);
      setEncounterMonsters([]);
    }
  };

  const handleEncounterClick = async (encounter: Encounter) => {
    setSelectedEncounter(encounter);
    await fetchEncounterMonsters(encounter.id);
  };

  const handleDeleteEncounter = async (encounterId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      const response = await fetch(`/api/encounters/${encounterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete encounter');
      }

      setEncounters(prev => prev.filter(e => e.id !== encounterId));

      if (selectedEncounter?.id === encounterId) {
        setSelectedEncounter(null);
        setEncounterMonsters([]);
      }
    } catch (error) {
      console.error('Error deleting encounter:', error);
    }
  };

  const handleRemoveFromEncounter = async (encounterMonsterId: number) => {
    try {
      const response = await fetch(`/api/encounters/monsters/${encounterMonsterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove monster from encounter');
      }

      setEncounterMonsters(prev =>
        prev.filter(m => m.encounter_monster_id !== encounterMonsterId)
      );
    } catch (error) {
      console.error('Error removing monster from encounter:', error);
    }
  };

  const handleEditMonster = (monster: Monster) => {
    setMonsterToEdit(monster);
    setShowCreateForm(true);
  };

  const filteredMonsters = monsters.filter(monster =>
    searchTerm
      ? monster.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <div className="flex">
      {/* Selected Monsters Sidebar */}
      <div className="w-64 h-screen bg-amber-50 border-r-2 border-amber-900 p-4 sticky top-0">
        <div className="space-y-4">
          <button
            className="w-full p-2 bg-amber-900 text-amber-50 rounded-lg
                       hover:bg-amber-800 transition-colors font-serif"
            onClick={() => setShowCreateEncounter(true)}
          >
            Create Encounter
          </button>
          <button
            className="w-full p-2 bg-amber-900 text-amber-50 rounded-lg
                       hover:bg-amber-800 transition-colors font-serif"
            onClick={() => setShowCreateForm(true)}
          >
            Create Monster
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl text-amber-900 font-serif mb-4">Encounters</h2>
          {encounters.length === 0 ? (
            <p className="text-amber-700 italic">No encounters created</p>
          ) : (
            <ul className="space-y-2">
              {encounters.map(encounter => (
                <li
                  key={encounter.id}
                  onClick={() => handleEncounterClick(encounter)}
                  className={`flex justify-between items-center text-amber-900
                             hover:bg-amber-100 p-2 rounded cursor-pointer
                             ${selectedEncounter?.id === encounter.id ? 'bg-amber-200' : ''}`}
                >
                  <span>{encounter.name}</span>
                  <button
                    onClick={(e) => handleDeleteEncounter(encounter.id, e)}
                    className="text-amber-700 hover:text-amber-900 px-2"
                    title="Delete Encounter"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {selectedEncounter ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl text-amber-900 font-serif">
                {selectedEncounter.name}
              </h1>
              <button
                onClick={() => setSelectedEncounter(null)}
                className="px-4 py-2 text-amber-900 border-2 border-amber-900
                         rounded hover:bg-amber-100"
              >
                Back to All Monsters
              </button>
            </div>
            {encounterMonsters.length === 0 ? (
              <p className="text-amber-700 italic">No monsters in this encounter yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start justify-items-start">
                {encounterMonsters.map((monster) => (
                  <Statblock
                    key={`${monster.id}-${monster.encounter_monster_id}`}
                    {...monster}
                    onCopy={handleCopyMonster}
                    onEdit={handleEditMonster}
                    showImages={showImages}
                    onAddToEncounter={handleAddToEncounter}
                    onRemoveFromEncounter={handleRemoveFromEncounter}
                    isInEncounter={true}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
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
              {filteredMonsters.map((monster) => (
                <Statblock
                  key={monster.id}
                  {...monster}
                  onCopy={handleCopyMonster}
                  onEdit={handleEditMonster}
                  showImages={showImages}
                  onAddToEncounter={handleAddToEncounter}
                  isInEncounter={false}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Create Monster Form Modal */}
      {showCreateForm && (
        <CreateMonsterForm
          onClose={() => {
            setShowCreateForm(false);
            setMonsterToCopy(null);
            setMonsterToEdit(null);
            setError(null);
          }}
          onSave={handleSaveMonster}
          initialData={monsterToEdit || monsterToCopy || undefined}
          isEdit={!!monsterToEdit}
          error={error}
        />
      )}

      {/* Add the CreateEncounterForm modal */}
      {showCreateEncounter && (
        <CreateEncounterForm
          onClose={() => {
            setShowCreateEncounter(false);
            setEncounterError(null);
          }}
          onSave={handleSaveEncounter}
          error={encounterError}
        />
      )}

      {/* Add the new modal */}
      {monsterToAdd && (
        <AddToEncounterModal
          monster={monsterToAdd}
          encounters={encounters}
          onClose={() => setMonsterToAdd(null)}
          onAdd={handleAddMonsterToEncounter}
        />
      )}
    </div>
  );
}