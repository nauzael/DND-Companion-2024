
import { Ability, Skill } from '../types';

export const ABILITY_NAMES: Record<Ability, string> = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma'
};

export const SKILL_LIST: Skill[] = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 
  'Sleight of Hand', 'Stealth', 'Survival'
];

export const SKILL_ABILITY_MAP: Record<Skill, Ability> = {
  'Acrobatics': 'DEX', 'Animal Handling': 'WIS', 'Arcana': 'INT', 
  'Athletics': 'STR', 'Deception': 'CHA', 'History': 'INT', 
  'Insight': 'WIS', 'Intimidation': 'CHA', 'Investigation': 'INT', 
  'Medicine': 'WIS', 'Nature': 'INT', 'Perception': 'WIS', 
  'Performance': 'CHA', 'Persuasion': 'CHA', 'Religion': 'INT', 
  'Sleight of Hand': 'DEX', 'Stealth': 'DEX', 'Survival': 'WIS'
};
