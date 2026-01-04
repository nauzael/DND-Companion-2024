
import { Ability, SpellDetail } from '../types';
import { CANTRIPS } from './spells/cantrips';
import { LEVEL1 } from './spells/level1';
import { LEVEL2 } from './spells/level2';
import { LEVEL3 } from './spells/level3';
import { LEVEL4 } from './spells/level4';
import { LEVEL5 } from './spells/level5';
import { LEVEL6 } from './spells/level6';
import { LEVEL7 } from './spells/level7';
import { LEVEL8 } from './spells/level8';
import { LEVEL9 } from './spells/level9';

export const ARCANE_SPELLS = [
  'Acid Splash', 'Blade Ward', 'Chill Touch', 'Dancing Lights', 'Eldritch Blast', 'Elementalism', 'Fire Bolt', 'Friends', 'Light', 'Mage Hand', 'Mending', 'Message', 'Mind Sliver', 'Minor Illusion', 'Poison Spray', 'Prestidigitation', 'Ray of Frost', 'Shocking Grasp', 'Sorcerous Burst', 'Thunderclap', 'Toll the Dead', 'True Strike', 'Vicious Mockery',
  'Alarm', 'Animal Friendship', 'Armor of Agathys', 'Arms of Hadar', 'Bane', 'Burning Hands', 'Charm Person', 'Chromatic Orb', 'Color Spray', 'Command', 'Comprehend Languages', 'Cure Wounds', 'Detect Magic', 'Disguise Self', 'Dissonant Whispers', 'Expeditious Retreat', 'Faerie Fire', 'False Life', 'Feather Fall', 'Find Familiar', 'Fog Cloud', 'Grease', 'Healing Word', 'Hellish Rebuke', 'Heroism', 'Hex', 'Ice Knife', 'Identify', 'Illusory Script', 'Jump', 'Longstrider', 'Mage Armor', 'Magic Missile', 'Protection from Evil and Good', 'Ray of Sickness', 'Shield', 'Silent Image', 'Sleep', 'Speak with Animals', 'Tasha\'s Hideous Laughter', 'Tenser\'s Floating Disk', 'Thunderwave', 'Unseen Servant', 'Witch Bolt',
  'Aid', 'Alter Self', 'Animal Messenger', 'Arcane Lock', 'Arcane Vigor', 'Augury', 'Blindness/Deafness', 'Blur', 'Calm Emotions', 'Cloud of Daggers', 'Continual Flame', 'Crown of Madness', 'Darkness', 'Darkvision', 'Detect Thoughts', 'Dragon\'s Breath', 'Enhance Ability', 'Enlarge/Reduce', 'Enthrall', 'Flaming Sphere', 'Gentle Repose', 'Gust of Wind', 'Heat Metal', 'Hold Person', 'Invisibility', 'Knock', 'Levitate', 'Locate Object', 'Magic Mouth', 'Magic Weapon', 'Melf\'s Acid Arrow', 'Mind Spike', 'Mirror Image', 'Misty Step', 'Moonbeam', 'Nystul\'s Magic Aura', 'Phantasmal Force', 'Ray of Enfeeblement', 'Rope Trick', 'Scorching Ray', 'See Invisibility', 'Shatter', 'Silence', 'Spider Climb', 'Suggestion', 'Web', 'Zone of Truth',
  'Animate Dead', 'Bestow Curse', 'Blink', 'Clairvoyance', 'Counterspell', 'Dispel Magic', 'Elemental Weapon', 'Fear', 'Feign Death', 'Fireball', 'Fly', 'Gaseous Form', 'Glyph of Warding', 'Haste', 'Hunger of Hadar', 'Hypnotic Pattern', 'Leomund\'s Tiny Hut', 'Lightning Bolt', 'Magic Circle', 'Major Image', 'Mass Healing Word', 'Nondetection', 'Phantom Steed', 'Protection from Energy', 'Remove Curse', 'Sending', 'Sleet Storm', 'Slow', 'Speak with Dead', 'Stinking Cloud', 'Summon Fey', 'Summon Undead', 'Tongues', 'Vampiric Touch', 'Water Breathing',
  'Arcane Eye', 'Banishment', 'Blight', 'Charm Monster', 'Compulsion', 'Confusion', 'Control Water', 'Dimension Door', 'Dominate Beast', 'Evard\'s Black Tentacles', 'Fabricate', 'Fire Shield', 'Fount of Moonlight', 'Greater Invisibility', 'Hallucinatory Terrain', 'Ice Storm', 'Jallarzi\'s Storm of Radiance', 'Legend Lore', 'Leomund\'s Secret Chest', 'Locate Creature', 'Mordenkainen\'s Faithful Hound', 'Mordenkainen\'s Private Sanctum', 'Otiluke\'s Resilient Sphere', 'Phantasmal Killer', 'Polymorph', 'Stoneskin', 'Summon Aberration', 'Summon Construct', 'Summon Elemental', 'Synaptic Static', 'Telekinesis', 'Teleportation Circle', 'Vitriolic Sphere', 'Wall of Fire', 'Wall of Force', 'Wall of Stone', 'Yolande\'s Regal Presence',
  'Animate Objects', 'Bigby\'s Hand', 'Circle of Power', 'Cloudkill', 'Cone of Cold', 'Conjure Elemental', 'Contact Other Plane', 'Creation', 'Dominate Person', 'Dream', 'Geas', 'Hold Monster', 'Legend Lore', 'Mass Cure Wounds', 'Mislead', 'Modify Memory', 'Passwall', 'Planar Binding', 'Rary\'s Telepathic Bond', 'Scrying', 'Seeming', 'Steel Wind Strike', 'Summon Fiend', 'Sunbeam', 'Synaptic Static', 'Telekinesis', 'Teleportation Circle', 'Wall of Force', 'Wall of Stone',
  'Arcane Gate', 'Chain Lightning', 'Circle of Death', 'Contingency', 'Create Undead', 'Disintegrate', 'Drawmij\'s Instant Summons', 'Eyebite', 'Flesh to Stone', 'Globe of Invulnerability', 'Guards and Wards', 'Heroes\' Feast', 'Magic Jar', 'Mass Suggestion', 'Move Earth', 'Otiluke\'s Freezing Sphere', 'Otto\'s Irresistible Dance', 'Programmed Illusion', 'Sunbeam', 'Tasha\'s Bubbling Cauldron', 'True Seeing', 'Wall of Ice',
  'Delayed Blast Fireball', 'Etherealness', 'Finger of Death', 'Forcecage', 'Mirage Arcane', 'Mordenkainen\'s Magnificent Mansion', 'Mordenkainen\'s Sword', 'Plane Shift', 'Power Word Fortify', 'Prismatic Spray', 'Project Image', 'Reverse Gravity', 'Sequester', 'Simulacrum', 'Symbol', 'Teleport',
  'Antimagic Field', 'Antipathy/Sympathy', 'Befuddlement', 'Clone', 'Control Weather', 'Demiplane', 'Dominate Monster', 'Glibness', 'Incendiary Cloud', 'Maze', 'Mind Blank', 'Power Word Stun', 'Sunburst', 'Telepathy',
  'Astral Projection', 'Foresight', 'Gate', 'Imprisonment', 'Meteor Swarm', 'Power Word Heal', 'Power Word Kill', 'Prismatic Wall', 'Shapechange', 'Time Stop', 'True Polymorph', 'Weird', 'Wish'
];

