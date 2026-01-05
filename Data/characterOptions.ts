
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

export const METAMAGIC_OPTIONS: Trait[] = [
    { name: 'Careful Spell', description: '(1 Sorcery Point) Choose a number of creatures up to your Charisma modifier. They automatically succeed on their saving throw against the spell.' },
    { name: 'Distant Spell', description: '(1 Sorcery Point) Range of 5+ ft increases by 100%. Range of Touch becomes 30 ft.' },
    { name: 'Empowered Spell', description: '(1 Sorcery Point) Reroll a number of damage dice up to your Charisma modifier. You must use the new rolls.' },
    { name: 'Extended Spell', description: '(1 Sorcery Point) Double the duration of a spell with a duration of 1 minute or longer (max 24 hours). Also advantage on concentration saves for that spell.' },
    { name: 'Heightened Spell', description: '(2 Sorcery Points) One target of the spell has Disadvantage on its first saving throw against the spell.' },
    { name: 'Quickened Spell', description: '(2 Sorcery Points) Change the casting time of a spell from 1 Action to 1 Bonus Action.' },
    { name: 'Seeking Spell', description: '(2 Sorcery Points) If you miss a spell attack roll, you can reroll the d20. You must use the new roll.' },
    { name: 'Subtle Spell', description: '(1 Sorcery Point) Cast a spell without Somatic or Verbal components.' },
    { name: 'Transmuted Spell', description: '(1 Sorcery Point) Change one type of elemental damage (Acid, Cold, Fire, Lightning, Poison, Thunder) to another from the list.' },
    { name: 'Twinned Spell', description: '(Sorcery Points equal to spell level) When you cast a spell that can be cast at a higher level to target an additional creature, you can target one additional creature without increasing the level.' }
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
    { name: 'Path of the Berserker', description: 'Channel Rage into violent fury.', features: { 3: [{ name: 'Frenzy', description: 'If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. To determine the extra damage, roll a number of d6s equal to your Rage Damage bonus, and add them together.' }], 6: [{ name: 'Mindless Rage', description: 'You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you\'re Charmed or Frightened when you enter your Rage, the condition ends on you.' }], 10: [{ name: 'Retaliation', description: 'When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature, using a weapon or an Unarmed Strike.' }], 14: [{ name: 'Intimidating Presence', description: 'As a Bonus Action, you can strike terror into others. Each creature of your choice in a 30-foot Emanation must make a Wisdom saving throw (DC 8 + Str Mod + PB). On a failed save, a creature has the Frightened condition for 1 minute.' }] } },
    { name: 'Path of the Wild Heart', description: 'Walk in community with the animal world.', features: { 3: [{ name: 'Animal Speaker', description: 'You can cast the Beast Sense and Speak with Animals spells but only as Rituals. Wisdom is your spellcasting ability for them.' }, { name: 'Rage of the Wilds', description: 'Whenever you activate your Rage, you gain one of the following options: Bear (Resistance to all damage except Force/Necrotic/Psychic/Radiant), Eagle (Disengage/Dash as Bonus Action), or Wolf (Allies have Advantage on melee attacks vs enemies within 5ft).' }], 6: [{ name: 'Aspect of the Wilds', description: 'You gain one of the following options (change on Long Rest): Owl (Darkvision 60ft), Panther (Climb Speed), or Salmon (Swim Speed).' }], 10: [{ name: 'Nature Speaker', description: 'You can cast the Commune with Nature spell but only as a Ritual. Wisdom is your spellcasting ability for it.' }], 14: [{ name: 'Power of the Wilds', description: 'Whenever you activate your Rage, you gain one: Falcon (Fly Speed if unarmored), Lion (Enemies within 5ft have Disadvantage to attack others), or Ram (Knock Large or smaller creatures Prone on hit).' }] } },
    { name: 'Path of the World Tree', description: 'Trace the roots and branches of the multiverse.', features: { 3: [{ name: 'Vitality of the Tree', description: 'When you activate your Rage, you gain Temp HP equal to your Barbarian level. Life-Giving Force: At start of turn while Raging, give another creature within 10ft Temp HP (d6s = Rage Damage).' }], 6: [{ name: 'Branches of the Tree', description: 'Reaction when enemy ends turn within 30ft: They make Str save or are teleported to unoccupied space within 5ft of you (or nearest). Speed becomes 0.' }], 10: [{ name: 'Battering Roots', description: 'Reach increases by 10ft with Heavy/Versatile weapons. Can use Push or Topple mastery in addition to weapon\'s mastery.' }], 14: [{ name: 'Travel Along the Tree', description: 'When you activate Rage and as Bonus Action, teleport up to 60ft. Once per Rage, increase range to 150ft and bring up to 6 allies.' }] } },
    { name: 'Path of the Zealot', description: 'Rage in ecstatic union with a god.', features: { 3: [{ name: 'Divine Fury', description: 'While Raging, first hit on turn deals extra 1d6 + half level Necrotic or Radiant damage.' }, { name: 'Warrior of the Gods', description: 'Pool of d12s (4 to start). Bonus Action to heal self. Regain on Long Rest.' }], 6: [{ name: 'Fanatical Focus', description: 'Once per Rage, reroll a failed saving throw with a bonus equal to Rage Damage.' }], 10: [{ name: 'Zealous Presence', description: 'Bonus Action: Up to 10 creatures within 60ft gain Advantage on attack rolls and saving throws until start of your next turn. Once per Long Rest.' }], 14: [{ name: 'Rage of the Gods', description: 'When you activate Rage, assume divine form for 1 minute. Fly Speed (hover), Resistance to Necrotic/Psychic/Radiant. Reaction to prevent 0 HP for ally (expend Rage use to heal them to Barb level).' }] } }
  ],
  'Bard': [
    { name: 'College of Dance', description: 'Move in harmony with the cosmos.', features: { 3: [{ name: 'Dazzling Footwork', description: 'Advantage on Performance (dancing). Unarmored Defense (10+Dex+Cha). Agile Strikes: Unarmed Strike as part of Bardic Inspiration use. Bardic Damage: Unarmed strikes use Dex and deal Bardic Die + Dex damage.' }], 6: [{ name: 'Inspiring Movement', description: 'Reaction when enemy ends turn within 5ft: Expend Bardic Inspiration to move half speed, and one ally moves half speed. No Opportunity Attacks.' }, { name: 'Tandem Footwork', description: 'When rolling Initiative, expend Bardic Inspiration to add the roll to you and allies within 30ft.' }], 14: [{ name: 'Leading Evasion', description: 'When you succeed Dex save for half damage, you take none. Allies within 5ft also benefit.' }] } },
    { name: 'College of Glamour', description: 'Weave beguiling Fey magic.', features: { 3: [{ name: 'Beguiling Magic', description: 'Charm Person/Mirror Image prepared. Cast Enchantment/Illusion spell: Target makes Wis save or Charmed/Frightened.' }, { name: 'Mantle of Inspiration', description: 'Bonus Action expend Bardic Inspiration: Allies gain Temp HP (2x Die) and move up to Speed (Reaction, no OA).' }], 6: [{ name: 'Mantle of Majesty', description: 'Cast Command as Bonus Action without slot. Charmed creatures auto-fail.' }], 14: [{ name: 'Unbreakable Majesty', description: 'Bonus Action for 1 minute: Attacks against you require Cha save or miss. ' }] } },
    { name: 'College of Lore', description: 'Plumb the depths of magical knowledge.', features: { 3: [{ name: 'Bonus Proficiencies', description: 'Gain proficiency with three skills.' }, { name: 'Cutting Words', description: 'Reaction to expend Bardic Inspiration and subtract from creature\'s damage roll or ability check/attack roll.' }], 6: [{ name: 'Magical Discoveries', description: 'Learn two spells of your choice from any class list (Cleric, Druid, Wizard).' }], 14: [{ name: 'Peerless Skill', description: 'When you fail ability check/attack, expend Bardic Inspiration to add to roll.' }] } },
    { name: 'College of Valor', description: 'Sing the deeds of ancient heroes.', features: { 3: [{ name: 'Combat Inspiration', description: 'Creature can add Bardic Die to damage roll or AC (Reaction).' }, { name: 'Martial Training', description: 'Proficiency with Martial weapons, Medium armor, Shields. Weapon as focus.' }], 6: [{ name: 'Extra Attack', description: 'Attack twice. Can replace one attack with cantrip (Action cast time).' }], 14: [{ name: 'Battle Magic', description: 'After casting spell (Action), make one weapon attack as Bonus Action.' }] } }
  ],
  'Cleric': [
    { name: 'Life Domain', description: 'Soothe the hurts of the world.', features: { 3: [{ name: 'Disciple of Life', description: 'Healing spells restore extra HP equal to 2 + spell level.' }, { name: 'Preserve Life', description: 'Channel Divinity: Restore 5x Level HP to creatures within 30ft (up to half max HP).' }], 6: [{ name: 'Blessed Healer', description: 'When you cast a healing spell on another, you regain 2 + spell level HP.' }], 17: [{ name: 'Supreme Healing', description: 'When rolling dice for healing spells/Channel Divinity, use highest number possible.' }] } },
    { name: 'Light Domain', description: 'Bring light to banish darkness.', features: { 3: [{ name: 'Radiance of the Dawn', description: 'Channel Divinity: 30ft Emanation. Dispels magical darkness. Creatures take 2d10 + Level Radiant damage (Con save half).' }, { name: 'Warding Flare', description: 'Reaction when creature attacks: Impose Disadvantage. (Wis Mod times/LR).' }], 6: [{ name: 'Improved Warding Flare', description: 'You can use Warding Flare to protect another creature within 30ft. Grant Temp HP (2d6+Wis).' }], 17: [{ name: 'Corona of Light', description: 'Magic Action: Emit sunlight 60ft. Enemies have Disadvantage on saves vs Radiance/Fire spells.' }] } },
    { name: 'Trickery Domain', description: 'Make mischief and challenge authority.', features: { 3: [{ name: 'Blessing of the Trickster', description: 'Magic Action: Give Advantage on Stealth checks to willing creature.' }, { name: 'Invoke Duplicity', description: 'Bonus Action Channel Divinity: Create illusion. Cast spells from its space. Advantage on attacks if both near target.' }], 6: [{ name: 'Trickster\'s Transposition', description: 'Bonus Action: Teleport to swap places with illusion.' }], 17: [{ name: 'Improved Duplicity', description: 'Allies get Advantage on attacks near illusion. Illusion heals when it ends.' }] } },
    { name: 'War Domain', description: 'Inspire valor and smite foes.', features: { 3: [{ name: 'War Priest', description: 'Bonus Action: Make one weapon/unarmed attack. (Wis Mod times/SR/LR).' }, { name: 'Guided Strike', description: 'Channel Divinity Reaction: +10 to an attack roll.' }], 6: [{ name: 'War God\'s Blessing', description: 'Channel Divinity: Cast Shield of Faith or Spiritual Weapon without slot/concentration.' }], 17: [{ name: 'Avatar of Battle', description: 'Resistance to Bludgeoning, Piercing, and Slashing damage.' }] } }
  ],
  'Druid': [
    { name: 'Circle of the Land', description: 'Celebrate connection to the natural world.', features: { 3: [{ name: 'Land\'s Aid', description: 'Magic Action expend Wild Shape: 10ft sphere. Necrotic damage (2d6) and Heal one creature (2d6).' }], 6: [{ name: 'Natural Recovery', description: 'Cast one Circle Spell freely. Recover spell slots on Short Rest.' }], 10: [{ name: 'Nature\'s Ward', description: 'Immunity to Poisoned. Resistance to element of your land.' }], 14: [{ name: 'Nature\'s Sanctuary', description: 'Magic Action expend Wild Shape: Spectral trees (15ft cube). Half cover and resistance for allies.' }] } },
    { name: 'Circle of the Moon', description: 'Adopt animal forms to guard the wilds.', features: { 3: [{ name: 'Circle Forms', description: 'Wild Shape AC = 13 + Wis. Temp HP = 3x Level. CR = Level / 3.' }], 6: [{ name: 'Improved Circle Forms', description: 'Attacks deal Radiant or Normal damage. Add Wis to Con saves.' }], 10: [{ name: 'Moonlight Step', description: 'Bonus Action teleport 30ft. Advantage on next attack.' }], 14: [{ name: 'Lunar Form', description: 'Extra 2d10 Radiant damage. Teleport ally with Moonlight Step.' }] } },
    { name: 'Circle of the Sea', description: 'Become one with tides and storms.', features: { 3: [{ name: 'Wrath of the Sea', description: 'Bonus Action expend Wild Shape: 10 min Emanation. Con save or Cold damage and Push 15ft.' }], 6: [{ name: 'Aquatic Affinity', description: 'Emanation 10ft. Swim Speed.' }], 10: [{ name: 'Stormborn', description: 'Fly Speed. Resistance to Cold, Lightning, Thunder.' }], 14: [{ name: 'Oceanic Gift', description: 'Manifest Emanation around ally.' }] } },
    { name: 'Circle of the Stars', description: 'Harness secrets hidden in constellations.', features: { 3: [{ name: 'Star Map', description: 'Guidance/Guiding Bolt prepared. Cast Guiding Bolt freely Wis times.' }, { name: 'Starry Form', description: 'Bonus Action expend Wild Shape: Archer (Bonus Attack), Chalice (Heal), Dragon (Concentration 10 minimum).' }], 6: [{ name: 'Cosmic Omen', description: 'Roll d6 on Long Rest. Weal (Even): Add d6 to D20 test. Woe (Odd): Subtract d6.' }], 10: [{ name: 'Twinkling Constellations', description: 'Archer/Chalice d8 becomes 2d8. Dragon gives Fly speed.' }], 14: [{ name: 'Full of Stars', description: 'Resistance to B/P/S damage while in Starry Form.' }] } }
  ],
  'Fighter': [
    { name: 'Battle Master', description: 'Master sophisticated battle maneuvers.', features: { 3: [{ name: 'Combat Superiority', description: 'Learn 3 Maneuvers. 4 Superiority Dice (d8).' }, { name: 'Student of War', description: 'Artisan tool proficiency. One skill proficiency.' }], 7: [{ name: 'Know Your Enemy', description: 'Bonus Action: Learn stats (Immunities, Vulnerabilities, etc).' }], 10: [{ name: 'Improved Combat Superiority', description: 'Dice become d10.' }], 15: [{ name: 'Relentless', description: 'Use d8 instead of expending die (1/turn).' }], 18: [{ name: 'Ultimate Combat Superiority', description: 'Dice become d12.' }] } },
    { name: 'Champion', description: 'Pursue physical excellence in combat.', features: { 3: [{ name: 'Improved Critical', description: 'Crit on 19-20.' }, { name: 'Remarkable Athlete', description: 'Advantage on Initiative and Str (Athletics).' }], 7: [{ name: 'Additional Fighting Style', description: 'Choose another Fighting Style feat.' }], 10: [{ name: 'Heroic Warrior', description: 'Gain Heroic Inspiration at start of turn if you have none.' }], 15: [{ name: 'Superior Critical', description: 'Crit on 18-20.' }], 18: [{ name: 'Survivor', description: 'Start of turn: Regain 5+Con HP if Bloodied.' }] } },
    { name: 'Eldritch Knight', description: 'Support combat skills with arcane magic.', features: { 3: [{ name: 'Spellcasting', description: 'Wizard spells (Int).' }, { name: 'War Bond', description: 'Bond to 2 weapons. Summon as Bonus Action. Cannot be disarmed.' }], 7: [{ name: 'War Magic', description: 'Replace one attack with Cantrip.' }], 10: [{ name: 'Eldritch Strike', description: 'Hit imposes Disadvantage on next save against your spell.' }], 15: [{ name: 'Arcane Charge', description: 'Action Surge teleports you 30ft.' }], 18: [{ name: 'Improved War Magic', description: 'Replace two attacks with Level 1 or 2 spell.' }] } },
    { name: 'Psi Warrior', description: 'Augment physical might with psionic power.', features: { 3: [{ name: 'Psionic Power', description: 'Psionic Energy Dice (d6). Protective Field (Reduce damage), Psionic Strike (Extra Force damage), Telekinetic Movement.' }], 7: [{ name: 'Telekinetic Adept', description: 'Psi-Powered Leap (Fly speed). Telekinetic Thrust (Prone/Move on Psionic Strike).' }], 10: [{ name: 'Guarded Mind', description: 'Resistance to Psychic. End Charm/Frightened.' }], 15: [{ name: 'Bulwark of Force', description: 'Bonus Action: Half Cover for allies.' }], 18: [{ name: 'Telekinetic Master', description: 'Cast Telekinesis freely. Attack while concentrating.' }] } }
  ],
  'Monk': [
    { name: 'Warrior of Mercy', description: 'Manipulate forces of life and death.', features: { 3: [{ name: 'Hand of Harm', description: 'Expend Focus to deal Necrotic damage.' }, { name: 'Hand of Healing', description: 'Expend Focus/Flurry to heal.' }], 6: [{ name: 'Physician\'s Touch', description: 'Harm poisons. Healing cures conditions.' }], 11: [{ name: 'Flurry of Healing and Harm', description: 'Flurry attacks trigger Healing/Harm without cost.' }], 17: [{ name: 'Hand of Ultimate Mercy', description: 'Resurrect dead creature.' }] } },
    { name: 'Warrior of Shadow', description: 'Harness shadow power for stealth.', features: { 3: [{ name: 'Shadow Arts', description: 'Darkness (1 Focus, move it). Darkvision 60ft. Minor Illusion.' }], 6: [{ name: 'Shadow Step', description: 'Bonus Action teleport 60ft in dim/dark. Advantage on next attack.' }], 11: [{ name: 'Improved Shadow Step', description: 'Spend Focus to ignore light requirement. Free Unarmed Strike after.' }], 17: [{ name: 'Cloak of Shadows', description: 'Action (3 Focus): Invisibility, Move through objects, Flurry costs 0.' }] } },
    { name: 'Warrior of the Elements', description: 'Wield elemental power.', features: { 3: [{ name: 'Elemental Attunement', description: '1 Focus, 10 min. Reach +10ft. Elemental damage/push/pull.' }, { name: 'Manipulate Elements', description: 'Elementalism cantrip.' }], 6: [{ name: 'Elemental Burst', description: '2 Focus. 20ft Sphere fireball-like effect.' }], 11: [{ name: 'Stride of the Elements', description: 'Fly/Swim speed while Attuned.' }], 17: [{ name: 'Elemental Epitome', description: 'Resistance. Step of Wind adds damage/speed.' }] } },
    { name: 'Warrior of the Open Hand', description: 'Master unarmed combat.', features: { 3: [{ name: 'Open Hand Technique', description: 'Flurry hits impose: Addle (No OA), Push 15ft, or Topple.' }], 6: [{ name: 'Wholeness of Body', description: 'Bonus Action heal self (Martial Die + Wis).' }], 11: [{ name: 'Fleet Step', description: 'Step of the Wind free after other Bonus Actions.' }], 17: [{ name: 'Quivering Palm', description: '4 Focus. End vibrations for 10d12 damage.' }] } }
  ],
  'Paladin': [
    { name: 'Oath of Devotion', description: 'Uphold justice and order.', features: { 3: [{ name: 'Sacred Weapon', description: 'Channel Divinity: Weapon adds Cha to hit, Light, Magic.' }], 7: [{ name: 'Aura of Devotion', description: 'Immunity to Charmed in Aura.' }], 15: [{ name: 'Smite of Protection', description: 'Divine Smite grants Half Cover in Aura.' }], 20: [{ name: 'Holy Nimbus', description: 'Radiant damage aura. Advantage vs Fiends/Undead.' }] } },
    { name: 'Oath of Glory', description: 'Strive for heroism.', features: { 3: [{ name: 'Peerless Athlete', description: 'Channel Divinity: Advantage Athletics/Acrobatics. Jump boost.' }, { name: 'Inspiring Smite', description: 'Divine Smite grants Temp HP.' }], 7: [{ name: 'Aura of Alacrity', description: 'Speed increase in Aura.' }], 15: [{ name: 'Glorious Defense', description: 'Reaction to add Cha to AC for ally. Counterattack.' }], 20: [{ name: 'Living Legend', description: 'Advantage Cha checks. Reroll save. Miss becomes hit.' }] } },
    { name: 'Oath of the Ancients', description: 'Preserve life and light.', features: { 3: [{ name: 'Nature\'s Wrath', description: 'Channel Divinity: Restrain creatures.' }], 7: [{ name: 'Aura of Warding', description: 'Resistance to Necrotic/Psychic/Radiant in Aura.' }], 15: [{ name: 'Undying Sentinel', description: 'Drop to 1 HP. Don\'t age.' }], 20: [{ name: 'Elder Champion', description: 'Bonus Action spells. Regen 10 HP/turn. Enemies Disadvantage on saves.' }] } },
    { name: 'Oath of Vengeance', description: 'Punish evildoers.', features: { 3: [{ name: 'Vow of Enmity', description: 'Channel Divinity: Advantage on attacks vs one creature.' }], 7: [{ name: 'Relentless Avenger', description: 'Move after OA.' }], 15: [{ name: 'Soul of Vengeance', description: 'Reaction attack when Vow target attacks.' }], 20: [{ name: 'Avenging Angel', description: 'Fly speed. Frightful Aura.' }] } }
  ],
  'Ranger': [
    { name: 'Beast Master', description: 'Bond with a primal beast.', features: { 3: [{ name: 'Primal Companion', description: 'Summon Beast (Land, Sea, Sky). Acts on your turn. Dodge default.' }], 7: [{ name: 'Exceptional Training', description: 'Beast can Dash/Disengage/Help as Bonus Action. Magic attacks.' }], 11: [{ name: 'Bestial Fury', description: 'Beast attacks twice. Hunter\'s Mark benefit.' }], 15: [{ name: 'Share Spells', description: 'Spells affect beast.' }] } },
    { name: 'Fey Wanderer', description: 'Wield fey mirth and fury.', features: { 3: [{ name: 'Dreadful Strikes', description: 'Extra Psychic damage.' }, { name: 'Otherworldly Glamour', description: 'Add Wis to Cha checks.' }], 7: [{ name: 'Beguiling Twist', description: 'Advantage vs Charm/Frighten. Reaction to redirect.' }], 11: [{ name: 'Fey Reinforcements', description: 'Summon Fey freely. No Concentration.' }], 15: [{ name: 'Misty Wanderer', description: 'Misty Step freely. Bring ally.' }] } },
    { name: 'Gloom Stalker', description: 'Draw on shadow magic.', features: { 3: [{ name: 'Dread Ambusher', description: '+10 Speed first turn. Dreadful Strike: Extra damage. Add Wis to Initiative.' }, { name: 'Umbral Sight', description: 'Darkvision 60ft. Invisible to Darkvision.' }], 7: [{ name: 'Iron Mind', description: 'Wisdom save proficiency.' }], 11: [{ name: 'Stalker\'s Flurry', description: 'Improved Dread Ambusher (Sudden Strike or Mass Fear).' }], 15: [{ name: 'Shadowy Dodge', description: 'Reaction impose Disadvantage.' }] } },
    { name: 'Hunter', description: 'Protect nature from destruction.', features: { 3: [{ name: 'Hunter\'s Prey', description: 'Colossus Slayer (Extra damage) or Horde Breaker (Extra attack).' }, { name: 'Hunter\'s Lore', description: 'Know immunities/resistances of mark.' }], 7: [{ name: 'Defensive Tactics', description: 'Escape the Horde (OA Disadvantage) or Multiattack Defense.' }], 11: [{ name: 'Superior Hunter\'s Prey', description: 'Hunter\'s Mark damage splashes.' }], 15: [{ name: 'Superior Hunter\'s Defense', description: 'Reaction Resistance to damage.' }] } }
  ],
  'Rogue': [
    { name: 'Arcane Trickster', description: 'Enhance stealth with magic.', features: { 3: [{ name: 'Spellcasting', description: 'Wizard spells (Int). Mage Hand Legerdemain.' }], 9: [{ name: 'Magical Ambush', description: 'Disadvantage on saves if hidden.' }], 13: [{ name: 'Versatile Trickster', description: 'Mage Hand distracts (Advantage).' }], 17: [{ name: 'Spell Thief', description: 'Steal spell knowledge.' }] } },
    { name: 'Assassin', description: 'Practice the grim art of death.', features: { 3: [{ name: 'Assassinate', description: 'Advantage on Initiative. Advantage vs enemies not taken turn. Extra damage first round.' }, { name: 'Assassin\'s Tools', description: 'Disguise/Poison kit.' }], 9: [{ name: 'Infiltration Expertise', description: 'Mimicry. Steady Aim move.' }], 13: [{ name: 'Envenom Weapons', description: 'Cunning Strike Poison deals damage.' }], 17: [{ name: 'Death Strike', description: 'Double damage on first round hit.' }] } },
    { name: 'Soulknife', description: 'Strike with psionic blades.', features: { 3: [{ name: 'Psychic Blades', description: '1d6+Dex Psychic. Bonus Action attack 1d4.' }, { name: 'Psionic Power', description: 'Psi Dice. Boost checks. Telepathy.' }], 9: [{ name: 'Soul Blades', description: 'Homing Strikes (Attack boost). Teleportation.' }], 13: [{ name: 'Psychic Veil', description: 'Invisibility 1 hour.' }], 17: [{ name: 'Rend Mind', description: 'Sneak Attack stuns.' }] } },
    { name: 'Thief', description: 'Classic adventurer.', features: { 3: [{ name: 'Fast Hands', description: 'Cunning Action: Sleight of Hand, Use Object.' }, { name: 'Second-Story Work', description: 'Climb Speed. Jump boost.' }], 9: [{ name: 'Supreme Sneak', description: 'Cunning Strike: Stealth Attack (Hidden stays hidden).' }], 13: [{ name: 'Use Magic Device', description: '4 Attunement slots. Scroll use.' }], 17: [{ name: 'Thief\'s Reflexes', description: 'Two turns in first round.' }] } }
  ],
  'Sorcerer': [
    { name: 'Aberrant Sorcery', description: 'Wield unnatural psionic power.', features: { 3: [{ name: 'Psionic Spells', description: 'Learned spells.' }, { name: 'Telepathic Speech', description: 'Telepathy.' }], 6: [{ name: 'Psionic Sorcery', description: 'Cast psionic spells with Points (Subtle).' }, { name: 'Psychic Defenses', description: 'Resist Psychic.' }], 14: [{ name: 'Revelation in Flesh', description: 'Swim/Fly/See Invis/Squeeze.' }], 18: [{ name: 'Warping Implosion', description: 'Teleport and Force damage AoE.' }] } },
    { name: 'Clockwork Sorcery', description: 'Channel cosmic order.', features: { 3: [{ name: 'Clockwork Spells', description: 'Learned spells.' }, { name: 'Restore Balance', description: 'Reaction cancel Adv/Disadv.' }], 6: [{ name: 'Bastion of Law', description: 'Spend Points for damage reduction ward.' }], 14: [{ name: 'Trance of Order', description: 'Minimum roll of 10 on d20.' }], 18: [{ name: 'Clockwork Cavalcade', description: 'Heal/Repair/Dispel in cube.' }] } },
    { name: 'Draconic Sorcery', description: 'Breathe dragon magic.', features: { 3: [{ name: 'Draconic Resilience', description: '+1 HP/Level. AC 10+Dex+Cha.' }, { name: 'Draconic Spells', description: 'Learned spells.' }], 6: [{ name: 'Elemental Affinity', description: 'Resistance. Add Cha to damage.' }], 14: [{ name: 'Dragon Wings', description: 'Fly Speed.' }], 18: [{ name: 'Dragon Companion', description: 'Summon Dragon.' }] } },
    { name: 'Wild Magic Sorcery', description: 'Unleash chaotic magic.', features: { 3: [{ name: 'Wild Magic Surge', description: 'Roll d20 on spell cast.' }, { name: 'Tides of Chaos', description: 'Gain Advantage. Next spell surges.' }], 6: [{ name: 'Bend Luck', description: '1d4 bonus/penalty to other\'s roll.' }], 14: [{ name: 'Controlled Chaos', description: 'Roll twice on surge table.' }], 18: [{ name: 'Tamed Surge', description: 'Choose effect.' }] } }
  ],
  'Warlock': [
    { name: 'Archfey Patron', description: 'Bargain with whimsical Fey.', features: { 3: [{ name: 'Steps of the Fey', description: 'Misty Step free uses. Add effect: Refresh (Temp HP) or Taunt.' }], 6: [{ name: 'Misty Escape', description: 'Reaction Misty Step. Add effect: Disappear or Dreadful.' }], 10: [{ name: 'Beguiling Defenses', description: 'Charm Immunity. Reflect damage/charm.' }], 14: [{ name: 'Bewitching Magic', description: 'Cast Enchantment/Illusion -> Free Misty Step.' }] } },
    { name: 'Celestial Patron', description: 'Call on heaven.', features: { 3: [{ name: 'Healing Light', description: 'Pool of d6s to heal.' }], 6: [{ name: 'Radiant Soul', description: 'Radiant Resistance. Add Cha to damage.' }], 10: [{ name: 'Celestial Resilience', description: 'Temp HP on rest.' }], 14: [{ name: 'Searing Vengeance', description: 'Resist death, blind enemies.' }] } },
    { name: 'Fiend Patron', description: 'Deal with lower planes.', features: { 3: [{ name: 'Dark One\'s Blessing', description: 'Temp HP on kill.' }], 6: [{ name: 'Dark One\'s Own Luck', description: 'Add d10 to check/save.' }], 10: [{ name: 'Fiendish Resilience', description: 'Choose Resistance.' }], 14: [{ name: 'Hurl Through Hell', description: 'Banish and 8d10 damage.' }] } },
    { name: 'Great Old One Patron', description: 'Unearth forbidden lore.', features: { 3: [{ name: 'Awakened Mind', description: 'Telepathy.' }, { name: 'Psychic Spells', description: 'Change damage to Psychic.' }], 6: [{ name: 'Clairvoyant Combatant', description: 'Telepathic bond grants Advantage/Disadvantage.' }], 10: [{ name: 'Eldritch Hex', description: 'Hex gives Disadvantage on saves.' }, { name: 'Thought Shield', description: 'Psychic Resistance.' }], 14: [{ name: 'Create Thrall', description: 'Summon Aberration modified.' }] } }
  ],
  'Wizard': [
    { name: 'Abjurer', description: 'Shield and banish.', features: { 3: [{ name: 'Abjuration Savant', description: 'Free spells.' }, { name: 'Arcane Ward', description: 'Ward absorbs damage. Recharges on Abjuration spell.' }], 6: [{ name: 'Projected Ward', description: 'Protect ally with ward.' }], 10: [{ name: 'Spell Breaker', description: 'Counterspell/Dispel Magic prepared. Bonus to check.' }], 14: [{ name: 'Spell Resistance', description: 'Advantage/Resistance vs spells.' }] } },
    { name: 'Diviner', description: 'Learn secrets.', features: { 3: [{ name: 'Divination Savant', description: 'Free spells.' }, { name: 'Portent', description: 'Roll 2 d20s, replace rolls.' }], 6: [{ name: 'Expert Divination', description: 'Regain slots casting Divination.' }], 10: [{ name: 'The Third Eye', description: 'Darkvision/See Invisibility.' }], 14: [{ name: 'Greater Portent', description: '3 d20s.' }] } },
    { name: 'Evoker', description: 'Explosive effects.', features: { 3: [{ name: 'Evocation Savant', description: 'Free spells.' }, { name: 'Potent Cantrip', description: 'Half damage on save/miss.' }], 6: [{ name: 'Sculpt Spells', description: 'Allies auto-save/no damage.' }], 10: [{ name: 'Empowered Evocation', description: 'Add Int to damage.' }], 14: [{ name: 'Overchannel', description: 'Max damage (Take necrotic).' }] } },
    { name: 'Illusionist', description: 'Subtle deception.', features: { 3: [{ name: 'Illusion Savant', description: 'Free spells.' }, { name: 'Improved Illusions', description: 'No verbal components. Bonus Action Minor Illusion.' }], 6: [{ name: 'Phantasmal Creatures', description: 'Summons can be illusions (half HP, spectral).' }], 10: [{ name: 'Illusory Self', description: 'Reaction to make attack miss.' }], 14: [{ name: 'Illusory Reality', description: 'Make illusion real for 1 minute.' }] } }
  ]
};
