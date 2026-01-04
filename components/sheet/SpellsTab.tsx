
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Character } from '../../types';
import { SPELL_DETAILS, SPELL_LIST_BY_CLASS, CANTRIPS_KNOWN_BY_LEVEL, SPELLS_KNOWN_BY_LEVEL, MAX_SPELL_LEVEL, SPELLCASTING_ABILITY } from '../../Data/spells';
import { SCHOOL_THEMES, getSpellSummary, formatShort, formatModifier, getFinalStats } from '../../utils/sheetUtils';

interface SpellsTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
}

// ... (Helper functions and constants remain unchanged)
// Standard 5e Spell Slot Progression (Full Caster)
const FULL_CASTER_SLOTS: number[][] = [
    [], // Lvl 0
    [2], // Lvl 1
    [3], // Lvl 2
    [4, 2], // Lvl 3
    [4, 3], // Lvl 4
    [4, 3, 2], // Lvl 5
    [4, 3, 3], // Lvl 6
    [4, 3, 3, 1], // Lvl 7
    [4, 3, 3, 2], // Lvl 8
    [4, 3, 3, 3, 1], // Lvl 9
    [4, 3, 3, 3, 2], // Lvl 10
    [4, 3, 3, 3, 2, 1], // Lvl 11
    [4, 3, 3, 3, 2, 1], // 12
    [4, 3, 3, 3, 2, 1, 1], // 13
    [4, 3, 3, 3, 2, 1, 1], // 14
    [4, 3, 3, 3, 2, 1, 1, 1], // 15
    [4, 3, 3, 3, 2, 1, 1, 1], // 16
    [4, 3, 3, 3, 2, 1, 1, 1, 1], // 17
    [4, 3, 3, 3, 3, 1, 1, 1, 1], // 18
    [4, 3, 3, 3, 3, 2, 1, 1, 1], // 19
    [4, 3, 3, 3, 3, 2, 2, 1, 1], // 20
];

const getWarlockSlots = (level: number): { count: number, level: number } => {
    let count = 1;
    if (level >= 2) count = 2;
    if (level >= 11) count = 3;
    if (level >= 17) count = 4;

    let slotLvl = 1;
    if (level >= 3) slotLvl = 2;
    if (level >= 5) slotLvl = 3;
    if (level >= 7) slotLvl = 4;
    if (level >= 9) slotLvl = 5;

    return { count, level: slotLvl };
};

const getSlots = (type: string, charLevel: number, spellLevel: number): number => {
    if (spellLevel === 0) return 0;
    if (type === 'none') return 0;
    
    if (type === 'pact') {
        const { count, level } = getWarlockSlots(charLevel);
        return spellLevel === level ? count : 0;
    }

    let effectiveLevel = charLevel;
    if (type === 'half') {
        effectiveLevel = Math.ceil(charLevel / 2);
    } else if (type === 'third') {
        effectiveLevel = Math.ceil(charLevel / 3);
    }

    effectiveLevel = Math.max(1, Math.min(effectiveLevel, 20));
    if (effectiveLevel >= FULL_CASTER_SLOTS.length) return 0;

    const slots = FULL_CASTER_SLOTS[effectiveLevel];
    const index = spellLevel - 1;
    
    return (slots && index >= 0 && index < slots.length) ? slots[index] : 0;
};

// Helper to look up values in sparse objects
const getProgressiveValue = (table: Record<number, number> | undefined, level: number, fallback: number = 0): number => {
    if (!table) return fallback;
    let value = fallback;
    Object.keys(table).forEach(keyStr => {
        const key = parseInt(keyStr);
        if (level >= key) {
            value = table[key];
        }
    });
    return value;
};

