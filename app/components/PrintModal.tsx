import { Monster } from '../lib/monsters';
import Statblock from './Statblock';

interface PrintModalProps {
  monsters: Monster[];
  selectedMonsters: Set<string>;
  onClose: () => void;
}

export default function PrintModal({ monsters, selectedMonsters, onClose }: PrintModalProps) {
  const selectedMonsterData = monsters.filter(m => selectedMonsters.has(m.name));
  console.log(selectedMonsterData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto print-modal">
        <div className="flex justify-between items-center mb-4 no-print">
          <h2 className="text-2xl text-amber-900 font-serif">Print Preview ({selectedMonsterData.length} monsters)</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-amber-900 text-amber-50 rounded hover:bg-amber-800"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-amber-900 border-2 border-amber-900 rounded hover:bg-amber-100"
            >
              Close
            </button>
          </div>
        </div>

        <div className="print-content">
          {selectedMonsterData.map((monster) => (
            <div key={monster.name} className="page-break">
              <Statblock
                {...monster}
                isSelected={false}
                onToggleSelect={() => {}}
                onCopy={() => {}}
                showImages={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}