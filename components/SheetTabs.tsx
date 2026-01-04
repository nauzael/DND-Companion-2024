
import React, { useState, useMemo, useEffect } from 'react';
import { Character, SheetTab, InventoryItem, Ability, ItemData, WeaponData, ArmorData } from '../types';
import { ALL_ITEMS, WEAPONS_DB, ARMOR_DB, GEAR_DB, MAGIC_ITEMS, MASTERY_DESCRIPTIONS } from '../Data/items';
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

const SCHOOL_THEMES: Record<string, { text: string, bg: string, border: string, icon: string }> = {
    'Abjuration': { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'shield' },
    'Conjuration': { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: 'apps' },
    'Divination': { text: 'text-indigo-300', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: 'visibility' },
    'Enchantment': { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: 'favorite' },
    'Evocation': { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'local_fire_department' },
    'Illusion': { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'auto_fix' },
    'Necromancy': { text: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/20', icon: 'skull' },
    'Transmutation': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'change_circle' },
};

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

// Helper to extract damage/healing from description
const getSpellSummary = (description: string, school: string) => {
    const damageRegex = /(\d+d\d+)(\s+\+\s+\d+)?\s+(\w+)\s+damage/i;
    const healRegex = /regains?\s+(\d+d\d+)(\s+\+\s+\d+)?\s+hit\s+points/i;
    const healRegex2 = /restore\s+(\d+d\d+)(\s+\+\s+\d+)?\s+hit\s+points/i;

    const dmgMatch = description.match(damageRegex);
    if (dmgMatch) {
        return { text: `${dmgMatch[1]} ${dmgMatch[3]}`, color: 'text-red-400', icon: 'swords' };
    }

    const healMatch = description.match(healRegex) || description.match(healRegex2);
    if (healMatch) {
        return { text: `${healMatch[1]} Heal`, color: 'text-green-400', icon: 'healing' };
    }

    const theme = SCHOOL_THEMES[school] || { text: 'text-slate-400', icon: 'auto_stories' };
    return { text: school, color: theme.text, icon: theme.icon };
};

