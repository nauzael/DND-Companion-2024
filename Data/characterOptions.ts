
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
  'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
];

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

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
    'Acolyte': { description: 'You spent your early years in a temple.', scores: ['WIS', 'INT', 'CHA'], feat: 'Magic Initiate (Cleric)', featDescription: 'Learn two Cleric cantrips and one 1st-level Cleric spell.', skills: ['Insight', 'Religion'], equipment: ['Holy Symbol', 'Prayer Book', 'Stick of Incense (5)', 'Vestments'] },
    'Artisan': { description: 'You began as an apprentice to a craftsperson.', scores: ['STR', 'DEX', 'INT'], feat: 'Crafter', featDescription: 'Discount on buying nonmagical items. Craft items faster.', skills: ['Investigation', 'Persuasion'], equipment: ['Artisan\'s Tools', 'Traveler\'s Clothes'] },
    'Charlatan': { description: 'You care little for the laws of society.', scores: ['CHA', 'DEX', 'CON'], feat: 'Skilled', featDescription: 'Gain proficiency in 3 Skills or Tools.', skills: ['Deception', 'Sleight of Hand'], equipment: ['Costume', 'Forged Documents', 'Disguise Kit'] },
    'Criminal': { description: 'You have a history of breaking the law.', scores: ['DEX', 'CON', 'INT'], feat: 'Alert', featDescription: 'Proficiency in Initiative. Swap initiative with ally.', skills: ['Sleight of Hand', 'Stealth'], equipment: ['Crowbar', 'Dark Common Clothes', 'Thieves\' Tools'] },
    'Entertainer': { description: 'You thrive in front of an audience.', scores: ['CHA', 'DEX', 'WIS'], feat: 'Musician', featDescription: 'Grant Heroic Inspiration to allies after a rest.', skills: ['Acrobatics', 'Performance'], equipment: ['Musical Instrument', 'Costume', 'Mirror'] },
    'Farmer': { description: 'You grew up close to the land.', scores: ['STR', 'CON', 'WIS'], feat: 'Tough', featDescription: 'Gain +2 HP per level.', skills: ['Animal Handling', 'Nature'], equipment: ['Carpenter\'s Tools', 'Iron Pot', 'Shovel', 'Sickle'] },
    'Guard': { description: 'You served in a militia or guard force.', scores: ['STR', 'INT', 'WIS'], feat: 'Alert', featDescription: 'Proficiency in Initiative. Swap initiative with ally.', skills: ['Athletics', 'Perception'], equipment: ['Manacles', 'Horn', 'Uniform'] },
    'Guide': { description: 'You know the wilderness well.', scores: ['DEX', 'CON', 'WIS'], feat: 'Magic Initiate (Druid)', featDescription: 'Learn two Druid cantrips and one 1st-level Druid spell.', skills: ['Stealth', 'Survival'], equipment: ['Bedroll', 'Tent', 'Quiver'] },
    'Hermit': { description: 'You spent years in seclusion.', scores: ['WIS', 'CON', 'CHA'], feat: 'Healer', featDescription: 'Reroll 1s on healing dice. Use Healer\'s Kit to restore HP.', skills: ['Medicine', 'Religion'], equipment: ['Herbalism Kit', 'Oil Flask', 'Quarterstaff'] },
    'Merchant': { description: 'You know how to make a deal.', scores: ['CHA', 'INT', 'WIS'], feat: 'Lucky', featDescription: 'Gain Luck Points to reroll d20s.', skills: ['Animal Handling', 'Persuasion'], equipment: ['Abacus', 'Quill & Ink', 'Navigator\'s Tools'] },
    'Noble': { description: 'You were raised in wealth and power.', scores: ['CHA', 'INT', 'WIS'], feat: 'Skilled', featDescription: 'Gain proficiency in 3 Skills or Tools.', skills: ['History', 'Persuasion'], equipment: ['Signet Ring', 'Fine Clothes', 'Gaming Set'] },
    'Sage': { description: 'You spent your time studying lore.', scores: ['INT', 'CON', 'WIS'], feat: 'Magic Initiate (Wizard)', featDescription: 'Learn two Wizard cantrips and one 1st-level Wizard spell.', skills: ['Arcana', 'History'], equipment: ['Quarterstaff', 'Book', 'Parchment'] },
    'Sailor': { description: 'You sailed the seas.', scores: ['DEX', 'STR', 'WIS'], feat: 'Tavern Brawler', featDescription: 'Unarmed strikes deal 1d4. Push/Topple on hit.', skills: ['Acrobatics', 'Perception'], equipment: ['Rope (50ft)', 'Navigator\'s Tools'] },
    'Scribe': { description: 'You spent formative years in a scriptorium or library.', scores: ['DEX', 'INT', 'WIS'], feat: 'Skilled', featDescription: 'Gain proficiency in 3 Skills or Tools.', skills: ['Investigation', 'Perception'], equipment: ['Calligrapher\'s Supplies', 'Fine Clothes', 'Lamp', 'Parchment (12 sheets)'] },
    'Soldier': { description: 'You were trained for war.', scores: ['STR', 'DEX', 'CON'], feat: 'Savage Attacker', featDescription: 'Advantage on weapon damage rolls.', skills: ['Athletics', 'Intimidation'], equipment: ['Gaming Set', 'Healer\'s Kit'] },
    'Wayfarer': { description: 'You grew up on the road.', scores: ['DEX', 'WIS', 'CHA'], feat: 'Lucky', featDescription: 'Gain Luck Points to reroll d20s.', skills: ['Insight', 'Stealth'], equipment: ['Map', 'Compass'] }
};

export const CLASS_FEATURES: Record<string, string[]> = {
    'Barbarian': ['Rage', 'Unarmored Defense', 'Weapon Mastery'], 'Bard': ['Bardic Inspiration', 'Spellcasting'], 'Cleric': ['Spellcasting', 'Divine Order'], 'Druid': ['Spellcasting', 'Druidic', 'Primal Order'],
    'Fighter': ['Fighting Style', 'Second Wind', 'Weapon Mastery'], 'Monk': ['Martial Arts', 'Unarmored Defense', 'Monk\'s Focus'], 'Paladin': ['Lay On Hands', 'Spellcasting', 'Weapon Mastery'], 'Ranger': ['Spellcasting', 'Favored Enemy', 'Weapon Mastery'],
    'Rogue': ['Expertise', 'Sneak Attack', 'Thieves\' Cant', 'Weapon Mastery'], 'Sorcerer': ['Spellcasting', 'Innate Sorcery'], 'Warlock': ['Eldritch Invocations', 'Pact Magic'], 'Wizard': ['Spellcasting', 'Ritual Adept', 'Arcane Recovery']
};

