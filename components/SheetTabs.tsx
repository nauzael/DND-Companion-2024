
import React, { useState, useMemo, useEffect } from 'react';
import { Character, SheetTab, InventoryItem, Ability, ItemData, WeaponData, ArmorData } from '../types';
import { ALL_ITEMS, WEAPONS_DB, ARMOR_DB, GEAR_DB, MASTERY_DESCRIPTIONS } from '../Data/items';
import { SPELL_DETAILS, CASTER_TYPE, SPELL_LIST_BY_CLASS, CANTRIPS_KNOWN_BY_LEVEL, SPELLS_KNOWN_BY_LEVEL, MAX_SPELL_LEVEL, PREPARED_CASTERS, SPELLCASTING_ABILITY } from '../Data/spells';
import { CLASS_SAVING_THROWS, SPECIES_DETAILS, CLASS_DETAILS, CLASS_PROGRESSION, SUBCLASS_OPTIONS, HIT_DIE } from '../Data/characterOptions';
import { SKILL_LIST, SKILL_ABILITY_MAP, SKILL_DESCRIPTIONS } from '../Data/skills';
import { FEAT_OPTIONS, GENERIC_FEATURES } from '../Data/feats';

interface SheetTabsProps {
  character: Character;
  onBack: () => void;
  onUpdate: (char: Character) => void;
}

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

