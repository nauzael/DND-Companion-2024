
import { Ability, Skill, BackgroundData, DetailData, SubclassData, Trait } from '../types';

export const SPECIES_LIST = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 'Gnome', 'Orc', 'Tiefling', 'Aasimar', 'Goliath'
];

export const CLASS_LIST = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

export const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good', 
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

export const LANGUAGES = [
  'Common', 'Common Sign Language', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 
  'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon', 'Thieves\' Cant', 'Druidic'
];

export const HIT_DIE: Record<string, number> = {
  'Barbarian': 12, 'Fighter': 10, 'Paladin': 10, 'Ranger': 10, 'Bard': 8, 'Cleric': 8, 'Druid': 8, 'Monk': 8, 'Rogue': 8, 'Warlock': 8, 'Sorcerer': 6, 'Wizard': 6
};

export const CLASS_SAVING_THROWS: Record<string, Ability[]> = {
  'Barbarian': ['STR', 'CON'], 'Bard': ['DEX', 'CHA'], 'Cleric': ['WIS', 'CHA'], 'Druid': ['INT', 'WIS'],
  'Fighter': ['STR', 'CON'], 'Monk': ['STR', 'DEX'], 'Paladin': ['WIS', 'CHA'], 'Ranger': ['STR', 'DEX'],
  'Rogue': ['DEX', 'INT'], 'Sorcerer': ['CON', 'CHA'], 'Warlock': ['WIS', 'CHA'], 'Wizard': ['INT', 'WIS']
};

export const CLASS_STAT_PRIORITIES: Record<string, Ability[]> = {
  'Barbarian': ['STR', 'CON', 'DEX'], 'Bard': ['CHA', 'DEX', 'CON'], 'Cleric': ['WIS', 'CON', 'STR'], 'Druid': ['WIS', 'CON', 'DEX'],
  'Fighter': ['STR', 'CON', 'DEX'], 'Monk': ['DEX', 'WIS', 'CON'], 'Paladin': ['STR', 'CHA', 'CON'], 'Ranger': ['DEX', 'WIS', 'CON'],
  'Rogue': ['DEX', 'INT', 'CON'], 'Sorcerer': ['CHA', 'CON', 'DEX'], 'Warlock': ['CHA', 'CON', 'DEX'], 'Wizard': ['INT', 'CON', 'DEX']
};

