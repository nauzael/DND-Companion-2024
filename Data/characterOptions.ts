
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
};

export const CLASS_DETAILS: Record<string, DetailData> = {
  'Barbarian': { name: 'Barbarian', description: 'Powered by primal forces that manifest as Rage.', traits: [{ name: 'Rage', description: 'You can imbue yourself with a primal power called Rage... (See Class Progression for full details)' }, { name: 'Unarmored Defense', description: 'AC = 10 + DEX + CON.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }] },
  'Monk': { name: 'Monk', description: 'Focus internal power into uncanny speed and strength.', traits: [{ name: 'Martial Arts', description: 'DEX for unarmed/monk weapons. d6 damage die. Bonus Action unarmed strike.' }, { name: 'Unarmored Defense', description: 'AC = 10 + DEX + WIS.' }, { name: 'Monk\'s Focus', description: 'Focus Points for Flurry of Blows, Patient Defense, Step of the Wind.' }] },
  'Rogue': { name: 'Rogue', description: 'Rely on cunning, stealth, and vulnerabilities.', traits: [{ name: 'Expertise', description: 'Double proficiency in two skills.' }, { name: 'Sneak Attack', description: 'Deal extra damage (1d6 scales) once per turn with Finesse/Ranged weapon.' }, { name: 'Thieves\' Cant', description: 'Secret code language.' }, { name: 'Weapon Mastery', description: 'Mastery properties for 2 weapons.' }] },
  'Sorcerer': { name: 'Sorcerer', description: 'Wield innate magic stamped into their being.', traits: [{ name: 'Spellcasting', description: 'Arcane magic. Charisma based.' }, { name: 'Innate Sorcery', description: 'Bonus Action: +1 DC, Advantage on spell attacks.' }] },
};

export const CLASS_PROGRESSION: Record<string, Record<number, string[]>> = {
    'Barbarian': { 1: ['Rage', 'Unarmored Defense', 'Weapon Mastery'], 2: ['Danger Sense', 'Reckless Attack'], 3: ['Barbarian Subclass', 'Primal Knowledge'], 4: ['Ability Score Improvement'], 5: ['Extra Attack', 'Fast Movement'], 9: ['Brutal Strike'], 11: ['Relentless Rage'], 13: ['Improved Brutal Strike'], 15: ['Persistent Rage'], 18: ['Indomitable Might'], 20: ['Primal Champion'] },
    'Monk': { 1: ['Martial Arts', 'Unarmored Defense'], 2: ['Monk\'s Focus', 'Unarmored Movement', 'Uncanny Metabolism'], 3: ['Deflect Attacks', 'Monk Subclass'], 4: ['Ability Score Improvement', 'Slow Fall'], 5: ['Extra Attack', 'Stunning Strike'], 6: ['Empowered Strikes'], 7: ['Evasion'], 9: ['Acrobatic Movement'], 10: ['Heightened Focus', 'Self-Restoration'], 13: ['Deflect Energy'], 14: ['Disciplined Survivor'], 15: ['Perfect Focus'], 18: ['Superior Defense'], 20: ['Body and Mind'] },
    'Rogue': { 1: ['Expertise', 'Sneak Attack', 'Thieves\' Cant', 'Weapon Mastery'], 2: ['Cunning Action'], 3: ['Rogue Subclass', 'Steady Aim'], 5: ['Cunning Strike', 'Uncanny Dodge'], 7: ['Evasion', 'Reliable Talent'], 11: ['Improved Cunning Strike'], 14: ['Devious Strikes'], 15: ['Slippery Mind'], 18: ['Elusive'], 20: ['Stroke of Luck'] },
    'Sorcerer': { 1: ['Spellcasting', 'Innate Sorcery'], 2: ['Font of Magic', 'Metamagic'], 3: ['Sorcerer Subclass'], 5: ['Sorcerous Restoration'], 7: ['Sorcery Incarnate'], 20: ['Arcane Apotheosis'] },
};

export const SUBCLASS_OPTIONS: Record<string, SubclassData[]> = {
  'Barbarian': [
    { name: 'Path of the Berserker', description: 'Channel Rage into violent fury.', features: { 3: [{ name: 'Frenzy', description: 'If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. To determine the extra damage, roll a number of d6s equal to your Rage Damage bonus, and add them together. The damage has the same type as the weapon or Unarmed Strike used for the attack.' }], 6: [{ name: 'Mindless Rage', description: 'You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you\'re Charmed or Frightened when you enter your Rage, the condition ends on you.' }], 10: [{ name: 'Retaliation', description: 'When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature, using a weapon or an Unarmed Strike.' }], 14: [{ name: 'Intimidating Presence', description: 'As a Bonus Action, you can strike terror into others with your menacing presence and primal power. When you do so, each creature of your choice in a 30-foot Emanation originating from you must make a Wisdom saving throw (DC 8 plus your Strength modifier and Proficiency Bonus). On a failed save, a creature has the Frightened condition for 1 minute. At the end of each of the Frightened creature\'s turns, the creature repeats the save, ending the effect on itself on a success.\n\nOnce you use this feature, you can\'t use it again until you finish a Long Rest unless you expend a use of your Rage (no action required) to restore your use of it.' }] } },
  ],
  'Monk': [
    { name: 'Warrior of Mercy', description: 'Manipulate forces of life and death.', features: { 3: [{ name: 'Hand of Harm', description: 'Once per turn when you hit a creature with an Unarmed Strike and deal damage, you can expend 1 Focus Point to deal extra Necrotic damage equal to one roll of your Martial Arts die plus your Wisdom modifier.' }, { name: 'Hand of Healing', description: 'As a Magic action, you can expend 1 Focus Point to touch a creature and restore a number of Hit Points equal to a roll of your Martial Arts die plus your Wisdom modifier. When you use your Flurry of Blows, you can replace one of the Unarmed Strikes with a use of this feature without expending a Focus Point.' }, { name: 'Implements of Mercy', description: 'You gain proficiency in the Insight and Medicine skills and proficiency with the Herbalism Kit.' }], 6: [{ name: 'Physician\'s Touch', description: 'Your Hand of Harm and Hand of Healing improve:\n\n• Hand of Harm: When you use Hand of Harm on a creature, you can also give that creature the Poisoned condition until the end of your next turn.\n\n• Hand of Healing: When you use Hand of Healing, you can also end one of the following conditions on the creature you heal: Blinded, Deafened, Paralyzed, Poisoned, or Stunned.' }], 11: [{ name: 'Flurry of Healing and Harm', description: 'When you use Flurry of Blows, you can replace each of the Unarmed Strikes with a use of Hand of Healing without expending Focus Points.\n\nIn addition, when you make an Unarmed Strike with Flurry of Blows and deal damage, you can use Hand of Harm with that strike without expending a Focus Point. You can still use Hand of Harm only once per turn.' }] } },
  ],
  'Sorcerer': [
    { name: 'Draconic Sorcery', description: 'Breathe the magic of dragons.', features: { 3: [{ name: 'Draconic Resilience', description: 'The magic in your body manifests physical traits of your draconic gift. Your Hit Point maximum increases by 3, and it increases by 1 whenever you gain another Sorcerer level. While you aren\'t wearing armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers.' }, { name: 'Draconic Spells', description: 'You always have specific spells prepared based on your draconic lineage.' }], 6: [{ name: 'Elemental Affinity', description: 'Your draconic magic has an affinity with a damage type (Acid, Cold, Fire, Lightning, or Poison). You have Resistance to that damage type. When you cast a spell that deals damage of that type, you can add your Charisma modifier to one damage roll of that spell.' }] } }
  ],
};
