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
  ac: number;
  init: number;
  speed: number;
  profBonus: number;
  stats: Record<string, number>;
  skills: string[];
  languages: string[];
  feats: string[];
  imageUrl: string;
  inventory?: string[]; // IDs or names of items
  preparedSpells?: string[];
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

export interface Item {
  name: string;
  type: string;
  weight: number;
  quantity?: number;
  notes?: string;
  equipped?: boolean;
  tags?: string[];
}

export type ViewState = 'list' | 'create' | 'sheet';
export type SheetTab = 'combat' | 'inventory' | 'spells';
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

export interface Weapon {
    name: string;
    damage: string;
    type: string;
    properties: string[];
    mastery: string;
    equipped: boolean;
}

export interface Armor {
    baseAC: number;
    type: 'Light' | 'Medium' | 'Heavy' | 'Shield';
    stealthDisadvantage: boolean;
    strengthReq: number;
    maxDex?: number;
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