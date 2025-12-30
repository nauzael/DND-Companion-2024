import React, { useState, useMemo, useEffect } from 'react';
import { Character, SheetTab, InventoryItem, Ability } from '../types';
import { ALL_ITEMS, WEAPONS_DB, ARMOR_DB, GEAR_DB } from '../Data/items';
import { SPELL_DETAILS } from '../Data/spells';
import { CLASS_SAVING_THROWS } from '../Data/characterOptions';
import { SKILL_LIST, SKILL_ABILITY_MAP } from '../Data/skills';

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
  
  // HP Modal State
  const [hpModal, setHpModal] = useState<{ show: boolean; type: 'damage' | 'heal' }>({ show: false, type: 'damage' });
  const [hpAmount, setHpAmount] = useState('');

  // Sync inventory state if character prop changes (e.g. from parent update)
  useEffect(() => {
      setInventory(character.inventory || []);
  }, [character.inventory]);

  // Derived Stats Calculations
  const strMod = Math.floor((character.stats.STR - 10) / 2);
  const dexMod = Math.floor((character.stats.DEX - 10) / 2);
  
  // Calculate AC
  const armorClass = useMemo(() => {
      let ac = 10 + dexMod;
      let hasArmor = false;
      let shieldBonus = 0;

      // Scan inventory for equipped armor/shield
      inventory.forEach(item => {
          if (!item.equipped) return;
          const armorData = ARMOR_DB[item.name];
          if (armorData) {
              if (armorData.armorType === 'Shield') {
                  shieldBonus += armorData.baseAC;
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
              const conMod = Math.floor((character.stats.CON - 10) / 2);
              ac = 10 + dexMod + conMod;
          } else if (character.class === 'Monk') {
              const wisMod = Math.floor((character.stats.WIS - 10) / 2);
              ac = 10 + dexMod + wisMod;
          }
      }

      return ac + shieldBonus;
  }, [inventory, dexMod, character.class, character.stats]);

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
          newCurrent = Math.max(0, newCurrent - remainingDamage);
      }

      onUpdate({
          ...character,
          hp: { ...character.hp, current: newCurrent, temp: newTemp }
      });
      setHpModal({ ...hpModal, show: false });
  };

  const renderCombat = () => (
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
            const score = character.stats[stat] || 10;
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
      <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 mb-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Hit Points</span>
            <span className="text-2xl font-bold dark:text-white text-slate-900 leading-none">{character.hp.current} <span className="text-base font-normal text-slate-400">/ {character.hp.max}</span></span>
          </div>
          <div className="flex gap-2">
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
          <span className="text-slate-400 dark:text-slate-500">Hit Dice: {character.level}d{character.class ? '?' : '8'}</span>
        </div>
      </div>

      {/* Weapons */}
      <div className="flex items-center justify-between group cursor-pointer mb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Equipped Weapons</h3>
      </div>
      <div className="flex flex-col gap-3 mb-6">
         {inventory.filter(i => i.equipped && WEAPONS_DB[i.name]).map(item => {
             const weapon = WEAPONS_DB[item.name];
             // Simple logic for To Hit / Damage mod
             const isFinesse = weapon.properties.includes('Finesse');
             const isRanged = weapon.rangeType === 'Ranged';
             let mod = strMod;
             if (isRanged) mod = dexMod;
             else if (isFinesse) mod = Math.max(strMod, dexMod);
             
             const toHit = character.profBonus + mod;
             const dmgMod = mod; // Simplified (off-hand handling would be complex)

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
                   <button className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-primary/10 dark:hover:bg-primary/20 hover:ring-1 ring-primary/50 transition-all group">
                       <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase tracking-wider mb-1">Damage</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">{weapon.damage}{dmgMod >= 0 ? '+' : ''}{dmgMod}</span>
                       <span className="text-[10px] text-slate-400">Mastery: {weapon.mastery}</span>
                   </button>
                </div>
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
                const mod = Math.floor((character.stats[stat] - 10) / 2);
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
                const mod = Math.floor((character.stats[ability] - 10) / 2);
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

  const renderInventory = () => {
    // Calculate total weight
    const totalWeight = inventory.reduce((acc, item) => {
        const itemData = ALL_ITEMS[item.name];
        return acc + (itemData ? itemData.weight * item.quantity : 0);
    }, 0);
    
    // Simple Str * 15 carry capacity
    const carryCap = character.stats.STR * 15;

    return (
    <div className="flex flex-col gap-5 px-4 pb-24 h-full">
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

       {/* Items List */}
       <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
           <div className="flex justify-between items-center mb-3">
               <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">All Items ({inventory.length})</h3>
               <button onClick={() => setShowAddItem(true)} className="text-primary text-sm font-bold flex items-center gap-1">
                   <span className="material-symbols-outlined text-lg">add_circle</span> Add Item
               </button>
           </div>
           
           <div className="flex flex-col gap-3">
              {inventory.map(item => {
                 const itemData = ALL_ITEMS[item.name] || { name: item.name, type: 'Gear', weight: 0, cost: '-' };
                 const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor';
                 
                 return (
                  <div key={item.id} className="group relative flex items-center gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform">
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
                                onClick={() => toggleEquip(item.id)}
                                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${item.equipped ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-transparent'}`}
                            >
                                {item.equipped ? 'Equipped' : 'Equip'}
                            </button>
                        )}
                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                     </div>
                  </div>
                 );
              })}
           </div>
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
    </div>
  );
  };

  const renderSpells = () => {
    const intMod = Math.floor((character.stats.INT - 10) / 2);
    const saveDC = 8 + character.profBonus + intMod;
    const spellAttack = character.profBonus + intMod;

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
           {['Magic Missile', 'Cure Wounds', 'Shield'].map(spellName => {
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
         {activeTab === 'spells' && renderSpells()}
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
             <span className="text-[10px] font-bold">Inv</span>
         </button>
         <button onClick={() => setActiveTab('spells')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'spells' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
             <span className={`material-symbols-outlined text-[24px] ${activeTab==='spells' ? 'fill-current' : ''}`}>auto_stories</span>
             <span className="text-[10px] font-bold">Spells</span>
         </button>
      </nav>
    </div>
  );
};

export default SheetTabs;