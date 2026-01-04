
import React, { useState, useMemo } from 'react';
import { Character, SheetTab } from '../types';
import CombatTab from './sheet/CombatTab';
import InventoryTab from './sheet/InventoryTab';
import SpellsTab from './sheet/SpellsTab';
import FeaturesTab from './sheet/FeaturesTab';
import { getEffectiveCasterType } from '../utils/sheetUtils';

interface SheetTabsProps {
  character: Character;
  onBack: () => void;
  onUpdate: (char: Character) => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({ character, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('combat');

  // Magic Initiate Detection
  const magicInitiateType = useMemo(() => {
      const feats = character.feats || [];
      if (feats.some(f => f.includes('Magic Initiate (Cleric)'))) return 'Cleric';
      if (feats.some(f => f.includes('Magic Initiate (Druid)'))) return 'Druid';
      if (feats.some(f => f.includes('Magic Initiate (Wizard)'))) return 'Wizard';
      return null;
  }, [character.feats]);

  const effectiveCasterType = useMemo(() => getEffectiveCasterType(character), [character]);

  const isCaster = effectiveCasterType !== 'none' || !!magicInitiateType || (character.preparedSpells && character.preparedSpells.length > 0);

  return (
    <div className="flex flex-col h-full min-h-screen bg-background-light dark:bg-background-dark relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">{character.name}</h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Lvl {character.level} {character.class}</p>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        {activeTab === 'combat' && <CombatTab character={character} onUpdate={onUpdate} />}
        {activeTab === 'inventory' && <InventoryTab character={character} onUpdate={onUpdate} />}
        {activeTab === 'spells' && <SpellsTab character={character} onUpdate={onUpdate} />}
        {activeTab === 'features' && <FeaturesTab character={character} />}
      </main>

      {/* Floating Compact Tab Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1.5 z-40 flex items-center gap-1.5">
          {[
            { id: 'combat', icon: 'swords', label: 'Combat' },
            { id: 'features', icon: 'stars', label: 'Feats' },
            { id: 'spells', icon: 'auto_stories', label: 'Spells', disabled: !isCaster },
            { id: 'inventory', icon: 'backpack', label: 'Bag' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id as SheetTab)}
              disabled={tab.disabled}
              className={`flex items-center justify-center gap-2 h-11 rounded-full transition-all duration-300 overflow-hidden ${
                  activeTab === tab.id 
                    ? 'text-white bg-primary shadow-lg shadow-primary/25 px-5' 
                    : `text-slate-400 dark:text-slate-500 w-11 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-slate-300 ${tab.disabled ? 'opacity-30 cursor-not-allowed' : ''}`
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] shrink-0 ${activeTab === tab.id ? 'animate-bounce-subtle' : ''}`}>{tab.icon}</span>
              {activeTab === tab.id && (
                  <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap">{tab.label}</span>
              )}
            </button>
          ))}
      </div>
    </div>
  );
};

export default SheetTabs;
