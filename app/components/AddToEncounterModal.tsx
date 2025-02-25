import { Encounter } from '../lib/encounters';
import { Monster } from '../lib/monsters';

interface AddToEncounterModalProps {
  monster: Monster;
  encounters: Encounter[];
  onClose: () => void;
  onAdd: (encounterId: number) => void;
}

export default function AddToEncounterModal({
  monster,
  encounters,
  onClose,
  onAdd
}: AddToEncounterModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-amber-50 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl text-amber-900 font-serif mb-2">Add to Encounter</h2>
        <p className="text-amber-900 mb-4">
          Select an encounter to add <span className="font-semibold">{monster.name}</span> to:
        </p>

        {encounters.length === 0 ? (
          <p className="text-amber-700 italic mb-4">No encounters available. Create an encounter first.</p>
        ) : (
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {encounters.map(encounter => (
              <button
                key={encounter.id}
                onClick={() => onAdd(encounter.id)}
                className="w-full text-left p-3 rounded
                         bg-amber-100 hover:bg-amber-200
                         text-amber-900 transition-colors"
              >
                {encounter.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-amber-900 border-2 border-amber-900
                     rounded hover:bg-amber-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}