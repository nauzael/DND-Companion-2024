
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
    'Barbarian': { 2: ['Reckless Attack', 'Danger Sense'], 3: ['Primal Knowledge'], 5: ['Extra Attack', 'Fast Movement'], 7: ['Feral Instinct', 'Instinctive Pounce'], 9: ['Brutal Strike'], 11: ['Relentless Rage'], 13: ['Improved Brutal Strike'], 15: ['Persistent Rage'], 18: ['Indomitable Might'], 20: ['Primal Champion'] },
    'Bard': { 2: ['Expertise', 'Jack of All Trades'], 5: ['Font of Inspiration'], 7: ['Countercharm'], 10: ['Magical Secrets'], 18: ['Superior Inspiration'], 20: ['Words of Creation'] },
    'Cleric': { 2: ['Channel Divinity'], 5: ['Sear Undead'], 7: ['Blessed Strikes'], 10: ['Divine Intervention'], 14: ['Improved Blessed Strikes'], 20: ['Greater Divine Intervention'] },
    'Druid': { 2: ['Wild Shape', 'Wild Companion'], 5: ['Wild Resurgence'], 7: ['Elemental Fury'], 15: ['Improved Elemental Fury'], 18: ['Beast Spells'], 20: ['Archdruid'] },
    'Fighter': { 2: ['Action Surge', 'Tactical Mind'], 5: ['Extra Attack', 'Tactical Shift'], 9: ['Indomitable', 'Tactical Master'], 11: ['Two Extra Attacks'], 13: ['Studied Attacks'], 17: ['Action Surge (two uses)', 'Indomitable (three uses)'], 20: ['Three Extra Attacks'] },
    'Monk': { 2: ['Monk\'s Focus', 'Unarmored Movement', 'Uncanny Metabolism'], 3: ['Deflect Attacks'], 4: ['Slow Fall'], 5: ['Extra Attack', 'Stunning Strike'], 6: ['Empowered Strikes'], 7: ['Evasion'], 9: ['Acrobatic Movement'], 10: ['Heightened Focus', 'Self-Restoration'], 13: ['Deflect Energy'], 14: ['Disciplined Survivor'], 15: ['Perfect Focus'], 18: ['Superior Defense'], 20: ['Body and Mind'] },
    'Paladin': { 2: ['Fighting Style', 'Paladin\'s Smite'], 5: ['Extra Attack', 'Faithful Steed'], 6: ['Aura of Protection'], 9: ['Abjure Foes'], 10: ['Aura of Courage'], 11: ['Radiant Strikes'], 14: ['Restoring Touch'], 18: ['Aura Expansion'] },
    'Ranger': { 2: ['Deft Explorer', 'Fighting Style'], 5: ['Extra Attack'], 6: ['Roving'], 9: ['Expertise'], 10: ['Tireless'], 13: ['Relentless Hunter'], 14: ['Nature\'s Veil'], 17: ['Precise Hunter'], 18: ['Feral Senses'], 20: ['Foe Slayer'] },
    'Rogue': { 2: ['Cunning Action'], 3: ['Steady Aim'], 5: ['Cunning Strike', 'Uncanny Dodge'], 6: ['Expertise'], 7: ['Evasion', 'Reliable Talent'], 11: ['Improved Cunning Strike'], 14: ['Devious Strikes'], 15: ['Slippery Mind'], 18: ['Elusive'], 20: ['Stroke of Luck'] },
    'Sorcerer': { 2: ['Font of Magic', 'Metamagic'], 5: ['Sorcerous Restoration'], 7: ['Sorcery Incarnate'], 20: ['Arcane Apotheosis'] },
    'Warlock': { 2: ['Magical Cunning'], 9: ['Contact Patron'], 11: ['Mystic Arcanum (level 6)'], 13: ['Mystic Arcanum (level 7)'], 15: ['Mystic Arcanum (level 8)'], 17: ['Mystic Arcanum (level 9)'], 20: ['Eldritch Master'] },
    'Wizard': { 2: ['Scholar'], 5: ['Memorize Spell'], 18: ['Spell Mastery'], 20: ['Signature Spells'] }
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
  'Bard': { name: 'Bard', description: 'Perform spells that inspire and heal allies or beguile foes.', traits: [{ name: 'Bardic Inspiration', description: 'Bonus Action to give a die (d6) to an ally to boost d20 rolls.' }, { name: 'Spellcasting', description: 'Cast spells from the Arcane list. Charisma is your casting ability.' }] },
  'Cleric': { name: 'Cleric', description: 'Invoke divine magic to heal, bolster, and smite.', traits: [{ name: 'Spellcasting', description: 'Prepare spells from the Divine list daily. Wisdom is your casting ability.' }, { name: 'Divine Order', description: 'Choose Protector (Heavy Armor + Martial Weapons) or Thaumaturge (Extra Cantrip + Religion bonus).' }] },
  'Druid': { name: 'Druid', description: 'Channel nature magic to heal, shape-shift, and control the elements.', traits: [{ name: 'Spellcasting', description: 'Prepare Primal spells. Wisdom is your casting ability.' }, { name: 'Druidic', description: 'You know the secret language of Druids.' }, { name: 'Primal Order', description: 'Choose Magician (Extra Cantrip + Arcana/Nature) or Warden (Medium Armor + Martial Weapons).' }] },
  'Fighter': { name: 'Fighter', description: 'Master all weapons and armor.', traits: [{ name: 'Fighting Style', description: 'Adopt a style like Archery, Defense, or Great Weapon Fighting.' }, { name: 'Second Wind', description: 'Bonus Action to regain HP (1d10 + level). Uses vary by level.' }, { name: 'Weapon Mastery', description: 'Master 3 weapons to use their tactical properties.' }] },
  'Monk': { name: 'Monk', description: 'Dart in and out of melee while striking fast and hard.', traits: [{ name: 'Martial Arts', description: 'Use DEX for Monk weapons/unarmed. Bonus Action unarmed strike. Martial Arts Die.' }, { name: 'Unarmored Defense', description: 'AC equals 10 + DEX mod + WIS mod.' }, { name: 'Monk\'s Focus', description: 'Focus Points to fuel Flurry of Blows, Patient Defense, and Step of the Wind.' }] },
  'Paladin': { name: 'Paladin', description: 'Smite foes and shield allies with divine and martial might.', traits: [{ name: 'Lay On Hands', description: 'Bonus Action to heal creatures from a pool of HP.' }, { name: 'Spellcasting', description: 'Prepare Divine spells. You can change them after a Long Rest.' }, { name: 'Weapon Mastery', description: 'Master 2 weapons to use their tactical properties.' }, { name: 'Paladin\'s Smite', description: 'Always prepared Divine Smite. Cast once free per Long Rest.' }] },
  'Ranger': { name: 'Ranger', description: 'Weave together martial prowess, nature magic, and survival skills.', traits: [{ name: 'Spellcasting', description: 'Prepare Primal spells. Wisdom is your casting ability.' }, { name: 'Favored Enemy', description: 'You always have Hunter\'s Mark prepared. Cast it without a slot (limited use).' }, { name: 'Weapon Mastery', description: 'Master 2 weapons to use their tactical properties.' }] },
  'Rogue': { name: 'Rogue', description: 'Launch deadly Sneak Attacks while avoiding harm through stealth.', traits: [{ name: 'Expertise', description: 'Double proficiency bonus in two chosen skills.' }, { name: 'Sneak Attack', description: 'Deal extra damage (1d6) once per turn if you have Advantage or an ally nearby.' }, { name: 'Weapon Mastery', description: 'Master 2 weapons to use their tactical properties.' }, { name: 'Thieves\' Cant', description: 'A secret mix of dialect, jargon, and code.' }] },
  'Sorcerer': { name: 'Sorcerer', description: 'Wield magic innate to your being, shaping the power to your will.', traits: [{ name: 'Spellcasting', description: 'Cast Arcane spells spontaneously. Charisma is your casting ability.' }, { name: 'Innate Sorcery', description: 'Bonus Action to activate a rage-like state increasing spell DC and attack advantage.' }] },
  'Warlock': { name: 'Warlock', description: 'Cast spells derived from occult knowledge.', traits: [{ name: 'Eldritch Invocations', description: 'Customize your powers with unique magical fragments.' }, { name: 'Pact Magic', description: 'Spell slots are always max level and recharge on a Short Rest.' }, { name: 'Magical Cunning', description: 'Regain half your Pact Magic slots once per Long Rest (1-minute rite).' }] },
  'Wizard': { name: 'Wizard', description: 'Study arcane magic and master spells for every purpose.', traits: [{ name: 'Spellcasting', description: 'Learn Arcane spells from scrolls and your spellbook.' }, { name: 'Ritual Adept', description: 'Cast ritual spells from your book without using a spell slot.' }, { name: 'Arcane Recovery', description: 'Regain some spell slots on a Short Rest (once per day).' }] }
};