const SheetTabs: React.FC<SheetTabsProps> = ({ character, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('combat');
  const [inventory, setInventory] = useState<InventoryItem[]>(character.inventory || []);
  const [showAddItem, setShowAddItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  
  const [activeSpellLevel, setActiveSpellLevel] = useState<number>(1);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [showGrimoire, setShowGrimoire] = useState(false);
  const [grimoireSearch, setGrimoireSearch] = useState('');
  const [grimoireLevel, setGrimoireLevel] = useState(0);
  const [expandedGrimoireId, setExpandedGrimoireId] = useState<string | null>(null);
  
  const [usedSlots, setUsedSlots] = useState<Record<string, boolean>>({});
  const [isRaging, setIsRaging] = useState(false);
  const [hpModal, setHpModal] = useState<{ show: boolean; type: 'damage' | 'heal' }>({ show: false, type: 'damage' });
  const [hpAmount, setHpAmount] = useState('');

  // Effective Caster Type
  const effectiveCasterType = useMemo(() => {
      if (character.class === 'Warlock') return 'pact';
      if (['Cleric', 'Druid', 'Bard', 'Sorcerer', 'Wizard'].includes(character.class)) return 'full';
      if (['Paladin', 'Ranger'].includes(character.class)) return 'half';
      if (['Eldritch Knight', 'Arcane Trickster'].includes(character.subclass || '')) return 'third';
      return 'none';
  }, [character.class, character.subclass]);

  const isCaster = effectiveCasterType !== 'none';

  const spellStat = SPELLCASTING_ABILITY[character.class] || (effectiveCasterType === 'third' ? 'INT' : 'INT');
  const spellMod = Math.floor(((character.stats[spellStat] || 10) - 10) / 2);

  const grimoireSpellList = useMemo(() => {
      if (['Eldritch Knight', 'Arcane Trickster'].includes(character.subclass || '')) {
          return SPELL_LIST_BY_CLASS['Wizard'] || [];
      }
      return SPELL_LIST_BY_CLASS[character.class] || [];
  }, [character.class, character.subclass]);

  // --- Limits & Max Level Logic ---

  // Calculate Allowed Cantrips
  const maxCantrips = useMemo(() => {
      if (effectiveCasterType === 'third') {
          return character.level >= 10 ? 3 : 2;
      }
      if (character.class === 'Ranger') {
          return character.level >= 10 ? 3 : 2;
      }
      if (character.class === 'Paladin') {
          return 0; // Unless Blessed Warrior
      }
      return getProgressiveValue(CANTRIPS_KNOWN_BY_LEVEL[character.class], character.level, 0);
  }, [character.class, character.level, effectiveCasterType]);
  
  // Calculate Max Spell Level Available
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
      // Full casters
      return getProgressiveValue(MAX_SPELL_LEVEL['full'], character.level, 0);
  }, [character.class, character.level, effectiveCasterType]);

  // Calculate Max Spells Prepared/Known
  const maxSpells = useMemo(() => {
      // 2024 Rules: Bard and Ranger are Prepared Casters now
      const preparedClasses = ['Cleric', 'Druid', 'Paladin', 'Wizard', 'Bard', 'Ranger'];
      
      if (preparedClasses.includes(character.class)) {
          // Half Casters (Paladin, Ranger) = Floor(Level / 2) + Mod
          // Full Casters (Bard, Cleric, Druid, Wizard) = Level + Mod
          const isHalf = ['Paladin', 'Ranger'].includes(character.class);
          const levelFactor = isHalf ? Math.floor(character.level / 2) : character.level;
          return Math.max(1, levelFactor + spellMod);
      }

      if (character.class === 'Warlock') {
          let count = getProgressiveValue(SPELLS_KNOWN_BY_LEVEL['Warlock'], character.level, 0);
          // Add Mystic Arcanum slots to the total "Known" count so they don't block pact spells
          if (character.level >= 11) count += 1;
          if (character.level >= 13) count += 1;
          if (character.level >= 15) count += 1;
          if (character.level >= 17) count += 1;
          return count;
      }

      if (effectiveCasterType === 'third') {
          if (character.level < 3) return 0;
          return character.level >= 19 ? 11 : character.level >= 13 ? (character.level - 2) : (character.level >= 8 ? character.level - 2 : 3 + Math.floor((character.level - 3)/1)); 
      }

      // Default Known Casters (Sorcerer)
      return getProgressiveValue(SPELLS_KNOWN_BY_LEVEL[character.class], character.level, 0);
  }, [character.class, character.level, spellMod, effectiveCasterType]);

  const currentCantrips = useMemo(() => 
      (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level === 0).length, 
  [character.preparedSpells]);

  const currentSpells = useMemo(() => 
      (character.preparedSpells || []).filter(s => SPELL_DETAILS[s]?.level > 0).length, 
  [character.preparedSpells]);

  useEffect(() => {
      setInventory(character.inventory || []);
  }, [character.inventory]);

  const toggleExpand = (id: string) => {
      setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSlot = (level: number, index: number) => {
      const key = `${level}-${index}`;
      setUsedSlots(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetSlots = () => {
      setUsedSlots({});
  };

  const castSpell = (level: number) => {
      if (level === 0) return; // Cantrips don't consume slots
      
      const totalSlots = getSlots(effectiveCasterType, character.level, level);
      let found = false;
      // Find first unused slot
      for (let i = 0; i < totalSlots; i++) {
          if (!usedSlots[`${level}-${i}`]) {
              toggleSlot(level, i);
              found = true;
              break;
          }
      }
      
      if (!found) {
          alert(`¡No te quedan espacios de conjuro de nivel ${level}!`);
      }
  };

  const togglePreparedSpell = (spellName: string) => {
      const current = character.preparedSpells || [];
      const isPrepared = current.includes(spellName);
      const spellData = SPELL_DETAILS[spellName];
      
      if (!spellData) return;

      const isCantrip = spellData.level === 0;

      if (!isPrepared) {
          // Strict enforcement of quantity limits
          if (isCantrip && currentCantrips >= maxCantrips) return;
          if (!isCantrip && currentSpells >= maxSpells) return;
          
          onUpdate({ ...character, preparedSpells: [...current, spellName] });
      } else {
          onUpdate({ ...character, preparedSpells: current.filter(s => s !== spellName) });
      }
  };

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
                  if (armorData.maxDex !== undefined) {
                      mod = Math.min(mod, armorData.maxDex);
                  }
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
      const hasDefenseStyle = character.feats.some(f => f.includes('Fighting Style: Defense') || f.includes('Defense'));
      if (hasDefenseStyle && hasArmor) ac += 1;
      return ac + shieldBonus;
  }, [inventory, dexMod, character.class, character.stats, finalStats, character.feats]);

  const formatModifier = (val: number) => `${val >= 0 ? '+' : ''}${val}`;

  const updateInventory = (newInventory: InventoryItem[]) => {
      setInventory(newInventory);
      onUpdate({ ...character, inventory: newInventory });
  };

  const addItem = (itemName: string) => {
      const newItem: InventoryItem = {
          id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: itemName,
          quantity: 1,
          equipped: false
      };
      updateInventory([...inventory, newItem]);
      setShowAddItem(false);
      setSearchQuery('');
  };

  const toggleEquip = (itemId: string) => {
      const itemToToggle = inventory.find(i => i.id === itemId);
      if (!itemToToggle) return;
      const itemData = ALL_ITEMS[itemToToggle.name];
      const isArmor = itemData?.type === 'Armor';
      const isShield = isArmor && (itemData as ArmorData).armorType === 'Shield';
      const isStandardArmor = isArmor && !isShield;
      const newInv = inventory.map(item => {
          if (item.id === itemId) return { ...item, equipped: !item.equipped };
          if (isShield && !itemToToggle.equipped && item.equipped) {
               const idata = ALL_ITEMS[item.name];
               if (idata?.type === 'Armor' && (idata as ArmorData).armorType === 'Shield') {
                   return { ...item, equipped: false };
               }
          }
          if (isStandardArmor && !itemToToggle.equipped && item.equipped) {
               const idata = ALL_ITEMS[item.name];
               if (idata?.type === 'Armor' && (idata as ArmorData).armorType !== 'Shield') {
                   return { ...item, equipped: false };
               }
          }
          return item;
      });
      updateInventory(newInv);
  };

  const removeItem = (itemId: string) => {
      updateInventory(inventory.filter(i => i.id !== itemId));
  };

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

  const renderCombat = () => {
    const rageDamage = character.level < 9 ? 2 : character.level < 16 ? 3 : 4;
    const hasDueling = character.feats.some(f => f.includes('Dueling'));
    const hasArchery = character.feats.some(f => f.includes('Archery'));
    const hasThrown = character.feats.some(f => f.includes('Thrown Weapon'));
    const isMonk = character.class === 'Monk';
    let martialArtsDie = '1d6';
    if (character.level >= 5) martialArtsDie = '1d8';
    if (character.level >= 11) martialArtsDie = '1d10';
    if (character.level >= 17) martialArtsDie = '1d12';
    const equippedWeapons = inventory.filter(i => i.equipped && WEAPONS_DB[i.name]);
    const isDualWielding = equippedWeapons.length > 1;

    return (
    <div className="px-4 pb-24">
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
         {inventory.filter(i => i.equipped && WEAPONS_DB[i.name]).map(item => {
             const weapon = WEAPONS_DB[item.name];
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

             return (
             <div key={item.id} className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 hover:ring-primary/50 dark:hover:ring-primary/50 transition-all">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex gap-3">
                       <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-[24px]">swords</span></div>
                       <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{weapon.name}</h4>
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
         )})}
      </div>
      
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
    </div>
  );
  };

  const renderInventory = () => {
    // ... same as before ...
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
        <div key={item.id} onClick={() => setSelectedItem(item)} className="group relative flex items-center gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
            <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden ${item.equipped ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-black/40 text-slate-600 dark:text-white'}`}>
            <span className="material-symbols-outlined relative z-10">{itemData.type === 'Weapon' ? 'swords' : itemData.type === 'Armor' ? 'shield' : 'backpack'}</span>
            </div>
            <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <p className="text-slate-900 dark:text-white font-semibold truncate">{item.name}</p>
                {item.quantity > 1 && <span className="text-xs text-slate-500">x{item.quantity}</span>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-body truncate">{itemData.weight} lb • {itemData.cost}</p>
            </div>
            <div className="flex items-center gap-2">
            {isEquippable && (<button onClick={(e) => { e.stopPropagation(); toggleEquip(item.id); }} className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${item.equipped ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-transparent'}`}>{item.equipped ? 'Equipped' : 'Equip'}</button>)}
            <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
            </div>
        </div>
        );
    };

    return (
    <div className="flex flex-col gap-5 px-4 pb-24">
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
       {equippedItems.length > 0 && (<div className="flex flex-col gap-3"><h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">Equipamiento ({equippedItems.length})</h3>{equippedItems.map(renderItemRow)}</div>)}
       <div className="flex flex-col gap-3">
           <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">Mochila ({backpackItems.length})</h3>
           {backpackItems.length === 0 && (<div className="p-4 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-xl"><p className="text-sm text-slate-400 italic">La mochila está vacía.</p></div>)}
           {backpackItems.map(renderItemRow)}
       </div>
       <div className="flex justify-between items-center mb-3 mt-2"><h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1"></h3><button onClick={() => setShowAddItem(true)} className="text-primary text-sm font-bold flex items-center gap-1"><span className="material-symbols-outlined text-lg">add_circle</span> Add Item</button></div>
       {showAddItem && (
           <div className="absolute inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col p-4 animate-fadeIn">
               <div className="flex items-center gap-3 mb-4">
                   <button onClick={() => setShowAddItem(false)} className="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                   <div className="flex-1 relative"><input autoFocus type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 ring-primary/50"/><span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span></div>
               </div>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                   {Object.keys(ALL_ITEMS).filter(name => name.toLowerCase().includes(searchQuery.toLowerCase())).map(name => {
                           const item = ALL_ITEMS[name];
                           return (<button key={name} onClick={() => addItem(name)} className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex justify-between items-center border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"><div><p className="font-bold text-slate-900 dark:text-white">{name}</p><p className="text-xs text-slate-500">{item.type} • {item.cost}</p></div><span className="material-symbols-outlined text-slate-300">add</span></button>);
                       })}
               </div>
           </div>
       )}
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
                           <div className="flex items-start justify-between mb-4"><div><h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedItem.name}</h3><span className="text-sm text-slate-500">{itemData.type}</span></div><button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button></div>
                           <div className="space-y-3 mb-6">
                               <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">Weight</span><span className="font-bold text-slate-900 dark:text-white">{itemData.weight} lb</span></div>
                               <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">Cost</span><span className="font-bold text-slate-900 dark:text-white">{itemData.cost}</span></div>
                               {itemData.type === 'Weapon' && (<><div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">Damage</span><span className="font-bold text-slate-900 dark:text-white">{asWeapon.damage} {asWeapon.damageType}</span></div>{asWeapon.properties && asWeapon.properties.length > 0 && (<div className="py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500 block mb-1">Properties</span><div className="flex flex-wrap gap-1">{asWeapon.properties.map(p => (<span key={p} className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded text-xs font-medium text-slate-600 dark:text-slate-300">{p}</span>))}</div></div>)}{asWeapon.mastery && (<div className="py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500 block mb-1">Mastery: <span className="font-bold text-primary">{asWeapon.mastery}</span></span><p className="text-xs text-slate-400 italic">{MASTERY_DESCRIPTIONS[asWeapon.mastery]}</p></div>)}</>)}
                               {itemData.type === 'Armor' && (<div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">AC</span><span className="font-bold text-slate-900 dark:text-white">{asArmor.baseAC} {asArmor.armorType === 'Shield' ? '(Shield)' : asArmor.armorType === 'Light' ? '+ Dex' : asArmor.armorType === 'Medium' ? '+ Dex (max 2)' : ''}</span></div>)}
                               {itemData.description && (<div className="py-2"><p className="text-sm text-slate-600 dark:text-slate-300 italic">{itemData.description}</p></div>)}
                           </div>
                           <div className="grid grid-cols-2 gap-3">{isEquippable && (<button onClick={() => { toggleEquip(selectedItem.id); setSelectedItem(null); }} className={`py-3 rounded-xl font-bold text-sm transition-colors ${selectedItem.equipped ? 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' : 'bg-primary text-background-dark'}`}>{selectedItem.equipped ? 'Unequip' : 'Equip'}</button>)}<button onClick={() => { removeItem(selectedItem.id); setSelectedItem(null); }} className={`py-3 rounded-xl font-bold text-sm bg-red-500/10 text-red-500 border border-transparent hover:border-red-500 transition-colors ${!isEquippable ? 'col-span-2' : ''}`}>Remove</button></div>
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
    // ... same feature code ...
    const features: { name: string; description: string; level: number; source: string }[] = [];
    const speciesData = SPECIES_DETAILS[character.species];
    if (speciesData) {
        speciesData.traits.forEach(t => features.push({...t, source: 'Raza', level: 1}));
    }
    const classData = CLASS_DETAILS[character.class];
    const subclassList = SUBCLASS_OPTIONS[character.class] || [];
    const subclassData = subclassList.find(s => s.name === character.subclass);
    if (classData) {
        classData.traits.forEach(t => {
             features.push({...t, source: 'Clase', level: 1});
        });
    }
    for (let l = 1; l <= character.level; l++) {
        const prog = CLASS_PROGRESSION[character.class]?.[l] || [];
        prog.forEach(featName => {
            if (l === 1 && classData?.traits.some(t => t.name === featName)) return;
            let desc = GENERIC_FEATURES[featName] || '';
            if (featName === 'Ability Score Improvement') desc = "Mejora de características o Dote.";
            features.push({ name: featName, description: desc, level: l, source: 'Clase' });
        });
        if (subclassData && subclassData.features[l]) {
            subclassData.features[l].forEach(t => {
                features.push({ ...t, source: 'Subclase', level: l });
            });
        }
    }
    character.feats.forEach(f => {
        const featOpt = FEAT_OPTIONS.find(fo => fo.name === f);
        features.push({ name: f, description: featOpt?.description || 'Dote', level: 1, source: 'Dote' });
    });
    const iconMap: Record<string, string> = { 'Clase': 'shield', 'Subclase': 'auto_awesome', 'Raza': 'face', 'Dote': 'military_tech' };

    return (
        <div className="px-4 pb-24 flex flex-col gap-4 mt-4">
            {features.map((feat, idx) => {
                const id = `feat-${idx}`;
                const isExpanded = expandedIds[id];
                const icon = iconMap[feat.source] || 'stars';
                return (
                    <div key={id} className="relative overflow-hidden rounded-xl bg-surface-dark border border-white/5 shadow-sm transition-all duration-300">
                        <div onClick={() => toggleExpand(id)} className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-white text-lg font-bold leading-tight">{feat.name}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        <span className="material-symbols-outlined text-[12px]">{icon}</span>
                                        {feat.source}
                                    </span>
                                    {feat.level > 0 && <span className="text-xs text-slate-500 font-medium">Lvl {feat.level}</span>}
                                </div>
                            </div>
                            <button className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white transition-all ${isExpanded ? 'rotate-180' : ''}`}>
                                <span className="material-symbols-outlined">expand_more</span>
                            </button>
                        </div>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-4 pt-0 text-sm text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                                {feat.description || <span className="italic">Sin descripción.</span>}
                            </div>
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
    <div className="flex flex-col gap-6 px-4 pb-24 relative min-h-screen">
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
               const isExpanded = expandedIds[spellName];

               return (
               <div key={spellName} className="relative overflow-hidden rounded-xl bg-surface-dark border border-white/5 shadow-sm transition-all duration-300">
                  <div 
                    onClick={() => toggleExpand(spellName)}
                    className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                      <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white text-lg font-bold leading-tight">{spell.name}</h3>
                              <span className="material-symbols-outlined text-primary text-[16px]" title="Prepared">check_circle</span>
                          </div>
                          <p className="text-primary text-[10px] font-bold uppercase tracking-wider">
                              {spell.level === 0 ? 'Cantrip' : `${spell.level}st Level`} {spell.school}
                          </p>
                      </div>
                      <button className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                      </button>
                  </div>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="grid grid-cols-3 border-y border-white/5 bg-black/20 text-[10px] text-slate-400 font-medium">
                          <div className="p-3 flex flex-col items-center justify-center gap-1 border-r border-white/5"><span className="material-symbols-outlined text-[16px]">timer</span><span className="text-center leading-tight">{spell.castingTime}</span></div>
                          <div className="p-3 flex flex-col items-center justify-center gap-1 border-r border-white/5"><span className="material-symbols-outlined text-[16px]">straighten</span><span className="text-center leading-tight">{spell.range}</span></div>
                          <div className="p-3 flex flex-col items-center justify-center gap-1"><span className="material-symbols-outlined text-[16px]">science</span><span className="text-center leading-tight">{spell.components}</span></div>
                      </div>
                      <div className="p-4 text-sm text-slate-400 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">{spell.description}</div>
                      <div className="p-4 pt-0">
                          <button onClick={() => castSpell(spell.level)} className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-primary hover:bg-primary-dark text-background-dark font-bold text-sm transition-colors shadow-lg shadow-primary/20 active:scale-95"><span className="material-symbols-outlined text-[18px]">auto_fix</span>{spell.level === 0 ? 'Lanzar Truco' : 'Lanzar Hechizo'}</button>
                      </div>
                  </div>
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

       {showGrimoire && (
           <div className="fixed inset-0 z-50 bg-background-dark flex flex-col animate-fadeIn">
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
                       <button onClick={() => setGrimoireLevel(0)} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${grimoireLevel === 0 ? 'bg-white text-background-dark' : 'bg-white/5 text-slate-400'}`}>Cantrips</button>
                   )}
                   {Array.from({length: maxSpellLevel}, (_, i) => i + 1).map(lvl => (
                       <button key={lvl} onClick={() => setGrimoireLevel(lvl)} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${grimoireLevel === lvl ? 'bg-white text-background-dark' : 'bg-white/5 text-slate-400'}`}>Lvl {lvl}</button>
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

               <div className="flex-1 overflow-y-auto p-4 gap-2 flex flex-col">
                   {grimoireSpellList
                       .filter(name => {
                           const s = SPELL_DETAILS[name];
                           if (!s) return false;
                           if (s.level !== grimoireLevel) return false;
                           if (grimoireSearch && !name.toLowerCase().includes(grimoireSearch.toLowerCase())) return false;
                           return true;
                       })
                       .sort()
                       .map(name => {
                           const s = SPELL_DETAILS[name];
                           const isPrepared = (character.preparedSpells || []).includes(name);
                           const isCantrip = s.level === 0;
                           const limitReached = isCantrip ? currentCantrips >= maxCantrips : currentSpells >= maxSpells;
                           const isDisabled = !isPrepared && limitReached;

                           return (
                               <div key={name} className={`rounded-xl border transition-all ${isPrepared ? 'bg-primary/5 border-primary/50' : 'bg-surface-dark border-white/5'}`}>
                                   <div className="flex items-center">
                                       <button onClick={() => setExpandedGrimoireId(expandedGrimoireId === name ? null : name)} className="flex-1 p-3 text-left">
                                           <div className="flex items-center gap-2">
                                               <p className={`font-bold ${isPrepared ? 'text-primary' : isDisabled ? 'text-slate-500' : 'text-white'}`}>{name}</p>
                                               {expandedGrimoireId === name ? <span className="material-symbols-outlined text-[14px] text-slate-500">expand_less</span> : <span className="material-symbols-outlined text-[14px] text-slate-500">expand_more</span>}
                                           </div>
                                           <p className="text-xs text-slate-500">{s.school} • {s.castingTime}</p>
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
           </div>
       )}
    </div>
  );
  };

  return (
    <div className="flex flex-col h-full min-h-screen relative bg-background-light dark:bg-background-dark">
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-4 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full active:bg-black/5 dark:active:bg-white/10 transition-colors"><span className="material-symbols-outlined text-2xl">arrow_back</span></button>
        <div className="flex flex-col items-center">
             <h1 className="text-lg font-bold tracking-tight leading-none">{character.name}</h1>
             <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{character.species} {character.class} {character.level}</span>
        </div>
        <button className="text-primary font-semibold text-sm px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors">Edit</button>
      </nav>

      <main className="flex-1 overflow-y-auto no-scrollbar relative">
         {activeTab === 'combat' && renderCombat()}
         {activeTab === 'inventory' && renderInventory()}
         {activeTab === 'spells' && isCaster && renderSpells()}
         {activeTab === 'features' && renderFeatures()}
      </main>

      {hpModal.show && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl transform transition-all scale-100">
                  <h3 className={`text-xl font-bold text-center mb-4 ${hpModal.type === 'damage' ? 'text-red-500' : 'text-green-500'}`}>{hpModal.type === 'damage' ? 'Recibir Daño' : 'Restaurar Salud'}</h3>
                  <div className="flex justify-center mb-6"><div className="relative w-32"><input autoFocus type="number" pattern="[0-9]*" inputMode="numeric" value={hpAmount} onChange={(e) => setHpAmount(e.target.value)} className="w-full text-center text-4xl font-bold bg-slate-100 dark:bg-black/30 border-2 border-transparent focus:border-primary/50 rounded-2xl py-3 outline-none" placeholder="0"/></div></div>
                  <div className="flex gap-3"><button onClick={() => setHpModal({ ...hpModal, show: false })} className="flex-1 py-3 rounded-xl font-bold bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Cancelar</button><button onClick={applyHpChange} className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${hpModal.type === 'damage' ? 'bg-red-500 shadow-red-500/30' : 'bg-green-500 shadow-green-500/30'}`}>Aplicar</button></div>
              </div>
          </div>
      )}

      {selectedSkill && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedSkill(null)}>
              <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-start mb-4"><div><h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedSkill}</h3><span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{SKILL_ABILITY_MAP[selectedSkill]} ({character.skills.includes(selectedSkill) ? 'Entrenada' : 'No Entrenada'})</span></div><button onClick={() => setSelectedSkill(null)} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button></div>
                  <div className="mb-6"><p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{SKILL_DESCRIPTIONS[selectedSkill] || "Sin descripción disponible."}</p></div>
                  <button onClick={() => setSelectedSkill(null)} className="w-full py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Cerrar</button>
              </div>
          </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-white/5 px-6 py-3 flex justify-around items-center max-w-md mx-auto">
         <button onClick={() => setActiveTab('combat')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'combat' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}><span className={`material-symbols-outlined text-[24px] ${activeTab==='combat' ? 'fill-current' : ''}`}>swords</span><span className="text-[10px] font-bold">Combat</span></button>
         <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'inventory' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}><span className={`material-symbols-outlined text-[24px] ${activeTab==='inventory' ? 'fill-current' : ''}`}>backpack</span><span className="text-[10px] font-bold">Inventario</span></button>
         {isCaster && (<button onClick={() => setActiveTab('spells')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'spells' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}><span className={`material-symbols-outlined text-[24px] ${activeTab==='spells' ? 'fill-current' : ''}`}>auto_stories</span><span className="text-[10px] font-bold">Spells</span></button>)}
         <button onClick={() => setActiveTab('features')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'features' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}><span className={`material-symbols-outlined text-[24px] ${activeTab==='features' ? 'fill-current' : ''}`}>stars</span><span className="text-[10px] font-bold">Rasgos</span></button>
      </nav>
    </div>
  );
};

export default SheetTabs;