export const DIVINE_SPELLS = [
  'Guidance', 'Light', 'Resistance', 'Sacred Flame', 'Spare the Dying', 'Thaumaturgy', 'Toll the Dead', 'Word of Radiance',
  'Bane', 'Bless', 'Command', 'Compelled Duel', 'Cure Wounds', 'Detect Evil and Good', 'Detect Magic', 'Detect Poison and Disease', 'Divine Favor', 'Divine Smite', 'Guiding Bolt', 'Healing Word', 'Heroism', 'Inflict Wounds', 'Protection from Evil and Good', 'Purify Food and Drink', 'Sanctuary', 'Searing Smite', 'Shield of Faith', 'Thunderous Smite', 'Wrathful Smite',
  'Aid', 'Augury', 'Blindness/Deafness', 'Calm Emotions', 'Continual Flame', 'Enhance Ability', 'Find Steed', 'Find Traps', 'Gentle Repose', 'Hold Person', 'Lesser Restoration', 'Locate Object', 'Magic Weapon', 'Prayer of Healing', 'Protection from Poison', 'Shining Smite', 'Silence', 'Spiritual Weapon', 'Warding Bond', 'Zone of Truth',
  'Animate Dead', 'Aura of Vitality', 'Beacon of Hope', 'Bestow Curse', 'Blinding Smite', 'Clairvoyance', 'Create Food and Water', 'Crusader\'s Mantle', 'Daylight', 'Dispel Magic', 'Feign Death', 'Glyph of Warding', 'Magic Circle', 'Mass Healing Word', 'Meld into Stone', 'Planar Ally', 'Protection from Energy', 'Remove Curse', 'Revivify', 'Sending', 'Speak with Dead', 'Spirit Guardians', 'Tongues', 'Water Walk',
  'Aura of Life', 'Aura of Purity', 'Banishment', 'Control Water', 'Death Ward', 'Divination', 'Freedom of Movement', 'Guardian of Faith', 'Locate Creature', 'Staggering Smite', 'Stone Shape',
  'Circle of Power', 'Commune', 'Contagion', 'Destructive Wave', 'Dispel Evil and Good', 'Flame Strike', 'Geas', 'Greater Restoration', 'Hallow', 'Insect Plague', 'Legend Lore', 'Mass Cure Wounds', 'Planar Binding', 'Raise Dead', 'Scrying', 'Summon Celestial', 'Sunbeam',
  'Blade Barrier', 'Create Undead', 'Forbiddance', 'Harm', 'Heal', 'Heroes\' Feast', 'Planar Ally', 'Sunbeam', 'True Seeing', 'Word of Recall',
  'Conjure Celestial', 'Divine Word', 'Etherealness', 'Fire Storm', 'Plane Shift', 'Power Word Fortify', 'Regenerate', 'Resurrection', 'Symbol',
  'Antimagic Field', 'Control Weather', 'Earthquake', 'Holy Aura', 'Sunburst',
  'Astral Projection', 'Gate', 'Mass Heal', 'Power Word Heal', 'True Resurrection'
];