const formatShort = (text: string) => {
    return text
        .replace('Bonus Action', 'Bonus')
        .replace('Action', '1 Act')
        .replace('Reaction', 'Reac')
        .replace('minutes', 'min')
        .replace('hours', 'h')
        .replace('feet', 'ft')
        .replace('Self', 'Self')
        .replace('Touch', 'Touch');
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
  const [selectedSpellName, setSelectedSpellName] = useState<string | null>(null);
  
  const [usedSlots, setUsedSlots] = useState<Record<string, boolean>>({});
  const [isRaging, setIsRaging] = useState(false);
  const [hpModal, setHpModal] = useState<{ show: boolean; type: 'damage' | 'heal' }>({ show: false, type: 'damage' });
  const [hpAmount, setHpAmount] = useState('');

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

  const isCaster = effectiveCasterType !== 'none' || !!magicInitiateType;

  // Calculate Spellcasting Ability
  const spellStat = useMemo(() => {
      if (SPELLCASTING_ABILITY[character.class]) return SPELLCASTING_ABILITY[character.class];
      if (effectiveCasterType === 'third') return 'INT';
      if (magicInitiateType) return SPELLCASTING_ABILITY[magicInitiateType];
      return 'INT';
  }, [character.class, effectiveCasterType, magicInitiateType]);

  const spellMod = Math.floor(((character.stats[spellStat] || 10) - 10) / 2);

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

  // Calculate Allowed Cantrips
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
      if (effectiveCasterType === 'full') {
          return getProgressiveValue(MAX_SPELL_LEVEL['full'], character.level, 0);
      }
      
      // None caster but has feat
      if (magicInitiateType) return 1;

      return 0;
  }, [character.class, character.level, effectiveCasterType, magicInitiateType]);

  // Calculate Max Spells Prepared/Known
  const maxSpells = useMemo(() => {
      let count = 0;
      // 2024 Rules: Bard and Ranger are Prepared Casters now
      const preparedClasses = ['Cleric', 'Druid', 'Paladin', 'Wizard', 'Bard', 'Ranger'];
      
      if (preparedClasses.includes(character.class)) {
          // Half Casters (Paladin, Ranger) = Floor(Level / 2) + Mod
          // Full Casters (Bard, Cleric, Druid, Wizard) = Level + Mod
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
          // Default Known Casters (Sorcerer)
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
          // If no slots, check if it's a feat usage or just alert
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
          // Strict enforcement of quantity limits
          if (isCantrip && currentCantrips >= maxCantrips) return;
          if (!isCantrip && currentSpells >= maxSpells) return;
          
          onUpdate({ ...character, preparedSpells: [...current, spellName] });
      } else {
          onUpdate({ ...character, preparedSpells: current.filter(s => s !== spellName) });
      }
  };

  const getItemData = (name: string): ItemData | undefined => {
      if (ALL_ITEMS[name]) return ALL_ITEMS[name];
      // Fallback: try to find item without quantity suffix e.g. "Dagger (2)" -> "Dagger"
      const match = name.match(/^(.*?) \((\d+)\)$/);
      if (match && ALL_ITEMS[match[1]]) return ALL_ITEMS[match[1]];
      return undefined;
  };

  const finalStats = useMemo(() => {
      const stats = { ...character.stats };
      // Class Capstones
      if (character.class === 'Barbarian' && character.level >= 20) {
          stats.STR = (stats.STR || 10) + 4;
          stats.CON = (stats.CON || 10) + 4;
      }
      if (character.class === 'Monk' && character.level >= 20) {
          stats.DEX = (stats.DEX || 10) + 4;
          stats.WIS = (stats.WIS || 10) + 4;
      }

      // Check Inventory for Stat Modifying Items
      const equippedNames = inventory.filter(i => i.equipped).map(i => i.name);
      
      // -- Additive Bonuses (Apply before Setters) --
      if (equippedNames.includes('Belt of Dwarvenkind')) stats.CON = Math.min(20, (stats.CON || 10) + 2);
      if (equippedNames.includes('Book of Exalted Deeds')) stats.WIS = Math.min(24, (stats.WIS || 10) + 2);

      // Manuals/Tomes (Assuming equipped implies used for this context, or active effect)
      if (equippedNames.includes('Manual of Bodily Health')) stats.CON = Math.min(30, (stats.CON || 10) + 2);
      if (equippedNames.includes('Manual of Gainful Exercise')) stats.STR = Math.min(30, (stats.STR || 10) + 2);
      if (equippedNames.includes('Manual of Quickness of Action')) stats.DEX = Math.min(30, (stats.DEX || 10) + 2);
      if (equippedNames.includes('Tome of Clear Thought')) stats.INT = Math.min(30, (stats.INT || 10) + 2);
      if (equippedNames.includes('Tome of Leadership and Influence')) stats.CHA = Math.min(30, (stats.CHA || 10) + 2);
      if (equippedNames.includes('Tome of Understanding')) stats.WIS = Math.min(30, (stats.WIS || 10) + 2);

      // Ioun Stones
      if (equippedNames.includes('Ioun Stone (Agility)')) stats.DEX = Math.min(20, (stats.DEX || 10) + 2);
      if (equippedNames.includes('Ioun Stone (Fortitude)')) stats.CON = Math.min(20, (stats.CON || 10) + 2);
      if (equippedNames.includes('Ioun Stone (Insight)')) stats.WIS = Math.min(20, (stats.WIS || 10) + 2);
      if (equippedNames.includes('Ioun Stone (Intellect)')) stats.INT = Math.min(20, (stats.INT || 10) + 2);
      if (equippedNames.includes('Ioun Stone (Leadership)')) stats.CHA = Math.min(20, (stats.CHA || 10) + 2);
      if (equippedNames.includes('Ioun Stone (Strength)')) stats.STR = Math.min(20, (stats.STR || 10) + 2);
      
      // -- Set Scores (Overrides) --
      if (equippedNames.includes('Gauntlets of Ogre Power')) stats.STR = Math.max(stats.STR, 19);
      if (equippedNames.includes('Headband of Intellect')) stats.INT = Math.max(stats.INT, 19);
      if (equippedNames.includes('Amulet of Health')) stats.CON = Math.max(stats.CON, 19);
      
      // Belts of Giant Strength
      if (equippedNames.includes('Belt of Giant Strength (Hill)')) stats.STR = Math.max(stats.STR, 21);
      if (equippedNames.includes('Belt of Giant Strength (Frost)')) stats.STR = Math.max(stats.STR, 23);
      if (equippedNames.includes('Belt of Giant Strength (Stone)')) stats.STR = Math.max(stats.STR, 23);
      if (equippedNames.includes('Belt of Giant Strength (Fire)')) stats.STR = Math.max(stats.STR, 25);
      if (equippedNames.includes('Belt of Giant Strength (Cloud)')) stats.STR = Math.max(stats.STR, 27);
      if (equippedNames.includes('Belt of Giant Strength (Storm)')) stats.STR = Math.max(stats.STR, 29);

      // Potions (if "equipped" to represent active)
      if (equippedNames.includes('Potion of Giant Strength (Hill)')) stats.STR = Math.max(stats.STR, 21);
      if (equippedNames.includes('Potion of Giant Strength (Frost)')) stats.STR = Math.max(stats.STR, 23);
      if (equippedNames.includes('Potion of Giant Strength (Stone)')) stats.STR = Math.max(stats.STR, 23);
      if (equippedNames.includes('Potion of Giant Strength (Fire)')) stats.STR = Math.max(stats.STR, 25);
      if (equippedNames.includes('Potion of Giant Strength (Cloud)')) stats.STR = Math.max(stats.STR, 27);
      if (equippedNames.includes('Potion of Giant Strength (Storm)')) stats.STR = Math.max(stats.STR, 29);

      // Specific Items
      if (equippedNames.includes('Thunderous Greatclub')) stats.STR = Math.max(stats.STR, 20);
      if (equippedNames.some(n => n.includes('Hand of Vecna'))) stats.STR = Math.max(stats.STR, 20);

      return stats;
  }, [character.stats, character.class, character.level, inventory]);

  const strMod = Math.floor(((finalStats.STR || 10) - 10) / 2);
  const dexMod = Math.floor(((finalStats.DEX || 10) - 10) / 2);
  
  const armorClass = useMemo(() => {
      let ac = 10 + dexMod;
      let hasArmor = false;
      let hasShield = false;
      let shieldBonus = 0;
      let magicBonus = 0;

      inventory.forEach(item => {
          if (!item.equipped) return;
          const itemData = getItemData(item.name);
          if (!itemData) return;

          // Armor Calculation
          if (itemData.type === 'Armor') {
              const armorData = itemData as ArmorData;
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

          // Magic Item AC Bonuses
          if (item.name === 'Ring of Protection') magicBonus += 1;
          if (item.name === 'Cloak of Protection') magicBonus += 1;
          if (item.name === 'Ioun Stone (Protection)') magicBonus += 1;
          if (item.name.includes('Armor +1')) magicBonus += 1; 
          if (item.name.includes('Armor +2')) magicBonus += 2; 
          if (item.name.includes('Armor +3')) magicBonus += 3; 
          if (item.name === 'Animated Shield' && item.equipped) shieldBonus += 2; 
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

          // Bracers of Defense check
          const equippedNames = inventory.filter(i => i.equipped).map(i => i.name);
          if (equippedNames.includes('Bracers of Defense') && !hasShield) {
              magicBonus += 2;
          }
      }

      const hasDefenseStyle = character.feats.some(f => f.includes('Fighting Style: Defense') || f.includes('Defense'));
      if (hasDefenseStyle && hasArmor) ac += 1;

      return ac + shieldBonus + magicBonus;
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
      
      const itemData = getItemData(itemToToggle.name);
      const isArmor = itemData?.type === 'Armor';
      const isShield = isArmor && (itemData as ArmorData).armorType === 'Shield';
      const isStandardArmor = isArmor && !isShield;
      
      const newInv = inventory.map(item => {
          if (item.id === itemId) return { ...item, equipped: !item.equipped };
          
          // Logic to unequip other armor/shields if necessary
          if (isShield && !itemToToggle.equipped && item.equipped) {
               const idata = getItemData(item.name);
               if (idata?.type === 'Armor' && (idata as ArmorData).armorType === 'Shield') {
                   return { ...item, equipped: false };
               }
          }
          if (isStandardArmor && !itemToToggle.equipped && item.equipped) {
               const idata = getItemData(item.name);
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

  const renderSpells = () => {
      const totalSlots = getSlots(effectiveCasterType, character.level, activeSpellLevel);
      
      const spellsAtLevel = (character.preparedSpells || []).filter(s => {
          const det = SPELL_DETAILS[s];
          return det && det.level === activeSpellLevel;
      });

      return (
        <div className="flex flex-col h-full">
            {/* Header / Slots */}
            {activeSpellLevel > 0 && totalSlots > 0 && (
                <div className="px-4 pt-4 pb-2">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Espacios de Nivel {activeSpellLevel} {effectiveCasterType === 'pact' ? '(Pact)' : ''}
                        </h3>
                        <button onClick={() => {
                             // Reset logic for specific level slots
                             const newSlots = { ...usedSlots };
                             for(let i=0; i<totalSlots; i++) delete newSlots[`${activeSpellLevel}-${i}`];
                             setUsedSlots(newSlots);
                        }} className="text-[10px] text-primary font-bold">
                            Restaurar
                        </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {Array.from({ length: totalSlots }).map((_, i) => {
                            const isUsed = usedSlots[`${activeSpellLevel}-${i}`];
                            return (
                                <button 
                                    key={i}
                                    onClick={() => toggleSlot(activeSpellLevel, i)}
                                    className={`h-8 flex-1 rounded-lg border-2 transition-all ${isUsed ? 'bg-transparent border-slate-200 dark:border-white/10 text-slate-300' : 'bg-primary border-primary shadow-lg shadow-primary/30'}`}
                                ></button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Level Selector */}
            <div className="px-4 py-2 overflow-x-auto no-scrollbar">
                <div className="flex gap-2">
                    {Array.from({ length: maxSpellLevel + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSpellLevel(i)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeSpellLevel === i ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                        >
                            {i === 0 ? 'Trucos' : `Nivel ${i}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Spells List */}
            <div className="flex-1 px-4 py-2 space-y-3 pb-24">
                {spellsAtLevel.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                        <p className="text-slate-400 text-sm">No hay hechizos preparados.</p>
                    </div>
                )}

                {spellsAtLevel.map(spellName => {
                    const spell = SPELL_DETAILS[spellName];
                    if (!spell) return null;
                    const summary = getSpellSummary(spell.description, spell.school);
                    const isExpanded = expandedIds[spellName];

                    return (
                        <div key={spellName} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                            <div 
                                onClick={() => toggleExpand(spellName)}
                                className="p-3 flex items-center justify-between cursor-pointer active:bg-slate-50 dark:active:bg-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${summary.bg} ${summary.text} flex items-center justify-center border ${summary.border}`}>
                                        <span className="material-symbols-outlined text-lg">{summary.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{spell.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formatShort(spell.castingTime)}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formatShort(spell.range)}</span>
                                        </div>
                                    </div>
                                </div>
                                {activeSpellLevel > 0 && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); castSpell(activeSpellLevel); }}
                                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                                    </button>
                                )}
                            </div>
                            
                            {isExpanded && (
                                <div className="px-4 pb-4 pt-0">
                                    <div className="my-2 h-px bg-slate-100 dark:bg-white/5"></div>
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg">
                                            <span className="text-[9px] uppercase text-slate-400 font-bold block">Duración</span>
                                            <span className="text-xs font-medium dark:text-slate-300">{spell.duration}</span>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg">
                                            <span className="text-[9px] uppercase text-slate-400 font-bold block">Componentes</span>
                                            <span className="text-xs font-medium dark:text-slate-300">{spell.components}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{spell.description}</p>
                                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex justify-end">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); togglePreparedSpell(spellName); }}
                                            className="text-xs font-bold text-red-500 flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">remove_circle</span>
                                            Despreparar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                <button 
                    onClick={() => { setGrimoireLevel(activeSpellLevel); setGrimoireSearch(''); setShowGrimoire(true); }}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Preparar Hechizo (Nivel {activeSpellLevel})
                </button>
            </div>

            {/* Grimoire Modal */}
            {showGrimoire && (
                <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-fadeIn">
                    <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-white/5">
                        <button onClick={() => setShowGrimoire(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                placeholder="Buscar hechizo..."
                                value={grimoireSearch}
                                onChange={(e) => setGrimoireSearch(e.target.value)}
                                autoFocus
                                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 ring-primary/50 text-slate-900 dark:text-white"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400">search</span>
                        </div>
                    </div>
                    
                    <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <span>Grimorio Nivel {grimoireLevel}</span>
                        <span className={character.preparedSpells?.filter(s => SPELL_DETAILS[s]?.level === grimoireLevel).length >= (grimoireLevel === 0 ? maxCantrips : maxSpells) ? 'text-red-500' : 'text-primary'}>
                            {grimoireLevel === 0 
                                ? `${currentCantrips}/${maxCantrips} Trucos`
                                : `${currentSpells}/${maxSpells} Preparados`
                            }
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {grimoireSpellList
                            .filter(name => {
                                const s = SPELL_DETAILS[name];
                                if (!s) return false;
                                if (s.level !== grimoireLevel) return false;
                                return name.toLowerCase().includes(grimoireSearch.toLowerCase());
                            })
                            .sort()
                            .map(name => {
                                const spell = SPELL_DETAILS[name];
                                const isPrepared = character.preparedSpells?.includes(name);
                                const isExpanded = expandedGrimoireId === name;
                                const summary = getSpellSummary(spell.description, spell.school);

                                return (
                                    <div key={name} className={`bg-white dark:bg-surface-dark rounded-xl border ${isPrepared ? 'border-primary/50 shadow-[0_0_10px_rgba(53,158,255,0.15)]' : 'border-slate-200 dark:border-white/5'} overflow-hidden transition-all`}>
                                        <div 
                                            onClick={() => setExpandedGrimoireId(isExpanded ? null : name)}
                                            className="p-3 flex items-center justify-between cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${summary.bg} ${summary.text} flex items-center justify-center`}>
                                                    <span className="material-symbols-outlined text-sm">{summary.icon}</span>
                                                </div>
                                                <span className={`font-bold text-sm ${isPrepared ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{name}</span>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); togglePreparedSpell(name); }}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isPrepared ? 'bg-primary text-white border-primary' : 'bg-transparent border-slate-300 text-slate-300 hover:border-primary hover:text-primary'}`}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">{isPrepared ? 'check' : 'add'}</span>
                                            </button>
                                        </div>
                                        {isExpanded && (
                                            <div className="px-3 pb-3 pt-0 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5">
                                                <div className="flex gap-2 my-2">
                                                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-white/5">{spell.school}</span>
                                                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 text-[10px] font-bold uppercase tracking-wider border border-slate-200 dark:border-white/5">{spell.castingTime}</span>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{spell.description}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
      );
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
    
    let unarmedBonus = 0;
    const equippedWraps = inventory.find(i => i.equipped && i.name.includes('Wraps of Unarmed Power'));
    if (equippedWraps) {
        if (equippedWraps.name.includes('+1')) unarmedBonus = 1;
        else if (equippedWraps.name.includes('+2')) unarmedBonus = 2;
        else if (equippedWraps.name.includes('+3')) unarmedBonus = 3;
    }

    const equippedWeapons = inventory.filter(i => {
        if (!i.equipped) return false;
        const itemData = getItemData(i.name);
        return itemData && itemData.type === 'Weapon';
    });
    
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
         {equippedWeapons.map(item => {
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
         )})}
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Saving Throws</h3>
        <div className="grid grid-cols-3 gap-3">
            {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(stat => {
                const mod = Math.floor(((finalStats[stat] || 10) - 10) / 2);
                const isProf = CLASS_SAVING_THROWS[character.class]?.includes(stat);
                let save = mod + (isProf ? character.profBonus : 0);
                
                if (inventory.some(i => i.equipped && (i.name === 'Cloak of Protection' || i.name === 'Ring of Protection'))) save += 1;
                
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
    const totalWeight = inventory.reduce((acc, item) => {
        const itemData = getItemData(item.name);
        return acc + (itemData ? itemData.weight * item.quantity : 0);
    }, 0);
    const carryCap = (finalStats.STR || 10) * 15;
    const equippedItems = inventory.filter(i => i.equipped);
    const backpackItems = inventory.filter(i => !i.equipped);

    const renderItemRow = (item: InventoryItem) => {
        const itemData = getItemData(item.name) || { name: item.name, type: 'Gear', weight: 0, cost: '-', description: '' };
        const isMagic = MAGIC_ITEMS[item.name] !== undefined;
        const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor' || isMagic;
        
        return (
        <div key={item.id} onClick={() => setSelectedItem(item)} className="group relative flex items-center gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
            <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden ${item.equipped ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-black/40 text-slate-600 dark:text-white'}`}>
            <span className="material-symbols-outlined relative z-10">{itemData.type === 'Weapon' ? 'swords' : itemData.type === 'Armor' ? 'shield' : isMagic ? 'auto_awesome' : 'backpack'}</span>
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
                   {Object.keys(ALL_ITEMS).filter(name => name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 50).map(name => {
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
                    const itemData = (getItemData(selectedItem.name) || { name: selectedItem.name, type: 'Gear', weight: 0, cost: '-', description: '' }) as ItemData;
                    const isMagic = MAGIC_ITEMS[selectedItem.name] !== undefined;
                    const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor' || isMagic;
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
    const allFeatures: { name: string; description: string; level: number; source: string }[] = [];
    const speciesData = SPECIES_DETAILS[character.species];
    
    if (speciesData) {
        speciesData.traits.forEach(t => allFeatures.push({...t, source: 'Raza', level: 1}));
    }
    
    const classData = CLASS_DETAILS[character.class];
    const subclassList = SUBCLASS_OPTIONS[character.class] || [];
    const subclassData = subclassList.find(s => s.name === character.subclass);
    
    if (classData) {
        classData.traits.forEach(t => {
             allFeatures.push({...t, source: 'Clase', level: 1});
        });
    }
    
    for (let l = 1; l <= character.level; l++) {
        const prog = CLASS_PROGRESSION[character.class]?.[l] || [];
        prog.forEach(featName => {
            if (l === 1 && classData?.traits.some(t => t.name === featName)) return;
            let desc = GENERIC_FEATURES[featName] || '';
            if (featName === 'Ability Score Improvement') desc = "Mejora de características o Dote.";
            allFeatures.push({ name: featName, description: desc, level: l, source: 'Clase' });
        });
        if (subclassData && subclassData.features[l]) {
            subclassData.features[l].forEach(t => {
                allFeatures.push({ ...t, source: 'Subclase', level: l });
            });
        }
    }
    
    character.feats.forEach(f => {
        const featOpt = FEAT_OPTIONS.find(fo => fo.name === f);
        allFeatures.push({ name: f, description: featOpt?.description || 'Dote', level: 1, source: 'Dote' });
    });

    const categorizeFeature = (f: { name: string, description: string }) => {
        const text = (f.name + ' ' + f.description).toLowerCase();
        
        // Manual Overrides
        if (text.includes('ability score improvement')) return 'Otros';
        if (text.includes('spellcasting') || text.includes('pact magic')) return 'Utilidad';

        // Combat Keywords
        if (
            text.includes('damage') || text.includes('attack') || text.includes('hit point') || 
            text.includes('heal') || text.includes('saving throw') || text.includes('armor class') || 
            text.includes('ac ') || text.includes('resistance') || text.includes('immunity') || 
            text.includes('initiative') || text.includes('dc') || text.includes('smite') || 
            text.includes('weapon') || text.includes('combat') || text.includes('strike') ||
            text.includes('defense')
        ) {
            return 'Combate';
        }

        // Utility Keywords
        if (
            text.includes('skill') || text.includes('proficiency') || text.includes('language') || 
            text.includes('tool') || text.includes('check') || text.includes('speed') || 
            text.includes('vision') || text.includes('ritual') || text.includes('movement') ||
            text.includes('stealth') || text.includes('perception') || text.includes('insight') ||
            text.includes('swim') || text.includes('fly') || text.includes('climb')
        ) {
            return 'Utilidad';
        }

        return 'Otros';
    };

    const categories = {
        'Combate': [] as typeof allFeatures,
        'Utilidad': [] as typeof allFeatures,
        'Otros': [] as typeof allFeatures
    };

    allFeatures.forEach(f => {
        const cat = categorizeFeature(f);
        // @ts-ignore
        categories[cat].push(f);
    });

    const iconMap: Record<string, string> = { 'Clase': 'shield', 'Subclase': 'auto_awesome', 'Raza': 'face', 'Dote': 'military_tech' };
    
    const renderSection = (title: string, feats: typeof allFeatures, color: string, sectionIcon: string) => {
        if (feats.length === 0) return null;
        return (
            <div className="mb-6 last:mb-0">
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${color}`}>
                    <span className="material-symbols-outlined text-lg">{sectionIcon}</span>
                    {title}
                </h3>
                <div className="flex flex-col gap-3">
                    {feats.map((feat, idx) => {
                        const uniqueKey = `${feat.name}-${feat.level}-${idx}`;
                        const isExpanded = expandedIds[uniqueKey];
                        const icon = iconMap[feat.source] || 'stars';
                        
                        return (
                            <div key={uniqueKey} className="relative overflow-hidden rounded-xl bg-surface-dark border border-white/5 shadow-sm transition-all duration-300">
                                <div onClick={() => toggleExpand(uniqueKey)} className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-white text-base font-bold leading-tight">{feat.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                <span className="material-symbols-outlined text-[12px]">{icon}</span>
                                                {feat.source}
                                            </span>
                                            {feat.level > 1 && <span className="text-[10px] text-slate-500 font-medium">Lvl {feat.level}</span>}
                                        </div>
                                    </div>
                                    <button className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white transition-all ${isExpanded ? 'rotate-180' : ''}`}>
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </button>
                                </div>
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-4 pt-0 text-sm text-slate-400 leading-relaxed border-t border-white/5 mt-2 whitespace-pre-wrap">
                                        {feat.description || <span className="italic">Sin descripción.</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="px-4 pb-24 flex flex-col mt-4">
            {renderSection('Combate', categories['Combate'], 'text-red-400', 'swords')}
            {renderSection('Utilidad', categories['Utilidad'], 'text-blue-400', 'construction')}
            {renderSection('Otros', categories['Otros'], 'text-slate-400', 'widgets')}

            {allFeatures.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">sentiment_dissatisfied</span>
                    <p className="text-sm italic text-slate-400">No hay rasgos disponibles.</p>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-background-light dark:bg-background-dark relative">
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

      <main className="flex-1 overflow-y-auto no-scrollbar relative pb-24">
        {activeTab === 'combat' && renderCombat()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'spells' && renderSpells()}
        {activeTab === 'features' && renderFeatures()}
      </main>

      {/* Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1E293B]/90 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 pb-6 pt-2 px-6 z-40 max-w-md mx-auto">
        <div className="flex justify-center items-center gap-6">
          {[
            { id: 'combat', icon: 'swords', label: 'Combat' },
            { id: 'features', icon: 'stars', label: 'Feats' },
            { id: 'spells', icon: 'auto_stories', label: 'Spells', disabled: !isCaster },
            { id: 'inventory', icon: 'backpack', label: 'Bag' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id as SheetTab)}
              disabled={tab.disabled}
              className={`flex flex-col items-center gap-1 min-w-[60px] ${activeTab === tab.id ? 'text-primary' : tab.disabled ? 'text-slate-300 dark:text-slate-700 grayscale cursor-not-allowed' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
            >
              <span className={`material-symbols-outlined text-[26px] ${activeTab === tab.id ? 'fill-current' : ''}`}>{tab.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
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

export default SheetTabs;
