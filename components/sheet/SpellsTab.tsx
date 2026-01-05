
import { createPortal } from 'react-dom';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Character } from '../../types';
import { SPELL_DETAILS, SPELL_LIST_BY_CLASS, CANTRIPS_KNOWN_BY_LEVEL, SPELLS_KNOWN_BY_LEVEL, MAX_SPELL_LEVEL, SPELLCASTING_ABILITY } from '../../Data/spells';
import { SCHOOL_THEMES, formatModifier, getFinalStats, getSpellSummary } from '../../utils/sheetUtils';

interface SpellsTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
}

const FULL_CASTER_SLOTS: number[][] = [
    [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
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
    if (type === 'half') effectiveLevel = Math.ceil(charLevel / 2);
    else if (type === 'third') effectiveLevel = Math.ceil(charLevel / 3);
    effectiveLevel = Math.max(1, Math.min(effectiveLevel, 20));
    if (effectiveLevel >= FULL_CASTER_SLOTS.length) return 0;
    const slots = FULL_CASTER_SLOTS[effectiveLevel];
    const index = spellLevel - 1;
    return (slots && index >= 0 && index < slots.length) ? slots[index] : 0;
};

const getProgressiveValue = (table: Record<number, number> | undefined, level: number, fallback: number = 0): number => {
    if (!table) return fallback;
    let value = fallback;
    Object.keys(table).forEach(keyStr => {
        const key = parseInt(keyStr);
        if (level >= key) value = table[key];
    });
    return value;
};

const SpellsTab: React.FC<SpellsTabProps> = ({ character, onUpdate }) => {
    const [activeSpellLevel, setActiveSpellLevel] = useState<number>(1);
    const [showGrimoire, setShowGrimoire] = useState(false);
    const [grimoireSearch, setGrimoireSearch] = useState('');
    const [grimoireLevel, setGrimoireLevel] = useState(0);
    const [expandedGrimoireId, setExpandedGrimoireId] = useState<string | null>(null);
    const [selectedSpellName, setSelectedSpellName] = useState<string | null>(null);
    const [usedSlots, setUsedSlots] = useState<Record<string, boolean>>({});
    const [sorceryPoints, setSorceryPoints] = useState<number>(character.level >= 2 && character.class === 'Sorcerer' ? character.level : 0);

    const tabsRef = useRef<HTMLDivElement>(null);
    const grimoireTabsRef = useRef<HTMLDivElement>(null);

    // Auto-center active spell level tab
    useEffect(() => {
        if (tabsRef.current) {
            const activeBtn = tabsRef.current.querySelector(`[data-level="${activeSpellLevel}"]`) as HTMLElement;
            if (activeBtn) {
                const container = tabsRef.current;
                const scrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [activeSpellLevel]);

    // Auto-center active grimoire level tab
    useEffect(() => {
        if (showGrimoire && grimoireTabsRef.current) {
             // Small delay to allow portal render
             setTimeout(() => {
                 if (!grimoireTabsRef.current) return;
                 const activeBtn = grimoireTabsRef.current.querySelector(`[data-level="${grimoireLevel}"]`) as HTMLElement;
                 if (activeBtn) {
                     const container = grimoireTabsRef.current;
                     const scrollLeft = activeBtn.offsetLeft - (container.clientWidth / 2) + (activeBtn.clientWidth / 2);
                     container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                 }
             }, 50);
        }
    }, [grimoireLevel, showGrimoire]);

    const isSorcerer = character.class === 'Sorcerer';

    const magicInitiateType = useMemo(() => {
        const feats = character.feats || [];
        if (feats.some(f => f.includes('Magic Initiate (Cleric)'))) return 'Cleric';
        if (feats.some(f => f.includes('Magic Initiate (Druid)'))) return 'Druid';
        if (feats.some(f => f.includes('Magic Initiate (Wizard)'))) return 'Wizard';
        return null;
    }, [character.feats]);

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

    const maxCantrips = useMemo(() => {
        let count = 0;
        if (effectiveCasterType === 'third') count = character.level >= 10 ? 3 : 2;
        else if (character.class === 'Ranger') count = character.level >= 10 ? 3 : 2;
        else if (character.class === 'Paladin') count = 0;
        else count = getProgressiveValue(CANTRIPS_KNOWN_BY_LEVEL[character.class], character.level, 0);
        if (magicInitiateType) count += 2;
        return count;
    }, [character.class, character.level, effectiveCasterType, magicInitiateType]);
    
    const maxSpellLevel = useMemo(() => {
        if (effectiveCasterType === 'pact') {
            const slotLvl = getWarlockSlots(character.level).level;
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
        if (effectiveCasterType === 'half') return Math.ceil(character.level / 4);
        if (effectiveCasterType === 'full') return getProgressiveValue(MAX_SPELL_LEVEL['full'], character.level, 0);
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
        } else count = getProgressiveValue(SPELLS_KNOWN_BY_LEVEL[character.class], character.level, 0);
        if (magicInitiateType) count += 1;
        return count;
    }, [character.class, character.level, spellMod, effectiveCasterType, magicInitiateType]);

    const currentCantrips = useMemo(() => (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level === 0).length, [character.preparedSpells]);
    const currentSpells = useMemo(() => (character.preparedSpells || []).filter(s => (SPELL_DETAILS[s]?.level || 0) > 0).length, [character.preparedSpells]);
    
    const currentLevelCount = useMemo(() => (character.preparedSpells || []).filter(s => (SPELL_DETAILS[s]?.level || 0) === grimoireLevel).length, [character.preparedSpells, grimoireLevel]);

    const maxPerLevel = useMemo(() => {
        if (grimoireLevel === 0) return maxCantrips;
        return getSlots(effectiveCasterType, character.level, grimoireLevel);
    }, [effectiveCasterType, character.level, grimoireLevel, maxCantrips]);

    const toggleSlot = (level: number, index: number) => {
        const key = `${level}-${index}`;
        setUsedSlots(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const togglePreparedSpell = (spellName: string) => {
        const current = character.preparedSpells || [];
        const isPrepared = current.includes(spellName);
        const spellData = SPELL_DETAILS[spellName];
        if (!spellData) return;
        
        const isCantrip = spellData.level === 0;
        const levelCount = current.filter(s => (SPELL_DETAILS[s]?.level || 0) === spellData.level).length;
        const levelLimit = spellData.level === 0 ? maxCantrips : getSlots(effectiveCasterType, character.level, spellData.level);

        if (!isPrepared) {
            // Block adding if at TOTAL limit
            if (isCantrip && currentCantrips >= maxCantrips) return;
            if (!isCantrip && currentSpells >= maxSpells) return;
            // Block adding if at LEVEL limit (Strict Mode)
            if (levelCount >= levelLimit) return;

            onUpdate({ ...character, preparedSpells: [...current, spellName] });
        } else {
            onUpdate({ ...character, preparedSpells: current.filter(s => s !== spellName) });
        }
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
        if (!found) alert(`¡No te quedan espacios de conjuro de nivel ${level}!`);
    };

    const saveDC = 8 + character.profBonus + spellMod;
    const spellAttack = character.profBonus + spellMod;
    const spellsToShow = (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level === activeSpellLevel).sort();
    const slotCount = getSlots(effectiveCasterType, character.level, activeSpellLevel);

    const getLimitColor = (current: number, max: number) => {
        if (current >= max) return 'bg-red-500/10 border-red-500/20 text-red-400';
        if (current >= max - 1) return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    };

    return (
    <div className="flex flex-col gap-6 px-4 pb-28 relative min-h-screen">
       <div className="grid grid-cols-3 gap-3 mt-4">
           <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark border border-white/5 shadow-sm">
              <span className="text-primary text-2xl font-bold leading-none">{formatModifier(spellMod)}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{spellStat}</span>
           </div>
           <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark border-2 border-white/10 shadow-sm relative overflow-hidden">
              <span className="text-white text-2xl font-bold leading-none z-10">{saveDC}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 z-10">Save DC</span>
           </div>
           <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-dark border border-white/5 shadow-sm">
              <span className="text-primary text-2xl font-bold leading-none">{formatModifier(spellAttack)}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Attack</span>
           </div>
       </div>

       {isSorcerer && (
           <div className="relative overflow-hidden bg-white/5 border border-purple-500/20 rounded-2xl p-3 shadow-sm animate-fadeIn">
               <div className="flex items-center justify-between gap-4">
                   <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-1.5 mb-1.5">
                           <span className="material-symbols-outlined text-purple-400 text-sm">auto_fix_normal</span>
                           <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Sorcery Points</span>
                       </div>
                       <div className="flex items-baseline gap-2 mb-2">
                           <span className="text-2xl font-bold text-white leading-none">{sorceryPoints}</span>
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">/ {character.level} Max</span>
                       </div>
                       <div className="relative h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                           <div 
                               className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                               style={{ width: `${(sorceryPoints / character.level) * 100}%` }}
                           ></div>
                       </div>
                   </div>
                   <div className="flex items-center gap-1.5 shrink-0 border-l border-white/10 pl-3">
                       <button onClick={() => setSorceryPoints(Math.max(0, sorceryPoints - 1))} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-purple-500/20 active:scale-90 transition-all"><span className="material-symbols-outlined text-base">remove</span></button>
                       <button onClick={() => setSorceryPoints(Math.min(character.level, sorceryPoints + 1))} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-purple-500/20 active:scale-90 transition-all"><span className="material-symbols-outlined text-base">add</span></button>
                       <button onClick={() => setSorceryPoints(character.level)} className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-white hover:bg-purple-500/40 active:scale-90 transition-all ml-1"><span className="material-symbols-outlined text-base">refresh</span></button>
                   </div>
               </div>
               {character.metamagics && character.metamagics.length > 0 && (
                   <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1.5">
                       {character.metamagics.map(m => (
                           <div key={m} className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/10 text-[9px] font-bold text-purple-300/80 uppercase tracking-tight">{m}</div>
                       ))}
                   </div>
               )}
           </div>
       )}

       <div ref={tabsRef} className="flex overflow-x-auto gap-2 no-scrollbar py-1 w-full">
           {/* Center container for small amounts, allow scroll for large */}
           <div className="flex gap-2 mx-auto min-w-min px-4">
               {maxCantrips > 0 && (
                   <button 
                       onClick={() => setActiveSpellLevel(0)} 
                       data-level="0"
                       className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${activeSpellLevel === 0 ? 'bg-primary text-background-dark scale-105' : 'bg-surface-dark text-slate-500'}`}
                   >
                       Cantrips
                   </button>
               )}
               {Array.from({length: maxSpellLevel}, (_, i) => i + 1).map(lvl => (
                   <button 
                       key={lvl} 
                       onClick={() => setActiveSpellLevel(lvl)} 
                       data-level={lvl}
                       className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${activeSpellLevel === lvl ? 'bg-primary text-background-dark scale-105' : 'bg-surface-dark text-slate-500'}`}
                   >
                       Level {lvl}
                   </button>
               ))}
           </div>
       </div>

       {activeSpellLevel > 0 && slotCount > 0 && (
           <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({length: slotCount}, (_, i) => (
                  <button key={i} onClick={() => toggleSlot(activeSpellLevel, i)} className={`h-10 w-10 rounded-lg border-2 border-white/10 flex items-center justify-center transition-all ${usedSlots[`${activeSpellLevel}-${i}`] ? 'bg-surface-dark opacity-50' : 'bg-primary/20 border-primary/50 text-primary'}`}>
                     <span className={`material-symbols-outlined ${usedSlots[`${activeSpellLevel}-${i}`] ? 'text-slate-600' : 'text-primary'}`}>bolt</span>
                  </button>
              ))}
           </div>
       )}

       <div className="flex flex-col gap-3">
           {spellsToShow.length === 0 ? (
               <div className="text-center p-8 bg-surface-dark rounded-xl border border-dashed border-white/10 mt-2">
                   <p className="text-slate-500 text-sm mb-2">No tienes hechizos preparados.</p>
                   <button onClick={() => setShowGrimoire(true)} className="text-primary font-bold text-sm">Abrir Grimorio</button>
               </div>
           ) : spellsToShow.map(spellName => {
               const spell = SPELL_DETAILS[spellName];
               if (!spell) return null;
               const summary = getSpellSummary(spell.description, spell.school);
               return (
               <div key={spellName} onClick={() => setSelectedSpellName(spellName)} className={`p-4 rounded-xl bg-surface-dark border ${summary.classes.split(' ').filter(c=>c.startsWith('border')).join(' ')} shadow-sm cursor-pointer flex items-center justify-between active:scale-[0.99]`}>
                  <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${summary.classes} shrink-0`}>
                          <span className="material-symbols-outlined text-lg">{summary.icon}</span>
                      </div>
                      <div>
                          <h3 className="text-white font-bold leading-tight truncate">{spell.name}</h3>
                          <div className="flex gap-2 mt-0.5 items-center">
                              <span className={`text-[10px] uppercase font-bold text-slate-400`}>{spell.school}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                              <span className={`text-[10px] font-bold ${summary.classes.split(' ')[0]}`}>{summary.label}</span>
                          </div>
                      </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-500">chevron_right</span>
               </div>
           )})}
       </div>

       <div className="flex justify-center mt-2 mb-8">
            <button onClick={() => setShowGrimoire(true)} className="flex items-center gap-2 pl-5 pr-6 py-3.5 rounded-full bg-primary text-background-dark font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-xl">menu_book</span>
                <span className="text-sm">Abrir Grimorio</span>
            </button>
       </div>

       {showGrimoire && createPortal(
           <div className="fixed inset-0 z-50 bg-background-dark flex flex-col pt-[env(safe-area-inset-top)] animate-fadeIn">
               <div className="flex flex-col gap-2 p-4 bg-surface-dark border-b border-white/10 shadow-lg">
                   <div className="flex items-center gap-4">
                       <button onClick={() => setShowGrimoire(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"><span className="material-symbols-outlined">close</span></button>
                       <div className="flex-1 relative">
                           <input type="text" placeholder="Buscar hechizo..." value={grimoireSearch} onChange={(e) => setGrimoireSearch(e.target.value)} className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-10 text-white outline-none focus:border-primary/50 transition-all"/>
                           <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500">search</span>
                       </div>
                   </div>
                   
                   {/* Level-Specific Discriminator / Indicator */}
                   <div className="flex items-center justify-between gap-4 mt-1 px-1">
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-1.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                    {grimoireLevel === 0 ? 'Capacidad de Trucos' : `Límite Nivel ${grimoireLevel}`}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-medium text-slate-500 uppercase tracking-tight">Total: {currentSpells}/{maxSpells}</span>
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${getLimitColor(currentLevelCount, maxPerLevel)} transition-colors duration-300`}>
                                        {currentLevelCount} / {maxPerLevel}
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className={`h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(53,158,255,0.2)] ${currentLevelCount >= maxPerLevel ? 'bg-red-500' : 'bg-primary'}`}
                                    style={{ width: `${Math.min(100, (currentLevelCount / Math.max(1, maxPerLevel)) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                   </div>
               </div>

               <div ref={grimoireTabsRef} className="flex overflow-x-auto gap-2 p-3 bg-surface-dark/50 border-b border-white/5 no-scrollbar w-full">
                   <div className="flex gap-2 mx-auto min-w-min px-4">
                       {Array.from({length: maxSpellLevel + 1}, (_, i) => (
                           <button 
                               key={i} 
                               onClick={() => setGrimoireLevel(i)} 
                               data-level={i}
                               className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${grimoireLevel === i ? 'bg-primary text-background-dark shadow-lg shadow-primary/20 scale-105' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                           >
                               {i === 0 ? 'Trucos' : `Lvl ${i}`}
                           </button>
                       ))}
                   </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 gap-3 flex flex-col pb-24 no-scrollbar bg-gradient-to-b from-surface-dark/20 to-background-dark">
                   {Array.from(new Set([...(SPELL_LIST_BY_CLASS[character.class] || []), ...(magicInitiateType ? SPELL_LIST_BY_CLASS[magicInitiateType] : [])]))
                       .filter(name => SPELL_DETAILS[name]?.level === grimoireLevel && name.toLowerCase().includes(grimoireSearch.toLowerCase()))
                       .sort()
                       .map(name => {
                           const isPrepared = (character.preparedSpells || []).includes(name);
                           const isExpanded = expandedGrimoireId === name;
                           const spell = SPELL_DETAILS[name];
                           const summary = spell ? getSpellSummary(spell.description, spell.school) : { classes: '', icon: 'help', label: '' };
                           
                           const isAtTotalLimit = grimoireLevel === 0 ? currentCantrips >= maxCantrips : currentSpells >= maxSpells;
                           const isAtLevelLimit = currentLevelCount >= maxPerLevel;
                           const isBlocked = !isPrepared && (isAtTotalLimit || isAtLevelLimit);

                           const shortDesc = spell ? (spell.description.split('.')[0] + '.') : '';

                           return (
                               <div key={name} className={`flex flex-col rounded-2xl border transition-all duration-300 ${isPrepared ? 'bg-primary/5 border-primary/50 shadow-md shadow-primary/5' : isBlocked ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-surface-dark border-white/5 hover:border-white/10'}`}>
                                   <div className="flex items-start">
                                       <button onClick={() => setExpandedGrimoireId(isExpanded ? null : name)} className="flex-1 p-4 text-left flex flex-col gap-2 group">
                                           <div className="flex items-center justify-between">
                                               <div className="flex items-center gap-3">
                                                   <div className={`w-2 h-2 rounded-full ${isPrepared ? 'bg-primary shadow-[0_0_8px_rgba(53,158,255,1)] animate-pulse' : isBlocked ? 'bg-slate-700' : 'bg-slate-500'}`}></div>
                                                   <p className={`font-bold transition-colors ${isPrepared ? 'text-primary' : 'text-white group-hover:text-primary/70'}`}>{name}</p>
                                               </div>
                                               <span className={`material-symbols-outlined text-slate-500 text-lg transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
                                           </div>
                                           
                                           {/* Visual Effect Badge */}
                                           <div className="flex items-center gap-2 pl-5">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${summary.classes}`}>
                                                    <span className="material-symbols-outlined text-[12px]">{summary.icon}</span>
                                                    {summary.label}
                                                </div>
                                           </div>

                                           {/* Short Description */}
                                           {!isExpanded && (
                                               <p className="text-[10px] text-slate-400 dark:text-slate-500 pl-5 leading-tight line-clamp-2 opacity-80 font-medium font-body italic">
                                                   {shortDesc}
                                               </p>
                                           )}
                                       </button>
                                       <button 
                                            onClick={() => !isBlocked && togglePreparedSpell(name)} 
                                            disabled={isBlocked}
                                            className={`self-stretch w-16 border-l border-white/5 active:scale-75 transition-all flex items-center justify-center ${isPrepared ? 'text-primary' : isBlocked ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}
                                            title={isPrepared ? 'Quitar' : isBlocked ? (isAtLevelLimit ? 'Límite de Nivel' : 'Grimorio Lleno') : 'Preparar'}
                                        >
                                            <span className="material-symbols-outlined font-bold text-xl">
                                                {isPrepared ? 'check_circle' : isBlocked ? 'lock' : 'add_circle'}
                                            </span>
                                       </button>
                                   </div>

                                   {isExpanded && spell && (
                                       <div className="px-5 pb-5 pt-0 animate-fadeIn border-t border-white/5 bg-black/20 rounded-b-2xl">
                                           <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-4 text-[10px]">
                                               <div className="space-y-0.5"><p className="text-slate-500 uppercase font-black tracking-widest opacity-70">Tiempo</p><p className="text-slate-200 font-bold text-xs">{spell.castingTime}</p></div>
                                               <div className="space-y-0.5"><p className="text-slate-500 uppercase font-black tracking-widest opacity-70">Alcance</p><p className="text-slate-200 font-bold text-xs">{spell.range}</p></div>
                                               <div className="space-y-0.5"><p className="text-slate-500 uppercase font-black tracking-widest opacity-70">Componentes</p><p className="text-slate-200 font-bold text-xs">{spell.components}</p></div>
                                               <div className="space-y-0.5"><p className="text-slate-500 uppercase font-black tracking-widest opacity-70">Duración</p><p className="text-slate-200 font-bold text-xs">{spell.duration}</p></div>
                                           </div>
                                           <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                <p className="text-xs text-slate-400 leading-relaxed font-body whitespace-pre-wrap">
                                                    {spell.description}
                                                </p>
                                           </div>
                                           {!isPrepared && isAtLevelLimit && (
                                                <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-red-400 uppercase bg-red-400/5 p-2 rounded-lg border border-red-400/20">
                                                    <span className="material-symbols-outlined text-sm">warning</span>
                                                    Has alcanzado el límite para Nivel {grimoireLevel}.
                                                </div>
                                           )}
                                       </div>
                                   )}
                               </div>
                           );
                       })
                   }
                   {/* Empty State in Search */}
                   {grimoireSearch && Array.from(new Set([...(SPELL_LIST_BY_CLASS[character.class] || []), ...(magicInitiateType ? SPELL_LIST_BY_CLASS[magicInitiateType] : [])])).filter(name => SPELL_DETAILS[name]?.level === grimoireLevel && name.toLowerCase().includes(grimoireSearch.toLowerCase())).length === 0 && (
                       <div className="py-20 text-center opacity-30">
                           <span className="material-symbols-outlined text-5xl mb-2">auto_stories</span>
                           <p className="text-sm font-bold">No se encontraron hechizos</p>
                       </div>
                   )}
               </div>
           </div>,
           document.body
       )}

       {/* Centered Spell Detail Modal (Used for Prepared List) */}
       {selectedSpellName && createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedSpellName(null)}>
                <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl animate-scaleUp flex flex-col max-h-[85vh] relative overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20"></div>
                    {(() => {
                        const spell = SPELL_DETAILS[selectedSpellName];
                        if (!spell) return null;
                        const summary = getSpellSummary(spell.description, spell.school);
                        
                        return (
                        <>
                            <div className="flex justify-between items-start mb-5">
                                <div className="min-w-0 pr-4">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight break-words">{selectedSpellName}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${summary.classes}`}>
                                            <span className="material-symbols-outlined text-[12px]">{summary.icon}</span>
                                            {summary.label}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-md">
                                            Nivel {spell.level === 0 ? 'Cantrip' : spell.level}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedSpellName(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar pr-1 border-t border-slate-100 dark:border-white/5 pt-5 mb-6">
                                <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6 text-xs">
                                    <div className="space-y-0.5"><p className="text-slate-400 uppercase font-black text-[9px] tracking-widest opacity-60">Tiempo</p><p className="text-slate-900 dark:text-white font-bold">{spell.castingTime}</p></div>
                                    <div className="space-y-0.5"><p className="text-slate-400 uppercase font-black text-[9px] tracking-widest opacity-60">Alcance</p><p className="text-slate-900 dark:text-white font-bold">{spell.range}</p></div>
                                    <div className="space-y-0.5"><p className="text-slate-400 uppercase font-black text-[9px] tracking-widest opacity-60">Componentes</p><p className="text-slate-900 dark:text-white font-bold">{spell.components}</p></div>
                                    <div className="space-y-0.5"><p className="text-slate-400 uppercase font-black text-[9px] tracking-widest opacity-60">Duración</p><p className="text-slate-900 dark:text-white font-bold">{spell.duration}</p></div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-body">
                                        {spell.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 shrink-0">
                                <button 
                                    onClick={() => { castSpell(spell.level || 0); setSelectedSpellName(null); }} 
                                    className="w-full py-4 rounded-2xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.97] transition-all"
                                >
                                    Lanzar Hechizo
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
