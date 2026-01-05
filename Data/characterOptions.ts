
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
    { name: 'Careful Spell', description: '(1 Sorcery Point) When you cast a spell that forces other creatures to make a saving throw, you can protect some of them. Choose a number of creatures up to your Charisma modifier. A chosen creature automatically succeeds on its saving throw, and it takes no damage if it would normally take half damage.' },
    { name: 'Distant Spell', description: '(1 Sorcery Point) When you cast a spell that has a range of at least 5 feet, you can spend 1 Sorcery Point to double the range. Or when you cast a spell with a range of Touch, you can make the range 30 feet.' },
    { name: 'Empowered Spell', description: '(1 Sorcery Point) When you roll damage for a spell, you can spend 1 Sorcery Point to reroll a number of the damage dice up to your Charisma modifier. You must use the new rolls.' },
    { name: 'Extended Spell', description: '(1 Sorcery Point) When you cast a spell with a duration of 1 minute or longer, you can spend 1 Sorcery Point to double its duration (max 24 hours). Also advantage on Concentration saves for that spell.' },
    { name: 'Heightened Spell', description: '(2 Sorcery Points) When you cast a spell that forces a creature to make a saving throw, you can spend 2 Sorcery Points to give one target Disadvantage on its save.' },
    { name: 'Quickened Spell', description: '(2 Sorcery Points) Change the casting time of a spell from an action to a Bonus Action. You can\'t cast a level 1+ spell with your action in the same turn.' },
    { name: 'Subtle Spell', description: '(1 Sorcery Point) Cast a spell without any Verbal or Somatic components.' },
    { name: 'Transmuted Spell', description: '(1 Sorcery Point) Change the damage type of a spell from Acid, Cold, Fire, Lightning, Poison, or Thunder to another from that list.' },
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
  'Elf': { name: 'Elf', description: 'Magical people of otherworldly grace, living in the world but apart from it.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: '60ft range.' }, { name: 'Fey Ancestry', description: 'Advantage vs Charmed. Magic can\'t put you to sleep.' }, { name: 'Keen Senses', description: 'Proficiency in Insight, Perception, or Survival.' }, { name: 'Trance', description: 'Meditate 4 hours for Long Rest.' }] },
  'Dwarf': { name: 'Dwarf', description: 'Solid and enduring like the mountains, resilient and strong.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: '120ft range.' }, { name: 'Dwarven Resilience', description: 'Resistance to Poison damage. Advantage vs Poisoned condition.' }, { name: 'Dwarven Toughness', description: '+1 HP per level.' }, { name: 'Stonecunning', description: 'Bonus Action: Tremorsense 60ft on stone (10 mins).' }] },
  'Halfling': { name: 'Halfling', description: 'Small, practical, and kind. They value hearth and home.', size: 'Small', speed: 30, traits: [{ name: 'Lucky', description: 'Reroll 1s on d20s (attack, check, save).' }, { name: 'Brave', description: 'Advantage on saves vs Frightened.' }, { name: 'Halfling Nimbleness', description: 'Move through space of creatures Larger than you.' }] },
  'Dragonborn': { name: 'Dragonborn', description: 'Born of dragons, they carry the power of their ancestors.', size: 'Medium', speed: 30, traits: [{ name: 'Draconic Ancestry', description: 'Choose a dragon type (element).' }, { name: 'Breath Weapon', description: 'Exhale energy in a cone or line (replaces an attack).' }, { name: 'Damage Resistance', description: 'Resistance to the damage type associated with your ancestry.' }] },
  'Gnome': { name: 'Gnome', description: 'Vibrant, curious, and inventive.', size: 'Small', speed: 30, traits: [{ name: 'Darkvision', description: '60ft range.' }, { name: 'Gnome Cunning', description: 'Advantage on Int, Wis, and Cha saves vs magic.' }] },
  'Orc': { name: 'Orc', description: 'Strong and enduring, driven by passion.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: '60ft range.' }, { name: 'Adrenaline Rush', description: 'Bonus Action Dash. Gain Temp HP.' }, { name: 'Relentless Endurance', description: 'Drop to 1 HP instead of 0 once per Long Rest.' }] },
  'Tiefling': { name: 'Tiefling', description: 'Heirs to an ancient infernal bloodline.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: '60ft range.' }, { name: 'Hellish Resistance', description: 'Resistance to Fire damage.' }, { name: 'Infernal Legacy', description: 'Know Thaumaturgy. Cast Hellish Rebuke (lvl 3) and Darkness (lvl 5).' }] },
  'Aasimar': { name: 'Aasimar', description: 'Carrying a spark of the Upper Planes.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: '60ft range.' }, { name: 'Celestial Resistance', description: 'Resistance to Necrotic and Radiant damage.' }, { name: 'Healing Hands', description: 'Touch to heal HP equal to level.' }, { name: 'Light Bearer', description: 'Know the Light cantrip.' }] },
  'Goliath': { name: 'Goliath', description: 'Towering kin to giants, dwelling in high places.', size: 'Medium', speed: 30, traits: [{ name: 'Giant Ancestry', description: 'Choose a giant type for special ability.' }, { name: 'Large Form', description: 'Bonus Action to become Large for 10 mins.' }, { name: 'Powerful Build', description: 'Count as one size larger for carrying/pushing.' }] },
};

export const CLASS_DETAILS: Record<string, DetailData> = {
  'Barbarian': { name: 'Barbarian', description: 'Powered by primal forces that manifest as Rage.', traits: [{ name: 'Rage', description: 'You can imbue yourself with a primal power called Rage... (See Class Progression for full details)' }, { name: 'Unarmored Defense', description: 'AC = 10 + DEX + CON.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }] },
  'Bard': { name: 'Bard', description: 'A master of song, speech, and magic.', traits: [{ name: 'Bardic Inspiration', description: 'Grant a d6 (scales) to allies for ability checks, attacks, or saves.' }, { name: 'Spellcasting', description: 'Arcane magic. Charisma based.' }, { name: 'Jack of All Trades', description: 'Add half proficiency to unskilled checks.' }] },
  'Cleric': { name: 'Cleric', description: 'A priestly champion who wields divine magic.', traits: [{ name: 'Spellcasting', description: 'Divine magic. Wisdom based. Prepared caster.' }, { name: 'Divine Order', description: 'Choose Protector (Heavy Armor/Martial Weapon) or Thaumaturge (Extra Cantrip/Religion Bonus).' }, { name: 'Channel Divinity', description: 'Turn Undead and other divine effects.' }] },
  'Druid': { name: 'Druid', description: 'A priest of the Old Faith, wielding the powers of nature.', traits: [{ name: 'Spellcasting', description: 'Primal magic. Wisdom based. Prepared caster.' }, { name: 'Wild Shape', description: 'Magically assume the shape of a beast.' }, { name: 'Druidic', description: 'Secret language of druids.' }] },
  'Fighter': { name: 'Fighter', description: 'A master of martial combat.', traits: [{ name: 'Fighting Style', description: 'Choose a specialty (Archery, Defense, etc.).' }, { name: 'Second Wind', description: 'Regain 1d10 + level HP as a Bonus Action.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 3 weapons.' }] },
  'Monk': { name: 'Monk', description: 'Focus internal power into uncanny speed and strength.', traits: [{ name: 'Martial Arts', description: 'DEX for unarmed/monk weapons. d6 damage die. Bonus Action unarmed strike.' }, { name: 'Unarmored Defense', description: 'AC = 10 + DEX + WIS.' }, { name: 'Monk\'s Focus', description: 'Focus Points for Flurry of Blows, Patient Defense, Step of the Wind.' }] },
  'Paladin': { name: 'Paladin', description: 'A holy warrior bound to a sacred oath.', traits: [{ name: 'Lay on Hands', description: 'Pool of healing power (5 x Level).' }, { name: 'Spellcasting', description: 'Divine magic. Charisma based.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }] },
  'Ranger': { name: 'Ranger', description: 'A warrior who combats threats on the edges of civilization.', traits: [{ name: 'Deft Explorer', description: 'Expertise in one skill. Languages.' }, { name: 'Spellcasting', description: 'Primal magic. Wisdom based.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }, { name: 'Favored Enemy', description: 'Mark foes for extra damage (Hunter\'s Mark).' }] },
  'Rogue': { name: 'Rogue', description: 'Rely on cunning, stealth, and vulnerabilities.', traits: [{ name: 'Expertise', description: 'Double proficiency in two skills.' }, { name: 'Sneak Attack', description: 'Deal extra damage (1d6 scales) once per turn with Finesse/Ranged weapon.' }, { name: 'Thieves\' Cant', description: 'Secret code language.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }] },
  'Sorcerer': { name: 'Sorcerer', description: 'Wield innate magic stamped into their being.', traits: [{ name: 'Spellcasting', description: 'Arcane magic. Charisma based.' }, { name: 'Innate Sorcery', description: 'Bonus Action: +1 DC, Advantage on spell attacks.' }] },
  'Warlock': { name: 'Warlock', description: 'A wielder of magic derived from a bargain with an extraplanar entity.', traits: [{ name: 'Pact Magic', description: 'Unique spellcasting. Slots recharge on Short Rest.' }, { name: 'Eldritch Invocations', description: 'Customizable magical abilities.' }, { name: 'Pact Boon', description: 'Gift from patron (Blade, Chain, or Tome).' }] },
  'Wizard': { name: 'Wizard', description: 'A scholarly magic-user capable of manipulating the structures of reality.', traits: [{ name: 'Spellcasting', description: 'Arcane magic. Intelligence based. Spellbook.' }, { name: 'Arcane Recovery', description: 'Regain spell slots on Short Rest.' }, { name: 'Ritual Caster', description: 'Cast ritual spells without preparing them.' }] },
};

export const CLASS_PROGRESSION: Record<string, Record<number, string[]>> = {
    'Barbarian': { 1: ['Rage', 'Unarmored Defense', 'Weapon Mastery'], 2: ['Danger Sense', 'Reckless Attack'], 3: ['Barbarian Subclass', 'Primal Knowledge'], 4: ['Ability Score Improvement'], 5: ['Extra Attack', 'Fast Movement'], 9: ['Brutal Strike'], 11: ['Relentless Rage'], 13: ['Improved Brutal Strike'], 15: ['Persistent Rage'], 18: ['Indomitable Might'], 20: ['Primal Champion'] },
    'Bard': { 1: ['Bardic Inspiration', 'Spellcasting'], 2: ['Jack of All Trades', 'Song of Rest'], 3: ['Bard Subclass', 'Expertise'], 4: ['Ability Score Improvement'], 5: ['Font of Inspiration'], 6: ['Countercharm'], 10: ['Magical Secrets', 'Expertise'], 20: ['Superior Inspiration'] },
    'Cleric': { 1: ['Spellcasting', 'Divine Order'], 2: ['Channel Divinity'], 3: ['Cleric Subclass'], 4: ['Ability Score Improvement'], 5: ['Destroy Undead'], 10: ['Divine Intervention'], 20: ['Greater Divine Intervention'] },
    'Druid': { 1: ['Druidic', 'Spellcasting', 'Primal Order'], 2: ['Wild Shape', 'Wild Companion'], 3: ['Druid Subclass'], 4: ['Ability Score Improvement'], 18: ['Timeless Body', 'Beast Spells'], 20: ['Archdruid'] },
    'Fighter': { 1: ['Fighting Style', 'Second Wind', 'Weapon Mastery'], 2: ['Action Surge', 'Tactical Mind'], 3: ['Fighter Subclass'], 4: ['Ability Score Improvement'], 5: ['Extra Attack'], 6: ['Ability Score Improvement'], 9: ['Indomitable'], 11: ['Extra Attack (2)'], 20: ['Extra Attack (3)'] },
    'Monk': { 1: ['Martial Arts', 'Unarmored Defense'], 2: ['Monk\'s Focus', 'Unarmored Movement', 'Uncanny Metabolism'], 3: ['Deflect Attacks', 'Monk Subclass'], 4: ['Ability Score Improvement', 'Slow Fall'], 5: ['Extra Attack', 'Stunning Strike'], 6: ['Empowered Strikes'], 7: ['Evasion'], 9: ['Acrobatic Movement'], 10: ['Heightened Focus', 'Self-Restoration'], 13: ['Deflect Energy'], 14: ['Disciplined Survivor'], 15: ['Perfect Focus'], 18: ['Superior Defense'], 20: ['Body and Mind'] },
    'Paladin': { 1: ['Lay on Hands', 'Spellcasting', 'Weapon Mastery'], 2: ['Fighting Style', 'Divine Smite'], 3: ['Paladin Subclass', 'Channel Divinity'], 4: ['Ability Score Improvement'], 5: ['Extra Attack', 'Faithful Steed'], 6: ['Aura of Protection'], 10: ['Aura of Courage'], 11: ['Improved Divine Smite'], 14: ['Cleansing Touch'] },
    'Ranger': { 1: ['Deft Explorer', 'Spellcasting', 'Weapon Mastery', 'Favored Enemy'], 2: ['Fighting Style'], 3: ['Ranger Subclass', 'Primal Awareness'], 4: ['Ability Score Improvement'], 5: ['Extra Attack'], 8: ['Land\'s Stride'], 10: ['Nature\'s Veil'], 14: ['Vanish'], 18: ['Feral Senses'], 20: ['Foe Slayer'] },
    'Rogue': { 1: ['Expertise', 'Sneak Attack', 'Thieves\' Cant', 'Weapon Mastery'], 2: ['Cunning Action'], 3: ['Rogue Subclass', 'Steady Aim'], 5: ['Cunning Strike', 'Uncanny Dodge'], 7: ['Evasion', 'Reliable Talent'], 11: ['Improved Cunning Strike'], 14: ['Devious Strikes'], 15: ['Slippery Mind'], 18: ['Elusive'], 20: ['Stroke of Luck'] },
    'Sorcerer': { 1: ['Spellcasting', 'Innate Sorcery'], 2: ['Font of Magic', 'Metamagic'], 3: ['Sorcerer Subclass'], 5: ['Sorcerous Restoration'], 7: ['Sorcery Incarnate'], 20: ['Arcane Apotheosis'] },
    'Warlock': { 1: ['Pact Magic', 'Eldritch Invocations'], 2: ['Magical Cunning'], 3: ['Warlock Subclass', 'Pact Boon'], 4: ['Ability Score Improvement'], 11: ['Mystic Arcanum (6th)'], 13: ['Mystic Arcanum (7th)'], 15: ['Mystic Arcanum (8th)'], 17: ['Mystic Arcanum (9th)'], 20: ['Eldritch Master'] },
    'Wizard': { 1: ['Spellcasting', 'Arcane Recovery', 'Ritual Caster'], 2: ['Scholar'], 3: ['Wizard Subclass'], 4: ['Ability Score Improvement'], 18: ['Spell Mastery'], 20: ['Signature Spells'] },
};

export const SUBCLASS_OPTIONS: Record<string, SubclassData[]> = {
  'Barbarian': [
    { name: 'Path of the Berserker', description: 'Channel Rage into violent fury.', features: { 3: [{ name: 'Frenzy', description: 'If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. To determine the extra damage, roll a number of d6s equal to your Rage Damage bonus, and add them together. The damage has the same type as the weapon or Unarmed Strike used for the attack.' }], 6: [{ name: 'Mindless Rage', description: 'You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you\'re Charmed or Frightened when you enter your Rage, the condition ends on you.' }], 10: [{ name: 'Retaliation', description: 'When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature, using a weapon or an Unarmed Strike.' }], 14: [{ name: 'Intimidating Presence', description: 'As a Bonus Action, you can strike terror into others with your menacing presence and primal power. When you do so, each creature of your choice in a 30-foot Emanation originating from you must make a Wisdom saving throw (DC 8 plus your Strength modifier and Proficiency Bonus). On a failed save, a creature has the Frightened condition for 1 minute. At the end of each of the Frightened creature\'s turns, the creature repeats the save, ending the effect on itself on a success.\n\nOnce you use this feature, you can\'t use it again until you finish a Long Rest unless you expend a use of your Rage (no action required) to restore your use of it.' }] } },
    { name: 'Path of the World Tree', description: 'Draw on the vitality of the multiverse.', features: { 3: [{name: 'Vitality of the Tree', description: 'Gain THP when you rage. Increase range of melee attacks.'}] } },
    { name: 'Path of the Zealot', description: 'Fueled by religious fervor.', features: { 3: [{name: 'Divine Fury', description: 'Extra radiant/necrotic damage while raging.'}] } },
    { name: 'Path of the Wild Heart', description: 'Attune to the spirits of beasts.', features: { 3: [{name: 'Animal Spirit', description: 'Choose Bear (resistance), Eagle (mobility), or Wolf (advantage for allies).'}] } }
  ],
  'Bard': [
      { name: 'College of Lore', description: 'Pursue beauty and truth using spells.', features: { 3: [{ name: 'Bonus Proficiencies', description: '3 extra skills.' }, { name: 'Cutting Words', description: 'Use Bardic Inspiration to reduce attack/damage/check.' }], 6: [{ name: 'Magical Secrets', description: 'Learn spells from any class.' }], 14: [{ name: 'Peerless Skill', description: 'Use Bardic Inspiration on own ability checks.' }] } },
      { name: 'College of Valor', description: 'Bards who embolden heroes.', features: { 3: [{name: 'Combat Inspiration', description: 'Use inspiration for damage or AC.'}, {name: 'Bonus Proficiencies', description: 'Medium armor, shields, martial weapons.'}] } },
      { name: 'College of Glamour', description: 'Wield the beguiling magic of the Feywild.', features: { 3: [{name: 'Mantle of Inspiration', description: 'Grant THP and movement to allies.'}] } },
      { name: 'College of Dance', description: 'Express magic through movement.', features: { 3: [{name: 'Dazzling Footwork', description: 'Unarmed strikes, extra movement, agile defense.'}] } }
  ],
  'Cleric': [
      { name: 'Life Domain', description: 'Focus on healing and vitality.', features: { 3: [{ name: 'Disciple of Life', description: 'Healing spells cure extra HP.' }, { name: 'Channel Divinity: Preserve Life', description: 'Heal injured creatures.' }], 6: [{ name: 'Blessed Healer', description: 'Healing others heals you.' }], 17: [{ name: 'Supreme Healing', description: 'Max healing rolls.' }] } },
      { name: 'Light Domain', description: 'Promote ideals of rebirth and renewal.', features: { 3: [{name: 'Warding Flare', description: 'Disadvantage on attacks against you.'}] } },
      { name: 'Trickery Domain', description: 'Servants of mischievous deities.', features: { 3: [{name: 'Blessing of the Trickster', description: 'Advantage on Stealth for ally.'}, {name: 'Invoke Duplicity', description: 'Create illusory double.'}] } },
      { name: 'War Domain', description: 'Champions of war gods.', features: { 3: [{name: 'War Priest', description: 'Bonus action attack.'}] } }
  ],
  'Druid': [
      { name: 'Circle of the Moon', description: 'Wild Shape into powerful combat forms.', features: { 3: [{ name: 'Combat Wild Shape', description: 'Bonus Action Wild Shape. Heal with spell slots.' }, { name: 'Circle Forms', description: 'Transform into stronger beasts (CR 1).' }], 6: [{ name: 'Primal Strike', description: 'Attacks count as magical.' }], 10: [{ name: 'Elemental Wild Shape', description: 'Transform into Elementals.' }], 14: [{ name: 'Thousand Forms', description: 'Cast Alter Self at will.' }] } },
      { name: 'Circle of the Land', description: 'Keepers of ancient knowledge.', features: { 3: [{name: 'Circle Spells', description: 'Always prepared spells based on land type.'}] } },
      { name: 'Circle of the Sea', description: 'Druids of the oceans and storms.', features: { 3: [{name: 'Wrath of the Sea', description: 'Thunderous emanation.'}] } },
      { name: 'Circle of the Stars', description: 'Draw on the power of starlight.', features: { 3: [{name: 'Starry Form', description: 'Archer, Chalice, or Dragon form.'}] } }
  ],
  'Fighter': [
      { name: 'Champion', description: 'Hone physical power to lethal perfection.', features: { 3: [{ name: 'Improved Critical', description: 'Crit on 19-20.' }], 7: [{ name: 'Remarkable Athlete', description: 'Bonus to physical checks. Jump farther.' }], 10: [{ name: 'Additional Fighting Style', description: 'Choose a second Fighting Style.' }], 15: [{ name: 'Superior Critical', description: 'Crit on 18-20.' }], 18: [{ name: 'Survivor', description: 'Regain HP when below half.' }] } },
      { name: 'Battle Master', description: 'Students of the art of war.', features: { 3: [{name: 'Combat Superiority', description: 'Superiority Dice and Maneuvers.'}] } },
      { name: 'Eldritch Knight', description: 'Combine martial mastery with magic.', features: { 3: [{name: 'Spellcasting', description: 'Wizard spells.'}, {name: 'Weapon Bond', description: 'Summon weapon.'}] } },
      { name: 'Psi Warrior', description: 'Augment prowess with psionic power.', features: { 3: [{name: 'Psionic Power', description: 'Psionic Energy dice for defense/offense.'}] } }
  ],
  'Monk': [
    { name: 'Warrior of Mercy', description: 'Manipulate forces of life and death.', features: { 3: [{ name: 'Hand of Harm', description: 'Once per turn when you hit a creature with an Unarmed Strike and deal damage, you can expend 1 Focus Point to deal extra Necrotic damage equal to one roll of your Martial Arts die plus your Wisdom modifier.' }, { name: 'Hand of Healing', description: 'As a Magic action, you can expend 1 Focus Point to touch a creature and restore a number of Hit Points equal to a roll of your Martial Arts die plus your Wisdom modifier. When you use your Flurry of Blows, you can replace one of the Unarmed Strikes with a use of this feature without expending a Focus Point.' }, { name: 'Implements of Mercy', description: 'You gain proficiency in the Insight and Medicine skills and proficiency with the Herbalism Kit.' }], 6: [{ name: 'Physician\'s Touch', description: 'Your Hand of Harm and Hand of Healing improve:\n\n• Hand of Harm: When you use Hand of Harm on a creature, you can also give that creature the Poisoned condition until the end of your next turn.\n\n• Hand of Healing: When you use Hand of Healing, you can also end one of the following conditions on the creature you heal: Blinded, Deafened, Paralyzed, Poisoned, or Stunned.' }], 11: [{ name: 'Flurry of Healing and Harm', description: 'When you use Flurry of Blows, you can replace each of the Unarmed Strikes with a use of Hand of Healing without expending Focus Points.\n\nIn addition, when you make an Unarmed Strike with Flurry of Blows and deal damage, you can use Hand of Harm with that strike without expending a Focus Point. You can still use Hand of Harm only once per turn.' }] } },
    { name: 'Warrior of Shadow', description: 'Masters of stealth and subterfuge.', features: { 3: [{name: 'Shadow Arts', description: 'Cast Darkness, Darkvision, Pass Without Trace, Silence.'}] } },
    { name: 'Warrior of the Elements', description: 'Channel elemental forces.', features: { 3: [{name: 'Elemental Attunement', description: 'Reach and elemental damage.'}] } },
    { name: 'Warrior of the Open Hand', description: 'Masters of martial arts combat.', features: { 3: [{name: 'Open Hand Technique', description: 'Add effects to Flurry of Blows (Topple, Push, Befuddle).'}] } }
  ],
  'Paladin': [
      { name: 'Oath of Devotion', description: 'Ideal of the white knight.', features: { 3: [{ name: 'Channel Divinity', description: 'Sacred Weapon or Turn the Unholy.' }, { name: 'Sacred Weapon', description: 'Add Cha to attack rolls. Light.' }], 7: [{ name: 'Aura of Devotion', description: 'Immunity to Charm for you and allies.' }], 15: [{ name: 'Purity of Spirit', description: 'Protection from Evil and Good effect always on.' }], 20: [{ name: 'Holy Nimbus', description: 'Radiant damage aura. Advantage on saves vs spells.' }] } },
      { name: 'Oath of Glory', description: 'Belief that destiny awaits those who try.', features: { 3: [{name: 'Channel Divinity', description: 'Peerless Athlete or Inspiring Smite.'}] } },
      { name: 'Oath of the Ancients', description: 'Preserve the light and natural world.', features: { 3: [{name: 'Channel Divinity', description: 'Nature\'s Wrath or Turn the Faithless.'}] } },
      { name: 'Oath of Vengeance', description: 'Punish those who commit grievous sins.', features: { 3: [{name: 'Channel Divinity', description: 'Abjure Enemy or Vow of Enmity.'}] } }
  ],
  'Ranger': [
      { name: 'Hunter', description: 'Master of martial prowess against specific threats.', features: { 3: [{ name: 'Hunter\'s Prey', description: 'Colossus Slayer, Giant Killer, or Horde Breaker.' }], 7: [{ name: 'Defensive Tactics', description: 'Escape the Horde, Multiattack Defense, or Steel Will.' }], 11: [{ name: 'Multiattack', description: 'Volley or Whirlwind Attack.' }], 15: [{ name: 'Superior Hunter\'s Defense', description: 'Evasion, Stand Against the Tide, or Uncanny Dodge.' }] } },
      { name: 'Beast Master', description: 'Bond with a primal beast.', features: { 3: [{name: 'Primal Companion', description: 'Summon Beast of the Land, Sea, or Sky.'}] } },
      { name: 'Gloom Stalker', description: 'At home in the darkest places.', features: { 3: [{name: 'Dread Ambusher', description: 'Bonus to initiative. Extra attack/damage first turn.'}, {name: 'Umbral Sight', description: 'Darkvision. Invisible to darkvision.'}] } },
      { name: 'Fey Wanderer', description: 'Guard the border of the Feywild.', features: { 3: [{name: 'Dreadful Strikes', description: 'Psychic damage.'}, {name: 'Otherworldly Glamour', description: 'Add Wis to Cha checks.'}] } }
  ],
  'Rogue': [
      { name: 'Thief', description: 'Burglary and agility.', features: { 3: [{ name: 'Fast Hands', description: 'Bonus Action Sleight of Hand, Thieves\' Tools, or Use Object.' }, { name: 'Second-Story Work', description: 'Climbing speed. Jump distance.' }], 9: [{ name: 'Supreme Sneak', description: 'Advantage on Stealth if moving half speed.' }], 13: [{ name: 'Use Magic Device', description: 'Ignore class/race/level requirements.' }], 17: [{ name: 'Thief\'s Reflexes', description: 'Two turns in first round of combat.' }] } },
      { name: 'Assassin', description: 'Masters of removing enemies.', features: { 3: [{ name: 'Assassinate', description: 'Advantage vs creature that hasn\'t moved. Crit vs surprised.' }, { name: 'Bonus Proficiencies', description: 'Disguise Kit, Poisoner\'s Kit.' }], 9: [{ name: 'Infiltration Expertise', description: 'Create false identities.' }], 13: [{ name: 'Imposter', description: 'Mimic speech and behavior perfectly.' }], 17: [{ name: 'Death Strike', description: 'Double damage on Assassinate hit (Con save).' }] } },
      { name: 'Arcane Trickster', description: 'Enhance stealth with magic.', features: { 3: [{name: 'Spellcasting', description: 'Wizard spells.'}, {name: 'Mage Hand Legerdemain', description: 'Invisible Mage Hand, finer control.'}] } },
      { name: 'Soulknife', description: 'Strike with the mind.', features: { 3: [{name: 'Psionic Power', description: 'Psi-Bolstered Knack, Psychic Whispers.'}, {name: 'Psychic Blades', description: 'Manifest psychic blades.'}] } }
  ],
  'Sorcerer': [
    { name: 'Draconic Sorcery', description: 'Breathe the magic of dragons.', features: { 3: [{ name: 'Draconic Resilience', description: 'The magic in your body manifests physical traits of your draconic gift. Your Hit Point maximum increases by 3, and it increases by 1 whenever you gain another Sorcerer level. While you aren\'t wearing armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers.' }, { name: 'Draconic Spells', description: 'You always have specific spells prepared based on your draconic lineage.' }], 6: [{ name: 'Elemental Affinity', description: 'Your draconic magic has an affinity with a damage type (Acid, Cold, Fire, Lightning, or Poison). You have Resistance to that damage type. When you cast a spell that deals damage of that type, you can add your Charisma modifier to one damage roll of that spell.' }] } },
    { name: 'Aberrant Sorcery', description: 'Alien influence.', features: { 3: [{name: 'Psionic Spells', description: 'Bonus spells.'}, {name: 'Telepathic Speech', description: 'Telepathy.'}] } },
    { name: 'Clockwork Sorcery', description: 'Order and mechanism.', features: { 3: [{name: 'Clockwork Magic', description: 'Bonus spells.'}, {name: 'Restore Balance', description: 'Cancel advantage/disadvantage.'}] } },
    { name: 'Wild Magic Sorcery', description: 'Chaos incarnate.', features: { 3: [{name: 'Wild Magic Surge', description: 'Random effect on spell cast.'}, {name: 'Tides of Chaos', description: 'Gain advantage.'}] } }
  ],
  'Warlock': [
      { name: 'Fiend Patron', description: 'Pact with a devil or demon.', features: { 3: [{ name: 'Dark One\'s Blessing', description: 'Gain Temp HP on kill.' }], 6: [{ name: 'Dark One\'s Own Luck', description: 'Add d10 to ability check or save.' }], 10: [{ name: 'Fiendish Resilience', description: 'Resistance to one damage type.' }], 14: [{ name: 'Hurl Through Hell', description: '10d10 Psychic damage banishment.' }] } },
      { name: 'Archfey Patron', description: 'Pact with a lord of the fey.', features: { 3: [{name: 'Fey Presence', description: 'Charm/Frighten nearby creatures.'}] } },
      { name: 'Great Old One Patron', description: 'Pact with an eldritch entity.', features: { 3: [{name: 'Awakened Mind', description: 'Telepathy.'}] } },
      { name: 'Celestial Patron', description: 'Pact with a being of the Upper Planes.', features: { 3: [{name: 'Healing Light', description: 'Pool of d6 healing.'}] } }
  ],
  'Wizard': [
      { name: 'School of Evocation', description: 'Focus on destructive energy.', features: { 3: [{ name: 'Evocation Savant', description: 'Halved gold/time for Evocation spells.' }, { name: 'Sculpt Spells', description: 'Protect allies from your AOE spells.' }], 6: [{ name: 'Potent Cantrip', description: 'Half damage on save for cantrips.' }], 10: [{ name: 'Empowered Evocation', description: 'Add Int to damage rolls.' }], 14: [{ name: 'Overchannel', description: 'Max damage on level 1-5 spell (take damage on repeat use).' }] } },
      { name: 'School of Abjuration', description: 'Wards and protection.', features: { 3: [{name: 'Arcane Ward', description: 'Magical shield absorbs damage.'}] } },
      { name: 'School of Divination', description: 'Seeing the future.', features: { 3: [{name: 'Portent', description: 'Roll d20s beforehand and use them.'}] } },
      { name: 'School of Illusion', description: 'Deception and figments.', features: { 3: [{name: 'Improved Minor Illusion', description: 'Sound and image.'}] } }
  ]
};
