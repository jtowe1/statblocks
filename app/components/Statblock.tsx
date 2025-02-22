import React from 'react';
import Image from 'next/image';

interface CreatureStats {
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
  isSelected: boolean;
  onToggleSelect: (name: string) => void;
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
    <div className="bg-amber-50 border-2 border-amber-900 p-6 font-serif h-full relative">
      <div className="absolute top-2 right-2">
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => props.onToggleSelect(props.name)}
          className="w-5 h-5 accent-amber-900"
        />
      </div>
      {/* Title Section */}
      <div className="border-b-2 border-amber-900 pb-2">
        <h1 className="text-2xl text-amber-900">{props.name}</h1>
        <p className="italic text-amber-900">{props.meta}</p>
      </div>

      {/* Stats Section */}
      <div className="py-4">
        <div className="text-amber-900">
          <p><span className="font-bold">Armor Class</span> {props.ArmorClass}</p>
          <p><span className="font-bold">Hit Points</span> {props.HitPoints}</p>
          <p><span className="font-bold">Speed</span> {props.Speed}</p>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="grid grid-cols-6 gap-2 border-y-2 border-amber-900 py-4">
        {abilities.map(({ key, label }) => (
          <div key={key} className="text-center">
            <h3 className="font-bold text-amber-900">{label}</h3>
            <p>{props[key as keyof CreatureStats]} {props[`${key}_mod` as keyof CreatureStats]}</p>
          </div>
        ))}
      </div>

      {/* Skills and Proficiencies */}
      <div className="py-4 text-amber-900">
        <p><span className="font-bold">Skills</span> {props.Skills}</p>
        <p><span className="font-bold">Senses</span> {props.Senses}</p>
        <p><span className="font-bold">Languages</span> {props.Languages}</p>
        <p><span className="font-bold">Challenge</span> {props.Challenge}</p>
      </div>

      {/* Traits */}
      <div className="py-2">
        <h2 className="text-xl text-amber-900 border-b border-amber-900 mb-2">Traits</h2>
        {props.Traits && (
          <div dangerouslySetInnerHTML={{ __html: props.Traits }} />
        )}
      </div>

      {/* Actions */}
      <div className="py-2">
        <h2 className="text-xl text-amber-900 border-b border-amber-900 mb-2">Actions</h2>
        {props.Actions && (
          <div dangerouslySetInnerHTML={{ __html: props.Actions }} />
        )}
      </div>

      {/* Optional Image */}
      {props.img_url && (
        <div className="mt-4">
          <Image
            src={props.img_url}
            alt={props.name}
            width={500}
            height={300}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default StatBlock;
