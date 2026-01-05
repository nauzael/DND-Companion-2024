import { createPortal } from 'react-dom';
import React, { useState, useMemo, useEffect } from 'react';
import { Character } from '../../types';
import { SPELL_DETAILS, SPELL_LIST_BY_CLASS, CANTRIPS_KNOWN_BY_LEVEL, SPELLS_KNOWN_BY_LEVEL, MAX_SPELL_LEVEL, SPELLCASTING_ABILITY } from '../../Data/spells';
import { METAMAGIC_OPTIONS } from '../../Data/characterOptions';
import { SCHOOL_THEMES, getSpellSummary, formatShort, formatModifier, getFinalStats } from '../../utils/sheetUtils';

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

    const isSorcerer = character.class === 'Sorcerer' && character.level >= 2;

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
    const currentSpells = useMemo(() => (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level > 0).length, [character.preparedSpells]);

    const toggleSlot = (level: number, index: number) => {
        const key = `${level}-${index}`;
        setUsedSlots(prev => ({ ...prev, [key]: !prev[key] }));
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
        } else onUpdate({ ...character, preparedSpells: current.filter(s => s !== spellName) });
    };

    const saveDC = 8 + character.profBonus + spellMod;
    const spellAttack = character.profBonus + spellMod;
    const preparedCount = character.preparedSpells?.length || 0;
    const spellsToShow = (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level === activeSpellLevel).sort();
    const slotCount = getSlots(effectiveCasterType, character.level, activeSpellLevel);

    return (
    <div className="flex flex-col gap-6 px-4 pb-20 relative min-h-screen">
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
                   {/* Info side */}
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

                   {/* Actions side */}
                   <div className="flex items-center gap-1.5 shrink-0 border-l border-white/10 pl-3">
                       <button 
                           onClick={() => setSorceryPoints(Math.max(0, sorceryPoints - 1))}
                           className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-purple-500/20 active:scale-90 transition-all"
                       >
                           <span className="material-symbols-outlined text-base">remove</span>
                       </button>
                       <button 
                           onClick={() => setSorceryPoints(Math.min(character.level, sorceryPoints + 1))}
                           className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-purple-500/20 active:scale-90 transition-all"
                       >
                           <span className="material-symbols-outlined text-base">add</span>
                       </button>
                       <button 
                           onClick={() => setSorceryPoints(character.level)}
                           className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-white hover:bg-purple-500/40 active:scale-90 transition-all ml-1"
                           title="Restaurar"
                       >
                           <span className="material-symbols-outlined text-base">refresh</span>
                       </button>
                   </div>
               </div>

               {character.metamagics && character.metamagics.length > 0 && (
                   <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1.5">
                       {character.metamagics.map(m => (
                           <div key={m} className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/10 text-[9px] font-bold text-purple-300/80 uppercase tracking-tight">
                               {m}
                           </div>
                       ))}
                   </div>
               )}
           </div>
       )}

       <div className="flex overflow-x-auto gap-2 no-scrollbar py-1">
           {maxCantrips > 0 && (
               <button onClick={() => setActiveSpellLevel(0)} className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${activeSpellLevel === 0 ? 'bg-primary text-background-dark' : 'bg-surface-dark text-slate-500'}`}>Cantrips</button>
           )}
           {Array.from({length: maxSpellLevel}, (_, i) => i + 1).map(lvl => (
               <button key={lvl} onClick={() => setActiveSpellLevel(lvl)} className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${activeSpellLevel === lvl ? 'bg-primary text-background-dark' : 'bg-surface-dark text-slate-500'}`}>Level {lvl}</button>
           ))}
       </div>

       {activeSpellLevel > 0 && slotCount > 0 && (
           <div className="flex flex-wrap gap-2">
              {Array.from({length: slotCount}, (_, i) => (
                  <button key={i} onClick={() => toggleSlot(activeSpellLevel, i)} className={`h-10 w-10 rounded-lg border-2 border-white/10 flex items-center justify-center ${usedSlots[`${activeSpellLevel}-${i}`] ? 'bg-surface-dark' : 'bg-primary/20 border-primary/50'}`}>
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
               const theme = SCHOOL_THEMES[spell.school] || { text: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/5', icon: 'auto_stories' };
               return (
               <div key={spellName} onClick={() => setSelectedSpellName(spellName)} className={`p-4 rounded-xl bg-surface-dark border ${theme.border} shadow-sm cursor-pointer flex items-center justify-between active:scale-[0.99]`}>
                  <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.bg} ${theme.text} shrink-0`}><span className="font-bold text-sm">{spell.level === 0 ? 'C' : spell.level}</span></div>
                      <div>
                          <h3 className="text-white font-bold leading-tight truncate">{spell.name}</h3>
                          <div className="flex gap-2 mt-0.5"><span className={`text-[10px] uppercase font-bold ${theme.text}`}>{spell.school}</span></div>
                      </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-500">chevron_right</span>
               </div>
           )})}
       </div>

       <div className="fixed bottom-24 right-6 z-20">
            <button onClick={() => setShowGrimoire(true)} className="flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-primary text-background-dark font-bold shadow-lg hover:scale-105 transition-transform"><span className="material-symbols-outlined">menu_book</span><span>Grimorio</span></button>
       </div>

       {showGrimoire && createPortal(
           <div className="fixed inset-0 z-50 bg-background-dark flex flex-col pt-[env(safe-area-inset-top)]">
               <div className="flex items-center gap-4 p-4 bg-surface-dark border-b border-white/10">
                   <button onClick={() => setShowGrimoire(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white"><span className="material-symbols-outlined">close</span></button>
                   <div className="flex-1 relative">
                       <input type="text" placeholder="Buscar..." value={grimoireSearch} onChange={(e) => setGrimoireSearch(e.target.value)} className="w-full bg-black/20 border border-white/5 rounded-xl py-2 pl-10 text-white outline-none focus:border-primary/50"/>
                       <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500">search</span>
                   </div>
               </div>
               <div className="flex overflow-x-auto gap-2 p-2 bg-surface-dark border-b border-white/5">
                   {Array.from({length: maxSpellLevel + 1}, (_, i) => (
                       <button key={i} onClick={() => setGrimoireLevel(i)} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${grimoireLevel === i ? 'bg-white text-background-dark' : 'bg-white/5 text-slate-400'}`}>{i === 0 ? 'Cantrips' : `Lvl ${i}`}</button>
                   ))}
               </div>
               <div className="flex-1 overflow-y-auto p-4 gap-2 flex flex-col pb-24">
                   {Array.from(new Set([...(SPELL_LIST_BY_CLASS[character.class] || []), ...(magicInitiateType ? SPELL_LIST_BY_CLASS[magicInitiateType] : [])]))
                       .filter(name => SPELL_DETAILS[name]?.level === grimoireLevel && name.toLowerCase().includes(grimoireSearch.toLowerCase()))
                       .sort()
                       .map(name => {
                           const isPrepared = (character.preparedSpells || []).includes(name);
                           return (
                               <div key={name} className={`flex items-center rounded-xl border ${isPrepared ? 'bg-primary/5 border-primary/50' : 'bg-surface-dark border-white/5'}`}>
                                   <button onClick={() => setExpandedGrimoireId(expandedGrimoireId === name ? null : name)} className="flex-1 p-3 text-left">
                                       <p className={`font-bold ${isPrepared ? 'text-primary' : 'text-white'}`}>{name}</p>
                                   </button>
                                   <button onClick={() => togglePreparedSpell(name)} className={`p-4 border-l border-white/5 ${isPrepared ? 'text-primary' : 'text-slate-400'}`}>
                                        <span className="material-symbols-outlined">{isPrepared ? 'check_circle' : 'add_circle'}</span>
                                   </button>
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
                <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                    {(() => {
                        const spell = SPELL_DETAILS[selectedSpellName];
                        if (!spell) return null;
                        return (
                        <>
                            <div className="flex justify-between items-start mb-4">
                                <div><h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedSpellName}</h3><span className="text-xs font-bold text-primary uppercase">{spell.school}</span></div>
                                <button onClick={() => setSelectedSpellName(null)} className="text-slate-400"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-1 mb-4">
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{spell.description}</p>
                            </div>
                            <button onClick={() => { castSpell(spell.level || 0); setSelectedSpellName(null); }} className="w-full py-3 rounded-xl bg-primary text-background-dark font-bold">Lanzar Hechizo</button>
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