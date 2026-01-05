
export interface InventoryItem {
  id: string; // Unique ID for this instance
  name: string;
  quantity: number;
  equipped: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  class: string;
  subclass?: string;
  species: string;
  background: string;
  alignment?: string;
  hp: { current: number; max: number; temp: number };
  ac: number; // Base or override, calculated usually
  init: number;
  speed: number;
  profBonus: number;
  stats: Record<string, number>;
  skills: string[];
  languages: string[];
  feats: string[];
  metamagics?: string[];
  imageUrl: string;
  inventory: InventoryItem[]; 
  preparedSpells?: string[];
  notes?: NoteItem[];
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  range: string;
  components: string[];
  duration: string;
  description: string;
  prepared?: boolean;
}

export interface ItemData {
  name: string;
  type: 'Weapon' | 'Armor' | 'Gear' | 'Tool';
  weight: number;
  cost: string; // "10 GP"
  description?: string;
}

export interface WeaponData extends ItemData {
  type: 'Weapon';
  category: 'Simple' | 'Martial';
  rangeType: 'Melee' | 'Ranged';
  damage: string;
  damageType: string;
  properties: string[];
  mastery?: string;
}

export interface ArmorData extends ItemData {
  type: 'Armor';
  armorType: 'Light' | 'Medium' | 'Heavy' | 'Shield';
  baseAC: number;
  stealthDisadvantage: boolean;
  strengthReq: number;
  maxDex?: number; // 2 for medium, 0 for heavy (effectively undefined means infinite for light)
}

export type ViewState = 'list' | 'create' | 'sheet';
export type SheetTab = 'combat' | 'inventory' | 'spells' | 'features' | 'notes';
export type CreatorStep = 1 | 2 | 3 | 4 | 5;

export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
export type Skill = string;

export interface BackgroundData {
    description: string;
    scores: Ability[];
    feat: string;
    featDescription: string;
    skills: Skill[];
    equipment: string[];
}

export interface Trait {
    name: string;
    description: string;
}

export interface DetailData {
    name: string;
    description: string;
    size?: string;
    speed?: number;
    traits: Trait[];
}

export interface SubclassData {
    name: string;
    description: string;
    features: Record<number, Trait[]>;
}

export interface SpellDetail {
    level: number;
    school: string;
    castingTime: string;
    range: string;
    components: string;
    duration: string;
    description: string;
    name: string;
}