export const PRIMAL_SPELLS = [
  'Druidcraft', 'Elementalism', 'Guidance', 'Poison Spray', 'Produce Flame', 'Resistance', 'Shillelagh', 'Starry Wisp', 'Thorn Whip', 'Thunderclap',
  'Animal Friendship', 'Create or Destroy Water', 'Cure Wounds', 'Detect Magic', 'Detect Poison and Disease', 'Entangle', 'Faerie Fire', 'Fog Cloud', 'Goodberry', 'Healing Word', 'Ice Knife', 'Jump', 'Longstrider', 'Protection from Evil and Good', 'Purify Food and Drink', 'Speak with Animals', 'Thunderwave',
  'Aid', 'Animal Messenger', 'Barkskin', 'Beast Sense', 'Darkvision', 'Enhance Ability', 'Enlarge/Reduce', 'Find Traps', 'Flame Blade', 'Flaming Sphere', 'Gust of Wind', 'Heat Metal', 'Hold Person', 'Lesser Restoration', 'Locate Animals or Plants', 'Locate Object', 'Moonbeam', 'Pass without Trace', 'Protection from Poison', 'Spike Growth', 'Summon Beast',
  'Aura of Vitality', 'Call Lightning', 'Conjure Animals', 'Conjure Barrage', 'Daylight', 'Dispel Magic', 'Elemental Weapon', 'Feign Death', 'Lightning Arrow', 'Meld into Stone', 'Plant Growth', 'Protection from Energy', 'Revivify', 'Sleet Storm', 'Speak with Plants', 'Summon Fey', 'Water Breathing', 'Water Walk', 'Wind Wall',
  'Blight', 'Charm Monster', 'Confusion', 'Conjure Minor Elementals', 'Conjure Woodland Beings', 'Control Water', 'Dominate Beast', 'Fire Shield', 'Fount of Moonlight', 'Freedom of Movement', 'Giant Insect', 'Grasping Vine', 'Hallucinatory Terrain', 'Ice Storm', 'Locate Creature', 'Polymorph', 'Stone Shape', 'Stoneskin', 'Summon Elemental', 'Swift Quiver', 'Wall of Fire',
  'Antilife Shell', 'Awaken', 'Commune with Nature', 'Cone of Cold', 'Conjure Elemental', 'Contagion', 'Geas', 'Greater Restoration', 'Insect Plague', 'Mass Cure Wounds', 'Planar Binding', 'Reincarnate', 'Scrying', 'Tree Stride', 'Wall of Stone',
  'Conjure Fey', 'Find the Path', 'Flesh to Stone', 'Heal', 'Heroes\' Feast', 'Move Earth', 'Sunbeam', 'Transport via Plants', 'Wall of Thorns', 'Wind Walk',
  'Fire Storm', 'Mirage Arcane', 'Plane Shift', 'Regenerate', 'Reverse Gravity', 'Symbol',
  'Animal Shapes', 'Antipathy/Sympathy', 'Befuddlement', 'Control Weather', 'Earthquake', 'Incendiary Cloud', 'Sunburst', 'Tsunami',
  'Foresight', 'Shapechange', 'Storm of Vengeance', 'True Resurrection'
];