const SpellsTab: React.FC<SpellsTabProps> = ({ character, onUpdate }) => {
    const [activeSpellLevel, setActiveSpellLevel] = useState<number>(1);
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
    const [showGrimoire, setShowGrimoire] = useState(false);
    const [grimoireSearch, setGrimoireSearch] = useState('');
    const [grimoireLevel, setGrimoireLevel] = useState(0);
    const [expandedGrimoireId, setExpandedGrimoireId] = useState<string | null>(null);
    const [selectedSpellName, setSelectedSpellName] = useState<string | null>(null);
    const [usedSlots, setUsedSlots] = useState<Record<string, boolean>>({});

    // Auto-scroll to centered tab
    useEffect(() => {
        const el = document.getElementById(`spell-level-btn-${activeSpellLevel}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeSpellLevel]);

    useEffect(() => {
        if (showGrimoire) {
            setTimeout(() => {
                const el = document.getElementById(`grimoire-level-btn-${grimoireLevel}`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }, 100);
        }
    }, [showGrimoire, grimoireLevel]);

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

    const spellStat = useMemo(() => {
        if (SPELLCASTING_ABILITY[character.class]) return SPELLCASTING_ABILITY[character.class];
        if (effectiveCasterType === 'third') return 'INT';
        if (magicInitiateType) return SPELLCASTING_ABILITY[magicInitiateType];
        return 'INT';
    }, [character.class, effectiveCasterType, magicInitiateType]);

    const finalStats = getFinalStats(character);
    const spellMod = Math.floor(((finalStats[spellStat] || 10) - 10) / 2);

    const grimoireSpellList = useMemo(() => {
        let list: string[] = [];
        
        // Class Spells
        if (['Eldritch Knight', 'Arcane Trickster'].includes(character.subclass || '')) {
            list = [...list, ...(SPELL_LIST_BY_CLASS['Wizard'] || [])];
        } else if (SPELL_LIST_BY_CLASS[character.class]) {
            list = [...list, ...(SPELL_LIST_BY_CLASS[character.class] || [])];
        }

        // Feat Spells
        if (magicInitiateType) {
            list = [...list, ...(SPELL_LIST_BY_CLASS[magicInitiateType] || [])];
        }
        
        // Deduplicate
        return Array.from(new Set(list));
    }, [character.class, character.subclass, magicInitiateType]);

    // --- Limits & Max Level Logic ---
    const maxCantrips = useMemo(() => {
        let count = 0;
        if (effectiveCasterType === 'third') {
            count = character.level >= 10 ? 3 : 2;
        } else if (character.class === 'Ranger') {
            count = character.level >= 10 ? 3 : 2;
        } else if (character.class === 'Paladin') {
            count = 0; // Unless Blessed Warrior
        } else {
            count = getProgressiveValue(CANTRIPS_KNOWN_BY_LEVEL[character.class], character.level, 0);
        }

        if (magicInitiateType) count += 2;
        return count;
    }, [character.class, character.level, effectiveCasterType, magicInitiateType]);
    
    const maxSpellLevel = useMemo(() => {
        if (effectiveCasterType === 'pact') {
            const slotLvl = getWarlockSlots(character.level).level;
            // Mystic Arcanum visibility
            if (character.level >= 17) return 9;
            if (character.level >= 15) return 8;
            if (character.level >= 13) return 7;
            if (character.level >= 11) return 6;
            return slotLvl;
        }
        if (effectiveCasterType === 'third') {
            if (character.level < 3) return 0;
            if (character.level >= 19) return 4;
            if (character.level >= 13) return 3;
            if (character.level >= 7) return 2;
            return 1;
        }
        if (effectiveCasterType === 'half') {
            return Math.ceil(character.level / 4);
        }
        if (effectiveCasterType === 'full') {
            return getProgressiveValue(MAX_SPELL_LEVEL['full'], character.level, 0);
        }
        if (magicInitiateType) return 1;
        return 0;
    }, [character.class, character.level, effectiveCasterType, magicInitiateType]);

    const maxSpells = useMemo(() => {
        let count = 0;
        const preparedClasses = ['Cleric', 'Druid', 'Paladin', 'Wizard', 'Bard', 'Ranger'];
        
        if (preparedClasses.includes(character.class)) {
            const isHalf = ['Paladin', 'Ranger'].includes(character.class);
            const levelFactor = isHalf ? Math.floor(character.level / 2) : character.level;
            count = Math.max(1, levelFactor + spellMod);
        } else if (character.class === 'Warlock') {
            let wCount = getProgressiveValue(SPELLS_KNOWN_BY_LEVEL['Warlock'], character.level, 0);
            if (character.level >= 11) wCount += 1;
            if (character.level >= 13) wCount += 1;
            if (character.level >= 15) wCount += 1;
            if (character.level >= 17) wCount += 1;
            count = wCount;
        } else if (effectiveCasterType === 'third') {
            if (character.level < 3) count = 0;
            else count = character.level >= 19 ? 11 : character.level >= 13 ? (character.level - 2) : (character.level >= 8 ? character.level - 2 : 3 + Math.floor((character.level - 3)/1)); 
        } else {
            count = getProgressiveValue(SPELLS_KNOWN_BY_LEVEL[character.class], character.level, 0);
        }

        if (magicInitiateType) count += 1;
        return count;
    }, [character.class, character.level, spellMod, effectiveCasterType, magicInitiateType]);

    const currentCantrips = useMemo(() => 
        (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level === 0).length, 
    [character.preparedSpells]);

    const currentSpells = useMemo(() => 
        (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level > 0).length, 
    [character.preparedSpells]);

    const toggleSlot = (level: number, index: number) => {
        const key = `${level}-${index}`;
        setUsedSlots(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const resetSlots = () => {
        setUsedSlots({});
    };

    const castSpell = (level: number) => {
        if (level === 0) return; 
        const totalSlots = getSlots(effectiveCasterType, character.level, level);
        let found = false;
        for (let i = 0; i < totalSlots; i++) {
            if (!usedSlots[`${level}-${i}`]) {
                toggleSlot(level, i);
                found = true;
                break;
            }
        }
        
        if (!found) {
            if (magicInitiateType && level === 1 && totalSlots === 0) {
                alert('Puedes lanzar este hechizo una vez por Descanso Largo sin gastar espacio (Magic Initiate).');
            } else {
                alert(`¡No te quedan espacios de conjuro de nivel ${level}!`);
            }
        }
    };

    const togglePreparedSpell = (spellName: string) => {
        const current = character.preparedSpells || [];
        const isPrepared = current.includes(spellName);
        const spellData = SPELL_DETAILS[spellName];
        
        if (!spellData) return;

        const isCantrip = spellData.level === 0;

        if (!isPrepared) {
            if (isCantrip && currentCantrips >= maxCantrips) return;
            if (!isCantrip && currentSpells >= maxSpells) return;
            onUpdate({ ...character, preparedSpells: [...current, spellName] });
        } else {
            onUpdate({ ...character, preparedSpells: current.filter(s => s !== spellName) });
        }
    };

    const saveDC = 8 + character.profBonus + spellMod;
    const spellAttack = character.profBonus + spellMod;
    const preparedCount = character.preparedSpells?.length || 0;

    const preparedSpellList = character.preparedSpells || [];
    const spellsToShow = preparedSpellList.filter(s => {
        const detail = SPELL_DETAILS[s];
        return detail && detail.level === activeSpellLevel;
    }).sort();

    const slotCount = getSlots(effectiveCasterType, character.level, activeSpellLevel);

    return (
    <div className="flex flex-col gap-6 px-4 pb-20 relative min-h-screen">
       <div className="grid grid-cols-3 gap-3 mt-4">
           <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark border border-white/5 shadow-sm">
              <span className="text-primary text-2xl font-bold leading-none">{formatModifier(spellMod)}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">psychology</span> {spellStat}
              </span>
           </div>
           <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark border-2 border-white/10 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5"></div>
              <span className="text-white text-2xl font-bold leading-none relative z-10">{saveDC}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-1 relative z-10">
                  <span className="material-symbols-outlined text-[12px]">shield</span> Save DC
              </span>
           </div>
           <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark border border-white/5 shadow-sm">
              <span className="text-primary text-2xl font-bold leading-none">{formatModifier(spellAttack)}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">swords</span> Attack
              </span>
           </div>
       </div>

       <div className="bg-surface-dark rounded-xl p-4 border border-white/5">
           <div className="flex justify-between items-center py-1">
               <span className="text-sm font-medium text-slate-400 flex items-center gap-2"><span className="material-symbols-outlined text-lg">auto_stories</span> Prepared Spells</span>
               <span className="text-white font-bold">{preparedCount} <span className="text-slate-600 text-xs">/ {maxSpells + maxCantrips}</span></span>
           </div>
       </div>

       <div className="flex overflow-x-auto gap-2 no-scrollbar py-1">
           {maxCantrips > 0 && (
               <button 
                   id="spell-level-btn-0"
                   onClick={() => setActiveSpellLevel(0)}
                   className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${activeSpellLevel === 0 ? 'bg-primary text-background-dark' : 'bg-surface-dark text-slate-500 hover:text-white border border-white/5'}`}
               >
                   Cantrips
               </button>
           )}
           {Array.from({length: maxSpellLevel}, (_, i) => i + 1).map(lvl => {
               return (
                   <button 
                       key={lvl}
                       id={`spell-level-btn-${lvl}`}
                       onClick={() => setActiveSpellLevel(lvl)}
                       className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${activeSpellLevel === lvl ? 'bg-primary text-background-dark' : 'bg-surface-dark text-slate-500 hover:text-white border border-white/5'}`}
                   >
                       Level {lvl}
                   </button>
               );
           })}
       </div>

       {activeSpellLevel > 0 && slotCount > 0 && (
           <div className="flex flex-col gap-2 animate-fadeIn">
              <div className="flex justify-between items-end px-1">
                 <h3 className="text-white text-base font-bold">Spell Slots ({slotCount})</h3>
                 <button onClick={resetSlots} className="text-[10px] text-primary font-bold hover:underline uppercase tracking-wider">Reset</button>
              </div>
              <div className="flex flex-wrap gap-2">
                 {Array.from({length: slotCount}, (_, i) => {
                     const isUsed = usedSlots[`${activeSpellLevel}-${i}`];
                     return (
                     <button key={i} onClick={() => toggleSlot(activeSpellLevel, i)} className={`group relative h-10 w-10 rounded-lg border-2 border-white/10 overflow-hidden flex items-center justify-center transition-colors ${isUsed ? 'bg-surface-dark' : 'bg-primary/20 border-primary/50'}`}>
                        <span className={`material-symbols-outlined transition-all duration-200 ${isUsed ? 'text-slate-600 scale-75' : 'text-primary scale-100'}`}>bolt</span>
                     </button>
                 )})}
              </div>
           </div>
       )}

       <div className="flex flex-col gap-3">
           {spellsToShow.length === 0 ? (
               <div className="text-center p-8 bg-surface-dark rounded-xl border border-dashed border-white/10 mt-2 flex flex-col items-center">
                   <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">auto_stories</span>
                   <p className="text-slate-500 text-sm mb-2">No tienes hechizos preparados de nivel {activeSpellLevel}.</p>
                   <button onClick={() => setShowGrimoire(true)} className="text-primary font-bold text-sm">Abrir Grimorio</button>
               </div>
           ) : spellsToShow.map(spellName => {
               const spell = SPELL_DETAILS[spellName];
               if (!spell) return null;
               
               const theme = SCHOOL_THEMES[spell.school] || { text: 'text-slate-400', bg: 'bg-slate-100 dark:bg-white/5', border: 'border-white/5', icon: 'auto_stories' };
               const summary = getSpellSummary(spell.description, spell.school);

               return (
               <div 
                  key={spellName} 
                  onClick={() => setSelectedSpellName(spellName)}
                  className={`p-4 rounded-xl bg-surface-dark border ${theme.border} shadow-sm hover:border-opacity-100 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99]`}
               >
                  <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.bg} ${theme.text} shrink-0`}>
                          <span className="font-bold text-sm">{spell.level === 0 ? 'C' : spell.level}</span>
                      </div>
                      <div className="min-w-0">
                          <h3 className="text-white font-bold leading-tight group-hover:text-primary transition-colors truncate">{spell.name}</h3>
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                              <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold ${summary.text}`}>
                                  <span className="material-symbols-outlined text-[10px]">{summary.icon}</span>
                                  {summary.label}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                  <span className="w-0.5 h-0.5 rounded-full bg-slate-600"></span>
                                  {formatShort(spell.castingTime)}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                  <span className="w-0.5 h-0.5 rounded-full bg-slate-600"></span>
                                  {formatShort(spell.range)}
                              </span>
                          </div>
                      </div>
                  </div>
                  <span className={`material-symbols-outlined ${theme.text} opacity-50 group-hover:opacity-100 shrink-0`}>chevron_right</span>
               </div>
           )})}
       </div>

       <div className="fixed bottom-24 right-6 z-20">
            <button 
                onClick={() => setShowGrimoire(true)}
                className="flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-primary text-background-dark font-bold shadow-[0_4px_20px_rgba(53,158,255,0.4)] hover:scale-105 transition-transform"
            >
                <span className="material-symbols-outlined text-2xl">menu_book</span>
                <span>Grimoire</span>
            </button>
       </div>

       {showGrimoire && createPortal(
           <div className="fixed inset-0 z-50 bg-background-dark flex flex-col animate-fadeIn pt-[env(safe-area-inset-top)]">
               <div className="flex flex-col border-b border-white/10 bg-surface-dark">
                   <div className="flex items-center gap-4 p-4 pb-2">
                       <button onClick={() => setShowGrimoire(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white"><span className="material-symbols-outlined">close</span></button>
                       <div className="flex-1 relative">
                           <input type="text" placeholder="Search spell..." value={grimoireSearch} onChange={(e) => setGrimoireSearch(e.target.value)} className="w-full bg-black/20 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-primary/50"/>
                           <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500">search</span>
                       </div>
                   </div>
                   
                   <div className="flex justify-around items-center px-4 pb-3 text-xs font-bold uppercase tracking-wider">
                        <div className={`flex items-center gap-1 ${currentCantrips > maxCantrips ? 'text-red-500' : currentCantrips === maxCantrips ? 'text-primary' : 'text-slate-400'}`}><span>Trucos:</span><span>{currentCantrips} / {maxCantrips}</span></div>
                        <div className={`w-px h-4 bg-white/10`}></div>
                        <div className={`flex items-center gap-1 ${currentSpells > maxSpells ? 'text-red-500' : currentSpells === maxSpells ? 'text-primary' : 'text-slate-400'}`}><span>Hechizos:</span><span>{currentSpells} / {maxSpells}</span></div>
                   </div>
               </div>

               <div className="flex overflow-x-auto gap-2 p-2 border-b border-white/5 no-scrollbar bg-surface-dark">
                   {maxCantrips > 0 && (
                       <button id="grimoire-level-btn-0" onClick={() => setGrimoireLevel(0)} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${grimoireLevel === 0 ? 'bg-white text-background-dark' : 'bg-white/5 text-slate-400'}`}>Cantrips</button>
                   )}
                   {Array.from({length: maxSpellLevel}, (_, i) => i + 1).map(lvl => (
                       <button key={lvl} id={`grimoire-level-btn-${lvl}`} onClick={() => setGrimoireLevel(lvl)} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${grimoireLevel === lvl ? 'bg-white text-background-dark' : 'bg-white/5 text-slate-400'}`}>Lvl {lvl}</button>
                   ))}
               </div>

               {grimoireLevel > 0 && (
                   <div className="px-4 py-2 bg-slate-900/50 border-b border-white/5 flex items-center justify-between text-xs font-bold text-slate-400">
                       <span>
                           {effectiveCasterType === 'pact' 
                               ? (grimoireLevel <= 5 
                                   ? `Espacios de Pacto: ${getWarlockSlots(character.level).count} (Nivel ${getWarlockSlots(character.level).level})`
                                   : 'Mystic Arcanum: 1 uso/día')
                               : `Espacios de Nivel ${grimoireLevel}: ${getSlots(effectiveCasterType, character.level, grimoireLevel)}`
                           }
                       </span>
                       <span className="material-symbols-outlined text-[14px]">bolt</span>
                   </div>
               )}

               <div className="flex-1 overflow-y-auto p-4 pb-24 gap-2 flex flex-col">
                   {grimoireSpellList
                       .filter(name => {
                           const s = SPELL_DETAILS[name];
                           if (!s) return false;
                           if (s.level !== grimoireLevel) return false;
                           if (grimoireSearch && !name.toLowerCase().includes(grimoireSearch.toLowerCase())) return false;
                           return true;
                       })
                       .sort()
                       .slice(0, 50) // Limit rendering
                       .map(name => {
                           const s = SPELL_DETAILS[name];
                           const isPrepared = (character.preparedSpells || []).includes(name);
                           const isCantrip = s.level === 0;
                           const limitReached = isCantrip ? currentCantrips >= maxCantrips : currentSpells >= maxSpells;
                           const isDisabled = !isPrepared && limitReached;
                           const summary = getSpellSummary(s.description, s.school);

                           return (
                               <div key={name} className={`rounded-xl border transition-all ${isPrepared ? 'bg-primary/5 border-primary/50' : 'bg-surface-dark border-white/5'}`}>
                                   <div className="flex items-center">
                                       <button onClick={() => setExpandedGrimoireId(expandedGrimoireId === name ? null : name)} className="flex-1 p-3 text-left">
                                           <div className="flex items-center gap-2">
                                               <p className={`font-bold ${isPrepared ? 'text-primary' : isDisabled ? 'text-slate-500' : 'text-white'}`}>{name}</p>
                                               {expandedGrimoireId === name ? <span className="material-symbols-outlined text-[14px] text-slate-500">expand_less</span> : <span className="material-symbols-outlined text-[14px] text-slate-500">expand_more</span>}
                                           </div>
                                           <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                                              <div className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold ${summary.text}`}>
                                                  <span className="material-symbols-outlined text-[10px]">{summary.icon}</span>
                                                  {summary.label}
                                              </div>
                                              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                  <span className="w-0.5 h-0.5 rounded-full bg-slate-600"></span>
                                                  {formatShort(s.castingTime)}
                                              </span>
                                              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                  <span className="w-0.5 h-0.5 rounded-full bg-slate-600"></span>
                                                  {formatShort(s.range)}
                                              </span>
                                           </div>
                                       </button>
                                       <button onClick={() => togglePreparedSpell(name)} disabled={isDisabled} className={`p-4 border-l border-white/5 flex items-center justify-center transition-colors ${isDisabled ? 'text-slate-600 cursor-not-allowed' : isPrepared ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                            <span className="material-symbols-outlined">{isPrepared ? 'check_circle' : isDisabled ? 'block' : 'add_circle'}</span>
                                       </button>
                                   </div>
                                   {expandedGrimoireId === name && (
                                       <div className="px-3 pb-3 pt-0 text-xs text-slate-400 border-t border-white/5 bg-black/20">
                                           <div className="grid grid-cols-3 py-2 gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                               <span className="flex items-center gap-1 bg-white/5 rounded px-1.5 py-1"><span className="material-symbols-outlined text-[10px]">straighten</span> {s.range}</span>
                                               <span className="flex items-center gap-1 bg-white/5 rounded px-1.5 py-1"><span className="material-symbols-outlined text-[10px]">science</span> {s.components}</span>
                                               <span className="flex items-center gap-1 bg-white/5 rounded px-1.5 py-1"><span className="material-symbols-outlined text-[10px]">timer</span> {s.duration}</span>
                                           </div>
                                           <p className="leading-relaxed mt-1">{s.description}</p>
                                       </div>
                                   )}
                               </div>
                           );
                       })
                   }
               </div>
           </div>,
           document.body
       )}

       {selectedSpellName && createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedSpellName(null)}>
                <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl transform transition-all scale-100 flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                    {(() => {
                        const spell = SPELL_DETAILS[selectedSpellName];
                        if (!spell) return null;
                        const theme = SCHOOL_THEMES[spell.school] || { text: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/5', icon: 'auto_stories' };
                        
                        return (
                        <>
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 shrink-0">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedSpellName}</h3>
                                    <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${theme.text}`}>
                                        <span className="material-symbols-outlined text-[14px]">{theme.icon}</span>
                                        {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} {spell.school}
                                    </span>
                                </div>
                                <button onClick={() => setSelectedSpellName(null)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-4 shrink-0">
                                <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-lg text-center">
                                    <span className="material-symbols-outlined text-[16px] text-slate-400 block mb-1">timer</span>
                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 block leading-tight">{spell.castingTime}</span>
                                </div>
                                <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-lg text-center">
                                    <span className="material-symbols-outlined text-[16px] text-slate-400 block mb-1">straighten</span>
                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 block leading-tight">{spell.range}</span>
                                </div>
                                <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-lg text-center">
                                    <span className="material-symbols-outlined text-[16px] text-slate-400 block mb-1">hourglass_empty</span>
                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 block leading-tight">{spell.duration}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 pr-1">
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {spell.description}
                                </p>
                                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500">
                                    <span className="font-bold">Components:</span> {spell.components}
                                </div>
                            </div>

                            {/* Action */}
                            <div className="shrink-0">
                                <button onClick={() => { castSpell(spell.level || 0); setSelectedSpellName(null); }} className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary hover:bg-primary-dark text-background-dark font-bold text-base transition-colors shadow-lg shadow-primary/20 active:scale-95">
                                    <span className="material-symbols-outlined">auto_fix</span>
                                    {spell.level === 0 ? 'Lanzar Truco' : 'Lanzar Hechizo'}
                                </button>
                            </div>
                        </>
                        );
                    })()}
                </div>
            </div>,
            document.body
        )}
    </div>
  );
};

export default SpellsTab;
