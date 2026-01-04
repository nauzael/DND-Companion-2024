
import React, { useState, useMemo } from 'react';
import { Character, Ability, WeaponData } from '../../types';
import { SKILL_LIST, SKILL_ABILITY_MAP } from '../../Data/skills';
import { MASTERY_DESCRIPTIONS } from '../../Data/items';
import { CLASS_SAVING_THROWS } from '../../Data/characterOptions';
import { getFinalStats, getArmorClass, formatModifier, getItemData } from '../../utils/sheetUtils';

interface CombatTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
}

const CombatTab: React.FC<CombatTabProps> = ({ character, onUpdate }) => {
    const [isRaging, setIsRaging] = useState(false);
    const [hpModal, setHpModal] = useState<{ show: boolean; type: 'damage' | 'heal' }>({ show: false, type: 'damage' });
    const [hpAmount, setHpAmount] = useState('');
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    const finalStats = useMemo(() => getFinalStats(character), [character]);
    const armorClass = useMemo(() => getArmorClass(character, finalStats), [character, finalStats]);

    const strMod = Math.floor(((finalStats.STR || 10) - 10) / 2);
    const dexMod = Math.floor(((finalStats.DEX || 10) - 10) / 2);

    const openHpModal = (type: 'damage' | 'heal') => {
        setHpModal({ show: true, type });
        setHpAmount('');
    };

    const applyHpChange = () => {
        const amount = parseInt(hpAmount);
        if (isNaN(amount) || amount <= 0) {
            setHpModal({ ...hpModal, show: false });
            return;
        }
        let newCurrent = character.hp.current;
        let newTemp = character.hp.temp;
        if (hpModal.type === 'heal') {
            newCurrent = Math.min(character.hp.max, newCurrent + amount);
        } else {
            let remainingDamage = amount;
            if (isRaging) remainingDamage = Math.floor(remainingDamage / 2);
            if (newTemp > 0) {
                const absorbed = Math.min(newTemp, remainingDamage);
                newTemp -= absorbed;
                remainingDamage -= absorbed;
            }
            newCurrent = Math.max(0, newCurrent - remainingDamage);
        }
        onUpdate({ ...character, hp: { ...character.hp, current: newCurrent, temp: newTemp } });
        setHpModal({ ...hpModal, show: false });
    };

    const renderWeapons = () => {
        const rageDamage = character.level < 9 ? 2 : character.level < 16 ? 3 : 4;
        const hasDueling = character.feats.some(f => f.includes('Dueling'));
        const hasArchery = character.feats.some(f => f.includes('Archery'));
        const hasThrown = character.feats.some(f => f.includes('Thrown Weapon'));
        const isMonk = character.class === 'Monk';
        let martialArtsDie = '1d6';
        if (character.level >= 5) martialArtsDie = '1d8';
        if (character.level >= 11) martialArtsDie = '1d10';
        if (character.level >= 17) martialArtsDie = '1d12';
        
        let unarmedBonus = 0;
        const equippedWraps = character.inventory.find(i => i.equipped && i.name.includes('Wraps of Unarmed Power'));
        if (equippedWraps) {
            if (equippedWraps.name.includes('+1')) unarmedBonus = 1;
            else if (equippedWraps.name.includes('+2')) unarmedBonus = 2;
            else if (equippedWraps.name.includes('+3')) unarmedBonus = 3;
        }

        const equippedWeapons = character.inventory.filter(i => {
            if (!i.equipped) return false;
            const itemData = getItemData(i.name);
            return itemData && itemData.type === 'Weapon';
        });
        
        const isDualWielding = equippedWeapons.length > 1;

        return equippedWeapons.map(item => {
            const weapon = getItemData(item.name) as WeaponData;
            if (!weapon) return null;

            const isFinesse = weapon.properties.includes('Finesse');
            const isRanged = weapon.rangeType === 'Ranged';
            const isThrown = weapon.properties.some(p => p.includes('Thrown'));
            const isTwoHanded = weapon.properties.includes('Two-Handed'); 
            const isMonkWeapon = isMonk && (
                (weapon.category === 'Simple' && weapon.rangeType === 'Melee') ||
                (weapon.category === 'Martial' && weapon.rangeType === 'Melee' && weapon.properties.includes('Light'))
            );
            let useDex = isRanged || (isFinesse && dexMod > strMod);
            if (isMonk && (isMonkWeapon || weapon.name === 'Unarmed Strike')) if (dexMod > strMod) useDex = true;
            let mod = useDex ? dexMod : strMod;
            let toHit = character.profBonus + mod;
            let dmgMod = mod;
            let damageDie = weapon.damage;
            if (isMonk && (isMonkWeapon || weapon.name === 'Unarmed Strike')) {
                const getDieSize = (s: string) => { if (s === '1') return 1; const parts = s.split('d'); return parts.length > 1 ? parseInt(parts[1]) : 0; };
                if (weapon.name === 'Unarmed Strike' || getDieSize(martialArtsDie) > getDieSize(weapon.damage)) damageDie = martialArtsDie;
            }
            let activeBonuses: string[] = [];
            if (hasArchery && isRanged) { toHit += 2; activeBonuses.push("Archery +2"); }
            if (isRaging && !useDex && weapon.rangeType === 'Melee') { dmgMod += rageDamage; activeBonuses.push(`Rage +${rageDamage}`); }
            if (hasDueling && weapon.rangeType === 'Melee' && !isTwoHanded && !isDualWielding) { dmgMod += 2; activeBonuses.push("Dueling +2"); }
            if (hasThrown && isThrown) { dmgMod += 2; activeBonuses.push("Thrown +2"); }

            if (item.name.includes('+1')) { toHit += 1; dmgMod += 1; }
            if (item.name.includes('+2')) { toHit += 2; dmgMod += 2; }
            if (item.name.includes('+3')) { toHit += 3; dmgMod += 3; }
            if (item.name === 'Sun Blade') { toHit += 2; dmgMod += 2; }
            if (item.name === 'Holy Avenger') { toHit += 3; dmgMod += 3; }

            if (weapon.name === 'Unarmed Strike' && unarmedBonus > 0) {
                toHit += unarmedBonus;
                dmgMod += unarmedBonus;
                activeBonuses.push(`Wraps +${unarmedBonus}`);
            }

            return (
                <div key={item.id} className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 hover:ring-primary/50 dark:hover:ring-primary/50 transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-[24px]">swords</span></div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                <div className="flex gap-1 mt-1 flex-wrap">
                                    {weapon.properties.map(p => (<span key={p} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300">{p}</span>))}
                                    {isMonk && (isMonkWeapon || weapon.name === 'Unarmed Strike') && (<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300">Monk</span>)}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</span>
                            <span className="text-sm font-medium dark:text-slate-200">{weapon.damageType}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-primary/10 dark:hover:bg-primary/20 hover:ring-1 ring-primary/50 transition-all group">
                            <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase tracking-wider mb-1">To Hit</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">{formatModifier(toHit)}</span> 
                        </button>
                        <button className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-primary/10 dark:hover:bg-primary/20 hover:ring-1 ring-primary/50 transition-all group relative">
                            <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase tracking-wider mb-1">Damage</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">{damageDie}{dmgMod >= 0 ? '+' : ''}{dmgMod}</span>
                            <span className="text-[10px] text-slate-400">Mastery: {weapon.mastery}</span>
                            {activeBonuses.length > 0 && (
                                <div className="absolute -top-2 -right-2 flex gap-1">
                                    {activeBonuses.some(b => b.includes('Rage')) && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                    {activeBonuses.some(b => b.includes('Dueling')) && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                </div>
                            )}
                        </button>
                    </div>
                    {activeBonuses.length > 0 && (<div className="mt-2 flex gap-2 flex-wrap">{activeBonuses.map(b => (<span key={b} className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{b}</span>))}</div>)}
                </div>
            );
        });
    };

    return (
        <div className="px-4 pb-20">
            <div className="grid grid-cols-4 gap-3 my-4">
                {[
                    { icon: "shield", label: "AC", value: armorClass, color: "text-primary" },
                    { icon: "bolt", label: "Init", value: formatModifier(character.init), color: "text-yellow-500" },
                    { icon: "sprint", label: "Spd", value: character.speed, color: "text-blue-400" },
                    { icon: "school", label: "Prof", value: `+${character.profBonus}`, color: "text-purple-400" },
                ].map(stat => (
                    <div key={stat.label} className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-surface-dark p-3 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className={`material-symbols-outlined mb-1 ${stat.color} text-[20px]`}>{stat.icon}</span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
                        <span className="text-xl font-bold dark:text-white text-slate-900 leading-none mt-1">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(stat => {
                    const score = finalStats[stat] || 10;
                    const mod = Math.floor((score - 10) / 2);
                    return (
                        <div key={stat} className="flex flex-col items-center p-2 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat}</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-bold text-slate-900 dark:text-white leading-none">{formatModifier(mod)}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{score}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 mb-6 relative overflow-hidden">
                {character.class === 'Barbarian' && (
                    <div className="flex justify-end mb-2">
                        <button 
                            onClick={() => setIsRaging(!isRaging)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isRaging ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{isRaging ? 'local_fire_department' : 'sentiment_neutral'}</span>
                            {isRaging ? 'Furia Activa' : 'Furia'}
                        </button>
                    </div>
                )}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Hit Points</span>
                        <span className="text-2xl font-bold dark:text-white text-slate-900 leading-none">{character.hp.current} <span className="text-base font-normal text-slate-400">/ {character.hp.max}</span></span>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0">
                        <button onClick={() => openHpModal('damage')} className="flex items-center justify-center size-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-transparent hover:border-red-600 active:scale-95"><span className="material-symbols-outlined text-[20px]">remove</span></button>
                        <button onClick={() => openHpModal('heal')} className="flex items-center justify-center size-10 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors border border-transparent hover:border-green-600 active:scale-95"><span className="material-symbols-outlined text-[20px]">add</span></button>
                    </div>
                </div>
                <div className="relative h-3 w-full rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden">
                    <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${character.hp.current < character.hp.max / 4 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (character.hp.current / character.hp.max) * 100)}%` }}></div>
                </div>
            </div>

            <div className="flex items-center justify-between group cursor-pointer mb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Equipped Weapons</h3>
            </div>
            <div className="flex flex-col gap-3 mb-6">
                {renderWeapons()}
            </div>
      
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Saving Throws</h3>
                <div className="grid grid-cols-3 gap-3">
                    {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(stat => {
                        const mod = Math.floor(((finalStats[stat] || 10) - 10) / 2);
                        const isProf = CLASS_SAVING_THROWS[character.class]?.includes(stat);
                        let save = mod + (isProf ? character.profBonus : 0);
                        
                        if (character.inventory.some(i => i.equipped && (i.name === 'Cloak of Protection' || i.name === 'Ring of Protection'))) save += 1;
                        
                        return (
                            <div key={stat} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${isProf ? 'bg-primary/10 border-primary/30' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/5'}`}>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{stat}</span>
                                <span className={`text-xl font-bold ${isProf ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{formatModifier(save)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="pb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Skills</h3>
                <div className="grid grid-cols-2 gap-2">
                    {SKILL_LIST.map(skill => {
                        const ability = SKILL_ABILITY_MAP[skill];
                        const mod = Math.floor(((finalStats[ability] || 10) - 10) / 2);
                        const isProf = character.skills.includes(skill);
                        const total = mod + (isProf ? character.profBonus : 0);
                        return (
                            <button key={skill} onClick={() => setSelectedSkill(skill)} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/50 transition-all active:scale-[0.99] cursor-pointer">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isProf ? 'bg-primary shadow-[0_0_6px_rgba(53,158,255,0.8)]' : 'bg-slate-300 dark:bg-white/10'}`}></div>
                                    <div className="flex flex-col truncate text-left">
                                        <span className={`font-bold text-xs truncate ${isProf ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{skill}</span>
                                        <span className="text-[9px] font-normal opacity-50 uppercase leading-none">{ability}</span>
                                    </div>
                                </div>
                                <span className={`font-bold text-xs ${isProf ? 'text-primary' : 'text-slate-400'}`}>{formatModifier(total)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* HP Edit Modal */}
            {hpModal.show && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setHpModal({ ...hpModal, show: false })}>
                    <div className="w-full max-w-[280px] bg-white dark:bg-surface-dark p-5 rounded-3xl shadow-2xl scale-100 transition-transform" onClick={e => e.stopPropagation()}>
                        <h3 className="text-center font-bold text-lg mb-4 text-slate-900 dark:text-white">
                            {hpModal.type === 'heal' ? 'Curar' : 'Daño'}
                        </h3>
                        <input 
                            type="number" 
                            value={hpAmount}
                            onChange={(e) => setHpAmount(e.target.value)}
                            autoFocus
                            className="w-full text-center text-4xl font-bold bg-transparent border-b-2 border-slate-200 dark:border-white/10 py-2 mb-6 outline-none focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            placeholder="0"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setHpModal({ ...hpModal, show: false })} className="py-3 rounded-xl font-bold text-sm text-slate-500 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Cancelar</button>
                            <button onClick={applyHpChange} className={`py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95 ${hpModal.type === 'heal' ? 'bg-green-500 shadow-green-500/30' : 'bg-red-500 shadow-red-500/30'}`}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CombatTab;
