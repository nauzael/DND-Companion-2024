
import { WeaponData, ArmorData, ItemData } from '../types';

export const MASTERY_DESCRIPTIONS: Record<string, string> = {
  'Cleave': 'If you hit a creature, you can make a second attack against a different creature within 5 feet of it.', 
  'Graze': 'If you miss a creature, you deal damage equal to the ability modifier you used for the attack.', 
  'Nick': 'When you make the extra attack of the Light property, you can make it as part of the Attack action.', 
  'Push': 'If you hit a creature, you can push it 10 feet away from you.', 
  'Sap': 'If you hit a creature, it has Disadvantage on its next attack roll before the start of your next turn.', 
  'Slow': 'If you hit a creature, its Speed is reduced by 10 feet until the start of your next turn.', 
  'Topple': 'If you hit a creature, you can force it to make a Constitution save or fall Prone.', 
  'Vex': 'If you hit a creature and deal damage, you have Advantage on your next attack roll against it.', 
  '-': 'No mastery property.'
};

// --- WEAPONS (Updated per PHB 2024 Table) ---
export const WEAPONS_DB: Record<string, WeaponData> = {
    // Simple Melee
    'Club': { name: 'Club', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d4', damageType: 'Bludgeoning', properties: ['Light'], mastery: 'Slow', weight: 2, cost: '1 SP' }, 
    'Dagger': { name: 'Dagger', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d4', damageType: 'Piercing', properties: ['Finesse', 'Light', 'Thrown (20/60)'], mastery: 'Nick', weight: 1, cost: '2 GP' }, 
    'Greatclub': { name: 'Greatclub', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d8', damageType: 'Bludgeoning', properties: ['Two-Handed'], mastery: 'Push', weight: 10, cost: '2 SP' }, 
    'Handaxe': { name: 'Handaxe', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d6', damageType: 'Slashing', properties: ['Light', 'Thrown (20/60)'], mastery: 'Vex', weight: 2, cost: '5 GP' }, 
    'Javelin': { name: 'Javelin', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d6', damageType: 'Piercing', properties: ['Thrown (30/120)'], mastery: 'Slow', weight: 2, cost: '5 SP' }, 
    'Light Hammer': { name: 'Light Hammer', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d4', damageType: 'Bludgeoning', properties: ['Light', 'Thrown (20/60)'], mastery: 'Nick', weight: 2, cost: '2 GP' }, 
    'Mace': { name: 'Mace', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d6', damageType: 'Bludgeoning', properties: [], mastery: 'Sap', weight: 4, cost: '5 GP' }, 
    'Quarterstaff': { name: 'Quarterstaff', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d6', damageType: 'Bludgeoning', properties: ['Versatile (1d8)'], mastery: 'Topple', weight: 4, cost: '2 SP' }, 
    'Sickle': { name: 'Sickle', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d4', damageType: 'Slashing', properties: ['Light'], mastery: 'Nick', weight: 2, cost: '1 GP' }, 
    'Spear': { name: 'Spear', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d6', damageType: 'Piercing', properties: ['Thrown (20/60)', 'Versatile (1d8)'], mastery: 'Sap', weight: 3, cost: '1 GP' }, 
    
    // Simple Ranged
    'Dart': { name: 'Dart', type: 'Weapon', category: 'Simple', rangeType: 'Ranged', damage: '1d4', damageType: 'Piercing', properties: ['Finesse', 'Thrown (20/60)'], mastery: 'Vex', weight: 0.25, cost: '5 CP' }, 
    'Light Crossbow': { name: 'Light Crossbow', type: 'Weapon', category: 'Simple', rangeType: 'Ranged', damage: '1d8', damageType: 'Piercing', properties: ['Ammunition (80/320)', 'Loading', 'Two-Handed'], mastery: 'Slow', weight: 5, cost: '25 GP' }, 
    'Shortbow': { name: 'Shortbow', type: 'Weapon', category: 'Simple', rangeType: 'Ranged', damage: '1d6', damageType: 'Piercing', properties: ['Ammunition (80/320)', 'Two-Handed'], mastery: 'Vex', weight: 2, cost: '25 GP' }, 
    'Sling': { name: 'Sling', type: 'Weapon', category: 'Simple', rangeType: 'Ranged', damage: '1d4', damageType: 'Bludgeoning', properties: ['Ammunition (30/120)'], mastery: 'Slow', weight: 0, cost: '1 SP' }, 
    
    // Martial Melee
    'Battleaxe': { name: 'Battleaxe', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Slashing', properties: ['Versatile (1d10)'], mastery: 'Topple', weight: 4, cost: '10 GP' }, 
    'Flail': { name: 'Flail', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Bludgeoning', properties: [], mastery: 'Sap', weight: 2, cost: '10 GP' }, 
    'Glaive': { name: 'Glaive', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d10', damageType: 'Slashing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Graze', weight: 6, cost: '20 GP' }, 
    'Greataxe': { name: 'Greataxe', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d12', damageType: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Cleave', weight: 7, cost: '30 GP' }, 
    'Greatsword': { name: 'Greatsword', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '2d6', damageType: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Graze', weight: 6, cost: '50 GP' }, 
    'Halberd': { name: 'Halberd', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d10', damageType: 'Slashing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Cleave', weight: 6, cost: '20 GP' }, 
    'Lance': { name: 'Lance', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d12', damageType: 'Piercing', properties: ['Heavy', 'Reach', 'Two-Handed (unless mounted)'], mastery: 'Topple', weight: 6, cost: '10 GP' }, 
    'Longsword': { name: 'Longsword', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Slashing', properties: ['Versatile (1d10)'], mastery: 'Sap', weight: 3, cost: '15 GP' }, 
    'Maul': { name: 'Maul', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '2d6', damageType: 'Bludgeoning', properties: ['Heavy', 'Two-Handed'], mastery: 'Topple', weight: 10, cost: '10 GP' }, 
    'Morningstar': { name: 'Morningstar', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Piercing', properties: [], mastery: 'Sap', weight: 4, cost: '15 GP' }, 
    'Pike': { name: 'Pike', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d10', damageType: 'Piercing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Push', weight: 18, cost: '5 GP' }, 
    'Rapier': { name: 'Rapier', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Piercing', properties: ['Finesse'], mastery: 'Vex', weight: 2, cost: '25 GP' }, 
    'Scimitar': { name: 'Scimitar', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d6', damageType: 'Slashing', properties: ['Finesse', 'Light'], mastery: 'Nick', weight: 3, cost: '25 GP' }, 
    'Shortsword': { name: 'Shortsword', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d6', damageType: 'Piercing', properties: ['Finesse', 'Light'], mastery: 'Vex', weight: 2, cost: '10 GP' }, 
    'Trident': { name: 'Trident', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Piercing', properties: ['Thrown (20/60)', 'Versatile (1d10)'], mastery: 'Topple', weight: 4, cost: '5 GP' }, 
    'Warhammer': { name: 'Warhammer', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Bludgeoning', properties: ['Versatile (1d10)'], mastery: 'Push', weight: 5, cost: '15 GP' }, 
    'War Pick': { name: 'War Pick', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Piercing', properties: ['Versatile (1d10)'], mastery: 'Sap', weight: 2, cost: '5 GP' }, 
    'Whip': { name: 'Whip', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d4', damageType: 'Slashing', properties: ['Finesse', 'Reach'], mastery: 'Slow', weight: 3, cost: '2 GP' }, 
    
    // Martial Ranged
    'Blowgun': { name: 'Blowgun', type: 'Weapon', category: 'Martial', rangeType: 'Ranged', damage: '1', damageType: 'Piercing', properties: ['Ammunition (25/100)', 'Loading'], mastery: 'Vex', weight: 1, cost: '10 GP' }, 
    'Hand Crossbow': { name: 'Hand Crossbow', type: 'Weapon', category: 'Martial', rangeType: 'Ranged', damage: '1d6', damageType: 'Piercing', properties: ['Ammunition (30/120)', 'Light', 'Loading'], mastery: 'Vex', weight: 3, cost: '75 GP' }, 
    'Heavy Crossbow': { name: 'Heavy Crossbow', type: 'Weapon', category: 'Martial', rangeType: 'Ranged', damage: '1d10', damageType: 'Piercing', properties: ['Ammunition (100/400)', 'Heavy', 'Loading', 'Two-Handed'], mastery: 'Push', weight: 18, cost: '50 GP' }, 
    'Longbow': { name: 'Longbow', type: 'Weapon', category: 'Martial', rangeType: 'Ranged', damage: '1d8', damageType: 'Piercing', properties: ['Ammunition (150/600)', 'Heavy', 'Two-Handed'], mastery: 'Slow', weight: 2, cost: '50 GP' }, 
    'Musket': { name: 'Musket', type: 'Weapon', category: 'Martial', rangeType: 'Ranged', damage: '1d12', damageType: 'Piercing', properties: ['Ammunition (40/120)', 'Loading', 'Two-Handed'], mastery: 'Slow', weight: 10, cost: '500 GP' }, 
    'Pistol': { name: 'Pistol', type: 'Weapon', category: 'Martial', rangeType: 'Ranged', damage: '1d10', damageType: 'Piercing', properties: ['Ammunition (30/90)', 'Loading'], mastery: 'Vex', weight: 3, cost: '250 GP' }, 
    
    // Special
    'Unarmed Strike': { name: 'Unarmed Strike', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1', damageType: 'Bludgeoning', properties: [], mastery: '-', weight: 0, cost: '-' },

    // Magic Weapons
    'Sun Blade': { name: 'Sun Blade', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Radiant', properties: ['Finesse', 'Versatile (1d10)'], mastery: 'Sap', weight: 3, cost: 'Rare (4,000 GP)', description: 'Requires Attunement. +2 bonus to attack/damage. Deals Radiant damage. +1d8 vs Undead. Emits sunlight.' },
    'Flame Tongue (Longsword)': { name: 'Flame Tongue (Longsword)', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Slashing', properties: ['Versatile (1d10)'], mastery: 'Sap', weight: 3, cost: 'Rare (4,000 GP)', description: 'Requires Attunement. Bonus Action to ignite: +2d6 Fire damage. Sheds bright light.' },
    'Vorpal Sword (Longsword)': { name: 'Vorpal Sword (Longsword)', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Slashing', properties: ['Versatile (1d10)'], mastery: 'Sap', weight: 3, cost: 'Legendary (200,000 GP)', description: 'Requires Attunement. +3 bonus. Ignores resistance to Slashing. Natural 20 decapitates creature.' },
    'Javelin of Lightning': { name: 'Javelin of Lightning', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d6', damageType: 'Piercing', properties: ['Thrown (30/120)'], mastery: 'Slow', weight: 2, cost: 'Uncommon (400 GP)', description: 'Transform into lightning bolt (Line 5ft wide). 4d6 Lightning damage (DC 13 Dex save).' },
    'Dagger of Venom': { name: 'Dagger of Venom', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d4', damageType: 'Piercing', properties: ['Finesse', 'Light', 'Thrown (20/60)'], mastery: 'Nick', weight: 1, cost: 'Rare (4,000 GP)', description: '+1 bonus. Action to coat in poison: DC 15 Con save or 2d10 Poison damage + Poisoned condition.' },
    'Frost Brand (Greatsword)': { name: 'Frost Brand (Greatsword)', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '2d6', damageType: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Graze', weight: 6, cost: 'Very Rare (40,000 GP)', description: 'Requires Attunement. +1d6 Cold damage. Resistance to Fire. Extinguishes nonmagical flames.' },
    'Trident of Fish Command': { name: 'Trident of Fish Command', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Piercing', properties: ['Thrown (20/60)', 'Versatile (1d10)'], mastery: 'Topple', weight: 4, cost: 'Uncommon (400 GP)', description: 'Requires Attunement. 3 charges to cast Dominate Beast (DC 15) on beasts with swim speed.' },
    'Mace of Disruption': { name: 'Mace of Disruption', type: 'Weapon', category: 'Simple', rangeType: 'Melee', damage: '1d6', damageType: 'Bludgeoning', properties: [], mastery: 'Sap', weight: 4, cost: 'Rare (4,000 GP)', description: 'Requires Attunement. +2d6 Radiant vs Fiends/Undead. DC 15 Wis save or be destroyed if under 25 HP.' },
    'Holy Avenger (Longsword)': { name: 'Holy Avenger (Longsword)', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Slashing', properties: ['Versatile (1d10)'], mastery: 'Sap', weight: 3, cost: 'Legendary (200,000 GP)', description: 'Requires Attunement (Paladin). +3 bonus. +2d10 Radiant vs Fiend/Undead. Aura of advantage vs spells.' },
    'Weapon +1': { name: 'Weapon +1', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Slashing', properties: [], mastery: '-', weight: 3, cost: 'Uncommon (400 GP)', description: '+1 bonus to attack and damage rolls.' },
    'Weapon +2': { name: 'Weapon +2', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Slashing', properties: [], mastery: '-', weight: 3, cost: 'Rare (4,000 GP)', description: '+2 bonus to attack and damage rolls.' },
    'Weapon +3': { name: 'Weapon +3', type: 'Weapon', category: 'Martial', rangeType: 'Melee', damage: '1d8', damageType: 'Slashing', properties: [], mastery: '-', weight: 3, cost: 'Very Rare (40,000 GP)', description: '+3 bonus to attack and damage rolls.' },
};

// --- ARMOR ---
export const ARMOR_DB: Record<string, ArmorData> = {
    // Light
    'Padded Armor': { name: 'Padded Armor', type: 'Armor', armorType: 'Light', baseAC: 11, stealthDisadvantage: true, strengthReq: 0, weight: 8, cost: '5 GP' }, 
    'Leather Armor': { name: 'Leather Armor', type: 'Armor', armorType: 'Light', baseAC: 11, stealthDisadvantage: false, strengthReq: 0, weight: 10, cost: '10 GP' }, 
    'Studded Leather Armor': { name: 'Studded Leather Armor', type: 'Armor', armorType: 'Light', baseAC: 12, stealthDisadvantage: false, strengthReq: 0, weight: 13, cost: '45 GP' },
    
    // Medium
    'Hide Armor': { name: 'Hide Armor', type: 'Armor', armorType: 'Medium', baseAC: 12, maxDex: 2, stealthDisadvantage: false, strengthReq: 0, weight: 12, cost: '10 GP' }, 
    'Chain Shirt': { name: 'Chain Shirt', type: 'Armor', armorType: 'Medium', baseAC: 13, maxDex: 2, stealthDisadvantage: false, strengthReq: 0, weight: 20, cost: '50 GP' }, 
    'Scale Mail': { name: 'Scale Mail', type: 'Armor', armorType: 'Medium', baseAC: 14, maxDex: 2, stealthDisadvantage: true, strengthReq: 0, weight: 45, cost: '50 GP' },
    'Breastplate': { name: 'Breastplate', type: 'Armor', armorType: 'Medium', baseAC: 14, maxDex: 2, stealthDisadvantage: false, strengthReq: 0, weight: 20, cost: '400 GP' }, 
    'Half Plate Armor': { name: 'Half Plate Armor', type: 'Armor', armorType: 'Medium', baseAC: 15, maxDex: 2, stealthDisadvantage: true, strengthReq: 0, weight: 40, cost: '750 GP' }, 
    
    // Heavy
    'Ring Mail': { name: 'Ring Mail', type: 'Armor', armorType: 'Heavy', baseAC: 14, maxDex: 0, stealthDisadvantage: true, strengthReq: 0, weight: 40, cost: '30 GP' },
    'Chain Mail': { name: 'Chain Mail', type: 'Armor', armorType: 'Heavy', baseAC: 16, maxDex: 0, stealthDisadvantage: true, strengthReq: 13, weight: 55, cost: '75 GP' }, 
    'Splint Armor': { name: 'Splint Armor', type: 'Armor', armorType: 'Heavy', baseAC: 17, maxDex: 0, stealthDisadvantage: true, strengthReq: 15, weight: 60, cost: '200 GP' }, 
    'Plate Armor': { name: 'Plate Armor', type: 'Armor', armorType: 'Heavy', baseAC: 18, maxDex: 0, stealthDisadvantage: true, strengthReq: 15, weight: 65, cost: '1,500 GP' },
    
    // Shield
    'Shield': { name: 'Shield', type: 'Armor', armorType: 'Shield', baseAC: 2, stealthDisadvantage: false, strengthReq: 0, weight: 6, cost: '10 GP' },

    // Magic Armor
    'Adamantine Armor (Plate)': { name: 'Adamantine Armor (Plate)', type: 'Armor', armorType: 'Heavy', baseAC: 18, maxDex: 0, stealthDisadvantage: true, strengthReq: 15, weight: 65, cost: 'Uncommon (500+ GP)', description: 'Critical hits against you become normal hits.' },
    'Mithral Armor (Chain Mail)': { name: 'Mithral Armor (Chain Mail)', type: 'Armor', armorType: 'Heavy', baseAC: 16, maxDex: 0, stealthDisadvantage: false, strengthReq: 0, weight: 55, cost: 'Uncommon (500+ GP)', description: 'No Strength requirement. No Disadvantage on Stealth.' },
    'Sentinel Shield': { name: 'Sentinel Shield', type: 'Armor', armorType: 'Shield', baseAC: 2, stealthDisadvantage: false, strengthReq: 0, weight: 6, cost: 'Uncommon (400 GP)', description: 'Advantage on Initiative and Perception.' },
    'Arrow-Catching Shield': { name: 'Arrow-Catching Shield', type: 'Armor', armorType: 'Shield', baseAC: 2, stealthDisadvantage: false, strengthReq: 0, weight: 6, cost: 'Rare (4,000 GP)', description: 'Requires Attunement. +2 AC vs Ranged Attacks. Reaction to become target of ranged attack.' },
    'Armor +1': { name: 'Armor +1', type: 'Armor', armorType: 'Light', baseAC: 12, stealthDisadvantage: false, strengthReq: 0, weight: 10, cost: 'Rare (4,000 GP)', description: '+1 bonus to AC.' },
    'Shield +1': { name: 'Shield +1', type: 'Armor', armorType: 'Shield', baseAC: 3, stealthDisadvantage: false, strengthReq: 0, weight: 6, cost: 'Uncommon (400 GP)', description: '+1 bonus to AC.' },
    'Elven Chain': { name: 'Elven Chain', type: 'Armor', armorType: 'Medium', baseAC: 14, maxDex: 2, stealthDisadvantage: false, strengthReq: 0, weight: 20, cost: 'Rare (4,000 GP)', description: '+1 bonus to AC. Considered proficient even if you lack Medium armor training.' },
    'Glamoured Studded Leather': { name: 'Glamoured Studded Leather', type: 'Armor', armorType: 'Light', baseAC: 13, stealthDisadvantage: false, strengthReq: 0, weight: 13, cost: 'Rare (4,000 GP)', description: '+1 bonus to AC. Bonus action to change appearance.' },
};

// --- GEAR & TOOLS ---
export const GEAR_DB: Record<string, ItemData> = {
    'Acid (vial)': { name: 'Acid (vial)', type: 'Gear', weight: 1, cost: '25 GP' },
    'Alchemist\'s Fire (flask)': { name: 'Alchemist\'s Fire (flask)', type: 'Gear', weight: 1, cost: '50 GP' },
    'Antitoxin (vial)': { name: 'Antitoxin (vial)', type: 'Gear', weight: 0, cost: '50 GP' },
    'Backpack': { name: 'Backpack', type: 'Gear', weight: 5, cost: '2 GP' },
    'Ball Bearings (bag of 1,000)': { name: 'Ball Bearings (bag of 1,000)', type: 'Gear', weight: 2, cost: '1 GP' },
    'Bedroll': { name: 'Bedroll', type: 'Gear', weight: 7, cost: '1 GP' },
    'Bell': { name: 'Bell', type: 'Gear', weight: 0, cost: '1 GP' },
    'Blanket': { name: 'Blanket', type: 'Gear', weight: 3, cost: '5 SP' },
    'Block and Tackle': { name: 'Block and Tackle', type: 'Gear', weight: 5, cost: '1 GP' },
    'Book': { name: 'Book', type: 'Gear', weight: 5, cost: '25 GP' },
    'Caltrops (bag of 20)': { name: 'Caltrops (bag of 20)', type: 'Gear', weight: 2, cost: '1 GP' },
    'Candle': { name: 'Candle', type: 'Gear', weight: 0, cost: '1 CP' },
    'Chain (10 feet)': { name: 'Chain (10 feet)', type: 'Gear', weight: 10, cost: '5 GP' },
    'Chest': { name: 'Chest', type: 'Gear', weight: 25, cost: '5 GP' },
    'Climber\'s Kit': { name: 'Climber\'s Kit', type: 'Gear', weight: 12, cost: '25 GP' },
    'Clothes, Fine': { name: 'Clothes, Fine', type: 'Gear', weight: 6, cost: '15 GP' },
    'Clothes, Traveler\'s': { name: 'Clothes, Traveler\'s', type: 'Gear', weight: 4, cost: '2 GP' },
    'Component Pouch': { name: 'Component Pouch', type: 'Gear', weight: 2, cost: '25 GP' },
    'Crowbar': { name: 'Crowbar', type: 'Gear', weight: 5, cost: '2 GP' },
    'Druidic Focus': { name: 'Druidic Focus', type: 'Gear', weight: 0, cost: 'Varies' },
    'Arcane Focus': { name: 'Arcane Focus', type: 'Gear', weight: 0, cost: 'Varies' },
    'Holy Symbol': { name: 'Holy Symbol', type: 'Gear', weight: 0, cost: 'Varies' },
    'Grappling Hook': { name: 'Grappling Hook', type: 'Gear', weight: 4, cost: '2 GP' },
    'Healer\'s Kit': { name: 'Healer\'s Kit', type: 'Gear', weight: 3, cost: '5 GP' },
    'Holy Water (flask)': { name: 'Holy Water (flask)', type: 'Gear', weight: 1, cost: '25 GP' },
    'Hunting Trap': { name: 'Hunting Trap', type: 'Gear', weight: 25, cost: '5 GP' },
    'Ink (1 ounce)': { name: 'Ink (1 ounce)', type: 'Gear', weight: 0, cost: '10 GP' },
    'Lantern, Bullseye': { name: 'Lantern, Bullseye', type: 'Gear', weight: 2, cost: '10 GP' },
    'Lantern, Hooded': { name: 'Lantern, Hooded', type: 'Gear', weight: 2, cost: '5 GP' },
    'Lock': { name: 'Lock', type: 'Gear', weight: 1, cost: '10 GP' },
    'Manacles': { name: 'Manacles', type: 'Gear', weight: 6, cost: '2 GP' },
    'Mirror, Steel': { name: 'Mirror, Steel', type: 'Gear', weight: 0.5, cost: '5 GP' },
    'Oil (flask)': { name: 'Oil (flask)', type: 'Gear', weight: 1, cost: '1 SP' },
    'Paper (one sheet)': { name: 'Paper (one sheet)', type: 'Gear', weight: 0, cost: '2 SP' },
    'Parchment (one sheet)': { name: 'Parchment (one sheet)', type: 'Gear', weight: 0, cost: '1 SP' },
    'Perfume (vial)': { name: 'Perfume (vial)', type: 'Gear', weight: 0, cost: '5 GP' },
    'Poison, Basic (vial)': { name: 'Poison, Basic (vial)', type: 'Gear', weight: 0, cost: '100 GP' },
    'Potion of Healing': { name: 'Potion of Healing', type: 'Gear', weight: 0.5, cost: '50 GP' },
    'Rations (1 day)': { name: 'Rations (1 day)', type: 'Gear', weight: 2, cost: '5 SP' },
    'Rope, Hempen (50 feet)': { name: 'Rope, Hempen (50 feet)', type: 'Gear', weight: 10, cost: '1 GP' },
    'Rope, Silk (50 feet)': { name: 'Rope, Silk (50 feet)', type: 'Gear', weight: 5, cost: '10 GP' },
    'Shovel': { name: 'Shovel', type: 'Gear', weight: 5, cost: '2 GP' },
    'Signal Whistle': { name: 'Signal Whistle', type: 'Gear', weight: 0, cost: '5 CP' },
    'Spellbook': { name: 'Spellbook', type: 'Gear', weight: 3, cost: '50 GP' },
    'Spyglass': { name: 'Spyglass', type: 'Gear', weight: 1, cost: '1,000 GP' },
    'Tent, Two-person': { name: 'Tent, Two-person', type: 'Gear', weight: 20, cost: '2 GP' },
    'Tinderbox': { name: 'Tinderbox', type: 'Gear', weight: 1, cost: '5 SP' },
    'Torch': { name: 'Torch', type: 'Gear', weight: 1, cost: '1 CP' },
    'Waterskin': { name: 'Waterskin', type: 'Gear', weight: 5, cost: '2 SP' },
    'Thieves\' Tools': { name: 'Thieves\' Tools', type: 'Tool', weight: 1, cost: '25 GP' },
    'Artisan\'s Tools': { name: 'Artisan\'s Tools', type: 'Tool', weight: 5, cost: 'Varies' },
    'Musical Instrument': { name: 'Musical Instrument', type: 'Tool', weight: 2, cost: 'Varies' },
    'Navigator\'s Tools': { name: 'Navigator\'s Tools', type: 'Tool', weight: 2, cost: '25 GP' },
};

// --- MAGIC ITEMS (Wondrous, Rings, Rods, Potions, etc.) ---
export const MAGIC_ITEMS: Record<string, ItemData> = {
    // Potions
    'Potion of Healing (Greater)': { name: 'Potion of Healing (Greater)', type: 'Gear', weight: 0.5, cost: 'Uncommon (100+ GP)', description: 'Regain 4d4 + 4 HP.' },
    'Potion of Healing (Superior)': { name: 'Potion of Healing (Superior)', type: 'Gear', weight: 0.5, cost: 'Rare (500+ GP)', description: 'Regain 8d4 + 8 HP.' },
    'Potion of Healing (Supreme)': { name: 'Potion of Healing (Supreme)', type: 'Gear', weight: 0.5, cost: 'Very Rare (5,000+ GP)', description: 'Regain 10d4 + 20 HP.' },
    'Potion of Invisibility': { name: 'Potion of Invisibility', type: 'Gear', weight: 0.5, cost: 'Very Rare', description: 'Gain Invisible condition for 1 hour.' },
    'Potion of Speed': { name: 'Potion of Speed', type: 'Gear', weight: 0.5, cost: 'Very Rare', description: 'Gain effect of Haste spell for 1 minute.' },
    'Potion of Giant Strength (Hill)': { name: 'Potion of Giant Strength (Hill)', type: 'Gear', weight: 0.5, cost: 'Uncommon', description: 'Strength becomes 21 for 1 hour.' },
    'Oil of Slipperiness': { name: 'Oil of Slipperiness', type: 'Gear', weight: 0.5, cost: 'Uncommon', description: 'Freedom of Movement for 8 hours.' },

    // Wondrous Items
    'Bag of Holding': { name: 'Bag of Holding', type: 'Gear', weight: 15, cost: 'Uncommon', description: 'Holds 500 lbs, 64 cubic feet. Always weighs 15 lbs.' },
    'Boots of Elvenkind': { name: 'Boots of Elvenkind', type: 'Gear', weight: 0, cost: 'Uncommon', description: 'Steps make no sound. Advantage on Stealth.' },
    'Cloak of Protection': { name: 'Cloak of Protection', type: 'Gear', weight: 3, cost: 'Uncommon', description: 'Requires Attunement. +1 bonus to AC and Saving Throws.' },
    'Gauntlets of Ogre Power': { name: 'Gauntlets of Ogre Power', type: 'Gear', weight: 0, cost: 'Uncommon', description: 'Requires Attunement. Strength becomes 19.' },
    'Headband of Intellect': { name: 'Headband of Intellect', type: 'Gear', weight: 0, cost: 'Uncommon', description: 'Requires Attunement. Intelligence becomes 19.' },
    'Winged Boots': { name: 'Winged Boots', type: 'Gear', weight: 0, cost: 'Uncommon', description: 'Requires Attunement. Fly speed equal to walking speed for 4 hours total.' },
    'Immovable Rod': { name: 'Immovable Rod', type: 'Gear', weight: 2, cost: 'Uncommon', description: 'Action to fix in space. Holds 8,000 lbs.' },
    'Lantern of Revealing': { name: 'Lantern of Revealing', type: 'Gear', weight: 2, cost: 'Uncommon', description: 'Sheds bright light 30ft. Invisible creatures are visible in the light.' },
    'Broom of Flying': { name: 'Broom of Flying', type: 'Gear', weight: 3, cost: 'Uncommon', description: 'Fly speed 50ft.' },
    'Alchemy Jug': { name: 'Alchemy Jug', type: 'Gear', weight: 12, cost: 'Uncommon', description: 'Produces liquids like acid, beer, honey, mayonnaise, water, wine.' },
    'Cap of Water Breathing': { name: 'Cap of Water Breathing', type: 'Gear', weight: 0, cost: 'Uncommon', description: 'Breathe underwater.' },
    'Cloak of the Manta Ray': { name: 'Cloak of the Manta Ray', type: 'Gear', weight: 3, cost: 'Uncommon', description: 'Breathe underwater and Swim Speed 60ft.' },
    'Driftglobe': { name: 'Driftglobe', type: 'Gear', weight: 1, cost: 'Uncommon', description: 'Cast Light or Daylight. Floats near you.' },
    'Eversmoking Bottle': { name: 'Eversmoking Bottle', type: 'Gear', weight: 1, cost: 'Uncommon', description: 'Creates cloud of smoke.' },
    'Goggles of Night': { name: 'Goggles of Night', type: 'Gear', weight: 0, cost: 'Uncommon', description: 'Darkvision 60ft.' },
    'Helm of Comprehending Languages': { name: 'Helm of Comprehending Languages', type: 'Gear', weight: 3, cost: 'Uncommon', description: 'Cast Comprehend Languages.' },
    'Heward\'s Handy Haversack': { name: 'Heward\'s Handy Haversack', type: 'Gear', weight: 5, cost: 'Rare', description: 'Extradimensional storage. Weighs 5 lbs.' },
    'Portable Hole': { name: 'Portable Hole', type: 'Gear', weight: 0, cost: 'Rare', description: 'Unfolds into 10ft deep extradimensional hole.' },
    'Rope of Climbing': { name: 'Rope of Climbing', type: 'Gear', weight: 3, cost: 'Uncommon', description: '60ft rope that animates and climbs.' },
    'Slippers of Spider Climbing': { name: 'Slippers of Spider Climbing', type: 'Gear', weight: 0.5, cost: 'Uncommon', description: 'Requires Attunement. Climb speed. Move on walls/ceilings.' },
    
    // Rings
    'Ring of Protection': { name: 'Ring of Protection', type: 'Gear', weight: 0, cost: 'Rare', description: 'Requires Attunement. +1 bonus to AC and Saving Throws.' },
    'Ring of Invisibility': { name: 'Ring of Invisibility', type: 'Gear', weight: 0, cost: 'Legendary', description: 'Requires Attunement. Turn invisible as an action.' },
    'Ring of Feather Falling': { name: 'Ring of Feather Falling', type: 'Gear', weight: 0, cost: 'Rare', description: 'Requires Attunement. Immune to falling damage.' },
    'Ring of Water Walking': { name: 'Ring of Water Walking', type: 'Gear', weight: 0, cost: 'Uncommon', description: 'Walk on liquid surfaces.' },
    'Ring of Mind Shielding': { name: 'Ring of Mind Shielding', type: 'Gear', weight: 0, cost: 'Uncommon', description: 'Requires Attunement. Immune to mind reading.' },

    // Rods & Wands
    'Rod of the Pact Keeper +1': { name: 'Rod of the Pact Keeper +1', type: 'Gear', weight: 2, cost: 'Uncommon', description: 'Requires Attunement (Warlock). +1 to spell attacks/DC. Regain 1 slot/day.' },
    'Wand of Magic Missiles': { name: 'Wand of Magic Missiles', type: 'Gear', weight: 1, cost: 'Uncommon', description: '7 charges. Cast Magic Missile.' },
    'Wand of Fireballs': { name: 'Wand of Fireballs', type: 'Gear', weight: 1, cost: 'Rare', description: 'Requires Attunement. 7 charges. Cast Fireball.' },
    'Wand of the War Mage +1': { name: 'Wand of the War Mage +1', type: 'Gear', weight: 1, cost: 'Uncommon', description: 'Requires Attunement. +1 to spell attacks. Ignore half cover.' },
    'Wand of Web': { name: 'Wand of Web', type: 'Gear', weight: 1, cost: 'Uncommon', description: 'Requires Attunement. 7 charges. Cast Web.' },

    // Treasures
    '10 GP Gemstone': { name: '10 GP Gemstone', type: 'Gear', weight: 0, cost: '10 GP', description: 'Azurite, Banded Agate, Blue Quartz, etc.' },
    '50 GP Gemstone': { name: '50 GP Gemstone', type: 'Gear', weight: 0, cost: '50 GP', description: 'Bloodstone, Carnelian, Chalcedony, etc.' },
    '100 GP Gemstone': { name: '100 GP Gemstone', type: 'Gear', weight: 0, cost: '100 GP', description: 'Amber, Amethyst, Coral, Jade, Pearl, etc.' },
    '500 GP Gemstone': { name: '500 GP Gemstone', type: 'Gear', weight: 0, cost: '500 GP', description: 'Alexandrite, Aquamarine, Black Pearl, Topaz.' },
    '1000 GP Gemstone': { name: '1000 GP Gemstone', type: 'Gear', weight: 0, cost: '1,000 GP', description: 'Black Opal, Blue Sapphire, Emerald, Fire Opal.' },
    '5000 GP Gemstone': { name: '5000 GP Gemstone', type: 'Gear', weight: 0, cost: '5,000 GP', description: 'Black Sapphire, Diamond, Jacinth, Ruby.' },
    'Art Object (25 GP)': { name: 'Art Object (25 GP)', type: 'Gear', weight: 1, cost: '25 GP', description: 'Silver ewer, Carved bone statuette, Gold bracelet.' },
    'Art Object (250 GP)': { name: 'Art Object (250 GP)', type: 'Gear', weight: 1, cost: '250 GP', description: 'Gold ring, Carved ivory statuette, Large gold bracelet.' },
    'Art Object (750 GP)': { name: 'Art Object (750 GP)', type: 'Gear', weight: 2, cost: '750 GP', description: 'Silver chalice with moonstones, Gold idol.' },
};

// Combine all for lookup
export const ALL_ITEMS: Record<string, ItemData> = {
    ...WEAPONS_DB,
    ...ARMOR_DB,
    ...GEAR_DB,
    ...MAGIC_ITEMS
};

export const TRINKETS: string[] = [
  "A mummified goblin hand", "A crystal that faintly glows in moonlight", "A gold coin minted in an unknown land", "A diary written in a language you don't know", "A brass ring that never tarnishes", "An old chess piece made from glass", "A pair of knucklebone dice, each with a skull symbol on the side that would normally show six pips", "A small idol depicting a nightmarish creature that gives you unsettling dreams when you sleep near it", "A lock of someone's hair", "The deed for a parcel of land in a realm unknown to you",
  "A 1-ounce block made from an unknown material", "A small cloth doll skewered with needles", "A tooth from an unknown beast", "An enormous scale, perhaps from a dragon", "A bright-green feather", "An old divination card bearing your likeness", "A glass orb filled with moving smoke", "A 1-pound egg with a bright-red shell", "A pipe that blows bubbles", "A glass jar containing a bit of flesh floating in pickling fluid",
  "A gnome-crafted music box that plays a song you dimly remember from your childhood", "A wooden statuette of a smug halfling", "A brass orb etched with strange runes", "A multicolored stone disk", "A silver icon of a raven", "A bag containing forty-seven teeth, one of which is rotten", "A shard of obsidian that always feels warm to the touch", "A dragon's talon strung on a leather necklace", "A pair of old socks", "A blank book whose pages refuse to hold ink, chalk, graphite, or any other marking",
  "A silver badge that is a five-pointed star", "A knife that belonged to a relative", "A glass vial filled with nail clippings", "A rectangular metal device with two tiny metal cups on one end that throws sparks when wet", "A white, sequined glove sized for a human", "A vest with one hundred tiny pockets", "A weightless stone", "A sketch of a goblin", "An empty glass vial that smells of perfume", "A gemstone that looks like a lump of coal when examined by anyone but you",
  "A scrap of cloth from an old banner", "A rank insignia from a lost legionnaire", "A silver bell without a clapper", "A mechanical canary inside a lamp", "A miniature chest carved to look like it has numerous feet on the bottom", "A dead sprite inside a clear glass bottle", "A metal can that has no opening but sounds as if it is filled with liquid, sand, spiders, or broken glass (your choice)", "A glass orb filled with water, in which swims a clockwork goldfish", "A silver spoon with an M engraved on the handle", "A whistle made from gold-colored wood",
  "A dead scarab beetle the size of your hand", "Two toy soldiers, one missing a head", "A small box filled with different-sized buttons", "A candle that can't be lit", "A miniature cage with no door", "An old key", "An indecipherable treasure map", "A hilt from a broken sword", "A rabbit's foot", "A glass eye",
  "A cameo of a hideous person", "A silver skull the size of a coin", "An alabaster mask", "A cone of sticky black incense that stinks", "A nightcap that gives you pleasant dreams when you wear it", "A single caltrop made from bone", "A gold monocle frame without the lens", "A 1-inch cube, each side a different color", "A crystal doorknob", "A packet filled with pink dust",
  "A fragment of a beautiful song, written as musical notes on two pieces of parchment", "A silver teardrop earring containing a real teardrop", "An eggshell painted with scenes of misery in disturbing detail", "A fan that, when unfolded, shows a sleepy cat", "A set of bone pipes", "A four-leaf clover pressed inside a book discussing manners and etiquette", "A sheet of parchment upon which is drawn a mechanical contraption", "An ornate scabbard that fits no blade you have found", "An invitation to a party where a murder happened", "A bronze pentacle with an etching of a rat's head in its center", "A purple handkerchief embroidered with the name of an archmage", "Half a floor plan for a temple, a castle, or another structure", "A bit of folded cloth that, when unfolded, turns into a stylish cap", "A receipt of deposit at a bank in a far-off city", "A diary with seven missing pages", "An empty silver snuffbox bearing the inscription 'dreams' on its lid", "An iron holy symbol devoted to an unknown god", "A book about a legendary hero's rise and fall, with the last chapter missing", "A vial of dragon blood", "An ancient arrow of elven design"
];
