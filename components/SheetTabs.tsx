import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Character, SheetTab, Ability } from '../types';
import CombatTab from './sheet/CombatTab';
import InventoryTab from './sheet/InventoryTab';
import SpellsTab from './sheet/SpellsTab';
import FeaturesTab from './sheet/FeaturesTab';
import NotesTab from './sheet/NotesTab';
import { getEffectiveCasterType, getFinalStats } from '../utils/sheetUtils';
import { HIT_DIE, CLASS_PROGRESSION, SUBCLASS_OPTIONS } from '../Data/characterOptions';
import { FEAT_OPTIONS, GENERIC_FEATURES } from '../Data/feats';

interface SheetTabsProps {
  character: Character;
  onBack: () => void;
  onUpdate: (char: Character) => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({ character, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('combat');
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const mainScrollRef = useRef<HTMLDivElement>(null);
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [manualHpGain, setManualHpGain] = useState<string>('');
  
  const [pendingSubclass, setPendingSubclass] = useState<string>('');
  const [pendingAsiType, setPendingAsiType] = useState<'stat' | 'feat'>('stat');
  const [pendingStat1, setPendingStat1] = useState<Ability>('STR');
  const [pendingStat2, setPendingStat2] = useState<Ability>('STR');
  const [pendingFeat, setPendingFeat] = useState<string>('');

  const touchStart = useRef<{ x: number, y: number } | null>(null);
  const touchEnd = useRef<{ x: number, y: number } | null>(null);
  const minSwipeDistance = 50;

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
      
      if (mainScrollRef.current) {
          mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

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

  const initiateLevelUp = () => {
      if (character.level >= 20) {
          alert("¡Has alcanzado el nivel máximo (20)!");
          return;
      }
      
      const stats = getFinalStats(character);
      const conMod = Math.floor(((stats.CON || 10) - 10) / 2);
      const hitDie = HIT_DIE[character.class] || 8;
      
      const isDraconic = character.subclass === 'Draconic Sorcery';
      const draconicBonus = isDraconic ? 1 : 0;

      const avgGain = Math.floor(hitDie / 2) + 1;
      const totalGain = Math.max(1, avgGain + conMod + draconicBonus);
      
      setManualHpGain(totalGain.toString());
      setPendingSubclass('');
      setPendingAsiType('stat');
      setPendingFeat('');
      setPendingStat1('STR');
      setPendingStat2('DEX');
      
      setShowLevelUp(true);
  };

  const nextLevel = character.level + 1;
  const newFeatures = CLASS_PROGRESSION[character.class]?.[nextLevel] || [];
  
  const needsSubclass = !character.subclass && newFeatures.some(f => f.includes('Subclass'));
  const needsAsi = newFeatures.includes('Ability Score Improvement');

  const confirmLevelUp = () => {
      const hpGain = parseInt(manualHpGain) || 0;
      const newProf = Math.ceil(1 + (nextLevel / 4));

      let retroactiveHp = 0;
      if (needsSubclass && pendingSubclass === 'Draconic Sorcery') {
          retroactiveHp = nextLevel; 
      }

      let updatedChar = {
          ...character,
          level: nextLevel,
          profBonus: newProf,
          hp: {
              ...character.hp,
              max: character.hp.max + hpGain + retroactiveHp,
              current: character.hp.current + hpGain + retroactiveHp 
          }
      };

      if (needsSubclass && pendingSubclass) {
          updatedChar.subclass = pendingSubclass;
      }

      if (needsAsi) {
          if (pendingAsiType === 'feat' && pendingFeat) {
              updatedChar.feats = [...(updatedChar.feats || []), pendingFeat];
          } else {
              const newStats = { ...updatedChar.stats };
              newStats[pendingStat1] = (newStats[pendingStat1] || 10) + 1;
              newStats[pendingStat2] = (newStats[pendingStat2] || 10) + 1;
              if (newStats[pendingStat1] > 20) newStats[pendingStat1] = 20;
              if (newStats[pendingStat2] > 20) newStats[pendingStat2] = 20;
              
              updatedChar.stats = newStats;
          }
      }

      onUpdate(updatedChar);
      setShowLevelUp(false);
  };

  const isLevelUpValid = () => {
      if (needsSubclass && !pendingSubclass) return false;
      if (needsAsi && pendingAsiType === 'feat' && !pendingFeat) return false;
      return true;
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

      <div className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-4 py-3 flex items-center justify-between pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">{character.name}</h2>
          <div className="flex items-center justify-center gap-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Lvl {character.level} {character.class}</p>
              {character.level < 20 && (
                  <button 
                    onClick={initiateLevelUp}
                    className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white transition-all"
                    title="Subir de Nivel"
                  >
                      <span className="material-symbols-outlined text-[14px] font-bold">arrow_upward</span>
                  </button>
              )}
          </div>
        </div>
        <div className="w-10"></div>
      </div>

      <main 
        ref={mainScrollRef}
        className="flex-1 overflow-y-auto no-scrollbar relative overflow-x-hidden"
      >
        <div 
            key={activeTab} 
            className={`min-h-full ${slideDirection === 'forward' ? 'animate-slide-right' : 'animate-slide-left'}`}
        >
            {activeTab === 'combat' && <CombatTab character={character} onUpdate={onUpdate} />}
            {activeTab === 'inventory' && <InventoryTab character={character} onUpdate={onUpdate} />}
            {activeTab === 'spells' && <SpellsTab character={character} onUpdate={onUpdate} />}
            {activeTab === 'features' && <FeaturesTab character={character} />}
            {activeTab === 'notes' && <NotesTab character={character} onUpdate={onUpdate} />}
        </div>
      </main>

      <div className="fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom))] left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1.5 z-40 flex items-center gap-1.5">
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

      {showLevelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>
                  
                  <div className="text-center mb-4 shrink-0">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-3 border-4 border-white dark:border-surface-dark shadow-lg">
                          <span className="material-symbols-outlined text-3xl">arrow_upward</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">¡Subida de Nivel!</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          Nivel <span className="text-slate-900 dark:text-white">{character.level}</span> <span className="material-symbols-outlined text-[10px] align-middle px-1">arrow_forward</span> <span className="text-green-500">{nextLevel}</span>
                      </p>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5">
                      <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Aumento de HP Máximo</label>
                          <div className="flex items-center justify-center gap-4">
                              <button 
                                  onClick={() => setManualHpGain(String(Math.max(1, parseInt(manualHpGain || '0') - 1)))}
                                  className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
                              >
                                  <span className="material-symbols-outlined">remove</span>
                              </button>
                              <input 
                                  type="number" 
                                  value={manualHpGain}
                                  onChange={(e) => setManualHpGain(e.target.value)}
                                  className="w-20 text-center bg-transparent text-3xl font-bold text-slate-900 dark:text-white outline-none border-b-2 border-slate-300 focus:border-green-500 transition-colors"
                              />
                              <button 
                                  onClick={() => setManualHpGain(String(parseInt(manualHpGain || '0') + 1))}
                                  className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
                              >
                                  <span className="material-symbols-outlined">add</span>
                              </button>
                          </div>
                          <p className="text-[10px] text-center text-slate-400 mt-2">
                              Sugerido: {Math.floor((HIT_DIE[character.class] || 8) / 2) + 1} (Media) + {Math.floor(((getFinalStats(character).CON || 10) - 10) / 2)} (CON) {character.subclass === 'Draconic Sorcery' ? '+ 1 (Linaje)' : ''}
                          </p>
                      </div>

                      {Math.ceil(1 + (nextLevel / 4)) > character.profBonus && (
                          <div className="flex items-center justify-center gap-2 text-sm font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/10 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/20">
                              <span className="material-symbols-outlined text-lg">school</span>
                              <span>¡Bono de Competencia +{Math.ceil(1 + (nextLevel / 4))}!</span>
                          </div>
                      )}

                      {newFeatures.length > 0 && (
                          <div className="space-y-2">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nuevos Rasgos</h4>
                              {newFeatures.map((featName, idx) => {
                                  if (featName === 'Ability Score Improvement' || featName.includes('Subclass')) return null;
                                  
                                  const desc = GENERIC_FEATURES[featName] || "Un nuevo rasgo de clase.";
                                  return (
                                      <div key={idx} className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-slate-200 dark:border-white/10">
                                          <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{featName}</p>
                                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                                      </div>
                                  );
                              })}
                          </div>
                      )}

                      {needsSubclass && (
                          <div className="space-y-2 animate-fadeIn">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-500 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">auto_awesome</span> Elige tu Subclase
                              </h4>
                              <div className="relative">
                                <select 
                                    value={pendingSubclass}
                                    onChange={(e) => setPendingSubclass(e.target.value)}
                                    className="w-full p-3 bg-white dark:bg-surface-dark border border-purple-500/30 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                                >
                                    <option value="" disabled>Seleccionar...</option>
                                    {(SUBCLASS_OPTIONS[character.class] || []).map(sub => (
                                        <option key={sub.name} value={sub.name}>{sub.name}</option>
                                    ))}
                                </select>
                              </div>
                              {pendingSubclass && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-2 rounded-lg">
                                      {SUBCLASS_OPTIONS[character.class]?.find(s => s.name === pendingSubclass)?.description}
                                  </p>
                              )}
                          </div>
                      )}

                      {needsAsi && (
                          <div className="space-y-3 animate-fadeIn">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">stars</span> Mejora de Característica
                              </h4>
                              
                              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                                  <button 
                                      onClick={() => setPendingAsiType('stat')}
                                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${pendingAsiType === 'stat' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}
                                  >
                                      Estadísticas
                                  </button>
                                  <button 
                                      onClick={() => setPendingAsiType('feat')}
                                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${pendingAsiType === 'feat' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}
                                  >
                                      Dote
                                  </button>
                              </div>

                              {pendingAsiType === 'stat' ? (
                                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                                      <div>
                                          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">+1 a...</label>
                                          <select 
                                              value={pendingStat1} 
                                              onChange={(e) => setPendingStat1(e.target.value as Ability)}
                                              className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-2 text-sm font-bold outline-none"
                                          >
                                              {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(s => <option key={s} value={s}>{s}</option>)}
                                          </select>
                                      </div>
                                      <div>
                                          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">+1 a...</label>
                                          <select 
                                              value={pendingStat2} 
                                              onChange={(e) => setPendingStat2(e.target.value as Ability)}
                                              className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-2 text-sm font-bold outline-none"
                                          >
                                              {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(s => <option key={s} value={s}>{s}</option>)}
                                          </select>
                                      </div>
                                      <div className="col-span-2 text-xs text-center text-slate-400">
                                          {pendingStat1 === pendingStat2 ? `+2 Total a ${pendingStat1}` : `+1 ${pendingStat1}, +1 ${pendingStat2}`}
                                      </div>
                                  </div>
                              ) : (
                                  <div>
                                      <select 
                                          value={pendingFeat}
                                          onChange={(e) => setPendingFeat(e.target.value)}
                                          className="w-full p-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold outline-none text-slate-900 dark:text-white"
                                      >
                                          <option value="" disabled>Seleccionar Dote...</option>
                                          {FEAT_OPTIONS.map(f => (
                                              <option key={f.name} value={f.name}>{f.name}</option>
                                          ))}
                                      </select>
                                      {pendingFeat && (
                                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-2 rounded-lg max-h-24 overflow-y-auto">
                                              {FEAT_OPTIONS.find(f => f.name === pendingFeat)?.description}
                                          </p>
                                      )}
                                  </div>
                              )}
                          </div>
                      )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6 shrink-0">
                      <button 
                          onClick={() => setShowLevelUp(false)}
                          className="py-3 rounded-xl font-bold text-sm text-slate-500 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                      >
                          Cancelar
                      </button>
                      <button 
                          onClick={confirmLevelUp}
                          disabled={!isLevelUpValid()}
                          className={`py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 ${isLevelUpValid() ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-slate-300 dark:bg-white/10 cursor-not-allowed shadow-none'}`}
                      >
                          Confirmar
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SheetTabs;