export const CLASS_PROGRESSION: Record<string, Record<number, string[]>> = {
    'Barbarian': { 
        1: ['Rage', 'Unarmored Defense', 'Weapon Mastery'], 
        2: ['Reckless Attack', 'Danger Sense'], 
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
        13: ['Studied Attacks'], 
        14: ['Ability Score Improvement'],
        15: ['Subclass Feature'],
        16: ['Ability Score Improvement'],
        17: ['Action Surge (two uses)', 'Indomitable (three uses)'], 
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

export const SPECIES_DETAILS: Record<string, DetailData> = {
  'Human': { name: 'Human', description: 'Versatile and ambitious, humans are diverse innovators found across the multiverse.', size: 'Medium', speed: 30, traits: [{ name: 'Resourceful', description: 'You gain Heroic Inspiration whenever you finish a Long Rest.' }, { name: 'Skillful', description: 'You gain proficiency in one Skill of your choice.' }, { name: 'Versatile', description: 'You gain an Origin Feat of your choice (e.g., Skilled, Alert).' }] },
  'Elf': { name: 'Elf', description: 'Magical people of otherworldly grace, living in the world but apart from it.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: 'See in dim light within 60ft as bright light, and darkness as dim light.' }, { name: 'Fey Ancestry', description: 'Advantage on saves vs Charmed condition. Magic cannot put you to sleep.' }, { name: 'Keen Senses', description: 'Proficiency in the Insight, Perception, or Survival skill.' }, { name: 'Elven Lineage', description: 'Choose Drow (120ft Darkvision, Dancing Lights), High Elf (Prestidigitation, swap on rest), or Wood Elf (Speed 35, Druidcraft).' }, { name: 'Trance', description: 'You don\'t sleep. You meditate for 4 hours to gain the benefits of a Long Rest.' }] },
  'Dwarf': { name: 'Dwarf', description: 'Solid and enduring like the mountains they love, weathering the passage of centuries.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: '120ft Darkvision range.' }, { name: 'Dwarven Resilience', description: 'Resistance to Poison damage and Advantage on saves vs Poisoned condition.' }, { name: 'Dwarven Toughness', description: 'Hit Point maximum increases by 1, and increases by 1 every time you gain a level.' }, { name: 'Stonecunning', description: 'Bonus Action to gain Tremorsense (range 60ft) on stone surfaces for 10 minutes.' }] },
  'Halfling': { name: 'Halfling', description: 'The diminutive halflings survive by being stout and lucky.', size: 'Small', speed: 30, traits: [{ name: 'Brave', description: 'Advantage on saves vs the Frightened condition.' }, { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is a size larger than yours.' }, { name: 'Luck', description: 'When you roll a 1 on a d20 for an attack, check, or save, you can reroll it (must use new roll).' }, { name: 'Naturally Stealthy', description: 'You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.' }] },
  'Dragonborn': { name: 'Dragonborn', description: 'Born of dragons, they walk proudly through a world that greets them with fearful incomprehension.', size: 'Medium', speed: 30, traits: [{ name: 'Breath Weapon', description: 'Exhale energy (Line or Cone) dealing 1d10 damage (scales with level). Replaces an attack.' }, { name: 'Damage Resistance', description: 'Resistance to the damage type associated with your ancestry (Acid, Fire, Lightning, Poison, or Cold).' }, { name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' }, { name: 'Draconic Flight', description: 'At 5th level, you can sprout spectral wings to fly for 10 minutes (Fly Speed = Speed).' }] },
  'Gnome': { name: 'Gnome', description: 'A slight expression of their vibrant energy, gnomes are curious and inventive.', size: 'Small', speed: 30, traits: [{ name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' }, { name: 'Gnomish Cunning', description: 'Advantage on Intelligence, Wisdom, and Charisma saves.' }, { name: 'Gnomish Lineage', description: 'Choose Forest (Know Minor Illusion, Speak with Animals) or Rock (Know Mending/Prestidigitation, create tiny clockwork devices).' }] },
  'Orc': { name: 'Orc', description: 'Orcs are moved by a powerful passion for life and combat capabilities.', size: 'Medium', speed: 30, traits: [{ name: 'Adrenaline Rush', description: 'Dash as a Bonus Action. When you do, gain Temp HP equal to proficiency bonus.' }, { name: 'Darkvision', description: '120ft Darkvision.' }, { name: 'Relentless Endurance', description: 'When reduced to 0 HP, drop to 1 HP instead (once per Long Rest).' },] },
  'Tiefling': { name: 'Tiefling', description: 'Souls influenced by the Lower Planes, often bearing horns or tails.', size: 'Medium', speed: 30, traits: [{ name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' }, { name: 'Fiendish Legacy', description: 'Choose Abyssal (Poison res, Poison Spray), Chthonic (Necrotic res, Chill Touch), or Infernal (Fire res, Fire Bolt).' }, { name: 'Otherworldly Presence', description: 'You know the Thaumaturgy cantrip.' }] },
  'Aasimar': { name: 'Aasimar', description: 'Souls touched by the power of Mount Celestia, bearing a spark of the divine.', size: 'Medium', speed: 30, traits: [{ name: 'Celestial Resistance', description: 'Resistance to Necrotic and Radiant damage.' }, { name: 'Darkvision', description: 'See in dim light within 60ft as bright light.' }, { name: 'Healing Hands', description: 'Magic Action to heal a creature (roll d4s equal to PB). No spell slots required.' }, { name: 'Light Bearer', description: 'You know the Light cantrip.' }, { name: 'Celestial Revelation', description: 'At 3rd level, transform to deal extra damage and fly or radiate light.' }] },
  'Goliath': { name: 'Goliath', description: 'Strong and reclusive, towering over most other folk.', size: 'Medium', speed: 35, traits: [{ name: 'Giant Ancestry', description: 'Choose one: Cloud (Teleport), Fire (Fire Dmg), Frost (Cold Dmg/Slow), Hill (Topple), Stone (Reaction Reduce Dmg), Storm (Reaction Thunder Dmg).' }, { name: 'Large Form', description: 'Starting at 5th level, you can grow to Large size as a Bonus Action for 10 minutes.' }, { name: 'Powerful Build', description: 'Advantage on checks to end the Grappled condition. Lift as one size larger.' },] }
};

export const CLASS_DETAILS: Record<string, DetailData> = {
  'Barbarian': { name: 'Barbarian', description: 'Storm with Rage, and wade into hand-to-hand combat.', traits: [{ name: 'Rage', description: 'Bonus Action to enter. Adv on STR checks/saves, Resistance to B/P/S damage, +Rage Damage to STR attacks.' }, { name: 'Unarmored Defense', description: 'AC equals 10 + DEX mod + CON mod when not wearing armor.' }, { name: 'Weapon Mastery', description: 'Unlock special properties (Cleave, Topple) on your chosen weapons.' }] },
  'Bard': { name: 'Bard', description: 'Perform spells that inspire and heal allies or beguile foes.', traits: [{ name: 'Bardic Inspiration', description: 'Bonus Action to give a die (d6) to an ally to boost d20 rolls. Lasts 1 hour.' }, { name: 'Spellcasting', description: 'Cast spells from the Arcane list. Charisma is your casting ability.' }] },
  'Cleric': { name: 'Cleric', description: 'Invoke divine magic to heal, bolster, and smite.', traits: [{ name: 'Spellcasting', description: 'Prepare spells from the Divine list daily. Wisdom is your casting ability.' }, { name: 'Divine Order', description: 'Choose Protector (Heavy Armor + Martial Weapons) or Thaumaturge (Extra Cantrip + Religion bonus).' }] },
  'Druid': { name: 'Druid', description: 'Channel nature magic to heal, shape-shift, and control the elements.', traits: [{ name: 'Spellcasting', description: 'Prepare Primal spells. Wisdom is your casting ability.' }, { name: 'Druidic', description: 'You know the secret language of Druids.' }, { name: 'Primal Order', description: 'Choose Magician (Extra Cantrip + Arcana/Nature) or Warden (Medium Armor + Martial Weapons).' }] },
  'Fighter': { name: 'Fighter', description: 'Master all weapons and armor.', traits: [{ name: 'Fighting Style', description: 'Adopt a style like Archery, Defense, or Great Weapon Fighting.' }, { name: 'Second Wind', description: 'Bonus Action to regain HP (1d10 + level). Can also use for Tactical Mind on failed checks.' }, { name: 'Weapon Mastery', description: 'Master 3 weapons to use their tactical properties.' }] },
  'Monk': { name: 'Monk', description: 'Dart in and out of melee while striking fast and hard.', traits: [{ name: 'Martial Arts', description: 'Use DEX for Monk weapons/unarmed. Bonus Action unarmed strike. Martial Arts Die.' }, { name: 'Unarmored Defense', description: 'AC equals 10 + DEX mod + WIS mod.' }, { name: 'Monk\'s Focus', description: 'Focus Points to fuel Flurry of Blows, Patient Defense, and Step of the Wind.' }] },
  'Paladin': { name: 'Paladin', description: 'Smite foes and shield allies with divine and martial might.', traits: [{ name: 'Lay On Hands', description: 'Bonus Action to heal creatures from a pool of HP (5 x Level).' }, { name: 'Spellcasting', description: 'Prepare Divine spells. You can change them after a Long Rest.' }, { name: 'Weapon Mastery', description: 'Master 2 weapons to use their tactical properties.' }] },
  'Ranger': { name: 'Ranger', description: 'Weave together martial prowess, nature magic, and survival skills.', traits: [{ name: 'Spellcasting', description: 'Prepare Primal spells. Wisdom is your casting ability.' }, { name: 'Favored Enemy', description: 'You always have Hunter\'s Mark prepared. Cast it without a slot (limited use).' }, { name: 'Weapon Mastery', description: 'Master 2 weapons to use their tactical properties.' }] },
  'Rogue': { name: 'Rogue', description: 'Launch deadly Sneak Attacks while avoiding harm through stealth.', traits: [{ name: 'Expertise', description: 'Double proficiency bonus in two chosen skills.' }, { name: 'Sneak Attack', description: 'Deal extra damage (1d6) once per turn if you have Advantage or an ally nearby.' }, { name: 'Weapon Mastery', description: 'Master 2 weapons to use their tactical properties.' }, { name: 'Thieves\' Cant', description: 'A secret mix of dialect, jargon, and code.' }] },
  'Sorcerer': { name: 'Sorcerer', description: 'Wield magic innate to your being, shaping the power to your will.', traits: [{ name: 'Spellcasting', description: 'Cast Arcane spells spontaneously. Charisma is your casting ability.' }, { name: 'Innate Sorcery', description: 'Bonus Action to activate a state increasing spell DC by 1 and gain Advantage on Sorcerer spell attacks.' }] },
  'Warlock': { name: 'Warlock', description: 'Cast spells derived from occult knowledge.', traits: [{ name: 'Eldritch Invocations', description: 'Customize your powers with unique magical fragments.' }, { name: 'Pact Magic', description: 'Spell slots are always max level and recharge on a Short Rest.' }, { name: 'Magical Cunning', description: 'Regain half your Pact Magic slots once per Long Rest (1-minute rite).' }] },
  'Wizard': { name: 'Wizard', description: 'Study arcane magic and master spells for every purpose.', traits: [{ name: 'Spellcasting', description: 'Learn Arcane spells from scrolls and your spellbook.' }, { name: 'Ritual Adept', description: 'Cast ritual spells from your book without using a spell slot.' }, { name: 'Arcane Recovery', description: 'Regain some spell slots on a Short Rest (once per day).' }] }
};

export const SUBCLASS_OPTIONS: Record<string, SubclassData[]> = {
  'Barbarian': [
    { 
        name: 'Path of the Berserker', 
        description: 'Direct your Rage primarily toward violence.', 
        features: { 
            3: [{ name: 'Frenzy', description: 'If you use Reckless Attack while Raging, deal extra damage (d6s equal to Rage Damage bonus).' }],
            6: [{ name: 'Mindless Rage', description: 'Immunity to Charmed and Frightened while Raging.' }],
            10: [{ name: 'Retaliation', description: 'Reaction to make a melee attack when damaged by a creature within 5 ft.' }],
            14: [{ name: 'Intimidating Presence', description: 'Bonus Action to frighten creatures in a 30-ft emanation (Wisdom save).' }]
        } 
    },
    { 
        name: 'Path of the Wild Heart', 
        description: 'Walk in community with the animal world.', 
        features: { 
            3: [{ name: 'Animal Speaker', description: 'Cast Beast Sense and Speak with Animals as Rituals.' }, { name: 'Rage of the Wilds', description: 'Choose Bear (Resist all dmg but force/necro/psychic/radiant), Eagle (Disengage/Dash bonus), or Wolf (Advantage for allies).' }],
            6: [{ name: 'Aspect of the Wilds', description: 'Choose Owl (Darkvision), Panther (Climb), or Salmon (Swim).' }],
            10: [{ name: 'Nature Speaker', description: 'Cast Commune with Nature as a Ritual.' }],
            14: [{ name: 'Power of the Wilds', description: 'Choose Falcon (Fly), Lion (Enemy Disadvantage), or Ram (Knock Prone).' }]
        } 
    },
    { 
        name: 'Path of the World Tree', 
        description: 'Trace the roots and branches of the multiverse.', 
        features: { 
            3: [{ name: 'Vitality of the Tree', description: 'When you Rage, gain Temp HP. At start of turn, give Temp HP to ally.' }],
            6: [{ name: 'Branches of the Tree', description: 'Reaction to teleport or restrain enemy within 30 ft.' }],
            10: [{ name: 'Battering Roots', description: 'Reach increases by 10 ft. Weapon Mastery properties improve (Push/Topple).' }],
            14: [{ name: 'Travel Along the Tree', description: 'Teleport up to 60 ft (or 150 ft once per Rage) and bring allies.' }]
        } 
    },
    { 
        name: 'Path of the Zealot', 
        description: 'Rage in ecstatic union with a god.', 
        features: { 
            3: [{ name: 'Divine Fury', description: 'While Raging, first hit deals extra Necrotic or Radiant damage (1d6 + 1/2 Level).' }, { name: 'Warrior of the Gods', description: 'Pool of d12s to heal yourself as Bonus Action.' }],
            6: [{ name: 'Fanatical Focus', description: 'Reroll a failed saving throw once per Rage with a bonus.' }],
            10: [{ name: 'Zealous Presence', description: 'Bonus Action to give allies Advantage on attacks and saves.' }],
            14: [{ name: 'Rage of the Gods', description: 'Flight, Resistances, and Reaction to prevent death (Revivification).' }]
        } 
    }
  ],
  'Bard': [
    { 
        name: 'College of Dance', 
        description: 'Move in harmony with the cosmos.', 
        features: { 
            3: [{ name: 'Dazzling Footwork', description: 'Unarmored Defense (10+DEX+CHA). Unarmed Strikes use Bardic Die+Dex. Agile Strikes (Unarmed Strike as part of using Bardic Inspiration).' }],
            6: [{ name: 'Inspiring Movement', description: 'Reaction to move yourself and an ally without opportunity attacks.' }, { name: 'Tandem Footwork', description: 'Boost Initiative for you and allies using Bardic Inspiration.' }],
            14: [{ name: 'Leading Evasion', description: 'Share Evasion with allies within 5 ft.' }]
        } 
    },
    { 
        name: 'College of Glamour', 
        description: 'Weave beguiling Feywild magic.', 
        features: { 
            3: [{ name: 'Beguiling Magic', description: 'Charm Person/Mirror Image prepared. Enchantment/Illusion spells can Charm/Frighten.' }, { name: 'Mantle of Inspiration', description: 'Use Bardic Inspiration to give allies Temp HP (2 x roll) and Reaction move.' }],
            6: [{ name: 'Mantle of Majesty', description: 'Cast Command without a spell slot as a Bonus Action.' }],
            14: [{ name: 'Unbreakable Majesty', description: 'Sanctuary-like effect. Enemies attacking you must save or miss/recoil.' }]
        } 
    },
    { 
        name: 'College of Lore', 
        description: 'Plumb the depths of magical knowledge.', 
        features: { 
            3: [{ name: 'Bonus Proficiencies', description: 'Gain 3 Skill Proficiencies.' }, { name: 'Cutting Words', description: 'Use Reaction and Bardic Inspiration to reduce an enemy attack, check, or damage roll.' }],
            6: [{ name: 'Magical Discoveries', description: 'Learn two spells of your choice from any class list (Cleric, Druid, Wizard).' }],
            14: [{ name: 'Peerless Skill', description: 'Add Bardic Inspiration die to your own ability checks.' }]
        } 
    },
    { 
        name: 'College of Valor', 
        description: 'Sing the deeds of ancient heroes.', 
        features: { 
            3: [{ name: 'Combat Inspiration', description: 'Allies can use your Inspiration to add to AC (Reaction) or Damage.' }, { name: 'Martial Training', description: 'Proficiency with Martial Weapons and Medium Armor/Shields.' }],
            6: [{ name: 'Extra Attack', description: 'Attack twice. Can replace one attack with a cantrip.' }],
            14: [{ name: 'Battle Magic', description: 'Bonus Action attack after casting a spell.' }]
        } 
    }
  ],
  'Cleric': [
    { 
        name: 'Life Domain', 
        description: 'Soothe the hurts of the world.', 
        features: { 
            3: [{ name: 'Disciple of Life', description: 'Healing spells cure extra HP (2 + Spell Level).' }, { name: 'Preserve Life', description: 'Channel Divinity (Magic Action) to heal injured creatures (5 x Lvl HP total) up to half max.' }, { name: 'Life Domain Spells', description: 'Always prepared healing spells (e.g. Cure Wounds, Revivify).' }],
            6: [{ name: 'Blessed Healer', description: 'When you heal others, you also heal yourself (2 + Spell Level).' }],
            17: [{ name: 'Supreme Healing', description: 'Maximize dice rolls for healing.' }]
        } 
    },
    { 
        name: 'Light Domain', 
        description: 'Bring light to banish darkness.', 
        features: { 
            3: [{ name: 'Light Domain Spells', description: 'Always prepared fire/light spells (e.g. Fireball, Daylight).' }, { name: 'Radiance of the Dawn', description: 'Channel Divinity to deal 2d10 + Lvl Radiant damage to foes within 30ft.' }, { name: 'Warding Flare', description: 'Reaction to impose Disadvantage on an attack against you.' }],
            6: [{ name: 'Improved Warding Flare', description: 'Use Warding Flare to protect allies. Give Temp HP.' }],
            17: [{ name: 'Corona of Light', description: 'Emit sunlight. Enemies have disadvantage on saves vs Fire/Radiant.' }]
        } 
    },
    { 
        name: 'Trickery Domain', 
        description: 'Make mischief and challenge authority.', 
        features: { 
            3: [{ name: 'Blessing of the Trickster', description: 'Grant Advantage on Stealth checks to another creature.' }, { name: 'Invoke Duplicity', description: 'Channel Divinity to create illusion. Cast spells from it. Advantage on attacks vs foes near it.' }, { name: 'Trickery Domain Spells', description: 'Always prepared deception spells (e.g. Invisibility, Polymorph).' }],
            6: [{ name: 'Trickster\'s Transposition', description: 'Teleport to swap places with your illusion.' }],
            17: [{ name: 'Improved Duplicity', description: 'Illusion grants allies advantage. Illusion heals when it ends.' }]
        } 
    },
    { 
        name: 'War Domain', 
        description: 'Inspire valor and smite foes.', 
        features: { 
            3: [{ name: 'War Priest', description: 'Make a weapon attack as a Bonus Action (WIS mod times).' }, { name: 'Guided Strike', description: 'Channel Divinity to add +10 to an attack roll (Reaction).' }, { name: 'War Domain Spells', description: 'Always prepared combat spells (e.g. Spiritual Weapon, Spirit Guardians).' }],
            6: [{ name: 'War God\'s Blessing', description: 'Cast Shield of Faith or Spiritual Weapon using Channel Divinity without concentration.' }],
            17: [{ name: 'Avatar of Battle', description: 'Resistance to Bludgeoning, Piercing, and Slashing damage.' }]
        } 
    }
  ],
  'Druid': [
    { 
        name: 'Circle of the Land', 
        description: 'Celebrate connection to the natural world.', 
        features: { 
            3: [{ name: 'Circle of the Land Spells', description: 'Always prepared spells based on chosen land type (Arid, Polar, Temperate, Tropical).' }, { name: 'Land\'s Aid', description: 'Expend Wild Shape to deal Necrotic damage and heal in an area.' }],
            6: [{ name: 'Natural Recovery', description: 'Recover spell slots on Short Rest. Free casting of Circle Spell.' }],
            10: [{ name: 'Nature\'s Ward', description: 'Immunity to Poison. Resistance to damage type of your land.' }],
            14: [{ name: 'Nature\'s Sanctuary', description: 'Create spectral trees/vines. Half cover and resistance for allies.' }]
        } 
    },
    { 
        name: 'Circle of the Moon', 
        description: 'Adopt animal forms to guard the wilds.', 
        features: { 
            3: [{ name: 'Circle Forms', description: 'Combat Wild Shape as Bonus Action. AC 13+Wis. Temp HP = 3 x Level.' }, { name: 'Circle of the Moon Spells', description: 'Always prepared moon spells (e.g. Moonbeam).' }],
            6: [{ name: 'Improved Circle Forms', description: 'Attacks deal Radiant damage option. Add Wis to Con saves.' }],
            10: [{ name: 'Moonlight Step', description: 'Bonus Action teleport 30ft.' }],
            14: [{ name: 'Lunar Form', description: 'Extra 2d10 Radiant damage. Teleport allies with Moonlight Step.' }]
        } 
    },
    { 
        name: 'Circle of the Sea', 
        description: 'Become one with tides and storms.', 
        features: { 
            3: [{ name: 'Circle of the Sea Spells', description: 'Always prepared storm/water spells (e.g. Shatter, Lightning Bolt).' }, { name: 'Wrath of the Sea', description: 'Expend Wild Shape to emanate storm spray (Cold Dmg + Push).' }],
            6: [{ name: 'Aquatic Affinity', description: 'Swim Speed. Emanation range increases to 10ft.' }],
            10: [{ name: 'Stormborn', description: 'Fly Speed. Resistance to Cold, Lightning, Thunder.' }],
            14: [{ name: 'Oceanic Gift', description: 'Manifest emanation around an ally.' }]
        } 
    },
    { 
        name: 'Circle of the Stars', 
        description: 'Harness secrets hidden in constellations.', 
        features: { 
            3: [{ name: 'Star Map', description: 'Guidance/Guiding Bolt prepared. Free Guiding Bolts.' }, { name: 'Starry Form', description: 'Expend Wild Shape to enter Archer (Bonus Attack 1d8+Wis), Chalice (Heal extra 1d8+Wis), or Dragon (Min 10 on Concentration/Int/Wis checks) form.' }],
            6: [{ name: 'Cosmic Omen', description: 'Roll d6 after Long Rest. Weal (add d6) or Woe (subtract d6) reaction.' }],
            10: [{ name: 'Twinkling Constellations', description: 'Forms improve (2d8 damage/healing, Fly Speed).' }],
            14: [{ name: 'Full of Stars', description: 'Resistance to Bludgeoning, Piercing, and Slashing damage.' }]
        } 
    }
  ],
  'Fighter': [
    { 
        name: 'Battle Master', 
        description: 'Master sophisticated battle maneuvers.', 
        features: { 
            3: [{ name: 'Combat Superiority', description: 'Gain 4 Superiority Dice (d8) and 3 Maneuvers (e.g., Trip Attack, Parry).' }, { name: 'Student of War', description: 'Proficiency with one Artisan Tool and one Skill.' }],
            7: [{ name: 'Know Your Enemy', description: 'Learn immunities, resistances, or vulnerabilities of a target.' }],
            10: [{ name: 'Improved Combat Superiority', description: 'Superiority Dice become d10s.' }],
            15: [{ name: 'Relentless', description: 'Use a free d8 instead of expending a die once per turn.' }],
            18: [{ name: 'Ultimate Combat Superiority', description: 'Superiority Dice become d12s.' }]
        } 
    },
    { 
        name: 'Champion', 
        description: 'Pursue physical excellence in combat.', 
        features: { 
            3: [{ name: 'Improved Critical', description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.' }, { name: 'Remarkable Athlete', description: 'Advantage on Initiative and Athletics. Crit hits allow movement.' }],
            7: [{ name: 'Additional Fighting Style', description: 'Choose a second Fighting Style.' }],
            10: [{ name: 'Heroic Warrior', description: 'Gain Heroic Inspiration at start of turn.' }],
            15: [{ name: 'Superior Critical', description: 'Critical hit on 18-20.' }],
            18: [{ name: 'Survivor', description: 'Advantage on Death Saves. Regain HP each turn if bloodied.' }]
        } 
    },
    { 
        name: 'Eldritch Knight', 
        description: 'Support combat skills with arcane magic.', 
        features: { 
            3: [{ name: 'Spellcasting', description: 'Cast Wizard spells (Level 1+).' }, { name: 'War Bond', description: 'Bond with 2 weapons, summon them as Bonus Action.' }],
            7: [{ name: 'War Magic', description: 'Replace one attack with a Cantrip.' }],
            10: [{ name: 'Eldritch Strike', description: 'Hit imposes Disadvantage on next save against your spell.' }],
            15: [{ name: 'Arcane Charge', description: 'Teleport 30ft when using Action Surge.' }],
            18: [{ name: 'Improved War Magic', description: 'Replace two attacks with a Level 1 or 2 Spell.' }]
        } 
    },
    { 
        name: 'Psi Warrior', 
        description: 'Augment physical might with psionic power.', 
        features: { 
            3: [{ name: 'Psionic Power', description: 'Psionic Energy Dice (d6). Protective Field (reduce dmg), Psionic Strike (extra dmg), Telekinetic Movement.' }],
            7: [{ name: 'Telekinetic Adept', description: 'Psi-Powered Leap (Fly Speed). Telekinetic Thrust (Prone/Move).' }],
            10: [{ name: 'Guarded Mind', description: 'Resistance to Psychic. End Charmed/Frightened.' }],
            15: [{ name: 'Bulwark of Force', description: 'Grant Half Cover to allies.' }],
            18: [{ name: 'Telekinetic Master', description: 'Cast Telekinesis. Make attacks while concentrating.' }]
        } 
    }
  ],
  'Monk': [
    { 
        name: 'Warrior of Mercy', 
        description: 'Manipulate forces of life and death.', 
        features: { 
            3: [{ name: 'Hand of Harm', description: 'Expend Focus to deal extra Necrotic damage.' }, { name: 'Hand of Healing', description: 'Expend Focus to heal creature. Can replace Flurry attack.' }, { name: 'Implements of Mercy', description: 'Proficiency in Insight, Medicine, Herbalism Kit.' }],
            6: [{ name: 'Physician\'s Touch', description: 'Harm poisons target. Healing cures conditions.' }],
            11: [{ name: 'Flurry of Healing and Harm', description: 'Free Hand of Healing/Harm with Flurry of Blows.' }],
            17: [{ name: 'Hand of Ultimate Mercy', description: 'Resurrect a creature.' }]
        } 
    },
    { 
        name: 'Warrior of Shadow', 
        description: 'Harness shadow power for stealth and subterfuge.', 
        features: { 
            3: [{ name: 'Shadow Arts', description: 'Expend Focus to cast Darkness. Gain Darkvision (or upgrade it). Know Minor Illusion.' }],
            6: [{ name: 'Shadow Step', description: 'Bonus Action teleport 60ft between shadows. Advantage on next attack.' }],
            11: [{ name: 'Improved Shadow Step', description: 'Free Shadow Step. Attack after teleporting.' }],
            17: [{ name: 'Cloak of Shadows', description: 'Invisibility and phasing through objects.' }]
        } 
    },
    { 
        name: 'Warrior of the Elements', 
        description: 'Wield strikes and bursts of elemental power.', 
        features: { 
            3: [{ name: 'Elemental Attunement', description: 'Expend Focus for +10ft Reach and Elemental damage/push/pull.' }, { name: 'Manipulate Elements', description: 'Know Elementalism spell.' }],
            6: [{ name: 'Elemental Burst', description: 'AoE elemental damage explosion (20ft sphere).' }],
            11: [{ name: 'Stride of the Elements', description: 'Fly and Swim speeds equal to Speed.' }],
            17: [{ name: 'Elemental Epitome', description: 'Resistance, Speed boost, Extra damage.' }]
        } 
    },
    { 
        name: 'Warrior of the Open Hand', 
        description: 'Master unarmed combat techniques.', 
        features: { 
            3: [{ name: 'Open Hand Technique', description: 'Flurry of Blows adds Addle (No Reactions), Push (15ft), or Topple (Prone).' }],
            6: [{ name: 'Wholeness of Body', description: 'Bonus Action heal (Martial Arts die + Wis).' }],
            11: [{ name: 'Fleet Step', description: 'Free Step of the Wind after other Bonus Actions.' }],
            17: [{ name: 'Quivering Palm', description: 'Set up lethal vibrations. End for 10d12 Force damage.' }]
        } 
    }
  ],
  'Paladin': [
    { 
        name: 'Oath of Devotion', 
        description: 'Uphold the ideals of justice and order.', 
        features: { 
            3: [{ name: 'Sacred Weapon', description: 'Channel Divinity to add CHA mod to attack rolls and deal Radiant damage. Light.' }, { name: 'Oath of Devotion Spells', description: 'Always prepared protection/holy spells.' }],
            7: [{ name: 'Aura of Devotion', description: 'Immunity to Charm for you and allies.' }],
            15: [{ name: 'Smite of Protection', description: 'Divine Smite grants Half Cover.' }],
            20: [{ name: 'Holy Nimbus', description: 'Radiant damage aura. Advantage on saves vs Fiends/Undead.' }]
        } 
    },
    { 
        name: 'Oath of Glory', 
        description: 'Strive for the heights of heroism.', 
        features: { 
            3: [{ name: 'Peerless Athlete', description: 'Channel Divinity for Adv on Athletics/Acrobatics and jump bonus.' }, { name: 'Inspiring Smite', description: 'Divine Smite triggers Temp HP distribution.' }, { name: 'Oath of Glory Spells', description: 'Always prepared glory spells.' }],
            7: [{ name: 'Aura of Alacrity', description: 'Speed increase for you and allies.' }],
            15: [{ name: 'Glorious Defense', description: 'Reaction to boost AC and counterattack.' }],
            20: [{ name: 'Living Legend', description: 'Advantage on Cha checks. Reroll saves. Unerring strikes.' }]
        } 
    },
    { 
        name: 'Oath of the Ancients', 
        description: 'Preserve life and light in the world.', 
        features: { 
            3: [{ name: 'Nature\'s Wrath', description: 'Channel Divinity to restrain foes with spectral vines.' }, { name: 'Oath of the Ancients Spells', description: 'Always prepared nature spells.' }],
            7: [{ name: 'Aura of Warding', description: 'Resistance to Necrotic, Psychic, and Radiant damage.' }],
            15: [{ name: 'Undying Sentinel', description: 'Drop to 1 HP instead of 0. Ignore aging.' }],
            20: [{ name: 'Elder Champion', description: 'Bonus Action spells. Enemy disadvantage. Regen.' }]
        } 
    },
    { 
        name: 'Oath of Vengeance', 
        description: 'Punish evildoers at any cost.', 
        features: { 
            3: [{ name: 'Vow of Enmity', description: 'Channel Divinity to gain Advantage on attacks against one creature.' }, { name: 'Oath of Vengeance Spells', description: 'Always prepared hunting/combat spells.' }],
            7: [{ name: 'Relentless Avenger', description: 'Move after opportunity attack.' }],
            15: [{ name: 'Soul of Vengeance', description: 'Reaction attack when vowed enemy attacks.' }],
            20: [{ name: 'Avenging Angel', description: 'Flight. Frightful Aura.' }]
        } 
    }
  ],
  'Ranger': [
    { 
        name: 'Beast Master', 
        description: 'Bond with a primal beast.', 
        features: { 
            3: [{ name: 'Primal Companion', description: 'Summon a Beast of the Land, Air, or Sea. Friendly, obeys commands, acts on your turn.' }],
            7: [{ name: 'Exceptional Training', description: 'Beast can Dash/Disengage/Dodge/Help as Bonus Action. Attacks deal Force/Type dmg.' }],
            11: [{ name: 'Bestial Fury', description: 'Beast attacks twice. Hunter\'s Mark benefit.' }],
            15: [{ name: 'Share Spells', description: 'Spells targeting you also affect beast.' }]
        } 
    },
    { 
        name: 'Fey Wanderer', 
        description: 'Wield fey mirth and fury.', 
        features: { 
            3: [{ name: 'Dreadful Strikes', description: 'Deal extra psychic damage once per turn.' }, { name: 'Otherworldly Glamour', description: 'Add WIS mod to Charisma checks. Gain social skill.' }, { name: 'Fey Wanderer Spells', description: 'Always prepared fey spells.' }],
            7: [{ name: 'Beguiling Twist', description: 'Reaction to Charm/Frighten when a creature succeeds a save.' }],
            11: [{ name: 'Fey Reinforcements', description: 'Summon Fey without concentration or components.' }],
            15: [{ name: 'Misty Wanderer', description: 'Misty Step brings an ally.' }]
        } 
    },
    { 
        name: 'Gloom Stalker', 
        description: 'Draw on shadow magic to fight your foes.', 
        features: { 
            3: [{ name: 'Dread Ambusher', description: 'Add WIS to Initiative. First turn: +10ft speed, extra attack + 2d6 Psychic dmg.' }, { name: 'Umbral Sight', description: 'Darkvision 60ft. Invisible to Darkvision.' }, { name: 'Gloom Stalker Spells', description: 'Always prepared stealth/fear spells.' }],
            7: [{ name: 'Iron Mind', description: 'Proficiency in Wisdom (or Int/Cha) saves.' }],
            11: [{ name: 'Stalker\'s Flurry', description: 'Miss causes extra attack or Fear.' }],
            15: [{ name: 'Shadowy Dodge', description: 'Reaction to impose Disadvantage on attack.' }]
        } 
    },
    { 
        name: 'Hunter', 
        description: 'Protect nature and people from destruction.', 
        features: { 
            3: [{ name: 'Hunter\'s Prey', description: 'Choose Colossus Slayer (hurt foes) or Horde Breaker (extra attack vs adjacent).' }, { name: 'Hunter\'s Lore', description: 'Know Immunities/Resistances/Vulnerabilities of Hunter\'s Mark target.' }],
            7: [{ name: 'Defensive Tactics', description: 'Choose Escape the Horde (OA Disadvantage) or Multiattack Defense.' }],
            11: [{ name: 'Superior Hunter\'s Prey', description: 'Hunter\'s Mark damage splashes to second target.' }],
            15: [{ name: 'Superior Hunter\'s Defense', description: 'Reaction Resistance to damage.' }]
        } 
    }
  ],
  'Rogue': [
    { 
        name: 'Arcane Trickster', 
        description: 'Enhance stealth with arcane spells.', 
        features: { 
            3: [{ name: 'Spellcasting', description: 'Cast Wizard spells.' }, { name: 'Mage Hand Legerdemain', description: 'Invisible Mage Hand, Bonus Action control, Sleight of Hand.' }],
            9: [{ name: 'Magical Ambush', description: 'Disadvantage on saves vs your spells if you are hidden.' }],
            13: [{ name: 'Versatile Trickster', description: 'Mage Hand distracts targets.' }],
            17: [{ name: 'Spell Thief', description: 'Reaction to negate and steal a spell.' }]
        } 
    },
    { 
        name: 'Assassin', 
        description: 'Practice the grim art of death.', 
        features: { 
            3: [{ name: 'Assassinate', description: 'Advantage on Initiative. Adv vs creatures who haven\'t acted. Sneak Attack adds Rogue Level dmg in first round.' }, { name: 'Assassin\'s Tools', description: 'Disguise Kit and Poisoner\'s Kit proficiency.' }],
            9: [{ name: 'Infiltration Expertise', description: 'Mimicry. Speed not reduced by Steady Aim.' }],
            13: [{ name: 'Envenom Weapons', description: 'Poison ignores resistance. Deal damage on failed save.' }],
            17: [{ name: 'Death Strike', description: 'Double damage on first round hit.' }]
        } 
    },
    { 
        name: 'Soulknife', 
        description: 'Strike foes with psionic blades.', 
        features: { 
            3: [{ name: 'Psychic Blades', description: 'Manifest blades (Finesse/Thrown) to attack. 1d6/1d4 Psychic damage.' }, { name: 'Psionic Power', description: 'Energy Dice (d6). Psi-Bolstered Knack (add to failed checks), Psychic Whispers (telepathy).' }],
            9: [{ name: 'Soul Blades', description: 'Homing Strikes (add die to hit). Psychic Teleportation.' }],
            13: [{ name: 'Psychic Veil', description: 'Invisibility.' }],
            17: [{ name: 'Rend Mind', description: 'Stun target with Sneak Attack.' }]
        } 
    },
    { 
        name: 'Thief', 
        description: 'Hunt for treasure as a classic adventurer.', 
        features: { 
            3: [{ name: 'Fast Hands', description: 'Use Cunning Action for Sleight of Hand, Thieves Tools, or Use an Object.' }, { name: 'Second-Story Work', description: 'Climb speed equals walk speed. Jump with Dex.' }],
            9: [{ name: 'Supreme Sneak', description: 'Stealth Attack (Cunning Strike): Attack from Hiding without breaking invisibility.' }],
            13: [{ name: 'Use Magic Device', description: 'Attune to 4 items. Use scrolls. Charge saving.' }],
            17: [{ name: 'Thief\'s Reflexes', description: 'Two turns in the first round of combat.' }]
        } 
    }
  ],
  'Sorcerer': [
    { 
        name: 'Aberrant Sorcery', 
        description: 'Wield unnatural psionic power.', 
        features: { 
            3: [{ name: 'Psionic Spells', description: 'Learn Mind Sliver and other psionic spells.' }, { name: 'Telepathic Speech', description: 'Bonus Action to connect telepathically with a creature.' }],
            6: [{ name: 'Psionic Sorcery', description: 'Cast psionic spells with Sorcery Points (Subtle).' }, { name: 'Psychic Defenses', description: 'Resistance to Psychic. Adv vs Charm/Frighten.' }],
            14: [{ name: 'Revelation in Flesh', description: 'Spend point for Flight, Swim, See Invis, or Squeeze.' }],
            18: [{ name: 'Warping Implosion', description: 'Teleport and damage/pull enemies.' }]
        } 
    },
    { 
        name: 'Clockwork Sorcery', 
        description: 'Channel cosmic forces of order.', 
        features: { 
            3: [{ name: 'Clockwork Spells', description: 'Learn order-based spells.' }, { name: 'Restore Balance', description: 'Reaction to neutralize Advantage/Disadvantage.' }],
            6: [{ name: 'Bastion of Law', description: 'Spend points to create damage-reducing ward.' }],
            14: [{ name: 'Trance of Order', description: 'Reliable Talent for attacks/saves. No Advantage against you.' }],
            18: [{ name: 'Clockwork Cavalcade', description: 'Heal, Repair, and Dispel in a cube.' }]
        } 
    },
    { 
        name: 'Draconic Sorcery', 
        description: 'Breathe the magic of dragons.', 
        features: { 
            3: [{ name: 'Draconic Resilience', description: 'AC is 10 + DEX + CHA. HP increases by 3 + Level.' }, { name: 'Draconic Spells', description: 'Learn dragon-themed spells.' }],
            6: [{ name: 'Elemental Affinity', description: 'Resistance to damage type. Add CHA to damage.' }],
            14: [{ name: 'Dragon Wings', description: 'Fly Speed.' }],
            18: [{ name: 'Dragon Companion', description: 'Summon Dragon without concentration.' }]
        } 
    },
    { 
        name: 'Wild Magic Sorcery', 
        description: 'Unleash chaotic magic.', 
        features: { 
            3: [{ name: 'Wild Magic Surge', description: 'Roll d20 on spell cast. 20 triggers random magical effect.' }, { name: 'Tides of Chaos', description: 'Gain Advantage on one D20 Test. Next spell triggers Surge.' }],
            6: [{ name: 'Bend Luck', description: 'Spend points to add/subtract d4 from a roll.' }],
            14: [{ name: 'Controlled Chaos', description: 'Roll twice on surge table.' }],
            18: [{ name: 'Tamed Surge', description: 'Choose effect from surge table.' }]
        } 
    }
  ],
  'Warlock': [
    { 
        name: 'Archfey Patron', 
        description: 'Bargain with whimsical Fey.', 
        features: { 
            3: [{ name: 'Steps of the Fey', description: 'Cast Misty Step without slot (CHA mod/day). Add effect: Refresh (Temp HP) or Taunt.' }, { name: 'Archfey Spells', description: 'Always prepared fey spells.' }],
            6: [{ name: 'Misty Escape', description: 'Cast Misty Step as Reaction to damage. Vanish or Dreadful Step.' }],
            10: [{ name: 'Beguiling Defenses', description: 'Immunity to Charm. Reaction to reflect damage/charm.' }],
            14: [{ name: 'Bewitching Magic', description: 'Free Misty Step after Enchantment/Illusion spell.' }]
        } 
    },
    { 
        name: 'Celestial Patron', 
        description: 'Call on the power of the Heavens.', 
        features: { 
            3: [{ name: 'Healing Light', description: 'Pool of d6s (1+Level) to heal as Bonus Action.' }, { name: 'Celestial Spells', description: 'Always prepared holy spells.' }],
            6: [{ name: 'Radiant Soul', description: 'Resistance to Radiant. Add CHA to Radiant/Fire damage.' }],
            10: [{ name: 'Celestial Resilience', description: 'Gain Temp HP on rest or Magical Cunning.' }],
            14: [{ name: 'Searing Vengeance', description: 'Resist death, heal, and blind enemies.' }]
        } 
    },
    { 
        name: 'Fiend Patron', 
        description: 'Make a deal with the Lower Planes.', 
        features: { 
            3: [{ name: 'Dark One\'s Blessing', description: 'Gain Temp HP (CHA + Level) when you reduce a hostile creature to 0 HP.' }, { name: 'Fiend Spells', description: 'Always prepared fire/destructive spells.' }],
            6: [{ name: 'Dark One\'s Own Luck', description: 'Add d10 to a check or save.' }],
            10: [{ name: 'Fiendish Resilience', description: 'Choose a damage resistance after rest.' }],
            14: [{ name: 'Hurl Through Hell', description: 'Banish hit creature to nightmare landscape (10d10 damage).' }]
        } 
    },
    { 
        name: 'Great Old One Patron', 
        description: 'Unearth forbidden lore of ineffable beings.', 
        features: { 
            3: [{ name: 'Awakened Mind', description: 'Telepathic communication.' }, { name: 'Psychic Spells', description: 'Change dmg to Psychic. No V/S for Enchantment/Illusion.' }, { name: 'Great Old One Spells', description: 'Always prepared psychic spells.' }],
            6: [{ name: 'Clairvoyant Combatant', description: 'Telepathic bond grants Advantage to you/Disadvantage to enemy.' }],
            10: [{ name: 'Eldritch Hex', description: 'Hex gives disadvantage on saves.' }, { name: 'Thought Shield', description: 'Resist Psychic. Reflect Psychic damage.' }],
            14: [{ name: 'Create Thrall', description: 'Summon Aberration is improved.' }]
        } 
    }
  ],
  'Wizard': [
    { 
        name: 'Abjurer', 
        description: 'Shield companions and banish foes.', 
        features: { 
            3: [{ name: 'Arcane Ward', description: 'Create a magical ward that absorbs damage. Recharge with Abjuration spells.' }, { name: 'Abjuration Savant', description: 'Two free Abjuration spells in book.' }],
            6: [{ name: 'Projected Ward', description: 'Reaction to use Arcane Ward on ally.' }],
            10: [{ name: 'Spell Breaker', description: 'Counterspell/Dispel Magic prepared. Add PB to checks.' }],
            14: [{ name: 'Spell Resistance', description: 'Advantage on saves vs spells. Resistance to spell damage.' }]
        } 
    },
    { 
        name: 'Diviner', 
        description: 'Learn the secrets of the multiverse.', 
        features: { 
            3: [{ name: 'Portent', description: 'Roll 2d20 after Long Rest. Replace any roll with these values.' }, { name: 'Divination Savant', description: 'Two free Divination spells in book.' }],
            6: [{ name: 'Expert Divination', description: 'Regain lower level slot when casting Divination spell.' }],
            10: [{ name: 'The Third Eye', description: 'Darkvision, See Invisibility, or Read Languages.' }],
            14: [{ name: 'Greater Portent', description: 'Roll three d20s for Portent.' }]
        } 
    },
    { 
        name: 'Evoker', 
        description: 'Create explosive elemental effects.', 
        features: { 
            3: [{ name: 'Potent Cantrip', description: 'Cantrips deal half damage on miss/save.' }, { name: 'Evocation Savant', description: 'Two free Evocation spells in book.' }],
            6: [{ name: 'Sculpt Spells', description: 'Protect allies from your Evocation spells.' }],
            10: [{ name: 'Empowered Evocation', description: 'Add INT to one damage roll.' }],
            14: [{ name: 'Overchannel', description: 'Max damage on level 1-5 spell. Take damage on reuse.' }]
        } 
    },
    { 
        name: 'Illusionist', 
        description: 'Weave subtle spells of deception.', 
        features: { 
            3: [{ name: 'Improved Illusions', description: 'Illusion spells have no Verbal components and +60ft range. Minor Illusion has sound+image.' }, { name: 'Illusion Savant', description: 'Two free Illusion spells in book.' }],
            6: [{ name: 'Phantasmal Creatures', description: 'Summon spells can be cast as Illusions (Spectral, half HP, flexible).' }],
            10: [{ name: 'Illusory Self', description: 'Reaction to make attack miss automatically.' }],
            14: [{ name: 'Illusory Reality', description: 'Make an illusion object real for 1 minute.' }]
        } 
    }
  ]
};

export const getLevelData = (className: string, level: number): { features: string[], asi: boolean, subclass: boolean } => {
    const progression = CLASS_PROGRESSION[className] || {};
    const features = progression[level] || [];
    let asi = [4, 8, 12, 16, 19].includes(level);
    if (className === 'Fighter' && [6, 14].includes(level)) asi = true;
    if (className === 'Rogue' && level === 10) asi = true;
    const subclass = level === 3;
    return { features, asi, subclass };
};