export const SUBCLASS_OPTIONS: Record<string, SubclassData[]> = {
  'Barbarian': [
    { name: 'Path of the Berserker', description: 'Unleash raw violence.', features: { 3: [{ name: 'Frenzy', description: 'If you use Reckless Attack while Raging, deal extra damage (d6s equal to Rage Damage bonus).' }] } }, 
    { name: 'Path of the Wild Heart', description: 'Manifest kinship with animals.', features: { 3: [{ name: 'Rage of the Wilds', description: 'Choose Bear (Resist all dmg but force/necro/psychic/radiant), Eagle (Disengage/Dash bonus), or Wolf (Advantage for allies).' }, { name: 'Animal Speaker', description: 'Cast Beast Sense and Speak with Animals as Rituals.' }] } }, 
    { name: 'Path of the World Tree', description: 'Tap into cosmic vitality.', features: { 3: [{ name: 'Vitality of the Tree', description: 'When you Rage, gain Temp HP. At start of turn, give Temp HP to ally.' }] } }, 
    { name: 'Path of the Zealot', description: 'Rage in union with a god.', features: { 3: [{ name: 'Divine Fury', description: 'While Raging, first hit deals extra Necrotic or Radiant damage (1d6 + 1/2 Level).' }, { name: 'Warrior of the Gods', description: 'Pool of d12s to heal yourself as Bonus Action.' }] } }
  ],
  'Bard': [
    { name: 'College of Dance', description: 'Harness agility in battle.', features: { 3: [{ name: 'Dazzling Footwork', description: 'Unarmored Defense (10+DEX+CHA). Unarmed Strikes use Bardic Die/Dex. Agile Strikes (Unarmed Strike with Bardic Inspiration).' }] } }, 
    { name: 'College of Glamour', description: 'Weave beguiling Feywild magic.', features: { 3: [{ name: 'Mantle of Inspiration', description: 'Use Bardic Inspiration to give allies Temp HP and Reaction move.' }, { name: 'Beguiling Magic', description: 'Charm Person/Mirror Image prepared. Enchantment/Illusion spells can Charm/Frighten.' }] } }, 
    { name: 'College of Lore', description: 'Collect knowledge and magical secrets.', features: { 3: [{ name: 'Cutting Words', description: 'Use Reaction and Bardic Inspiration to reduce an enemy attack, check, or damage roll.' }, { name: 'Bonus Proficiencies', description: 'Gain 3 Skill Proficiencies.' }] } }, 
    { name: 'College of Valor', description: 'Wield weapons with spells.', features: { 3: [{ name: 'Combat Inspiration', description: 'Allies can use your Inspiration to add to AC or Damage.' }, { name: 'Martial Training', description: 'Proficiency with Martial Weapons and Medium Armor/Shields.' }] } }
  ],
  'Cleric': [
    { name: 'Life Domain', description: 'Be a master of healing.', features: { 3: [{ name: 'Disciple of Life', description: 'Healing spells cure extra HP (2 + Spell Level).' }, { name: 'Preserve Life', description: 'Channel Divinity to heal injured creatures up to half HP.' }, { name: 'Life Domain Spells', description: 'Always prepared healing spells.' }] } }, 
    { name: 'Light Domain', description: 'Wield searing, warding light.', features: { 3: [{ name: 'Warding Flare', description: 'Reaction to impose Disadvantage on an attack against you.' }, { name: 'Radiance of the Dawn', description: 'Channel Divinity to deal Radiant damage to foes within 30ft.' }, { name: 'Light Domain Spells', description: 'Always prepared fire/light spells.' }] } }, 
    { name: 'Trickery Domain', description: 'Bedevil foes with mischief.', features: { 3: [{ name: 'Blessing of the Trickster', description: 'Grant Advantage on Stealth checks to another creature.' }, { name: 'Invoke Duplicity', description: 'Channel Divinity to create illusion. Cast spells from it. Advantage on attacks vs foes near it.' }, { name: 'Trickery Domain Spells', description: 'Always prepared deception spells.' }] } }, 
    { name: 'War Domain', description: 'Inspire valor and chastise foes.', features: { 3: [{ name: 'War Priest', description: 'Make a weapon attack as a Bonus Action (WIS mod times).' }, { name: 'Guided Strike', description: 'Channel Divinity to add +10 to an attack roll.' }, { name: 'War Domain Spells', description: 'Always prepared combat spells.' }] } }
  ],
  'Druid': [
    { name: 'Circle of the Land', description: 'Draw on the magic of the environment.', features: { 3: [{ name: 'Circle of the Land Spells', description: 'Always prepared spells based on chosen land type (Arid, Polar, Temperate, Tropical).' }, { name: 'Land\'s Aid', description: 'Expend Wild Shape to deal Necrotic damage and heal in an area.' }] } }, 
    { name: 'Circle of the Moon', description: 'Adopt powerful animal forms.', features: { 3: [{ name: 'Circle Forms', description: 'Combat Wild Shape as Bonus Action. AC 13+Wis. Temp HP = 3*Level.' }, { name: 'Circle of the Moon Spells', description: 'Always prepared moon spells. Cast them while Wild Shaped.' }] } }, 
    { name: 'Circle of the Sea', description: 'Channel tides and storms.', features: { 3: [{ name: 'Wrath of the Sea', description: 'Expend Wild Shape to emanate storm spray (Cold Dmg + Push).' }, { name: 'Circle of the Sea Spells', description: 'Always prepared water/storm spells.' }] } }, 
    { name: 'Circle of the Stars', description: 'Gain powers in a starry form.', features: { 3: [{ name: 'Starry Form', description: 'Expend Wild Shape to enter Archer (Bonus Attack), Chalice (Heal), or Dragon (Concentration) form.' }, { name: 'Star Map', description: 'Guidance/Guiding Bolt prepared.' }] } }
  ],
  'Fighter': [
    { name: 'Battle Master', description: 'Use special combat maneuvers.', features: { 3: [{ name: 'Combat Superiority', description: 'Gain Superiority Dice (d8) and Maneuvers (e.g., Trip Attack, Parry).' }, { name: 'Student of War', description: 'Proficiency with one Artisan Tool and one Skill.' }] } }, 
    { name: 'Champion', description: 'Strive for peak combat prowess.', features: { 3: [{ name: 'Improved Critical', description: 'Your weapon attacks score a critical hit on a roll of 19 or 20.' }, { name: 'Remarkable Athlete', description: 'Advantage on Initiative and Athletics. Crit hits allow movement.' }] } }, 
    { name: 'Eldritch Knight', description: 'Learn spells to aid in combat.', features: { 3: [{ name: 'Spellcasting', description: 'Cast Wizard spells (Level 1+).' }, { name: 'War Bond', description: 'Bond with 2 weapons, summon them as Bonus Action.' }] } }, 
    { name: 'Psi Warrior', description: 'Augment attacks with psionic power.', features: { 3: [{ name: 'Psionic Power', description: 'Psionic Energy Dice (d6). Protective Field (reduce dmg), Psionic Strike (extra dmg), Telekinetic Movement.' }] } }
  ],
  'Monk': [
    { name: 'Warrior of Mercy', description: 'Heal or harm with a touch.', features: { 3: [{ name: 'Hand of Harm', description: 'Expend Focus to deal extra Necrotic damage.' }, { name: 'Hand of Healing', description: 'Expend Focus to heal creature. Can replace Flurry attack.' }, { name: 'Implements of Mercy', description: 'Proficiency in Insight, Medicine, Herbalism Kit.' }] } }, 
    { name: 'Warrior of Shadow', description: 'Employ shadows for subterfuge.', features: { 3: [{ name: 'Shadow Arts', description: 'Expend Focus to cast Darkness. Gain Darkvision (or upgrade it). Know Minor Illusion.' }] } }, 
    { name: 'Warrior of the Elements', description: 'Wield elemental power.', features: { 3: [{ name: 'Elemental Attunement', description: 'Expend Focus for +10ft Reach and Elemental damage/push/pull.' }, { name: 'Manipulate Elements', description: 'Know Elementalism spell.' }] } }, 
    { name: 'Warrior of the Open Hand', description: 'Master unarmed combat.', features: { 3: [{ name: 'Open Hand Technique', description: 'Flurry of Blows adds Addle (No Reactions), Push (15ft), or Topple (Prone).' }] } }
  ],
  'Paladin': [
    { name: 'Oath of Devotion', description: 'Emulate the angels of justice.', features: { 3: [{ name: 'Sacred Weapon', description: 'Channel Divinity to add CHA mod to attack rolls and deal Radiant damage.' }, { name: 'Oath Spells', description: 'Always prepared protection/holy spells.' }] } }, 
    { name: 'Oath of Glory', description: 'Reach the heights of heroism.', features: { 3: [{ name: 'Peerless Athlete', description: 'Channel Divinity for Adv on Athletics/Acrobatics and jump bonus.' }, { name: 'Inspiring Smite', description: 'Divine Smite triggers Temp HP distribution.' }, { name: 'Oath Spells', description: 'Always prepared glory spells.' }] } }, 
    { name: 'Oath of the Ancients', description: 'Preserve life, joy, and nature.', features: { 3: [{ name: 'Nature\'s Wrath', description: 'Channel Divinity to restrain foes with spectral vines.' }, { name: 'Oath Spells', description: 'Always prepared nature spells.' }] } }, 
    { name: 'Oath of Vengeance', description: 'Hunt down evildoers.', features: { 3: [{ name: 'Vow of Enmity', description: 'Channel Divinity to gain Advantage on attacks against one creature.' }, { name: 'Oath Spells', description: 'Always prepared hunting/combat spells.' }] } }
  ],
  'Ranger': [
    { name: 'Beast Master', description: 'Bond with a primal beast.', features: { 3: [{ name: 'Primal Companion', description: 'Summon a Beast of the Land, Air, or Sea. Friendly, obeys commands, acts on your turn.' }] } }, 
    { name: 'Fey Wanderer', description: 'Manifest fey mirth and fury.', features: { 3: [{ name: 'Dreadful Strikes', description: 'Deal extra psychic damage once per turn.' }, { name: 'Otherworldly Glamour', description: 'Add WIS mod to Charisma checks. Gain social skill.' }, { name: 'Fey Wanderer Spells', description: 'Always prepared fey spells.' }] } }, 
    { name: 'Gloom Stalker', description: 'Hunt foes that lurk in darkness.', features: { 3: [{ name: 'Dread Ambusher', description: 'Add WIS to Initiative. First turn: +10ft speed, extra attack + 2d6 Psychic dmg.' }, { name: 'Umbral Sight', description: 'Darkvision 60ft. Invisible to Darkvision.' }, { name: 'Gloom Stalker Spells', description: 'Always prepared stealth/fear spells.' }] } }, 
    { name: 'Hunter', description: 'Protect nature with martial versatility.', features: { 3: [{ name: 'Hunter\'s Prey', description: 'Choose Colossus Slayer (hurt foes) or Horde Breaker (extra attack vs adjacent).' }, { name: 'Hunter\'s Lore', description: 'Know Immunities/Resistances/Vulnerabilities of Hunter\'s Mark target.' }] } }
  ],
  'Rogue': [
    { name: 'Arcane Trickster', description: 'Enhance stealth with spells.', features: { 3: [{ name: 'Spellcasting', description: 'Cast Wizard spells.' }, { name: 'Mage Hand Legerdemain', description: 'Invisible Mage Hand, Bonus Action control, Sleight of Hand.' }] } }, 
    { name: 'Assassin', description: 'Deliver ambushes and poison.', features: { 3: [{ name: 'Assassinate', description: 'Advantage on Initiative. Adv vs creatures who haven\'t acted. Sneak Attack adds Rogue Level dmg in first round.' }, { name: 'Assassin\'s Tools', description: 'Disguise Kit and Poisoner\'s Kit proficiency.' }] } }, 
    { name: 'Soulknife', description: 'Strike foes with psi blades.', features: { 3: [{ name: 'Psychic Blades', description: 'Manifest blades (Finesse/Thrown) to attack. 1d6/1d4 Psychic damage.' }, { name: 'Psionic Power', description: 'Energy Dice (d6). Psi-Bolstered Knack (add to failed checks), Psychic Whispers (telepathy).' }] } }, 
    { name: 'Thief', description: 'Master infiltration and treasure hunting.', features: { 3: [{ name: 'Fast Hands', description: 'Use Cunning Action for Sleight of Hand, Thieves Tools, or Use an Object.' }, { name: 'Second-Story Work', description: 'Climb speed equals walk speed. Jump with Dex.' }] } }
  ],
  'Sorcerer': [
    { name: 'Aberrant Sorcery', description: 'Use strange psionic magic.', features: { 3: [{ name: 'Psionic Spells', description: 'Learn Mind Sliver and other psionic spells.' }, { name: 'Telepathic Speech', description: 'Bonus Action to connect telepathically with a creature.' }] } }, 
    { name: 'Clockwork Sorcery', description: 'Harness cosmic forces of order.', features: { 3: [{ name: 'Clockwork Spells', description: 'Learn order-based spells.' }, { name: 'Restore Balance', description: 'Reaction to neutralize Advantage/Disadvantage.' }] } }, 
    { name: 'Draconic Sorcery', description: 'Breathe the magic of dragons.', features: { 3: [{ name: 'Draconic Resilience', description: 'AC is 10 + DEX + CHA. HP increases by 3 + Level.' }, { name: 'Draconic Spells', description: 'Learn dragon-themed spells.' }] } }, 
    { name: 'Wild Magic Sorcery', description: 'Unleash chaos magic.', features: { 3: [{ name: 'Wild Magic Surge', description: 'Roll d20 on spell cast. 20 triggers random magical effect.' }, { name: 'Tides of Chaos', description: 'Gain Advantage on one D20 Test. Next spell triggers Surge.' }] } }
  ],
  'Warlock': [
    { name: 'Archfey Patron', description: 'Teleport and wield fey magic.', features: { 3: [{ name: 'Steps of the Fey', description: 'Cast Misty Step without slot (CHA mod/day). Add effect: Refresh (Temp HP) or Taunt.' }, { name: 'Archfey Spells', description: 'Always prepared fey spells.' }] } }, 
    { name: 'Celestial Patron', description: 'Heal with heavenly magic.', features: { 3: [{ name: 'Healing Light', description: 'Pool of d6s (1+Level) to heal as Bonus Action.' }, { name: 'Celestial Spells', description: 'Always prepared holy spells.' }] } }, 
    { name: 'Fiend Patron', description: 'Call on sinister powers.', features: { 3: [{ name: 'Dark One\'s Blessing', description: 'Gain Temp HP (CHA + Level) when you reduce a hostile creature to 0 HP.' }, { name: 'Fiend Spells', description: 'Always prepared fire/destructive spells.' }] } }, 
    { name: 'Great Old One Patron', description: 'Delve into forbidden lore.', features: { 3: [{ name: 'Awakened Mind', description: 'Telepathic communication.' }, { name: 'Psychic Spells', description: 'Change dmg to Psychic. No V/S for Enchantment/Illusion.' }, { name: 'Great Old One Spells', description: 'Always prepared psychic spells.' }] } }
  ],
  'Wizard': [
    { name: 'Abjurer', description: 'Shield allies and banish foes.', features: { 3: [{ name: 'Arcane Ward', description: 'Create a magical ward that absorbs damage. Recharge with Abjuration spells.' }, { name: 'Abjuration Savant', description: 'Two free Abjuration spells in book.' }] } }, 
    { name: 'Diviner', description: 'Learn the multiverse\'s secrets.', features: { 3: [{ name: 'Portent', description: 'Roll 2d20 after Long Rest. Replace any roll with these values.' }, { name: 'Divination Savant', description: 'Two free Divination spells in book.' }] } }, 
    { name: 'Evoker', description: 'Create explosive effects.', features: { 3: [{ name: 'Potent Cantrip', description: 'Cantrips deal half damage on miss/save.' }, { name: 'Evocation Savant', description: 'Two free Evocation spells in book.' }] } }, 
    { name: 'Illusionist', description: 'Weave spells of deception.', features: { 3: [{ name: 'Improved Illusions', description: 'Illusion spells have no Verbal components and +60ft range. Minor Illusion has sound+image.' }, { name: 'Illusion Savant', description: 'Two free Illusion spells in book.' }] } }
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
