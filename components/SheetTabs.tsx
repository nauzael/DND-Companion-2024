
import React, { useState, useMemo } from 'react';
import { Character, SheetTab } from '../types';
import CombatTab from './sheet/CombatTab';
import InventoryTab from './sheet/InventoryTab';
import SpellsTab from './sheet/SpellsTab';
import FeaturesTab from './sheet/FeaturesTab';

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

  // Effective Caster Type
  const effectiveCasterType = useMemo(() => {
      if (character.class === 'Warlock') return 'pact';
      if (['Cleric', 'Druid', 'Bard', 'Sorcerer', 'Wizard'].includes(character.class)) return 'full';
      if (['Paladin', 'Ranger'].includes(character.class)) return 'half';
      if (['Eldritch Knight', 'Arcane Trickster'].includes(character.subclass || '')) return 'third';
      return 'none';
  }, [character.class, character.subclass]);

  const isCaster = effectiveCasterType !== 'none' || !!magicInitiateType;

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

      <main className="flex-1 overflow-y-auto no-scrollbar relative pb-24">
        {activeTab === 'combat' && <CombatTab character={character} onUpdate={onUpdate} />}
        {activeTab === 'inventory' && <InventoryTab character={character} onUpdate={onUpdate} />}
        {activeTab === 'spells' && <SpellsTab character={character} onUpdate={onUpdate} />}
        {activeTab === 'features' && <FeaturesTab character={character} />}
      </main>

      {/* Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#1E293B]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 pb-6 pt-3 px-2 z-40 max-w-md mx-auto">
        <div className="flex justify-around items-center w-full">
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
              className={`flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-2xl transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'text-primary bg-primary/10' 
                    : tab.disabled 
                        ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40' 
                        : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] transition-transform duration-200 ${activeTab === tab.id ? 'fill-current scale-110' : ''}`}>{tab.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider leading-none">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SheetTabs;