export const SPELL_LIST_BY_CLASS: Record<string, string[]> = {
    'Bard': ARCANE_SPELLS,
    'Cleric': DIVINE_SPELLS,
    'Druid': PRIMAL_SPELLS,
    'Paladin': DIVINE_SPELLS,
    'Ranger': PRIMAL_SPELLS,
    'Sorcerer': ARCANE_SPELLS,
    'Warlock': ARCANE_SPELLS,
    'Wizard': ARCANE_SPELLS,
};

export const SPELLCASTING_ABILITY: Record<string, Ability> = {
    'Bard': 'CHA',
    'Cleric': 'WIS',
    'Druid': 'WIS',
    'Paladin': 'CHA',
    'Ranger': 'WIS',
    'Sorcerer': 'CHA',
    'Warlock': 'CHA',
    'Wizard': 'INT',
};

export const CASTER_TYPE: Record<string, 'full' | 'half' | 'pact' | 'none'> = {
    'Barbarian': 'none', 'Bard': 'full', 'Cleric': 'full', 'Druid': 'full',
    'Fighter': 'none', 'Monk': 'none', 'Paladin': 'half', 'Ranger': 'half',
    'Rogue': 'none', 'Sorcerer': 'full', 'Warlock': 'pact', 'Wizard': 'full',
};

export const MAX_SPELL_LEVEL: Record<'full' | 'half' | 'pact', Record<number, number>> = {
    'full': { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6, 13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9, 19: 9, 20: 9, },
    'half': { 1: 0, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3, 12: 3, 13: 4, 14: 4, 15: 4, 16: 4, 17: 5, 18: 5, 19: 5, 20: 5, },
    'pact': { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5, }
};

export const CANTRIPS_KNOWN_BY_LEVEL: Record<string, Record<number, number>> = {
    'Bard': { 1: 2, 4: 3, 10: 4},
    'Cleric': { 1: 3, 4: 4, 10: 5},
    'Druid': { 1: 2, 4: 3, 10: 4},
    'Sorcerer': { 1: 4, 4: 5, 10: 6},
    'Warlock': { 1: 2, 4: 3, 10: 4},
    'Wizard': { 1: 3, 4: 4, 10: 5},
};

export const SPELLS_KNOWN_BY_LEVEL: Record<string, Record<number, number>> = {
    'Bard': { 1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 13, 11: 14, 12: 14, 13: 15, 14: 15, 15: 16, 16: 16, 17: 17, 18: 17, 19: 18, 20: 18 },
    'Ranger': { 1: 0, 2: 2, 3: 3, 4: 3, 5: 4, 6: 4, 7: 5, 8: 5, 9: 6, 10: 6, 11: 7, 12: 7, 13: 8, 14: 8, 15: 9, 16: 9, 17: 10, 18: 10, 19: 11, 20: 11 },
    'Sorcerer': { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 12, 13: 13, 14: 13, 15: 14, 16: 14, 17: 15, 18: 15, 19: 15, 20: 15 },
    'Warlock': { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 10, 11: 11, 12: 11, 13: 12, 14: 12, 15: 13, 16: 13, 17: 14, 18: 14, 19: 15, 20: 15 }
};

export const PREPARED_CASTERS = ['Cleric', 'Druid', 'Paladin', 'Wizard'];

// Aggregate all spell details into a single lookup object
export const SPELL_DETAILS: Record<string, SpellDetail> = {
  ...CANTRIPS,
  ...LEVEL1,
  ...LEVEL2,
  ...LEVEL3,
  ...LEVEL4,
  ...LEVEL5,
  ...LEVEL6,
  ...LEVEL7,
  ...LEVEL8,
  ...LEVEL9
};
