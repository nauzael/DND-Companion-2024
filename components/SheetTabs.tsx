
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

  // Sync inventory state if character prop changes (e.g. from parent update)
  useEffect(() => {
      setInventory(character.inventory || []);
  }, [character.inventory]);

  // --- Derived Stats Calculations (Enhanced) ---
  
  // 1. Base Stats with Capstones applied
  const finalStats = useMemo(() => {
      const stats = { ...character.stats };
      
      // Barbarian Level 20: Primal Champion (+4 STR/CON)
      if (character.class === 'Barbarian' && character.level >= 20) {
          stats.STR = (stats.STR || 10) + 4;
          stats.CON = (stats.CON || 10) + 4;
      }
      
      // Monk Level 20: Body and Mind (+4 DEX/WIS)
      if (character.class === 'Monk' && character.level >= 20) {
          stats.DEX = (stats.DEX || 10) + 4;
          stats.WIS = (stats.WIS || 10) + 4;
      }

      return stats;
  }, [character.stats, character.class, character.level]);

  const strMod = Math.floor(((finalStats.STR || 10) - 10) / 2);
  const dexMod = Math.floor(((finalStats.DEX || 10) - 10) / 2);
  
  // Calculate AC
  const armorClass = useMemo(() => {
      let ac = 10 + dexMod;
      let hasArmor = false;
      let hasShield = false;
      let shieldBonus = 0;

      // Scan inventory for equipped armor/shield
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
                  if (armorData.maxDex !== undefined) {
                      mod = Math.min(mod, armorData.maxDex);
                  }
                  ac = armorData.baseAC + mod;
              }
          }
      });

      // Unarmored Defense (Barbarian/Monk) simple check
      if (!hasArmor) {
          if (character.class === 'Barbarian') {
              const conMod = Math.floor(((finalStats.CON || 10) - 10) / 2);
              ac = 10 + dexMod + conMod;
          } else if (character.class === 'Monk' && !hasShield) {
              const wisMod = Math.floor(((finalStats.WIS || 10) - 10) / 2);
              ac = 10 + dexMod + wisMod;
          }
          // Sorcerer Draconic Resilience
          else if (character.class === 'Sorcerer' && character.subclass === 'Draconic Sorcery') {
              ac = 13 + dexMod;
          }
      }

      // Fighting Style: Defense (needs detection, assumed +1 if wearing armor)
      const hasDefenseStyle = character.feats.some(f => f.includes('Fighting Style: Defense') || f.includes('Defense'));
      if (hasDefenseStyle && hasArmor) ac += 1;

      return ac + shieldBonus;
  }, [inventory, dexMod, character.class, character.stats, finalStats, character.feats]);

  const formatModifier = (val: number) => {
    return `${val >= 0 ? '+' : ''}${val}`;
  };

  // --- Inventory Handlers ---
  const updateInventory = (newInventory: InventoryItem[]) => {
      setInventory(newInventory);
      onUpdate({ ...character, inventory: newInventory });
  };

  const addItem = (itemName: string) => {
      const newItem: InventoryItem = {
          id: `item-${Date.now()}`,
          name: itemName,
          quantity: 1,
          equipped: false
      };
      updateInventory([...inventory, newItem]);
      setShowAddItem(false);
      setSearchQuery('');
  };

  const toggleEquip = (itemId: string) => {
      const newInv = inventory.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, equipped: !item.equipped };
      });
      updateInventory(newInv);
  };

  const removeItem = (itemId: string) => {
      updateInventory(inventory.filter(i => i.id !== itemId));
  };

  // --- HP Handlers ---
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
          // Damage logic: Absorb with Temp HP first
          let remainingDamage = amount;
          if (newTemp > 0) {
              const absorbed = Math.min(newTemp, remainingDamage);
              newTemp -= absorbed;
              remainingDamage -= absorbed;
          }
          // Barbarian Rage Resistance (Simple generic halving for demo, normally specific types)
          if (isRaging) {
             // In a real app, we'd ask for damage type. Here we assume physical resistance.
             // remainingDamage = Math.floor(remainingDamage / 2); 
             // Commented out to avoid confusion without type selector
          }
          newCurrent = Math.max(0, newCurrent - remainingDamage);
      }

      onUpdate({
          ...character,
          hp: { ...character.hp, current: newCurrent, temp: newTemp }
      });
      setHpModal({ ...hpModal, show: false });
  };

  const renderCombat = () => {
    // Determine Rage Damage Bonus
    const rageDamage = character.level < 9 ? 2 : character.level < 16 ? 3 : 4;

    // Detect Fighting Styles from feats string
    const hasDueling = character.feats.some(f => f.includes('Dueling'));
    const hasArchery = character.feats.some(f => f.includes('Archery'));
    const hasThrown = character.feats.some(f => f.includes('Thrown Weapon'));
    
    // Check for shield
    const hasShield = inventory.some(i => i.equipped && ARMOR_DB[i.name]?.armorType === 'Shield');
    
    // Check equipped weapons count for Dueling logic (Simple check: count main hand weapons)
    const equippedWeapons = inventory.filter(i => i.equipped && WEAPONS_DB[i.name]);
    const isDualWielding = equippedWeapons.length > 1;

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

      {/* HP Section */}
      <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 mb-6 relative overflow-hidden">
        {/* Barbarian Rage Toggle */}
        {character.class === 'Barbarian' && (
            <div className="absolute top-4 right-4 z-10">
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
             <button 
                onClick={() => openHpModal('damage')}
                className="flex items-center justify-center size-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-transparent hover:border-red-600 active:scale-95"
                title="Recibir Daño"
             >
                <span className="material-symbols-outlined text-[20px]">remove</span>
             </button>
             <button 
                onClick={() => openHpModal('heal')}
                className="flex items-center justify-center size-10 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors border border-transparent hover:border-green-600 active:scale-95"
                title="Curar"
             >
                <span className="material-symbols-outlined text-[20px]">add</span>
             </button>
          </div>
        </div>
        <div className="relative h-3 w-full rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${character.hp.current < character.hp.max / 4 ? 'bg-red-500' : 'bg-primary'}`} 
            style={{ width: `${Math.min(100, (character.hp.current / character.hp.max) * 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-xs mt-1">
          <span className="text-blue-400 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">shield_moon</span> Temp HP: {character.hp.temp}</span>
          <span className="text-slate-400 dark:text-slate-500">Hit Dice: {character.level}d{character.class ? HIT_DIE[character.class] || 8 : 8}</span>
        </div>
      </div>

      {/* Weapons */}
      <div className="flex items-center justify-between group cursor-pointer mb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Equipped Weapons</h3>
      </div>
      <div className="flex flex-col gap-3 mb-6">
         {inventory.filter(i => i.equipped && WEAPONS_DB[i.name]).map(item => {
             const weapon = WEAPONS_DB[item.name];
             
             // --- Advanced Calc Logic ---
             const isFinesse = weapon.properties.includes('Finesse');
             const isRanged = weapon.rangeType === 'Ranged';
             const isThrown = weapon.properties.some(p => p.includes('Thrown'));
             const isHeavy = weapon.properties.includes('Heavy');
             const isTwoHanded = weapon.properties.includes('Two-Handed'); // Simplified, versatile handled by user choice usually but here assuming 1H unless strict 2H
             
             // Ability Modifier
             let useDex = isRanged || (isFinesse && dexMod > strMod);
             let mod = useDex ? dexMod : strMod;
             
             // Base Hit Bonus
             let toHit = character.profBonus + mod;
             
             // Base Damage Bonus
             let dmgMod = mod;

             // --- Feature Modifiers ---
             let activeBonuses: string[] = [];

             // Archery
             if (hasArchery && isRanged) {
                 toHit += 2;
                 activeBonuses.push("Archery +2");
             }

             // Barbarian Rage
             if (isRaging && !useDex && weapon.rangeType === 'Melee') { // Rage only works on STR melee
                 dmgMod += rageDamage;
                 activeBonuses.push(`Rage +${rageDamage}`);
             }

             // Dueling (Melee, 1H, no other weapon - checking isDualWielding is a rough approx here)
             if (hasDueling && weapon.rangeType === 'Melee' && !isTwoHanded && !isDualWielding) {
                 dmgMod += 2;
                 activeBonuses.push("Dueling +2");
             }

             // Thrown Weapon Fighting
             if (hasThrown && hasThrown) { // Check variable name typo fix
                 dmgMod += 2;
                 activeBonuses.push("Thrown +2");
             }

             return (
             <div key={item.id} className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 hover:ring-primary/50 dark:hover:ring-primary/50 transition-all">
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
                       <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">{weapon.damage}{dmgMod >= 0 ? '+' : ''}{dmgMod}</span>
                       <span className="text-[10px] text-slate-400">Mastery: {weapon.mastery}</span>
                       
                       {/* Active Bonus Indicators */}
                       {activeBonuses.length > 0 && (
                           <div className="absolute -top-2 -right-2 flex gap-1">
                               {activeBonuses.some(b => b.includes('Rage')) && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                               {activeBonuses.some(b => b.includes('Dueling')) && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                           </div>
                       )}
                   </button>
                </div>
                {activeBonuses.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                        {activeBonuses.map(b => (
                            <span key={b} className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">{b}</span>
                        ))}
                    </div>
                )}
             </div>
         )})}
         {inventory.filter(i => i.equipped && WEAPONS_DB[i.name]).length === 0 && (
             <div className="text-center p-4 text-slate-400 text-sm italic border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                 No equipped weapons. Go to Inventory to equip.
             </div>
         )}
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
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{stat}</span>
                        <span className={`text-xl font-bold ${isProf ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{formatModifier(save)}</span>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Skills */}
      <div className="pb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Skills</h3>
        <div className="grid grid-cols-2 gap-2">
            {SKILL_LIST.map(skill => {
                const ability = SKILL_ABILITY_MAP[skill];
                const mod = Math.floor(((finalStats[ability] || 10) - 10) / 2);
                const isProf = character.skills.includes(skill);
                const total = mod + (isProf ? character.profBonus : 0);
                
                return (
                    <div key={skill} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isProf ? 'bg-primary shadow-[0_0_6px_rgba(53,158,255,0.8)]' : 'bg-slate-300 dark:bg-white/10'}`}></div>
                            <div className="flex flex-col truncate">
                                <span className={`font-bold text-xs truncate ${isProf ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                    {skill}
                                </span>
                                <span className="text-[9px] font-normal opacity-50 uppercase leading-none">{ability}</span>
                            </div>
                        </div>
                        <span className={`font-bold text-xs ${isProf ? 'text-primary' : 'text-slate-400'}`}>{formatModifier(total)}</span>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
  };

  const renderInventory = () => {
    // Calculate total weight
    const totalWeight = inventory.reduce((acc, item) => {
        const itemData = ALL_ITEMS[item.name];
        return acc + (itemData ? itemData.weight * item.quantity : 0);
    }, 0);
    
    // Simple Str * 15 carry capacity
    const carryCap = (finalStats.STR || 10) * 15;

    const equippedItems = inventory.filter(i => i.equipped);
    const backpackItems = inventory.filter(i => !i.equipped);

    const renderItemRow = (item: InventoryItem) => {
        const itemData = ALL_ITEMS[item.name] || { name: item.name, type: 'Gear', weight: 0, cost: '-' };
        const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor';
        
        return (
        <div key={item.id} onClick={() => setSelectedItem(item)} className="group relative flex items-center gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
            <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden ${item.equipped ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-black/40 text-slate-600 dark:text-white'}`}>
            <span className="material-symbols-outlined relative z-10">
                {itemData.type === 'Weapon' ? 'swords' : itemData.type === 'Armor' ? 'shield' : 'backpack'}
            </span>
            </div>
            <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <p className="text-slate-900 dark:text-white font-semibold truncate">{item.name}</p>
                {item.quantity > 1 && <span className="text-xs text-slate-500">x{item.quantity}</span>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-body truncate">
                {itemData.weight} lb • {itemData.cost}
            </p>
            </div>
            <div className="flex items-center gap-2">
            {isEquippable && (
                <button 
                    onClick={(e) => { e.stopPropagation(); toggleEquip(item.id); }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${item.equipped ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-transparent'}`}
                >
                    {item.equipped ? 'Equipped' : 'Equip'}
                </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="text-slate-300 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
            </div>
        </div>
        );
    };

    return (
    <div className="flex flex-col gap-5 px-4 pb-24">
       {/* Encumbrance */}
       <div className="pt-4 shrink-0">
           <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                 <label className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Encumbrance</label>
                 <span className="text-slate-800 dark:text-white text-sm font-medium"><span className={`${totalWeight > carryCap ? 'text-red-500' : 'text-primary'}`}>{totalWeight}</span> / {carryCap} lbs</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-surface-dark rounded-full overflow-hidden">
                 <div className={`h-full rounded-full ${totalWeight > carryCap ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (totalWeight / carryCap) * 100)}%` }}></div>
              </div>
           </div>
       </div>

       {/* Equipped List */}
        {equippedItems.length > 0 && (
            <div className="flex flex-col gap-3">
                <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">Equipamiento ({equippedItems.length})</h3>
                {equippedItems.map(renderItemRow)}
            </div>
        )}

       {/* Items List (Backpack) */}
       <div className="flex flex-col gap-3">
           <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">Mochila ({backpackItems.length})</h3>
           {backpackItems.length === 0 && (
                <div className="p-4 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
                    <p className="text-sm text-slate-400 italic">La mochila está vacía.</p>
                </div>
           )}
           {backpackItems.map(renderItemRow)}
       </div>

       {/* Add Item Button */}
       <div className="flex justify-between items-center mb-3 mt-2">
           <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1"></h3>
           <button onClick={() => setShowAddItem(true)} className="text-primary text-sm font-bold flex items-center gap-1">
               <span className="material-symbols-outlined text-lg">add_circle</span> Add Item
           </button>
       </div>

       {/* Add Item Modal Overlay */}
       {showAddItem && (
           <div className="absolute inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col p-4 animate-fadeIn">
               <div className="flex items-center gap-3 mb-4">
                   <button onClick={() => setShowAddItem(false)} className="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                       <span className="material-symbols-outlined">close</span>
                   </button>
                   <div className="flex-1 relative">
                       <input 
                          autoFocus
                          type="text" 
                          placeholder="Search items..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 ring-primary/50"
                       />
                       <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                   </div>
               </div>
               
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                   {Object.keys(ALL_ITEMS)
                       .filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
                       .map(name => {
                           const item = ALL_ITEMS[name];
                           return (
                               <button 
                                  key={name}
                                  onClick={() => addItem(name)}
                                  className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex justify-between items-center border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
                               >
                                   <div>
                                       <p className="font-bold text-slate-900 dark:text-white">{name}</p>
                                       <p className="text-xs text-slate-500">{item.type} • {item.cost}</p>
                                   </div>
                                   <span className="material-symbols-outlined text-slate-300">add</span>
                               </button>
                           );
                       })
                   }
               </div>
           </div>
       )}

       {/* Item Detail Modal */}
       {selectedItem && (
         <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedItem(null)}>
            <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                {(() => {
                    const itemData = (ALL_ITEMS[selectedItem.name] || { name: selectedItem.name, type: 'Gear', weight: 0, cost: '-', description: '' }) as ItemData;
                    const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor';
                    
                    const asWeapon = itemData as WeaponData;
                    const asArmor = itemData as ArmorData;

                    return (
                        <>
                           <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedItem.name}</h3>
                                    <span className="text-sm text-slate-500">{itemData.type}</span>
                                </div>
                                <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                           </div>

                           <div className="space-y-3 mb-6">
                               <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                   <span className="text-sm text-slate-500">Weight</span>
                                   <span className="font-bold text-slate-900 dark:text-white">{itemData.weight} lb</span>
                               </div>
                               <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                   <span className="text-sm text-slate-500">Cost</span>
                                   <span className="font-bold text-slate-900 dark:text-white">{itemData.cost}</span>
                               </div>
                               {itemData.type === 'Weapon' && (
                                   <>
                                     <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                         <span className="text-sm text-slate-500">Damage</span>
                                         <span className="font-bold text-slate-900 dark:text-white">{asWeapon.damage} {asWeapon.damageType}</span>
                                     </div>
                                     {asWeapon.properties && asWeapon.properties.length > 0 && (
                                         <div className="py-2 border-b border-slate-100 dark:border-white/5">
                                             <span className="text-sm text-slate-500 block mb-1">Properties</span>
                                             <div className="flex flex-wrap gap-1">
                                                 {asWeapon.properties.map(p => (
                                                     <span key={p} className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded text-xs font-medium text-slate-600 dark:text-slate-300">{p}</span>
                                                 ))}
                                             </div>
                                         </div>
                                     )}
                                     {asWeapon.mastery && (
                                         <div className="py-2 border-b border-slate-100 dark:border-white/5">
                                             <span className="text-sm text-slate-500 block mb-1">Mastery: <span className="font-bold text-primary">{asWeapon.mastery}</span></span>
                                             <p className="text-xs text-slate-400 italic">
                                                 {MASTERY_DESCRIPTIONS[asWeapon.mastery]}
                                             </p>
                                         </div>
                                     )}
                                   </>
                               )}
                               {itemData.type === 'Armor' && (
                                   <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                                       <span className="text-sm text-slate-500">AC</span>
                                       <span className="font-bold text-slate-900 dark:text-white">{asArmor.baseAC} {asArmor.armorType === 'Shield' ? '(Shield)' : asArmor.armorType === 'Light' ? '+ Dex' : asArmor.armorType === 'Medium' ? '+ Dex (max 2)' : ''}</span>
                                   </div>
                               )}
                               {itemData.description && (
                                   <div className="py-2">
                                       <p className="text-sm text-slate-600 dark:text-slate-300 italic">{itemData.description}</p>
                                   </div>
                               )}
                           </div>

                           <div className="grid grid-cols-2 gap-3">
                               {isEquippable && (
                                   <button 
                                      onClick={() => { toggleEquip(selectedItem.id); setSelectedItem(null); }}
                                      className={`py-3 rounded-xl font-bold text-sm transition-colors ${selectedItem.equipped ? 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' : 'bg-primary text-background-dark'}`}
                                   >
                                       {selectedItem.equipped ? 'Unequip' : 'Equip'}
                                   </button>
                               )}
                               <button 
                                  onClick={() => { removeItem(selectedItem.id); setSelectedItem(null); }}
                                  className={`py-3 rounded-xl font-bold text-sm bg-red-500/10 text-red-500 border border-transparent hover:border-red-500 transition-colors ${!isEquippable ? 'col-span-2' : ''}`}
                               >
                                   Remove
                               </button>
                           </div>
                        </>
                    );
                })()}
            </div>
         </div>
       )}
    </div>
  );
  };

  const renderFeatures = () => {
    const features: { name: string; description: string; level: number; source: string }[] = [];
    
    // Species Traits
    const speciesData = SPECIES_DETAILS[character.species];
    if (speciesData) {
        speciesData.traits.forEach(t => features.push({...t, source: 'Raza', level: 1}));
    }

    // Class & Subclass
    const classData = CLASS_DETAILS[character.class];
    const subclassList = SUBCLASS_OPTIONS[character.class] || [];
    const subclassData = subclassList.find(s => s.name === character.subclass);

    // Lvl 1 Class Traits
    if (classData) {
        classData.traits.forEach(t => {
             features.push({...t, source: 'Clase', level: 1});
        });
    }

    // Progression
    for (let l = 1; l <= character.level; l++) {
        const prog = CLASS_PROGRESSION[character.class]?.[l] || [];
        prog.forEach(featName => {
            if (l === 1 && classData?.traits.some(t => t.name === featName)) return;
            
            let desc = GENERIC_FEATURES[featName] || '';
            if (featName === 'Ability Score Improvement') desc = "Mejora de características o Dote.";
            
            features.push({ name: featName, description: desc, level: l, source: 'Clase' });
        });

        // Subclass
        if (subclassData && subclassData.features[l]) {
            subclassData.features[l].forEach(t => {
                features.push({ ...t, source: 'Subclase', level: l });
            });
        }
    }
    
    // Feats
    character.feats.forEach(f => {
        // Try to find feat desc
        const featOpt = FEAT_OPTIONS.find(fo => fo.name === f);
        features.push({ name: f, description: featOpt?.description || 'Dote', level: 1, source: 'Dote' });
    });

    const grouped = {
        'Clase & Subclase': features.filter(f => f.source === 'Clase' || f.source === 'Subclase'),
        'Raza': features.filter(f => f.source === 'Raza'),
        'Dotes': features.filter(f => f.source === 'Dote'),
        'Otros': features.filter(f => !['Clase', 'Subclase', 'Raza', 'Dote'].includes(f.source))
    };

    const icons: Record<string, string> = {
        'Clase & Subclase': 'shield',
        'Raza': 'face',
        'Dotes': 'military_tech',
        'Otros': 'stars'
    };

    return (
        <div className="px-4 pb-24 flex flex-col gap-6 mt-4">
            {Object.entries(grouped).map(([category, feats]) => {
                if (feats.length === 0) return null;
                return (
                    <div key={category} className="animate-fadeIn">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 pl-1">
                            <span className="material-symbols-outlined text-lg">{icons[category]}</span>
                            {category}
                        </h3>
                        <div className="flex flex-col gap-3">
                            {feats.map((feat, idx) => (
                                <div key={`${feat.name}-${idx}`} className="group bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:border-primary/30 transition-all">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="w-full">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{feat.name}</h4>
                                            <div className="flex items-center gap-2 mt-1.5 mb-2.5">
                                                {feat.source === 'Subclase' && (
                                                    <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                        Subclase
                                                    </span>
                                                )}
                                                {feat.level > 0 && (
                                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                                                        Nivel {feat.level}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                                {feat.description || <span className="italic text-slate-400">Sin descripción disponible.</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
            
            {features.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">sentiment_dissatisfied</span>
                    <p className="text-sm italic text-slate-400">No hay rasgos disponibles.</p>
                </div>
            )}
        </div>
    );
  };

  const renderSpells = () => {
    const intMod = Math.floor(((finalStats.INT || 10) - 10) / 2);
    const saveDC = 8 + character.profBonus + intMod;
    const spellAttack = character.profBonus + intMod;
    
    const spellsToShow = character.preparedSpells && character.preparedSpells.length > 0 
        ? character.preparedSpells 
        : (SPELL_LIST_BY_CLASS[character.class]?.slice(0, 4) || []);

    return (
    <div className="flex flex-col gap-6 px-4 pb-24">
       {/* Stats */}
       <div className="grid grid-cols-3 gap-3 mt-4">
           <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 p-3 items-center text-center shadow-sm">
              <p className="text-primary tracking-tight text-2xl font-bold leading-none">{formatModifier(intMod)}</p>
              <div className="flex items-center gap-1 opacity-80">
                 <span className="material-symbols-outlined text-gray-500 dark:text-slate-400 text-[16px]">psychology</span>
                 <p className="text-gray-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">MOD</p>
              </div>
           </div>
           <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border-2 border-primary/20 dark:border-primary/30 p-3 items-center text-center shadow-sm relative overflow-hidden">
              <p className="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-none">{saveDC}</p>
              <div className="flex items-center gap-1 opacity-80 z-10">
                 <span className="material-symbols-outlined text-gray-500 dark:text-slate-400 text-[16px]">shield</span>
                 <p className="text-gray-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Save DC</p>
              </div>
           </div>
           <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 p-3 items-center text-center shadow-sm">
              <p className="text-primary tracking-tight text-2xl font-bold leading-none">{formatModifier(spellAttack)}</p>
              <div className="flex items-center gap-1 opacity-80">
                 <span className="material-symbols-outlined text-gray-500 dark:text-slate-400 text-[16px]">swords</span>
                 <p className="text-gray-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Attack</p>
              </div>
           </div>
       </div>

       {/* Slot Tracker */}
       <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end px-1">
             <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">Spell Slots (Level 1)</h3>
             <button className="text-xs text-primary font-medium hover:underline">Reset All</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
             {[1, 2, 3, 4].map(i => (
                 <label key={i} className="group relative flex flex-col items-center justify-center gap-2 cursor-pointer">
                    <input type="checkbox" className="peer sr-only" defaultChecked={i <= 2} />
                    <div className="h-12 w-full rounded-lg border-2 border-gray-300 dark:border-white/10 bg-white dark:bg-surface-dark peer-checked:bg-primary/10 peer-checked:border-primary transition-all flex items-center justify-center">
                       <span className="material-symbols-outlined text-transparent peer-checked:text-primary scale-0 peer-checked:scale-100 transition-transform duration-300">bolt</span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : '4th'}</span>
                 </label>
             ))}
          </div>
       </div>

       {/* Spells List - Dynamic */}
       <div className="flex flex-col gap-4 mt-2">
           {spellsToShow.length === 0 ? (
               <div className="text-center p-6 bg-slate-100 dark:bg-white/5 rounded-xl border border-dashed border-slate-300 dark:border-white/10">
                   <p className="text-slate-500 dark:text-slate-400 italic">No hay hechizos preparados.</p>
               </div>
           ) : spellsToShow.map(spellName => {
               const spell = SPELL_DETAILS[spellName];
               if (!spell) return null;
               return (
               <div key={spellName} className="relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm">
                  <div className="p-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-gray-900 dark:text-white text-lg font-bold">{spell.name}</h3>
                              <span className="material-symbols-outlined text-primary text-[16px]" title="Prepared">check_circle</span>
                          </div>
                          <p className="text-primary text-xs font-bold uppercase tracking-wide">Level {spell.level} {spell.school}</p>
                      </div>
                      <button className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                      </button>
                  </div>
                  <div className="grid grid-cols-3 border-y border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 text-xs">
                      <div className="p-2 flex flex-col items-center justify-center gap-1 border-r border-gray-100 dark:border-white/5"><span className="material-symbols-outlined text-gray-400 text-[16px]">timer</span><span className="text-gray-600 dark:text-slate-300 font-medium text-center">{spell.castingTime}</span></div>
                      <div className="p-2 flex flex-col items-center justify-center gap-1 border-r border-gray-100 dark:border-white/5"><span className="material-symbols-outlined text-gray-400 text-[16px]">straighten</span><span className="text-gray-600 dark:text-slate-300 font-medium text-center">{spell.range}</span></div>
                      <div className="p-2 flex flex-col items-center justify-center gap-1"><span className="material-symbols-outlined text-gray-400 text-[16px]">science</span><span className="text-gray-600 dark:text-slate-300 font-medium text-center">{spell.components}</span></div>
                  </div>
                  <div className="p-4 pt-3">
                      <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {spell.description}
                      </p>
                  </div>
                  <div className="px-4 pb-4">
                      <button className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-primary hover:bg-primary/90 text-background-dark font-bold text-sm transition-colors">
                          <span className="material-symbols-outlined text-[18px]">auto_fix</span>
                          Cast Spell
                      </button>
                  </div>
               </div>
           )})}
       </div>
    </div>
  );
  };

  return (
    <div className="flex flex-col h-full min-h-screen relative bg-background-light dark:bg-background-dark">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-4 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full active:bg-black/5 dark:active:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
             <h1 className="text-lg font-bold tracking-tight leading-none">{character.name}</h1>
             <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{character.species} {character.class} {character.level}</span>
        </div>
        <button className="text-primary font-semibold text-sm px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors">
            Edit
        </button>
      </nav>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
         {activeTab === 'combat' && renderCombat()}
         {activeTab === 'inventory' && renderInventory()}
         {activeTab === 'spells' && isCaster && renderSpells()}
         {activeTab === 'features' && renderFeatures()}
      </main>

      {/* HP Change Modal */}
      {hpModal.show && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl transform transition-all scale-100">
                  <h3 className={`text-xl font-bold text-center mb-4 ${hpModal.type === 'damage' ? 'text-red-500' : 'text-green-500'}`}>
                      {hpModal.type === 'damage' ? 'Recibir Daño' : 'Restaurar Salud'}
                  </h3>
                  <div className="flex justify-center mb-6">
                      <div className="relative w-32">
                          <input 
                              autoFocus
                              type="number" 
                              pattern="[0-9]*"
                              inputMode="numeric"
                              value={hpAmount}
                              onChange={(e) => setHpAmount(e.target.value)}
                              className="w-full text-center text-4xl font-bold bg-slate-100 dark:bg-black/30 border-2 border-transparent focus:border-primary/50 rounded-2xl py-3 outline-none"
                              placeholder="0"
                          />
                      </div>
                  </div>
                  <div className="flex gap-3">
                      <button 
                          onClick={() => setHpModal({ ...hpModal, show: false })}
                          className="flex-1 py-3 rounded-xl font-bold bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                      >
                          Cancelar
                      </button>
                      <button 
                          onClick={applyHpChange}
                          className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${hpModal.type === 'damage' ? 'bg-red-500 shadow-red-500/30' : 'bg-green-500 shadow-green-500/30'}`}
                      >
                          Aplicar
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Bottom Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-white/5 px-6 py-3 flex justify-around items-center max-w-md mx-auto">
         <button onClick={() => setActiveTab('combat')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'combat' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
             <span className={`material-symbols-outlined text-[24px] ${activeTab==='combat' ? 'fill-current' : ''}`}>swords</span>
             <span className="text-[10px] font-bold">Combat</span>
         </button>
         <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'inventory' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
             <span className={`material-symbols-outlined text-[24px] ${activeTab==='inventory' ? 'fill-current' : ''}`}>backpack</span>
             <span className="text-[10px] font-bold">Inventario</span>
         </button>
         
         {isCaster && (
             <button onClick={() => setActiveTab('spells')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'spells' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
                 <span className={`material-symbols-outlined text-[24px] ${activeTab==='spells' ? 'fill-current' : ''}`}>auto_stories</span>
                 <span className="text-[10px] font-bold">Spells</span>
             </button>
         )}

         <button onClick={() => setActiveTab('features')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'features' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
             <span className={`material-symbols-outlined text-[24px] ${activeTab==='features' ? 'fill-current' : ''}`}>stars</span>
             <span className="text-[10px] font-bold">Rasgos</span>
         </button>
      </nav>
    </div>
  );
};

export default SheetTabs;
