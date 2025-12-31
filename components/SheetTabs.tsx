
import React, { useState, useMemo, useEffect } from 'react';
import { Character, SheetTab, InventoryItem, Ability, ItemData, WeaponData, ArmorData } from '../types';
import { ALL_ITEMS, WEAPONS_DB, ARMOR_DB, GEAR_DB, MASTERY_DESCRIPTIONS } from '../Data/items';
import { SPELL_DETAILS, CASTER_TYPE, SPELL_LIST_BY_CLASS } from '../Data/spells';
import { CLASS_SAVING_THROWS, SPECIES_DETAILS, CLASS_DETAILS, CLASS_PROGRESSION, SUBCLASS_OPTIONS, HIT_DIE } from '../Data/characterOptions';
import { SKILL_LIST, SKILL_ABILITY_MAP } from '../Data/skills';
import { FEAT_OPTIONS, GENERIC_FEATURES } from '../Data/feats';

interface SheetTabsProps {
  character: Character;
  onBack: () => void;
  onUpdate: (char: Character) => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({ character, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('combat');
  const [inventory, setInventory] = useState<InventoryItem[]>(character.inventory || []);
  const [showAddItem, setShowAddItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  // Combat States
  const [isRaging, setIsRaging] = useState(false);

  // HP Modal State
  const [hpModal, setHpModal] = useState<{ show: boolean; type: 'damage' | 'heal' }>({ show: false, type: 'damage' });
  const [hpAmount, setHpAmount] = useState('');

  // Determine if character is a spellcaster
  const isCaster = useMemo(() => (CASTER_TYPE[character.class] || 'none') !== 'none', [character.class]);

  // Sync inventory state if character prop changes
  useEffect(() => {
      setInventory(character.inventory || []);
  }, [character.inventory, character.id]);

  // --- Derived Stats Calculations ---
  const finalStats = useMemo(() => {
      const stats = { ...character.stats };
      if (character.class === 'Barbarian' && character.level >= 20) {
          stats.STR = (stats.STR || 10) + 4;
          stats.CON = (stats.CON || 10) + 4;
      }
      if (character.class === 'Monk' && character.level >= 20) {
          stats.DEX = (stats.DEX || 10) + 4;
          stats.WIS = (stats.WIS || 10) + 4;
      }
      return stats;
  }, [character.stats, character.class, character.level]);

  const strMod = Math.floor(((finalStats.STR || 10) - 10) / 2);
  const dexMod = Math.floor(((finalStats.DEX || 10) - 10) / 2);
  
  const armorClass = useMemo(() => {
      let ac = 10 + dexMod;
      let hasArmor = false;
      let hasShield = false;
      let shieldBonus = 0;

      inventory.forEach(item => {
          if (!item.equipped) return;
          const armorData = ARMOR_DB[item.name];
          if (armorData) {
              if (armorData.armorType === 'Shield') {
                  shieldBonus += armorData.baseAC;
                  hasShield = true;
              } else {
                  hasArmor = true;
                  let mod = dexMod;
                  if (armorData.maxDex !== undefined) mod = Math.min(mod, armorData.maxDex);
                  ac = armorData.baseAC + mod;
              }
          }
      });

      if (!hasArmor) {
          if (character.class === 'Barbarian') {
              const conMod = Math.floor(((finalStats.CON || 10) - 10) / 2);
              ac = 10 + dexMod + conMod;
          } else if (character.class === 'Monk' && !hasShield) {
              const wisMod = Math.floor(((finalStats.WIS || 10) - 10) / 2);
              ac = 10 + dexMod + wisMod;
          } else if (character.class === 'Sorcerer' && character.subclass === 'Draconic Sorcery') {
              ac = 13 + dexMod;
          }
      }
      const hasDefenseStyle = character.feats.some(f => f.includes('Defense'));
      if (hasDefenseStyle && hasArmor) ac += 1;
      return ac + shieldBonus;
  }, [inventory, dexMod, character.class, character.stats, finalStats, character.feats]);

  const formatModifier = (val: number) => `${val >= 0 ? '+' : ''}${val}`;

  const updateInventory = (newInventory: InventoryItem[]) => {
      setInventory(newInventory);
      onUpdate({ ...character, inventory: newInventory });
  };

  const addItem = (itemName: string) => {
      const newItem: InventoryItem = { id: `item-${Date.now()}`, name: itemName, quantity: 1, equipped: false };
      updateInventory([...inventory, newItem]);
      setShowAddItem(false);
      setSearchQuery('');
  };

  const toggleEquip = (itemId: string) => {
      const newInv = inventory.map(item => item.id !== itemId ? item : { ...item, equipped: !item.equipped });
      updateInventory(newInv);
  };

  const removeItem = (itemId: string) => updateInventory(inventory.filter(i => i.id !== itemId));

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

  // Focus Management for Monks
  const handleFocusChange = (delta: number) => {
    if (!character.focus) {
        onUpdate({ ...character, focus: { current: Math.max(0, Math.min(character.level, character.level + delta)), max: character.level } });
        return;
    }
    const newCurrent = Math.max(0, Math.min(character.focus.max, character.focus.current + delta));
    onUpdate({ ...character, focus: { ...character.focus, current: newCurrent } });
  };

  const handleResetFocus = () => {
    onUpdate({ ...character, focus: { current: character.level, max: character.level } });
  };

  const renderCombat = () => {
    const rageDamage = character.level < 9 ? 2 : character.level < 16 ? 3 : 4;
    const hasDueling = character.feats.some(f => f.includes('Dueling'));
    const hasArchery = character.feats.some(f => f.includes('Archery'));
    const hasThrown = character.feats.some(f => f.includes('Thrown Weapon'));
    const equippedWeapons = inventory.filter(i => i.equipped && WEAPONS_DB[i.name]);
    const isDualWielding = equippedWeapons.length > 1;
    const isMonk = character.class === 'Monk';
    const focus = character.focus || { current: character.level, max: character.level };
    
    let martialArtsDie = '1d6';
    if (character.level >= 5) martialArtsDie = '1d8';
    if (character.level >= 11) martialArtsDie = '1d10';
    if (character.level >= 17) martialArtsDie = '1d12';

    return (
    <div className="px-4 pb-24">
      {/* Quick Stats */}
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

      {/* Ability Scores */}
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

      {/* Health & Resources Section */}
      <div className="flex flex-col gap-4 mb-6">
          {/* Health Card */}
          <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 relative overflow-hidden">
            {character.class === 'Barbarian' && (
                <div className="absolute top-4 right-4 z-10">
                    <button onClick={() => setIsRaging(!isRaging)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isRaging ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>
                        <span className="material-symbols-outlined text-[16px]">{isRaging ? 'local_fire_department' : 'sentiment_neutral'}</span>
                        {isRaging ? 'Furia Activa' : 'Furia'}
                    </button>
                </div>
            )}
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Puntos de Golpe</span>
                <span className="text-2xl font-bold dark:text-white text-slate-900 leading-none">{character.hp.current} <span className="text-base font-normal text-slate-400">/ {character.hp.max}</span></span>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => openHpModal('damage')} className="flex items-center justify-center size-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-transparent active:scale-95"><span className="material-symbols-outlined text-[20px]">remove</span></button>
                 <button onClick={() => openHpModal('heal')} className="flex items-center justify-center size-10 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors border border-transparent active:scale-95"><span className="material-symbols-outlined text-[20px]">add</span></button>
              </div>
            </div>
            <div className="relative h-2.5 w-full rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden">
              <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${character.hp.current < character.hp.max / 4 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (character.hp.current / character.hp.max) * 100)}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-blue-400 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">shield_moon</span> Temp: {character.hp.temp}</span>
              <span className="text-slate-400 dark:text-slate-500">Dados: {character.level}d{HIT_DIE[character.class] || 8}</span>
            </div>
          </div>

          {/* Monk Focus Points Tracker */}
          {isMonk && (
              <div className="flex flex-col gap-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 p-4 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-500/20 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="material-symbols-outlined">self_improvement</span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Puntos de Foco</span>
                            <span className="text-xl font-bold dark:text-white text-slate-900 leading-none">{focus.current} <span className="text-sm font-normal text-slate-400">/ {focus.max}</span></span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            disabled={focus.current <= 0}
                            onClick={() => handleFocusChange(-1)}
                            className={`flex items-center justify-center size-9 rounded-lg transition-all border ${focus.current <= 0 ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed' : 'bg-white dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-500 hover:text-white active:scale-95'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <button 
                            disabled={focus.current >= focus.max}
                            onClick={() => handleFocusChange(1)}
                            className={`flex items-center justify-center size-9 rounded-lg transition-all border ${focus.current >= focus.max ? 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed' : 'bg-white dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-500 hover:text-white active:scale-95'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                    </div>
                </div>
                {/* Visual dots for focus points */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {Array.from({ length: focus.max }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 flex-1 min-w-[8px] rounded-full transition-all duration-300 ${i < focus.current ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-slate-200 dark:bg-white/5'}`}
                        ></div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-indigo-500/70 dark:text-indigo-400/50 uppercase tracking-tighter">
                    <span>Recuperar: Descanso Corto o Largo</span>
                    <button onClick={handleResetFocus} className="hover:text-indigo-600 underline">Reset</button>
                </div>
              </div>
          )}
      </div>

      {/* Weapons */}
      <div className="flex items-center justify-between group cursor-pointer mb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Equipped Weapons</h3>
      </div>
      <div className="flex flex-col gap-3 mb-6">
         {inventory.filter(i => i.equipped && WEAPONS_DB[i.name]).map(item => {
             const weapon = WEAPONS_DB[item.name];
             const isFinesse = weapon.properties.includes('Finesse');
             const isRanged = weapon.rangeType === 'Ranged';
             const isTwoHanded = weapon.properties.includes('Two-Handed'); 
             const isMonkWeapon = isMonk && (
                (weapon.category === 'Simple' && weapon.rangeType === 'Melee') ||
                (weapon.category === 'Martial' && weapon.rangeType === 'Melee' && weapon.properties.includes('Light'))
             );
             let useDex = isRanged || (isFinesse && dexMod > strMod);
             if (isMonk && (isMonkWeapon || weapon.name === 'Unarmed Strike')) {
                 if (dexMod > strMod) useDex = true;
             }
             let mod = useDex ? dexMod : strMod;
             let toHit = character.profBonus + mod;
             let dmgMod = mod;
             let damageDie = weapon.damage;
             if (isMonk && (isMonkWeapon || weapon.name === 'Unarmed Strike')) {
                 const getDieSize = (s: string) => {
                    if (s === '1') return 1;
                    const parts = s.split('d');
                    return parts.length > 1 ? parseInt(parts[1]) : 0;
                 };
                 if (weapon.name === 'Unarmed Strike' || getDieSize(martialArtsDie) > getDieSize(weapon.damage)) {
                     damageDie = martialArtsDie;
                 }
             }
             let activeBonuses: string[] = [];
             if (hasArchery && isRanged) { toHit += 2; activeBonuses.push("Archery +2"); }
             if (isRaging && !useDex && weapon.rangeType === 'Melee') { dmgMod += rageDamage; activeBonuses.push(`Rage +${rageDamage}`); }
             if (hasDueling && weapon.rangeType === 'Melee' && !isTwoHanded && !isDualWielding) { dmgMod += 2; activeBonuses.push("Dueling +2"); }
             if (hasThrown && weapon.properties.some(p => p.includes('Thrown'))) { dmgMod += 2; activeBonuses.push("Thrown +2"); }

             return (
             <div key={item.id} className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 hover:ring-primary/50 transition-all">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex gap-3">
                       <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-300">
                          <span className="material-symbols-outlined text-[24px]">swords</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{weapon.name}</h4>
                          <div className="flex gap-1 mt-1 flex-wrap">
                              {weapon.properties.map(p => (
                                <span key={p} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300">{p}</span>
                              ))}
                              {isMonk && (isMonkWeapon || weapon.name === 'Unarmed Strike') && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">Monk</span>
                              )}
                          </div>
                       </div>
                   </div>
                   <div className="flex flex-col items-end">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</span>
                       <span className="text-sm font-medium dark:text-slate-200">{weapon.damageType}</span>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-primary/10 transition-all group">
                       <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase tracking-wider mb-1">To Hit</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">{formatModifier(toHit)}</span> 
                   </button>
                   <button className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-primary/10 transition-all group relative">
                       <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase tracking-wider mb-1">Daño</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">{damageDie}{dmgMod >= 0 ? '+' : ''}{dmgMod}</span>
                       <span className="text-[10px] text-slate-400">Mastery: {weapon.mastery}</span>
                   </button>
                </div>
             </div>
         )})}
      </div>
      
      {/* Saving Throws */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Saving Throws</h3>
        <div className="grid grid-cols-3 gap-3">
            {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(stat => {
                const mod = Math.floor(((finalStats[stat] || 10) - 10) / 2);
                const isProf = CLASS_SAVING_THROWS[character.class]?.includes(stat);
                const save = mod + (isProf ? character.profBonus : 0);
                return (
                    <div key={stat} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${isProf ? 'bg-primary/10 border-primary/30' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/5'}`}>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{stat}</span>
                        <span className={`text-xl font-bold ${isProf ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{formatModifier(save)}</span>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
  };

  const renderInventory = () => {
    const totalWeight = inventory.reduce((acc, item) => {
        const itemData = ALL_ITEMS[item.name];
        return acc + (itemData ? itemData.weight * item.quantity : 0);
    }, 0);
    const carryCap = (finalStats.STR || 10) * 15;
    const equippedItems = inventory.filter(i => i.equipped);
    const backpackItems = inventory.filter(i => !i.equipped);

    const renderItemRow = (item: InventoryItem) => {
        const itemData = ALL_ITEMS[item.name] || { name: item.name, type: 'Gear', weight: 0, cost: '-' };
        const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor';
        return (
        <div key={item.id} onClick={() => setSelectedItem(item)} className="group flex items-center gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
            <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden ${item.equipped ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-black/40 text-slate-600 dark:text-white'}`}>
                <span className="material-symbols-outlined">{itemData.type === 'Weapon' ? 'swords' : itemData.type === 'Armor' ? 'shield' : 'backpack'}</span>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-slate-900 dark:text-white font-semibold truncate">{item.name}</p>
                    {item.quantity > 1 && <span className="text-xs text-slate-500">x{item.quantity}</span>}
                </div>
                <p className="text-xs text-slate-500 font-body">{itemData.weight} lb • {itemData.cost}</p>
            </div>
            <div className="flex items-center gap-2">
                {isEquippable && (
                    <button onClick={(e) => { e.stopPropagation(); toggleEquip(item.id); }} className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${item.equipped ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-transparent'}`}>
                        {item.equipped ? 'Equipado' : 'Equipar'}
                    </button>
                )}
            </div>
        </div>
        );
    };

    return (
    <div className="flex flex-col gap-5 px-4 pb-24">
       <div className="pt-4 shrink-0">
           <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                 <label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Carga</label>
                 <span className="text-slate-800 dark:text-white text-sm font-medium"><span className={`${totalWeight > carryCap ? 'text-red-500' : 'text-primary'}`}>{totalWeight}</span> / {carryCap} lbs</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-surface-dark rounded-full overflow-hidden">
                 <div className={`h-full rounded-full ${totalWeight > carryCap ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (totalWeight / carryCap) * 100)}%` }}></div>
              </div>
           </div>
       </div>
        {equippedItems.length > 0 && (
            <div className="flex flex-col gap-3">
                <h3 className="text-slate-400 text-xs font-bold uppercase pl-1">Equipamiento</h3>
                {equippedItems.map(renderItemRow)}
            </div>
        )}
       <div className="flex flex-col gap-3">
           <h3 className="text-slate-400 text-xs font-bold uppercase pl-1">Mochila</h3>
           {backpackItems.map(renderItemRow)}
       </div>
       <button onClick={() => setShowAddItem(true)} className="text-primary text-sm font-bold flex items-center gap-1 justify-center py-4 border border-dashed border-primary/20 rounded-xl mt-2">
           <span className="material-symbols-outlined text-lg">add_circle</span> Añadir Objeto
       </button>
    </div>
  );
  };

  const renderFeatures = () => {
    const features: any[] = [];
    const speciesData = SPECIES_DETAILS[character.species];
    if (speciesData) speciesData.traits.forEach(t => features.push({...t, source: 'Raza', level: 1}));
    const classData = CLASS_DETAILS[character.class];
    const subclassList = SUBCLASS_OPTIONS[character.class] || [];
    const subclassData = subclassList.find(s => s.name === character.subclass);
    if (classData) classData.traits.forEach(t => features.push({...t, source: 'Clase', level: 1}));
    for (let l = 1; l <= character.level; l++) {
        const prog = CLASS_PROGRESSION[character.class]?.[l] || [];
        prog.forEach(featName => {
            if (l === 1 && classData?.traits.some(t => t.name === featName)) return;
            features.push({ name: featName, description: GENERIC_FEATURES[featName] || 'Rasgo de clase.', level: l, source: 'Clase' });
        });
        if (subclassData && subclassData.features[l]) {
            subclassData.features[l].forEach(t => features.push({ ...t, source: 'Subclase', level: l }));
        }
    }
    return (
        <div className="px-4 pb-24 flex flex-col gap-4 mt-4">
            {features.map((feat, idx) => (
                <div key={idx} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">{feat.name}</h4>
                        <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">{feat.source} Lvl {feat.level}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{feat.description}</p>
                </div>
            ))}
        </div>
    );
  };

  const renderSpells = () => {
    const intMod = Math.floor(((finalStats.INT || 10) - 10) / 2);
    const saveDC = 8 + character.profBonus + intMod;
    const spellsToShow = character.preparedSpells || (SPELL_LIST_BY_CLASS[character.class]?.slice(0, 4) || []);
    return (
    <div className="flex flex-col gap-6 px-4 pb-24">
       <div className="grid grid-cols-3 gap-3 mt-4">
           <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 p-3 items-center shadow-sm">
              <p className="text-primary text-2xl font-bold">{formatModifier(intMod)}</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase">MOD</p>
           </div>
           <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border-2 border-primary/20 p-3 items-center shadow-sm">
              <p className="text-gray-900 dark:text-white text-2xl font-bold">{saveDC}</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase">CD Salva</p>
           </div>
           <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 p-3 items-center shadow-sm">
              <p className="text-primary text-2xl font-bold">{formatModifier(character.profBonus + intMod)}</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase">Ataque</p>
           </div>
       </div>
       <div className="flex flex-col gap-4">
           {spellsToShow.map(spellName => {
               const spell = SPELL_DETAILS[spellName];
               if (!spell) return null;
               return (
               <div key={spellName} className="rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm p-4">
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-900 dark:text-white text-lg font-bold">{spell.name}</h3>
                      <span className="text-primary text-xs font-bold uppercase">Lvl {spell.level}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{spell.description}</p>
                  <button className="w-full h-10 rounded-lg bg-primary text-background-dark font-bold text-sm">Lanzar Hechizo</button>
               </div>
           )})}
       </div>
    </div>
  );
  };

  return (
    <div className="flex flex-col h-full min-h-screen relative bg-background-light dark:bg-background-dark">
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-4 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full active:bg-black/5 dark:active:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
             <h1 className="text-lg font-bold tracking-tight leading-none">{character.name}</h1>
             <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{character.species} {character.class} {character.level}</span>
        </div>
        <div className="w-10"></div>
      </nav>

      <main className="flex-1 overflow-y-auto no-scrollbar relative">
         {activeTab === 'combat' && renderCombat()}
         {activeTab === 'inventory' && renderInventory()}
         {activeTab === 'spells' && isCaster && renderSpells()}
         {activeTab === 'features' && renderFeatures()}
      </main>

      {hpModal.show && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl">
                  <h3 className={`text-xl font-bold text-center mb-4 ${hpModal.type === 'damage' ? 'text-red-500' : 'text-green-500'}`}>{hpModal.type === 'damage' ? 'Daño' : 'Curación'}</h3>
                  <input autoFocus type="number" inputMode="numeric" value={hpAmount} onChange={(e) => setHpAmount(e.target.value)} className="w-full text-center text-4xl font-bold bg-slate-100 dark:bg-black/30 rounded-2xl py-3 outline-none mb-6" placeholder="0" />
                  <div className="flex gap-3">
                      <button onClick={() => setHpModal({ ...hpModal, show: false })} className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-500">Cerrar</button>
                      <button onClick={applyHpChange} className={`flex-1 py-3 rounded-xl font-bold text-white ${hpModal.type === 'damage' ? 'bg-red-500' : 'bg-green-500'}`}>OK</button>
                  </div>
              </div>
          </div>
      )}

      {/* Footer Navigation Tabs */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 md:absolute bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-black/5 dark:border-white/5 pb-safe">
        <div className="max-w-md mx-auto flex h-16 items-center justify-around px-2">
            {[
                { id: 'combat', label: 'Combate', icon: 'swords' },
                { id: 'inventory', label: 'Bolsa', icon: 'backpack' },
                { id: 'spells', label: 'Magia', icon: 'auto_fix_high', hide: !isCaster },
                { id: 'features', label: 'Rasgos', icon: 'military_tech' }
            ].map(tab => !tab.hide && (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SheetTab)}
                    className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${activeTab === tab.id ? 'text-primary scale-105' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}
                >
                    <span className={`material-symbols-outlined text-[24px] ${activeTab === tab.id ? 'fill-1' : ''}`}>{tab.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
                    {activeTab === tab.id && <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>}
                </button>
            ))}
        </div>
      </footer>
    </div>
  );
};

export default SheetTabs;
