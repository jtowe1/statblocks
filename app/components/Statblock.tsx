import React from 'react';
import Image from 'next/image';

interface CreatureStats {
  id?: number;
  name: string;
  meta: string;
  ArmorClass: string;
  HitPoints: string;
  Speed: string;
  STR: string;
  STR_mod: string;
  DEX: string;
  DEX_mod: string;
  CON: string;
  CON_mod: string;
  INT: string;
  INT_mod: string;
  WIS: string;
  WIS_mod: string;
  CHA: string;
  CHA_mod: string;
  Skills?: string;
  Senses?: string;
  Languages?: string;
  Challenge: string;
  Traits?: string;
  Actions?: string;
  img_url?: string;
}

interface StatBlockProps extends CreatureStats {
  onCopy: (monster: CreatureStats) => void;
  showImages: boolean;
  onAddToEncounter: (monsterId: number) => void;
  onRemoveFromEncounter?: (encounterMonsterId: number) => void;
  encounter_monster_id?: number;
  isInEncounter?: boolean;
}

const StatBlock: React.FC<StatBlockProps> = (props) => {
  const abilities = [
    { key: 'STR', label: 'STR' },
    { key: 'DEX', label: 'DEX' },
    { key: 'CON', label: 'CON' },
    { key: 'INT', label: 'INT' },
    { key: 'WIS', label: 'WIS' },
    { key: 'CHA', label: 'CHA' },
  ];

  return (
    <div className="bg-amber-50 border-2 border-amber-900 p-3 font-serif relative">
      <div className="flex justify-end gap-2 mb-2">
        {props.isInEncounter && props.encounter_monster_id && props.onRemoveFromEncounter ? (
          <button
            onClick={() => props.onRemoveFromEncounter!(props.encounter_monster_id!)}
            className="px-2 py-1 text-sm bg-red-700 text-white rounded hover:bg-red-800"
          >
            Remove From Encounter
          </button>
        ) : (
          <button
            onClick={() => props.id && props.onAddToEncounter(props.id)}
            className="px-2 py-1 text-sm bg-amber-900 text-amber-50 rounded hover:bg-amber-800"
          >
            Add to Encounter
          </button>
        )}
        <button
          onClick={() => props.onCopy(props)}
          className="px-2 py-1 text-sm bg-amber-900 text-amber-50 rounded hover:bg-amber-800"
        >
          Copy
        </button>
      </div>

      {/* Title Section */}
      <div className="border-b-2 border-amber-900 pb-1 mb-2">
        <h1 className="text-2xl text-amber-900">{props.name}</h1>
        <p className="italic text-amber-900">{props.meta}</p>
      </div>

      {/* Image Section */}
      {props.showImages && props.img_url && (
        <div className="monster-image-container">
          <Image
            src={props.img_url}
            alt={props.name}
            width={400}
            height={400}
            className="monster-image"
          />
        </div>
      )}

      {/* Stats Section */}
      <div className="text-amber-900 space-y-0.5">
        <p><span className="font-bold">Armor Class</span> {props.ArmorClass}</p>
        <p><span className="font-bold">Hit Points</span> {props.HitPoints}</p>
        <p><span className="font-bold">Speed</span> {props.Speed}</p>
      </div>

      {/* Ability Scores */}
      <div className="grid grid-cols-6 gap-2 border-y-2 border-amber-900 py-1 my-2">
        {abilities.map(({ key, label }) => (
          <div key={key} className="text-center">
            <h3 className="font-bold text-amber-900">{label}</h3>
            <p>{props[key as keyof CreatureStats]} {props[`${key}_mod` as keyof CreatureStats]}</p>
          </div>
        ))}
      </div>

      {/* Skills and Proficiencies */}
      <div className="text-amber-900 space-y-0.5">
        {props.Skills && <p><span className="font-bold">Skills</span> {props.Skills}</p>}
        {props.Senses && <p><span className="font-bold">Senses</span> {props.Senses}</p>}
        {props.Languages && <p><span className="font-bold">Languages</span> {props.Languages}</p>}
        {props.Challenge && <p><span className="font-bold">Challenge</span> {props.Challenge}</p>}
      </div>

      {/* Traits */}
      {props.Traits && (
        <>
          <h2 className="text-xl border-b border-amber-900 mt-2">Traits</h2>
          <div
            dangerouslySetInnerHTML={{ __html: props.Traits }}
            className="text-amber-900 [&>p:last-child]:mb-0"
          />
        </>
      )}

      {/* Actions */}
      {props.Actions && (
        <>
          <h2 className="text-xl border-b border-amber-900 mt-2">Actions</h2>
          <div
            dangerouslySetInnerHTML={{ __html: props.Actions }}
            className="text-amber-900 [&>p:last-child]:mb-0"
          />
        </>
      )}
    </div>
  );
};

export default StatBlock;
