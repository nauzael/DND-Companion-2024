
import React, { useState, useMemo, useRef } from 'react';
import { Character, SheetTab } from '../types';
import CombatTab from './sheet/CombatTab';
import InventoryTab from './sheet/InventoryTab';
import SpellsTab from './sheet/SpellsTab';
import FeaturesTab from './sheet/FeaturesTab';
import NotesTab from './sheet/NotesTab';
import { getEffectiveCasterType } from '../utils/sheetUtils';

interface SheetTabsProps {
  character: Character;
  onBack: () => void;
  onUpdate: (char: Character) => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({ character, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('combat');
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  
  // Use refs for touch coordinates to avoid re-renders during gesture
  const touchStart = useRef<{ x: number, y: number } | null>(null);
  const touchEnd = useRef<{ x: number, y: number } | null>(null);
  const minSwipeDistance = 50;

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

  const tabs = [
    { id: 'combat', icon: 'swords', label: 'Combat' },
    { id: 'features', icon: 'stars', label: 'Feats' },
    { id: 'spells', icon: 'auto_stories', label: 'Spells', disabled: !isCaster },
    { id: 'inventory', icon: 'backpack', label: 'Bag' },
    { id: 'notes', icon: 'edit_note', label: 'Notes' },
  ];

  const handleTabChange = (newTabId: SheetTab) => {
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      const newIndex = tabs.findIndex(t => t.id === newTabId);
      
      if (currentIndex === newIndex) return;

      setSlideDirection(newIndex > currentIndex ? 'forward' : 'backward');
      setActiveTab(newTabId);
      
      // Scroll to top on tab change for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Swipe Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
    };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    
    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    
    // If vertical movement is greater than horizontal, assume scrolling and do not swipe
    if (Math.abs(distanceY) > Math.abs(distanceX)) return;

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
        const validTabs = tabs.filter(t => !t.disabled);
        const currentIndex = validTabs.findIndex(t => t.id === activeTab);
        
        if (isLeftSwipe && currentIndex < validTabs.length - 1) {
            handleTabChange(validTabs[currentIndex + 1].id as SheetTab);
        }
        
        if (isRightSwipe && currentIndex > 0) {
            handleTabChange(validTabs[currentIndex - 1].id as SheetTab);
        }
    }
  };

  return (
    <div 
        className="flex flex-col h-full min-h-screen bg-background-light dark:bg-background-dark relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-right { animation: slideInRight 0.3s ease-out forwards; }
        .animate-slide-left { animation: slideInLeft 0.3s ease-out forwards; }
      `}</style>

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

      <main className="flex-1 overflow-y-auto no-scrollbar relative overflow-x-hidden">
        <div 
            key={activeTab} // Key forces re-render to trigger animation
            className={`min-h-full ${slideDirection === 'forward' ? 'animate-slide-right' : 'animate-slide-left'}`}
        >
            {activeTab === 'combat' && <CombatTab character={character} onUpdate={onUpdate} />}
            {activeTab === 'inventory' && <InventoryTab character={character} onUpdate={onUpdate} />}
            {activeTab === 'spells' && <SpellsTab character={character} onUpdate={onUpdate} />}
            {activeTab === 'features' && <FeaturesTab character={character} />}
            {activeTab === 'notes' && <NotesTab character={character} onUpdate={onUpdate} />}
        </div>
      </main>

      {/* Floating Compact Tab Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1.5 z-40 flex items-center gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id as SheetTab)}
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
