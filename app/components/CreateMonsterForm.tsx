import { useState } from 'react';
import type { Monster } from '../lib/monsters';

interface CreateMonsterFormProps {
  onClose: () => void;
  onSave: (monster: Monster) => void;
  initialData?: Monster;
  error?: string | null;
}

export default function CreateMonsterForm({ onClose, onSave, initialData, error }: CreateMonsterFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    meta: initialData?.meta || '',
    ArmorClass: initialData?.ArmorClass || '',
    HitPoints: initialData?.HitPoints || '',
    Speed: initialData?.Speed || '',
    STR: initialData?.STR || '',
    STR_mod: initialData?.STR_mod || '',
    DEX: initialData?.DEX || '',
    DEX_mod: initialData?.DEX_mod || '',
    CON: initialData?.CON || '',
    CON_mod: initialData?.CON_mod || '',
    INT: initialData?.INT || '',
    INT_mod: initialData?.INT_mod || '',
    WIS: initialData?.WIS || '',
    WIS_mod: initialData?.WIS_mod || '',
    CHA: initialData?.CHA || '',
    CHA_mod: initialData?.CHA_mod || '',
    Skills: initialData?.Skills || '',
    Senses: initialData?.Senses || '',
    Languages: initialData?.Languages || '',
    Challenge: initialData?.Challenge || '',
    Traits: initialData?.Traits || '',
    Actions: initialData?.Actions || '',
    img_url: initialData?.img_url || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAbilityChange = (key: string, value: string) => {
    const score = parseInt(value) || 0;
    const mod = Math.floor((score - 10) / 2);
    const modString = mod >= 0 ? `(+${mod})` : `(${mod})`;

    setFormData(prev => ({
      ...prev,
      [key]: value,
      [`${key}_mod`]: modString
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const abilities = [
    { key: 'STR', label: 'Strength', value: '16', mod: '(+3)' },
    { key: 'DEX', label: 'Dexterity', value: '12', mod: '(+1)' },
    { key: 'CON', label: 'Constitution', value: '16', mod: '(+3)' },
    { key: 'INT', label: 'Intelligence', value: '7', mod: '(-2)' },
    { key: 'WIS', label: 'Wisdom', value: '11', mod: '(+0)' },
    { key: 'CHA', label: 'Charisma', value: '10', mod: '(+0)' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-amber-50 p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl text-amber-900 font-serif mb-4">Create Monster</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-700 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-900 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Orc"
                className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
                required
              />
            </div>
            <div>
              <label className="block text-amber-900 mb-1">Meta</label>
              <input
                type="text"
                name="meta"
                value={formData.meta}
                onChange={handleChange}
                placeholder="Medium humanoid (orc), chaotic evil"
                className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-amber-900 mb-1">Armor Class</label>
              <input
                type="text"
                name="ArmorClass"
                value={formData.ArmorClass}
                onChange={handleChange}
                placeholder="13 (hide armor)"
                className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
                required
              />
            </div>
            <div>
              <label className="block text-amber-900 mb-1">Hit Points</label>
              <input
                type="text"
                name="HitPoints"
                value={formData.HitPoints}
                onChange={handleChange}
                placeholder="15 (2d8 + 6)"
                className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
                required
              />
            </div>
            <div>
              <label className="block text-amber-900 mb-1">Speed</label>
              <input
                type="text"
                name="Speed"
                value={formData.Speed}
                onChange={handleChange}
                placeholder="30 ft."
                className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
                required
              />
            </div>
          </div>

          {/* Ability Scores */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {abilities.map(({ key, label, value }) => (
              <div key={key}>
                <label className="block text-amber-900 mb-1">{label}</label>
                <input
                  type="number"
                  name={key}
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => handleAbilityChange(key, e.target.value)}
                  placeholder={value}
                  className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
                  required
                  min="1"
                  max="30"
                />
                <input
                  type="text"
                  name={`${key}_mod`}
                  value={formData[`${key}_mod` as keyof typeof formData]}
                  className="w-full mt-1 p-2 border-2 border-amber-900 rounded bg-amber-50"
                  readOnly
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-900 mb-1">Skills</label>
              <input
                type="text"
                name="Skills"
                value={formData.Skills}
                onChange={handleChange}
                placeholder="Intimidation +2"
                className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
              />
            </div>
            <div>
              <label className="block text-amber-900 mb-1">Senses</label>
              <input
                type="text"
                name="Senses"
                value={formData.Senses}
                onChange={handleChange}
                placeholder="darkvision 60 ft., passive Perception 10"
                className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
              />
            </div>
            <div>
              <label className="block text-amber-900 mb-1">Languages</label>
              <input
                type="text"
                name="Languages"
                value={formData.Languages}
                onChange={handleChange}
                placeholder="Common, Orc"
                className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
              />
            </div>
            <div>
              <label className="block text-amber-900 mb-1">Challenge Rating</label>
              <input
                type="text"
                name="Challenge"
                value={formData.Challenge}
                onChange={handleChange}
                placeholder="1/2"
                className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-900 mb-1">Traits</label>
            <textarea
              name="Traits"
              value={formData.Traits}
              onChange={handleChange}
              placeholder="<p><em><strong>Aggressive.</strong></em> As a bonus action, the orc can move up to its speed toward a hostile creature that it can see.</p>"
              className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50 h-32"
            />
          </div>

          <div>
            <label className="block text-amber-900 mb-1">Actions</label>
            <textarea
              name="Actions"
              value={formData.Actions}
              onChange={handleChange}
              placeholder="<p><em><strong>Greataxe.</strong></em> <em>Melee Weapon Attack:</em> +5 to hit, reach 5 ft., one target. <em>Hit:</em> 9 (1d12 + 3) slashing damage.</p><p><em><strong>Javelin.</strong></em> <em>Melee or Ranged Weapon Attack:</em> +5 to hit, reach 5 ft. or range 30/120 ft., one target. <em>Hit:</em> 6 (1d6 + 3) piercing damage.</p>"
              className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50 h-32"
            />
          </div>

          <div>
            <label className="block text-amber-900 mb-1">Image URL</label>
            <input
              type="text"
              name="img_url"
              value={formData.img_url}
              onChange={handleChange}
              placeholder="https://example.com/orc.png"
              className="w-full p-2 border-2 border-amber-900 rounded bg-amber-50"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-amber-900 border-2 border-amber-900 rounded hover:bg-amber-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-900 text-amber-50 rounded hover:bg-amber-800"
            >
              Create Monster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}