export const CLASS_SKILL_DATA: Record<string, { count: number, options: Skill[] | 'Any' }> = {
  'Barbarian': { count: 2, options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
  'Bard': { count: 3, options: 'Any' },
  'Cleric': { count: 2, options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
  'Druid': { count: 2, options: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
  'Fighter': { count: 2, options: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
  'Monk': { count: 2, options: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
  'Paladin': { count: 2, options: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
  'Ranger': { count: 3, options: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
  'Rogue': { count: 4, options: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
  'Sorcerer': { count: 2, options: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
  'Warlock': { count: 2, options: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
  'Wizard': { count: 2, options: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] }
};

export const BACKGROUNDS_DATA: Record<string, BackgroundData> = {
    'Acolyte': { description: 'Devoted to service in a temple.', scores: ['INT', 'WIS', 'CHA'], feat: 'Magic Initiate (Cleric)', featDescription: 'Learn 2 Cleric cantrips and 1 level 1 spell.', skills: ['Insight', 'Religion'], equipment: ['Calligrapher\'s Supplies', 'Book (Prayers)', 'Holy Symbol', 'Parchment (10)', 'Robe', '8 GP'] },
    'Artisan': { description: 'Started as an apprentice to a craftsperson.', scores: ['STR', 'DEX', 'INT'], feat: 'Crafter', featDescription: 'Discount on nonmagical items. Fast crafting.', skills: ['Investigation', 'Persuasion'], equipment: ['Artisan\'s Tools', 'Pouch (2)', 'Traveler\'s Clothes', '32 GP'] },
    'Charlatan': { description: 'Learned to prey on unfortunates with lies.', scores: ['DEX', 'CON', 'CHA'], feat: 'Skilled', featDescription: 'Gain proficiency in 3 Skills or Tools.', skills: ['Deception', 'Sleight of Hand'], equipment: ['Forgery Kit', 'Costume', 'Fine Clothes', '15 GP'] },
    'Criminal': { description: 'Eked out a living in dark alleyways.', scores: ['DEX', 'CON', 'INT'], feat: 'Alert', featDescription: 'Proficiency in Initiative. Swap initiative with ally.', skills: ['Sleight of Hand', 'Stealth'], equipment: ['Thieves\' Tools', 'Dagger (2)', 'Crowbar', 'Pouch (2)', 'Traveler\'s Clothes', '16 GP'] },
    'Entertainer': { description: 'Thrive on applause and the stage.', scores: ['STR', 'DEX', 'CHA'], feat: 'Musician', featDescription: 'Grant Heroic Inspiration to allies after a rest.', skills: ['Acrobatics', 'Performance'], equipment: ['Musical Instrument', 'Costume (2)', 'Mirror', 'Perfume', 'Traveler\'s Clothes', '11 GP'] },
    'Farmer': { description: 'Grew up close to the land and nature.', scores: ['STR', 'CON', 'WIS'], feat: 'Tough', featDescription: 'Hit Point maximum increases by 2 per level.', skills: ['Animal Handling', 'Nature'], equipment: ['Carpenter\'s Tools', 'Sickle', 'Healer\'s Kit', 'Iron Pot', 'Shovel', 'Traveler\'s Clothes', '30 GP'] },
    'Guard': { description: 'Trained to watch for marauders and trouble.', scores: ['STR', 'INT', 'WIS'], feat: 'Alert', featDescription: 'Proficiency in Initiative. Swap initiative with ally.', skills: ['Athletics', 'Perception'], equipment: ['Gaming Set', 'Spear', 'Light Crossbow', 'Bolts (20)', 'Hooded Lantern', 'Manacles', 'Quiver', 'Traveler\'s Clothes', '12 GP'] },
    'Guide': { description: 'Came of age outdoors, far from settlements.', scores: ['DEX', 'CON', 'WIS'], feat: 'Magic Initiate (Druid)', featDescription: 'Learn 2 Druid cantrips and 1 level 1 spell.', skills: ['Stealth', 'Survival'], equipment: ['Cartographer\'s Tools', 'Shortbow', 'Arrows (20)', 'Bedroll', 'Quiver', 'Tent', 'Traveler\'s Clothes', '3 GP'] },
    'Hermit': { description: 'Spent early years in seclusion or a monastery.', scores: ['CON', 'WIS', 'CHA'], feat: 'Healer', featDescription: 'Reroll 1s on healing dice. Use Healer\'s Kit to restore HP.', skills: ['Medicine', 'Religion'], equipment: ['Herbalism Kit', 'Quarterstaff', 'Bedroll', 'Book (Philosophy)', 'Lamp', 'Oil (3)', 'Traveler\'s Clothes', '16 GP'] },
    'Merchant': { description: 'Apprenticed to a trader or shopkeeper.', scores: ['CON', 'INT', 'CHA'], feat: 'Lucky', featDescription: 'Gain Luck Points to reroll d20s.', skills: ['Animal Handling', 'Persuasion'], equipment: ['Navigator\'s Tools', 'Pouch (2)', 'Traveler\'s Clothes', '22 GP'] },
    'Noble': { description: 'Raised in a castle with wealth and power.', scores: ['STR', 'INT', 'CHA'], feat: 'Skilled', featDescription: 'Gain proficiency in 3 Skills or Tools.', skills: ['History', 'Persuasion'], equipment: ['Gaming Set', 'Fine Clothes', 'Perfume', '29 GP'] },
    'Sage': { description: 'Whiled away evenings studying books and scrolls.', scores: ['CON', 'INT', 'WIS'], feat: 'Magic Initiate (Wizard)', featDescription: 'Learn 2 Wizard cantrips and 1 level 1 spell.', skills: ['Arcana', 'History'], equipment: ['Calligrapher\'s Supplies', 'Quarterstaff', 'Book (History)', 'Parchment (8)', 'Robe', '8 GP'] },
    'Sailor': { description: 'Lived as a seafarer, wind at your back.', scores: ['STR', 'DEX', 'WIS'], feat: 'Tavern Brawler', featDescription: 'Unarmed strikes deal 1d4. Push on hit. Reroll 1s.', skills: ['Acrobatics', 'Perception'], equipment: ['Navigator\'s Tools', 'Dagger', 'Rope', 'Traveler\'s Clothes', '20 GP'] },
    'Scribe': { description: 'Learned to write with a clear hand.', scores: ['DEX', 'INT', 'WIS'], feat: 'Skilled', featDescription: 'Gain proficiency in 3 Skills or Tools.', skills: ['Investigation', 'Perception'], equipment: ['Calligrapher\'s Supplies', 'Fine Clothes', 'Lamp', 'Oil (3)', 'Parchment (12)', '23 GP'] },
    'Soldier': { description: 'Began training for war as soon as you reached adulthood.', scores: ['STR', 'DEX', 'CON'], feat: 'Savage Attacker', featDescription: 'Roll damage dice twice and use the higher roll.', skills: ['Athletics', 'Intimidation'], equipment: ['Gaming Set', 'Spear', 'Shortbow', 'Arrows (20)', 'Healer\'s Kit', 'Quiver', 'Traveler\'s Clothes', '14 GP'] },
    'Wayfarer': { description: 'Grew up on the streets, resorting to theft.', scores: ['DEX', 'WIS', 'CHA'], feat: 'Lucky', featDescription: 'Gain Luck Points to reroll d20s.', skills: ['Insight', 'Stealth'], equipment: ['Thieves\' Tools', 'Dagger (2)', 'Gaming Set', 'Bedroll', 'Pouch (2)', 'Traveler\'s Clothes', '16 GP'] }
};

export const SPECIES_DETAILS: Record<string, DetailData> = {
  'Human': { name: 'Human', description: 'Ambitious and resourceful. Found throughout the multiverse.', size: 'Medium or Small', speed: 30, traits: [{ name: 'Resourceful', description: 'Gain Heroic Inspiration whenever you finish a Long Rest.' }, { name: 'Skillful', description: 'Gain proficiency in one Skill of your choice.' }, { name: 'Versatile', description: 'Gain an Origin Feat of your choice.' }] },
  'Elf': { name: 'Elf', description: 'Magical people of otherworldly grace, living in the world but apart from it.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: '60ft range.' }, { name: 'Elven Lineage', description: 'Choose Drow (120ft Darkvision, spells), High Elf (Prestidigitation + spells), or Wood Elf (35ft Speed + Druidcraft).' }, { name: 'Fey Ancestry', description: 'Advantage vs Charmed. Magic can\'t put you to sleep.' }, { name: 'Keen Senses', description: 'Proficiency in Insight, Perception, or Survival.' }, { name: 'Trance', description: 'Meditate 4 hours for Long Rest.' }] },
  'Dwarf': { name: 'Dwarf', description: 'Solid and enduring like the mountains, resilient and strong.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: '120ft range.' }, { name: 'Dwarven Resilience', description: 'Resistance to Poison damage. Advantage vs Poisoned condition.' }, { name: 'Dwarven Toughness', description: '+1 HP per level.' }, { name: 'Stonecunning', description: 'Bonus Action: Tremorsense 60ft on stone (10 mins).' }] },
  'Halfling': { name: 'Halfling', description: 'Small, brave, and lucky inhabitants of bucolic havens.', size: 'Small', speed: 30, traits: [{ name: 'Brave', description: 'Advantage vs Frightened.' }, { name: 'Halfling Nimbleness', description: 'Move through space of creatures larger than you.' }, { name: 'Luck', description: 'Reroll natural 1s on d20 tests.' }, { name: 'Naturally Stealthy', description: 'Hide even when obscured only by a larger creature.' }] },
  'Dragonborn': { name: 'Dragonborn', description: 'Ancestry of dragons, manifesting in breath and resistance.', size: 'Medium', speed: 30, traits: [{ name: 'Draconic Ancestry', description: 'Choose a dragon type (e.g. Gold/Fire, Blue/Lightning). Determines resistance and breath.' }, { name: 'Breath Weapon', description: 'Replace attack. 15ft Cone or 30ft Line. 1d10 damage (scales). Dex/Con save.' }, { name: 'Damage Resistance', description: 'Resistance to your ancestry\'s damage type.' }, { name: 'Darkvision', description: '60ft range.' }, { name: 'Draconic Flight', description: 'Lvl 5: Fly speed equal to speed for 10 mins (Bonus Action).' }] },
  'Gnome': { name: 'Gnome', description: 'Petite, clever, and magical folk created by gods of invention.', size: 'Small', speed: 30, traits: [{ name: 'Darkvision', description: '60ft range.' }, { name: 'Gnomish Cunning', description: 'Advantage on INT, WIS, and CHA saves.' }, { name: 'Gnomish Lineage', description: 'Choose Forest (Minor Illusion + Speak with Animals) or Rock (Mending + Prestidigitation + Clockwork Devices).' }] },
  'Orc': { name: 'Orc', description: 'Tall, broad, and blessed by Gruumsh with endurance.', size: 'Medium', speed: 30, traits: [{ name: 'Adrenaline Rush', description: 'Bonus Action Dash. Gain Temp HP = PB.' }, { name: 'Darkvision', description: '120ft range.' }, { name: 'Relentless Endurance', description: 'Drop to 1 HP instead of 0 once per Long Rest.' }] },
  'Tiefling': { name: 'Tiefling', description: 'Linked by blood to the Lower Planes.', size: 'Medium or Small', speed: 30, traits: [{ name: 'Darkvision', description: '60ft range.' }, { name: 'Fiendish Legacy', description: 'Abyssal (Poison res/spells), Chthonic (Necrotic res/spells), or Infernal (Fire res/spells).' }, { name: 'Otherworldly Presence', description: 'You know Thaumaturgy.' }] },
  'Aasimar': { name: 'Aasimar', description: 'Mortals carrying a spark of the Upper Planes.', size: 'Medium or Small', speed: 30, traits: [{ name: 'Celestial Resistance', description: 'Resistance to Necrotic and Radiant damage.' }, { name: 'Darkvision', description: '60ft range.' }, { name: 'Healing Hands', description: 'Magic Action: Heal creature 1d4 * PB. Once per Long Rest.' }, { name: 'Light Bearer', description: 'You know the Light cantrip.' }, { name: 'Celestial Revelation', description: 'Lvl 3: Transform (Bonus Action) for flight, searing light, or necrotic shroud.' }] },
  'Goliath': { name: 'Goliath', description: 'Distant descendants of giants.', size: 'Medium', speed: 35, traits: [{ name: 'Giant Ancestry', description: 'Choose Cloud (Teleport), Fire (Fire dmg), Frost (Cold/Slow), Hill (Topple), Stone (Reaction reduce dmg), or Storm (Reaction Thunder).' }, { name: 'Large Form', description: 'Lvl 5: Become Large, Adv on Str checks, +10 Speed (Bonus Action).' }, { name: 'Powerful Build', description: 'Advantage to end Grappled. Count as one size larger for carrying.' }] }
};

export const CLASS_DETAILS: Record<string, DetailData> = {
  'Barbarian': { name: 'Barbarian', description: 'Powered by primal forces that manifest as Rage.', traits: [{ name: 'Rage', description: 'Bonus Action. Resist B/P/S. Adv on STR checks/saves. +Rage Damage.' }, { name: 'Unarmored Defense', description: 'AC = 10 + DEX + CON.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }] },
  'Bard': { name: 'Bard', description: 'Inspire others through music, dance, and verse.', traits: [{ name: 'Bardic Inspiration', description: 'Bonus Action give d6 (scales) to ally for D20 Tests.' }, { name: 'Spellcasting', description: 'Arcane magic. Charisma based. Ritual casting.' }] },
  'Cleric': { name: 'Cleric', description: 'Harness divine magic to work miracles.', traits: [{ name: 'Spellcasting', description: 'Divine magic. Wisdom based. Change prepared spells on Long Rest.' }, { name: 'Divine Order', description: 'Choose Protector (Heavy Armor/Martial Weap) or Thaumaturge (Extra Cantrip/Skill).' }] },
  'Druid': { name: 'Druid', description: 'Channel the forces of nature and shape-shift.', traits: [{ name: 'Spellcasting', description: 'Primal magic. Wisdom based.' }, { name: 'Druidic', description: 'Secret language. Speak with Animals prepared.' }, { name: 'Primal Order', description: 'Choose Magician (Cantrip/Arcana/Nature) or Warden (Medium Armor/Martial Weap).' }] },
  'Fighter': { name: 'Fighter', description: 'Master combatants skilled with all weapons and armor.', traits: [{ name: 'Fighting Style', description: 'Choose a Fighting Style feat.' }, { name: 'Second Wind', description: 'Bonus Action regain 1d10+Lvl HP. Use 2/SR.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 3 weapons.' }] },
  'Monk': { name: 'Monk', description: 'Focus internal power into uncanny speed and strength.', traits: [{ name: 'Martial Arts', description: 'DEX for unarmed/monk weapons. d6 damage die. Bonus Action unarmed strike.' }, { name: 'Unarmored Defense', description: 'AC = 10 + DEX + WIS.' }, { name: 'Monk\'s Focus', description: 'Focus Points for Flurry of Blows, Patient Defense, Step of the Wind.' }] },
  'Paladin': { name: 'Paladin', description: 'United by oaths to stand against annihilation.', traits: [{ name: 'Lay On Hands', description: 'Healing pool = 5 * Level. Bonus Action to use.' }, { name: 'Spellcasting', description: 'Divine magic. Charisma based.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }] },
  'Ranger': { name: 'Ranger', description: 'Wanderers of the wilderness and deadly hunters.', traits: [{ name: 'Spellcasting', description: 'Primal magic. Wisdom based.' }, { name: 'Favored Enemy', description: 'Hunter\'s Mark prepared. Free castings.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }] },
  'Rogue': { name: 'Rogue', description: 'Rely on cunning, stealth, and vulnerabilities.', traits: [{ name: 'Expertise', description: 'Double proficiency in two skills.' }, { name: 'Sneak Attack', description: 'Deal extra damage (1d6 scales) once per turn with Finesse/Ranged weapon.' }, { name: 'Thieves\' Cant', description: 'Secret code language.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }] },
  'Sorcerer': { name: 'Sorcerer', description: 'Wield innate magic stamped into their being.', traits: [{ name: 'Spellcasting', description: 'Arcane magic. Charisma based.' }, { name: 'Innate Sorcery', description: 'Bonus Action: +1 DC, Advantage on spell attacks.' }] },
  'Warlock': { name: 'Warlock', description: 'Quest for knowledge via a pact with a patron.', traits: [{ name: 'Eldritch Invocations', description: 'Gain 1 invocation (e.g. Pact of the Blade/Chain/Tome).' }, { name: 'Pact Magic', description: 'Spells always max level. Regain on Short Rest.' }] },
  'Wizard': { name: 'Wizard', description: 'Defined by exhaustive study of magic.', traits: [{ name: 'Spellcasting', description: 'Arcane magic. Intelligence based. Spellbook.' }, { name: 'Ritual Adept', description: 'Cast rituals from book without preparing.' }, { name: 'Arcane Recovery', description: 'Regain spell slots on Short Rest.' }] }
};

export const CLASS_PROGRESSION: Record<string, Record<number, string[]>> = {
    'Barbarian': { 
        1: ['Rage', 'Unarmored Defense', 'Weapon Mastery'], 
        2: ['Danger Sense', 'Reckless Attack'], 
        3: ['Barbarian Subclass', 'Primal Knowledge'], 
        4: ['Ability Score Improvement'],
        5: ['Extra Attack', 'Fast Movement'], 
        6: ['Subclass Feature'],
        7: ['Feral Instinct', 'Instinctive Pounce'], 
        8: ['Ability Score Improvement'],
        9: ['Brutal Strike'], 
        10: ['Subclass Feature'],
        11: ['Relentless Rage'], 
        12: ['Ability Score Improvement'],
        13: ['Improved Brutal Strike'], 
        14: ['Subclass Feature'],
        15: ['Persistent Rage'], 
        16: ['Ability Score Improvement'],
        17: ['Improved Brutal Strike'], 
        18: ['Indomitable Might'], 
        19: ['Epic Boon'],
        20: ['Primal Champion'] 
    },
    'Bard': { 
        1: ['Bardic Inspiration', 'Spellcasting'],
        2: ['Expertise', 'Jack of All Trades'], 
        3: ['Bard Subclass'],
        4: ['Ability Score Improvement'],
        5: ['Font of Inspiration'], 
        6: ['Subclass Feature'],
        7: ['Countercharm'], 
        8: ['Ability Score Improvement'],
        9: ['Expertise'], 
        10: ['Magical Secrets'], 
        11: [],
        12: ['Ability Score Improvement'],
        13: [],
        14: ['Subclass Feature'],
        15: [],
        16: ['Ability Score Improvement'],
        17: [],
        18: ['Superior Inspiration'], 
        19: ['Epic Boon'],
        20: ['Words of Creation'] 
    },
    'Cleric': { 
        1: ['Spellcasting', 'Divine Order'],
        2: ['Channel Divinity'], 
        3: ['Cleric Subclass'],
        4: ['Ability Score Improvement'],
        5: ['Sear Undead'], 
        6: ['Subclass Feature'],
        7: ['Blessed Strikes'], 
        8: ['Ability Score Improvement'],
        9: [],
        10: ['Divine Intervention'], 
        11: [],
        12: ['Ability Score Improvement'],
        13: [],
        14: ['Improved Blessed Strikes'], 
        15: [],
        16: ['Ability Score Improvement'],
        17: ['Subclass Feature'],
        18: [],
        19: ['Epic Boon'],
        20: ['Greater Divine Intervention'] 
    },
    'Druid': { 
        1: ['Spellcasting', 'Druidic', 'Primal Order'],
        2: ['Wild Shape', 'Wild Companion'], 
        3: ['Druid Subclass'],
        4: ['Ability Score Improvement'],
        5: ['Wild Resurgence'], 
        6: ['Subclass Feature'],
        7: ['Elemental Fury'], 
        8: ['Ability Score Improvement'],
        9: [],
        10: ['Subclass Feature'],
        11: [],
        12: ['Ability Score Improvement'],
        13: [],
        14: ['Subclass Feature'],
        15: ['Improved Elemental Fury'], 
        16: ['Ability Score Improvement'],
        17: [],
        18: ['Beast Spells'], 
        19: ['Epic Boon'],
        20: ['Archdruid'] 
    },
    'Fighter': { 
        1: ['Fighting Style', 'Second Wind', 'Weapon Mastery'],
        2: ['Action Surge', 'Tactical Mind'], 
        3: ['Fighter Subclass'],
        4: ['Ability Score Improvement'],
        5: ['Extra Attack', 'Tactical Shift'], 
        6: ['Ability Score Improvement'],
        7: ['Subclass Feature'],
        8: ['Ability Score Improvement'],
        9: ['Indomitable', 'Tactical Master'], 
        10: ['Subclass Feature'],
        11: ['Two Extra Attacks'], 
        12: ['Ability Score Improvement'],
        13: ['Indomitable (2 uses)', 'Studied Attacks'], 
        14: ['Ability Score Improvement'],
        15: ['Subclass Feature'],
        16: ['Ability Score Improvement'],
        17: ['Action Surge (2 uses)', 'Indomitable (3 uses)'], 
        18: ['Subclass Feature'],
        19: ['Epic Boon'],
        20: ['Three Extra Attacks'] 
    },
    'Monk': { 
        1: ['Martial Arts', 'Unarmored Defense'],
        2: ['Monk\'s Focus', 'Unarmored Movement', 'Uncanny Metabolism'], 
        3: ['Deflect Attacks', 'Monk Subclass'], 
        4: ['Ability Score Improvement', 'Slow Fall'], 
        5: ['Extra Attack', 'Stunning Strike'], 
        6: ['Empowered Strikes', 'Subclass Feature'], 
        7: ['Evasion'], 
        8: ['Ability Score Improvement'],
        9: ['Acrobatic Movement'], 
        10: ['Heightened Focus', 'Self-Restoration'], 
        11: ['Subclass Feature'], 
        12: ['Ability Score Improvement'],
        13: ['Deflect Energy'], 
        14: ['Disciplined Survivor'], 
        15: ['Perfect Focus'], 
        16: ['Ability Score Improvement'], 
        17: ['Subclass Feature'], 
        18: ['Superior Defense'], 
        19: ['Epic Boon'],
        20: ['Body and Mind'] 
    },
    'Paladin': { 
        1: ['Lay On Hands', 'Spellcasting', 'Weapon Mastery'],
        2: ['Fighting Style', 'Paladin\'s Smite'], 
        3: ['Channel Divinity', 'Paladin Subclass'],
        4: ['Ability Score Improvement'],
        5: ['Extra Attack', 'Faithful Steed'], 
        6: ['Aura of Protection'], 
        7: ['Subclass Feature'], 
        8: ['Ability Score Improvement'],
        9: ['Abjure Foes'], 
        10: ['Aura of Courage'], 
        11: ['Radiant Strikes'], 
        12: ['Ability Score Improvement'],
        13: [],
        14: ['Restoring Touch'], 
        15: ['Subclass Feature'],
        16: ['Ability Score Improvement'],
        17: [],
        18: ['Aura Expansion'],
        19: ['Epic Boon'],
        20: ['Subclass Feature']
    },
    'Ranger': { 
        1: ['Spellcasting', 'Favored Enemy', 'Weapon Mastery'],
        2: ['Deft Explorer', 'Fighting Style'], 
        3: ['Ranger Subclass'],
        4: ['Ability Score Improvement'],
        5: ['Extra Attack'], 
        6: ['Roving'], 
        7: ['Subclass Feature'],
        8: ['Ability Score Improvement'],
        9: ['Expertise'], 
        10: ['Tireless'], 
        11: ['Subclass Feature'],
        12: ['Ability Score Improvement'],
        13: ['Relentless Hunter'], 
        14: ['Nature\'s Veil'], 
        15: ['Subclass Feature'],
        16: ['Ability Score Improvement'], 
        17: ['Precise Hunter'], 
        18: ['Feral Senses'], 
        19: ['Epic Boon'],
        20: ['Foe Slayer'] 
    },
    'Rogue': { 
        1: ['Expertise', 'Sneak Attack', 'Thieves\' Cant', 'Weapon Mastery'],
        2: ['Cunning Action'], 
        3: ['Rogue Subclass', 'Steady Aim'], 
        4: ['Ability Score Improvement'],
        5: ['Cunning Strike', 'Uncanny Dodge'], 
        6: ['Expertise'], 
        7: ['Evasion', 'Reliable Talent'], 
        8: ['Ability Score Improvement'],
        9: ['Subclass Feature'], 
        10: ['Ability Score Improvement'], 
        11: ['Improved Cunning Strike'], 
        12: ['Ability Score Improvement'],
        13: ['Subclass Feature'], 
        14: ['Devious Strikes'], 
        15: ['Slippery Mind'], 
        16: ['Ability Score Improvement'],
        17: ['Subclass Feature'], 
        18: ['Elusive'], 
        19: ['Epic Boon'],
        20: ['Stroke of Luck'] 
    },
    'Sorcerer': { 
        1: ['Spellcasting', 'Innate Sorcery'],
        2: ['Font of Magic', 'Metamagic'], 
        3: ['Sorcerer Subclass'],
        4: ['Ability Score Improvement'],
        5: ['Sorcerous Restoration'], 
        6: ['Subclass Feature'],
        7: ['Sorcery Incarnate'], 
        8: ['Ability Score Improvement'],
        9: [],
        10: ['Metamagic'], 
        11: [],
        12: ['Ability Score Improvement'],
        13: [],
        14: ['Subclass Feature'], 
        15: [],
        16: ['Ability Score Improvement'],
        17: ['Metamagic'], 
        18: ['Subclass Feature'],
        19: ['Epic Boon'],
        20: ['Arcane Apotheosis'] 
    },
    'Warlock': { 
        1: ['Eldritch Invocations', 'Pact Magic'],
        2: ['Magical Cunning'], 
        3: ['Warlock Subclass'],
        4: ['Ability Score Improvement'],
        5: [],
        6: ['Subclass Feature'], 
        7: [],
        8: ['Ability Score Improvement'],
        9: ['Contact Patron'], 
        10: ['Subclass Feature'],
        11: ['Mystic Arcanum (level 6)'], 
        12: ['Ability Score Improvement'],
        13: ['Mystic Arcanum (level 7)'], 
        14: ['Subclass Feature'],
        15: ['Mystic Arcanum (level 8)'], 
        16: ['Ability Score Improvement'],
        17: ['Mystic Arcanum (level 9)'], 
        18: [],
        19: ['Epic Boon'],
        20: ['Eldritch Master'] 
    },
    'Wizard': { 
        1: ['Spellcasting', 'Ritual Adept', 'Arcane Recovery'],
        2: ['Scholar'], 
        3: ['Wizard Subclass'],
        4: ['Ability Score Improvement'],
        5: ['Memorize Spell'], 
        6: ['Subclass Feature'], 
        7: [],
        8: ['Ability Score Improvement'],
        9: [],
        10: ['Subclass Feature'],
        11: [],
        12: ['Ability Score Improvement'],
        13: [],
        14: ['Subclass Feature'], 
        15: [],
        16: ['Ability Score Improvement'],
        17: [],
        18: ['Spell Mastery'], 
        19: ['Epic Boon'],
        20: ['Signature Spells'] 
    }
};

export const SUBCLASS_OPTIONS: Record<string, SubclassData[]> = {
  'Barbarian': [
    { name: 'Path of the Berserker', description: 'Channel Rage into violent fury.', features: { 3: [{ name: 'Frenzy', description: 'Deal extra damage when using Reckless Attack.' }], 6: [{ name: 'Mindless Rage', description: 'Immunity to Charmed and Frightened while Raging.' }], 10: [{ name: 'Retaliation', description: 'Reaction to attack when damaged.' }], 14: [{ name: 'Intimidating Presence', description: 'Frighten enemies as a Bonus Action.' }] } },
    { name: 'Path of the Wild Heart', description: 'Walk in community with the animal world.', features: { 3: [{ name: 'Animal Speaker', description: 'Cast Beast Sense and Speak with Animals.' }, { name: 'Rage of the Wilds', description: 'Choose Bear, Eagle, or Wolf benefits.' }], 6: [{ name: 'Aspect of the Wilds', description: 'Choose Owl, Panther, or Salmon benefits.' }], 10: [{ name: 'Nature Speaker', description: 'Cast Commune with Nature.' }], 14: [{ name: 'Power of the Wilds', description: 'Choose Falcon, Lion, or Ram benefits.' }] } },
    { name: 'Path of the World Tree', description: 'Trace the roots and branches of the multiverse.', features: { 3: [{ name: 'Vitality of the Tree', description: 'Gain Temp HP on Rage. Give Temp HP to others.' }], 6: [{ name: 'Branches of the Tree', description: 'Reaction to teleport or move enemies.' }], 10: [{ name: 'Battering Roots', description: 'Increased Reach. Use Push/Topple mastery.' }], 14: [{ name: 'Travel Along the Tree', description: 'Teleporting abilities.' }] } },
    { name: 'Path of the Zealot', description: 'Rage in ecstatic union with a god.', features: { 3: [{ name: 'Divine Fury', description: 'Deal Necrotic or Radiant damage while Raging.' }, { name: 'Warrior of the Gods', description: 'Healing pool dice.' }], 6: [{ name: 'Fanatical Focus', description: 'Reroll saving throws.' }], 10: [{ name: 'Zealous Presence', description: 'Grant Advantage to allies.' }], 14: [{ name: 'Rage of the Gods', description: 'Flight and Resistances.' }] } }
  ],
  'Bard': [
    { name: 'College of Dance', description: 'Move in harmony with the cosmos.', features: { 3: [{ name: 'Dazzling Footwork', description: 'Unarmored Defense. Unarmed Strike with Bardic Die.' }], 6: [{ name: 'Inspiring Movement', description: 'Reaction move allies.' }, { name: 'Tandem Footwork', description: 'Boost Initiative.' }], 14: [{ name: 'Leading Evasion', description: 'Share Evasion with allies.' }] } },
    { name: 'College of Glamour', description: 'Weave beguiling Fey magic.', features: { 3: [{ name: 'Beguiling Magic', description: 'Charm/Frighten with spells.' }, { name: 'Mantle of Inspiration', description: 'Grant Temp HP and movement.' }], 6: [{ name: 'Mantle of Majesty', description: 'Cast Command as Bonus Action.' }], 14: [{ name: 'Unbreakable Majesty', description: 'Sanctuary-like effect.' }] } },
    { name: 'College of Lore', description: 'Plumb the depths of magical knowledge.', features: { 3: [{ name: 'Bonus Proficiencies', description: '3 extra skills.' }, { name: 'Cutting Words', description: 'Reduce enemy rolls.' }], 6: [{ name: 'Magical Discoveries', description: 'Learn 2 spells from any class.' }], 14: [{ name: 'Peerless Skill', description: 'Boost own ability checks.' }] } },
    { name: 'College of Valor', description: 'Sing the deeds of ancient heroes.', features: { 3: [{ name: 'Combat Inspiration', description: 'Add to damage or AC.' }, { name: 'Martial Training', description: 'Martial weapons, Medium Armor, Shields.' }], 6: [{ name: 'Extra Attack', description: 'Attack twice.' }], 14: [{ name: 'Battle Magic', description: 'Bonus Action attack after casting spell.' }] } }
  ],
  'Cleric': [
    { name: 'Life Domain', description: 'Soothe the hurts of the world.', features: { 3: [{ name: 'Disciple of Life', description: 'Extra healing.' }, { name: 'Preserve Life', description: 'Heal from pool.' }], 6: [{ name: 'Blessed Healer', description: 'Heal yourself when healing others.' }], 17: [{ name: 'Supreme Healing', description: 'Max healing dice.' }] } },
    { name: 'Light Domain', description: 'Bring light to banish darkness.', features: { 3: [{ name: 'Radiance of the Dawn', description: 'AoE Radiant damage.' }, { name: 'Warding Flare', description: 'Impose disadvantage on attacks.' }], 6: [{ name: 'Improved Warding Flare', description: 'Protect allies.' }], 17: [{ name: 'Corona of Light', description: 'Disadvantage to enemies vs Fire/Radiant.' }] } },
    { name: 'Trickery Domain', description: 'Make mischief and challenge authority.', features: { 3: [{ name: 'Blessing of the Trickster', description: 'Grant Stealth advantage.' }, { name: 'Invoke Duplicity', description: 'Create illusionary double.' }], 6: [{ name: 'Trickster\'s Transposition', description: 'Teleport to double.' }], 17: [{ name: 'Improved Duplicity', description: 'Allies get advantage near double. Healing illusion.' }] } },
    { name: 'War Domain', description: 'Inspire valor and smite foes.', features: { 3: [{ name: 'War Priest', description: 'Bonus Action attacks.' }, { name: 'Guided Strike', description: '+10 to hit.' }], 6: [{ name: 'War God\'s Blessing', description: 'Cast Shield of Faith/Spiritual Weapon freely.' }], 17: [{ name: 'Avatar of Battle', description: 'Physical resistances.' }] } }
  ],
  'Druid': [
    { name: 'Circle of the Land', description: 'Celebrate connection to the natural world.', features: { 3: [{ name: 'Land\'s Aid', description: 'Heal/Harm area.' }], 6: [{ name: 'Natural Recovery', description: 'Regain spell slots.' }], 10: [{ name: 'Nature\'s Ward', description: 'Immunities/Resistances.' }], 14: [{ name: 'Nature\'s Sanctuary', description: 'Trees provide cover.' }] } },
    { name: 'Circle of the Moon', description: 'Adopt animal forms to guard the wilds.', features: { 3: [{ name: 'Circle Forms', description: 'Combat Wild Shape. AC 13+Wis. Temp HP.' }], 6: [{ name: 'Improved Circle Forms', description: 'Radiant damage attacks.' }], 10: [{ name: 'Moonlight Step', description: 'Teleport.' }], 14: [{ name: 'Lunar Form', description: 'Extra damage.' }] } },
    { name: 'Circle of the Sea', description: 'Become one with tides and storms.', features: { 3: [{ name: 'Wrath of the Sea', description: 'Emanation deals Cold damage/push.' }], 6: [{ name: 'Aquatic Affinity', description: 'Swim speed.' }], 10: [{ name: 'Stormborn', description: 'Fly speed. Resistances.' }], 14: [{ name: 'Oceanic Gift', description: 'Share emanation.' }] } },
    { name: 'Circle of the Stars', description: 'Harness secrets hidden in constellations.', features: { 3: [{ name: 'Star Map', description: 'Guidance/Guiding Bolt.' }, { name: 'Starry Form', description: 'Archer/Chalice/Dragon forms.' }], 6: [{ name: 'Cosmic Omen', description: 'Weal or Woe.' }], 10: [{ name: 'Twinkling Constellations', description: ' improved forms.' }], 14: [{ name: 'Full of Stars', description: 'Resistances.' }] } }
  ],
  'Fighter': [
    { name: 'Battle Master', description: 'Master sophisticated battle maneuvers.', features: { 3: [{ name: 'Combat Superiority', description: 'Maneuvers and Superiority Dice.' }, { name: 'Student of War', description: 'Tool proficiency.' }], 7: [{ name: 'Know Your Enemy', description: 'Learn stats.' }], 10: [{ name: 'Improved Combat Superiority', description: 'd10 dice.' }], 15: [{ name: 'Relentless', description: 'Free die.' }], 18: [{ name: 'Ultimate Combat Superiority', description: 'd12 dice.' }] } },
    { name: 'Champion', description: 'Pursue physical excellence in combat.', features: { 3: [{ name: 'Improved Critical', description: 'Crit on 19-20.' }, { name: 'Remarkable Athlete', description: 'Initiative/Athletics advantage.' }], 7: [{ name: 'Additional Fighting Style', description: 'Second style.' }], 10: [{ name: 'Heroic Warrior', description: 'Heroic Inspiration.' }], 15: [{ name: 'Superior Critical', description: 'Crit on 18-20.' }], 18: [{ name: 'Survivor', description: 'Regen HP.' }] } },
    { name: 'Eldritch Knight', description: 'Support combat skills with arcane magic.', features: { 3: [{ name: 'Spellcasting', description: 'Wizard spells.' }, { name: 'War Bond', description: 'Summon weapon.' }], 7: [{ name: 'War Magic', description: 'Cantrip + Attack.' }], 10: [{ name: 'Eldritch Strike', description: 'Disadvantage on saves.' }], 15: [{ name: 'Arcane Charge', description: 'Teleport.' }], 18: [{ name: 'Improved War Magic', description: 'Spell + Attack.' }] } },
    { name: 'Psi Warrior', description: 'Augment physical might with psionic power.', features: { 3: [{ name: 'Psionic Power', description: 'Psionic Energy Dice.' }], 7: [{ name: 'Telekinetic Adept', description: 'Flight/Thrust.' }], 10: [{ name: 'Guarded Mind', description: 'Resistance/End conditions.' }], 15: [{ name: 'Bulwark of Force', description: 'Cover.' }], 18: [{ name: 'Telekinetic Master', description: 'Telekinesis spell.' }] } }
  ],
  'Monk': [
    { name: 'Warrior of Mercy', description: 'Manipulate forces of life and death.', features: { 3: [{ name: 'Hand of Harm', description: 'Necrotic damage.' }, { name: 'Hand of Healing', description: 'Heal HP.' }], 6: [{ name: 'Physician\'s Touch', description: 'Cure conditions/Poison.' }], 11: [{ name: 'Flurry of Healing and Harm', description: 'Free use.' }], 17: [{ name: 'Hand of Ultimate Mercy', description: 'Resurrect.' }] } },
    { name: 'Warrior of Shadow', description: 'Harness shadow power for stealth.', features: { 3: [{ name: 'Shadow Arts', description: 'Darkness/Darkvision.' }], 6: [{ name: 'Shadow Step', description: 'Teleport.' }], 11: [{ name: 'Improved Shadow Step', description: 'Free step/attack.' }], 17: [{ name: 'Cloak of Shadows', description: 'Invisibility/Phase.' }] } },
    { name: 'Warrior of the Elements', description: 'Wield elemental power.', features: { 3: [{ name: 'Elemental Attunement', description: 'Reach/Damage type.' }], 6: [{ name: 'Elemental Burst', description: 'AoE damage.' }], 11: [{ name: 'Stride of the Elements', description: 'Fly/Swim.' }], 17: [{ name: 'Elemental Epitome', description: 'Resistance/Speed.' }] } },
    { name: 'Warrior of the Open Hand', description: 'Master unarmed combat.', features: { 3: [{ name: 'Open Hand Technique', description: 'Addle/Push/Topple.' }], 6: [{ name: 'Wholeness of Body', description: 'Heal self.' }], 11: [{ name: 'Fleet Step', description: 'Step of Wind free.' }], 17: [{ name: 'Quivering Palm', description: 'Massive damage.' }] } }
  ],
  'Paladin': [
    { name: 'Oath of Devotion', description: 'Uphold justice and order.', features: { 3: [{ name: 'Sacred Weapon', description: ' radiant weapon.' }], 7: [{ name: 'Aura of Devotion', description: 'Charm immunity.' }], 15: [{ name: 'Smite of Protection', description: 'Half cover.' }], 20: [{ name: 'Holy Nimbus', description: 'Radiant aura.' }] } },
    { name: 'Oath of Glory', description: 'Strive for heroism.', features: { 3: [{ name: 'Peerless Athlete', description: 'Athletics advantage.' }, { name: 'Inspiring Smite', description: 'Temp HP.' }], 7: [{ name: 'Aura of Alacrity', description: 'Speed boost.' }], 15: [{ name: 'Glorious Defense', description: 'AC bonus reaction.' }], 20: [{ name: 'Living Legend', description: 'Rerolls.' }] } },
    { name: 'Oath of the Ancients', description: 'Preserve life and light.', features: { 3: [{ name: 'Nature\'s Wrath', description: 'Restrain foes.' }], 7: [{ name: 'Aura of Warding', description: 'Resistance to magic damage.' }], 15: [{ name: 'Undying Sentinel', description: 'Avoid 0 HP.' }], 20: [{ name: 'Elder Champion', description: 'Bonus action spells.' }] } },
    { name: 'Oath of Vengeance', description: 'Punish evildoers.', features: { 3: [{ name: 'Vow of Enmity', description: 'Advantage.' }], 7: [{ name: 'Relentless Avenger', description: 'Move after OA.' }], 15: [{ name: 'Soul of Vengeance', description: 'Reaction attack.' }], 20: [{ name: 'Avenging Angel', description: 'Fly/Fear.' }] } }
  ],
  'Ranger': [
    { name: 'Beast Master', description: 'Bond with a primal beast.', features: { 3: [{ name: 'Primal Companion', description: 'Summon beast.' }], 7: [{ name: 'Exceptional Training', description: 'Bonus actions.' }], 11: [{ name: 'Bestial Fury', description: 'Extra attack.' }], 15: [{ name: 'Share Spells', description: 'Spells affect beast.' }] } },
    { name: 'Fey Wanderer', description: 'Wield fey mirth and fury.', features: { 3: [{ name: 'Dreadful Strikes', description: 'Psychic damage.' }, { name: 'Otherworldly Glamour', description: 'Social skills.' }], 7: [{ name: 'Beguiling Twist', description: 'Charm/Frighten reaction.' }], 11: [{ name: 'Fey Reinforcements', description: 'Summon Fey.' }], 15: [{ name: 'Misty Wanderer', description: 'Teleport ally.' }] } },
    { name: 'Gloom Stalker', description: 'Draw on shadow magic.', features: { 3: [{ name: 'Dread Ambusher', description: 'Initiative/First round bonus.' }, { name: 'Umbral Sight', description: 'Darkvision/Invisible.' }], 7: [{ name: 'Iron Mind', description: 'Wisdom saves.' }], 11: [{ name: 'Stalker\'s Flurry', description: 'Miss = extra attack.' }], 15: [{ name: 'Shadowy Dodge', description: 'Disadvantage reaction.' }] } },
    { name: 'Hunter', description: 'Protect nature from destruction.', features: { 3: [{ name: 'Hunter\'s Prey', description: 'Colossus Slayer or Horde Breaker.' }], 7: [{ name: 'Defensive Tactics', description: 'Escape Horde or Multiattack Defense.' }], 11: [{ name: 'Superior Hunter\'s Prey', description: 'Splash damage.' }], 15: [{ name: 'Superior Hunter\'s Defense', description: 'Reaction resistance.' }] } }
  ],
  'Rogue': [
    { name: 'Arcane Trickster', description: 'Enhance stealth with magic.', features: { 3: [{ name: 'Spellcasting', description: 'Wizard spells.' }, { name: 'Mage Hand Legerdemain', description: 'Invisible hand.' }], 9: [{ name: 'Magical Ambush', description: 'Save disadvantage.' }], 13: [{ name: 'Versatile Trickster', description: 'Distract.' }], 17: [{ name: 'Spell Thief', description: 'Steal spells.' }] } },
    { name: 'Assassin', description: 'Practice the grim art of death.', features: { 3: [{ name: 'Assassinate', description: 'Advantage/Sneak Attack damage.' }], 9: [{ name: 'Infiltration Expertise', description: 'Mimicry.' }], 13: [{ name: 'Envenom Weapons', description: 'Poison damage.' }], 17: [{ name: 'Death Strike', description: 'Double damage.' }] } },
    { name: 'Soulknife', description: 'Strike with psionic blades.', features: { 3: [{ name: 'Psychic Blades', description: 'Psychic damage.' }, { name: 'Psionic Power', description: 'Knack/Whispers.' }], 9: [{ name: 'Soul Blades', description: 'Homing/Teleport.' }], 13: [{ name: 'Psychic Veil', description: 'Invisibility.' }], 17: [{ name: 'Rend Mind', description: 'Stun.' }] } },
    { name: 'Thief', description: 'Classic adventurer.', features: { 3: [{ name: 'Fast Hands', description: 'Cunning Action Use Object.' }, { name: 'Second-Story Work', description: 'Climb.' }], 9: [{ name: 'Supreme Sneak', description: 'Stealth attack.' }], 13: [{ name: 'Use Magic Device', description: 'Scrolls/Attunement.' }], 17: [{ name: 'Thief\'s Reflexes', description: 'Two turns.' }] } }
  ],
  'Sorcerer': [
    { name: 'Aberrant Sorcery', description: 'Wield unnatural psionic power.', features: { 3: [{ name: 'Psionic Spells', description: 'Bonus spells.' }, { name: 'Telepathic Speech', description: 'Telepathy.' }], 6: [{ name: 'Psionic Sorcery', description: 'Subtle casting.' }], 14: [{ name: 'Revelation in Flesh', description: 'Transformations.' }], 18: [{ name: 'Warping Implosion', description: 'Teleport/Damage.' }] } },
    { name: 'Clockwork Sorcery', description: 'Channel cosmic order.', features: { 3: [{ name: 'Clockwork Spells', description: 'Bonus spells.' }, { name: 'Restore Balance', description: 'Cancel Advantage.' }], 6: [{ name: 'Bastion of Law', description: 'Damage ward.' }], 14: [{ name: 'Trance of Order', description: 'Reliable talent.' }], 18: [{ name: 'Clockwork Cavalcade', description: 'Heal/Repair.' }] } },
    { name: 'Draconic Sorcery', description: 'Breathe dragon magic.', features: { 3: [{ name: 'Draconic Resilience', description: 'AC 10+Dex+Cha. HP.' }], 6: [{ name: 'Elemental Affinity', description: 'Damage boost.' }], 14: [{ name: 'Dragon Wings', description: 'Fly.' }], 18: [{ name: 'Dragon Companion', description: 'Summon.' }] } },
    { name: 'Wild Magic Sorcery', description: 'Unleash chaotic magic.', features: { 3: [{ name: 'Wild Magic Surge', description: 'Random effects.' }, { name: 'Tides of Chaos', description: 'Advantage.' }], 6: [{ name: 'Bend Luck', description: 'Modify rolls.' }], 14: [{ name: 'Controlled Chaos', description: 'Pick surge.' }], 18: [{ name: 'Tamed Surge', description: 'Trigger surge.' }] } }
  ],
  'Warlock': [
    { name: 'Archfey Patron', description: 'Bargain with whimsical Fey.', features: { 3: [{ name: 'Steps of the Fey', description: 'Misty Step effects.' }], 6: [{ name: 'Misty Escape', description: 'Reaction teleport.' }], 10: [{ name: 'Beguiling Defenses', description: 'Charm immunity.' }], 14: [{ name: 'Bewitching Magic', description: 'Free casts.' }] } },
    { name: 'Celestial Patron', description: 'Call on heaven.', features: { 3: [{ name: 'Healing Light', description: 'Heal pool.' }], 6: [{ name: 'Radiant Soul', description: 'Damage boost.' }], 10: [{ name: 'Celestial Resilience', description: 'Temp HP.' }], 14: [{ name: 'Searing Vengeance', description: 'Revive.' }] } },
    { name: 'Fiend Patron', description: 'Deal with lower planes.', features: { 3: [{ name: 'Dark One\'s Blessing', description: 'Temp HP on kill.' }], 6: [{ name: 'Dark One\'s Own Luck', description: 'Add d10.' }], 10: [{ name: 'Fiendish Resilience', description: 'Resistance.' }], 14: [{ name: 'Hurl Through Hell', description: 'Damage/Banish.' }] } },
    { name: 'Great Old One Patron', description: 'Unearth forbidden lore.', features: { 3: [{ name: 'Awakened Mind', description: 'Telepathy.' }], 6: [{ name: 'Clairvoyant Combatant', description: 'Read thoughts/Advantage.' }], 10: [{ name: 'Thought Shield', description: 'Psychic resistance.' }], 14: [{ name: 'Create Thrall', description: 'Summon Aberration.' }] } }
  ],
  'Wizard': [
    { name: 'Abjurer', description: 'Shield and banish.', features: { 3: [{ name: 'Arcane Ward', description: 'Damage shield.' }], 6: [{ name: 'Projected Ward', description: 'Protect ally.' }], 10: [{ name: 'Spell Breaker', description: 'Counterspell bonus.' }], 14: [{ name: 'Spell Resistance', description: 'Save advantage.' }] } },
    { name: 'Diviner', description: 'Learn secrets.', features: { 3: [{ name: 'Portent', description: 'Foresee rolls.' }], 6: [{ name: 'Expert Divination', description: 'Regain slots.' }], 10: [{ name: 'The Third Eye', description: 'Vision.' }], 14: [{ name: 'Greater Portent', description: '3 rolls.' }] } },
    { name: 'Evoker', description: 'Explosive effects.', features: { 3: [{ name: 'Potent Cantrip', description: 'Half damage on save.' }], 6: [{ name: 'Sculpt Spells', description: 'Safe zones.' }], 10: [{ name: 'Empowered Evocation', description: 'Add Int to damage.' }], 14: [{ name: 'Overchannel', description: 'Max damage.' }] } },
    { name: 'Illusionist', description: 'Subtle deception.', features: { 3: [{ name: 'Improved Illusions', description: 'Better Minor Illusion.' }], 6: [{ name: 'Phantasmal Creatures', description: 'Summon illusions.' }], 10: [{ name: 'Illusory Self', description: 'Dodge attack.' }], 14: [{ name: 'Illusory Reality', description: 'Real illusions.' }] } }
  ]
};
