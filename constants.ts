import { Character } from "./types";

const GENERIC_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export const MOCK_CHARACTERS: Character[] = [
  {
    id: "demo-monk",
    name: "Aurelius el Piadoso",
    level: 9,
    class: "Monk",
    subclass: "Warrior of Mercy",
    species: "Aasimar",
    background: "Hermit",
    alignment: "Lawful Neutral",
    hp: { current: 66, max: 66, temp: 0 },
    ac: 18,
    init: 5,
    speed: 45,
    profBonus: 4,
    stats: { STR: 10, DEX: 20, CON: 14, INT: 10, WIS: 16, CHA: 12 },
    skills: ["Acrobatics", "Athletics", "Insight", "Stealth", "Medicine", "Religion"],
    languages: ["Common", "Celestial"],
    feats: ["Mobile"],
    imageUrl: GENERIC_AVATAR,
    inventory: [
      { id: "m1", name: "Unarmed Strike", quantity: 1, equipped: true },
      { id: "m2", name: "Dagger", quantity: 1, equipped: true },
      { id: "m3", name: "Herbalism Kit", quantity: 1, equipped: false }
    ],
    notes: [{ id: "n-monk-1", title: "Juramento de Sanación", content: "Mis manos pueden tanto arrebatar la vida como restaurarla. Debo mantener el equilibrio.", date: "15/06/2024" }]
  },
  {
    id: "demo-wizard",
    name: "Xalyth el Sabio",
    level: 9,
    class: "Wizard",
    subclass: "Abjurer",
    species: "Elf",
    background: "Sage",
    alignment: "Neutral Good",
    hp: { current: 56, max: 56, temp: 0 },
    ac: 15,
    init: 3,
    speed: 30,
    profBonus: 4,
    stats: { STR: 8, DEX: 16, CON: 14, INT: 20, WIS: 12, CHA: 10 },
    skills: ["Arcana", "History", "Insight", "Investigation", "Perception"],
    languages: ["Common", "Elvish", "Draconic", "Celestial"],
    feats: ["Magic Initiate (Wizard)", "Keen Mind"],
    imageUrl: GENERIC_AVATAR,
    inventory: [
      { id: "w1", name: "Quarterstaff", quantity: 1, equipped: true },
      { id: "w2", name: "Dagger", quantity: 2, equipped: false },
      { id: "a1", name: "Bracers of Defense", quantity: 1, equipped: true }
    ],
    preparedSpells: ["Shield", "Misty Step", "Fireball", "Counterspell", "Banishment", "Cone of Cold"],
    notes: [{ id: "n1", title: "Misión Arvana", content: "Recuperar el tomo de los siete vientos.", date: "10/05/2024" }]
  },
  {
    id: "demo-fighter",
    name: "Thrain Martillo Hierro",
    level: 9,
    class: "Fighter",
    subclass: "Champion",
    species: "Dwarf",
    background: "Soldier",
    alignment: "Lawful Good",
    hp: { current: 94, max: 94, temp: 0 },
    ac: 20,
    init: 0,
    speed: 25,
    profBonus: 4,
    stats: { STR: 20, DEX: 10, CON: 18, INT: 8, WIS: 12, CHA: 10 },
    skills: ["Athletics", "Intimidation", "Perception", "Survival"],
    languages: ["Common", "Dwarvish"],
    feats: ["Heavy Armor Master", "Tough"],
    imageUrl: GENERIC_AVATAR,
    inventory: [
      { id: "f1", name: "Plate Armor", quantity: 1, equipped: true },
      { id: "f2", name: "Shield", quantity: 1, equipped: true },
      { id: "f3", name: "Warhammer +1", quantity: 1, equipped: true }
    ],
    notes: []
  },
  {
    id: "demo-rogue",
    name: "Viper",
    level: 9,
    class: "Rogue",
    subclass: "Assassin",
    species: "Human",
    background: "Criminal",
    alignment: "Chaotic Neutral",
    hp: { current: 67, max: 67, temp: 0 },
    ac: 17,
    init: 9,
    speed: 30,
    profBonus: 4,
    stats: { STR: 10, DEX: 20, CON: 14, INT: 14, WIS: 10, CHA: 12 },
    skills: ["Acrobatics", "Deception", "Insight", "Investigation", "Sleight of Hand", "Stealth", "Perception"],
    languages: ["Common", "Thieves' Cant", "Undercommon"],
    feats: ["Alert", "Skilled"],
    imageUrl: GENERIC_AVATAR,
    inventory: [
      { id: "r1", name: "Studded Leather Armor", quantity: 1, equipped: true },
      { id: "r2", name: "Shortsword", quantity: 2, equipped: true },
      { id: "r3", name: "Shortbow", quantity: 1, equipped: true }
    ],
    notes: []
  },
  {
    id: "demo-sorcerer",
    name: "Kaelen Sangre Dragón",
    level: 9,
    class: "Sorcerer",
    subclass: "Draconic Sorcery",
    species: "Tiefling",
    background: "Charlatan",
    alignment: "Neutral",
    hp: { current: 75, max: 75, temp: 0 },
    ac: 18,
    init: 2,
    speed: 30,
    profBonus: 4,
    stats: { STR: 8, DEX: 14, CON: 16, INT: 10, WIS: 10, CHA: 20 },
    skills: ["Arcana", "Deception", "Persuasion", "Religion"],
    languages: ["Common", "Infernal", "Draconic"],
    feats: ["Elemental Adept", "War Caster"],
    metamagics: ["Quickened Spell", "Twinned Spell"],
    imageUrl: GENERIC_AVATAR,
    inventory: [
      { id: "s1", name: "Dagger", quantity: 1, equipped: true },
      { id: "s2", name: "Ring of Protection", quantity: 1, equipped: true }
    ],
    preparedSpells: ["Fire Bolt", "Shield", "Scorching Ray", "Fireball", "Dimension Door", "Hold Monster"],
    notes: []
  },
  {
    id: "demo-paladin",
    name: "Valerius el Brillante",
    level: 9,
    class: "Paladin",
    subclass: "Oath of Devotion",
    species: "Aasimar",
    background: "Acolyte",
    alignment: "Lawful Good",
    hp: { current: 85, max: 85, temp: 0 },
    ac: 21,
    init: -1,
    speed: 30,
    profBonus: 4,
    stats: { STR: 18, DEX: 8, CON: 16, INT: 10, WIS: 12, CHA: 18 },
    skills: ["Athletics", "Insight", "Medicine", "Persuasion", "Religion"],
    languages: ["Common", "Celestial"],
    feats: ["Inspiring Leader", "Shield Master"],
    imageUrl: GENERIC_AVATAR,
    inventory: [
      { id: "p1", name: "Plate Armor", quantity: 1, equipped: true },
      { id: "p2", name: "Shield", quantity: 1, equipped: true },
      { id: "p3", name: "Longsword", quantity: 1, equipped: true }
    ],
    preparedSpells: ["Bless", "Cure Wounds", "Lesser Restoration", "Revivify"],
    notes: []
  }
];

export const MAP_TEXTURE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCci_9LlzLBRVKMl1mc_U-PI7pOA37e5v9j0IBVPIWRTYMaSEvDrM1dNax_MOPK-cvdJKWHInGTW3RUm3dfYRMTZ5897zlqHPcb4EgyRbBn918kFop8Q7PDDdLrBSMF1NifHl7bvNMqa0jmiqxcY36X3xpBWnBZYFL42kFa8rqcCl9HKLdzHTFmAStCV2e9bZm1NjB_czY2xLfbStx3TdJheuPvI3tPOG8DwFefJ1fFM3ocgOa04FuaZHvYn0RBqQHqDyx1Tt2TSSf8";

// Map raw data names to UI elements (Colors, Icons, Roles)
export const CLASS_UI_MAP: Record<string, { role: string, color: string, icon: string }> = {
  "Barbarian": { role: "Tanque de Furia", color: "text-orange-600", icon: "swords" },
  "Bard": { role: "Apoyo y Control", color: "text-purple-500", icon: "music_note" },
  "Cleric": { role: "Curación Divina", color: "text-yellow-500", icon: "verified_user" },
  "Druid": { role: "Naturaleza y Formas", color: "text-green-600", icon: "forest" },
  "Fighter": { role: "Maestro de Armas", color: "text-red-500", icon: "sports_martial_arts" },
  "Monk": { role: "Artes Marciales", color: "text-blue-400", icon: "self_improvement" },
  "Paladin": { role: "Guerrero Santo", color: "text-yellow-600", icon: "shield" },
  "Ranger": { role: "Explorador", color: "text-emerald-500", icon: "radar" },
  "Rogue": { role: "Sigilo y Daño", color: "text-slate-400", icon: "visibility_off" },
  "Sorcerer": { role: "Magia Innata", color: "text-red-400", icon: "local_fire_department" },
  "Warlock": { role: "Pacto Arcano", color: "text-purple-700", icon: "skull" },
  "Wizard": { role: "Maestro Arcano", color: "text-blue-600", icon: "auto_fix_high" },
};

export const SPECIES_UI_MAP: Record<string, { color: string, icon: string }> = {
  "Human": { color: "text-blue-500", icon: "accessibility_new" },
  "Elf": { color: "text-green-500", icon: "eco" },
  "Dwarf": { color: "text-orange-600", icon: "construction" },
  "Halfling": { color: "text-yellow-500", icon: "directions_walk" },
  "Dragonborn": { color: "text-red-600", icon: "local_fire_department" },
  "Gnome": { color: "text-purple-500", icon: "psychology" },
  "Orc": { color: "text-emerald-700", icon: "fitness_center" },
  "Tiefling": { color: "text-rose-500", icon: "contrast" },
  "Aasimar": { color: "text-amber-400", icon: "flare" },
  "Goliath": { color: "text-slate-500", icon: "landscape" },
};

export const BACKGROUND_UI_MAP: Record<string, { color: string, icon: string }> = {
  'Acolyte': { color: 'text-yellow-500', icon: 'self_improvement' },
  'Artisan': { color: 'text-orange-500', icon: 'handyman' },
  'Charlatan': { color: 'text-purple-500', icon: 'theater_comedy' },
  'Criminal': { color: 'text-slate-500', icon: 'visibility_off' },
  'Entertainer': { color: 'text-pink-500', icon: 'music_note' },
  'Farmer': { color: 'text-green-600', icon: 'agriculture' },
  'Guard': { color: 'text-blue-600', icon: 'local_police' },
  'Guide': { color: 'text-emerald-500', icon: 'map' },
  'Hermit': { color: 'text-teal-600', icon: 'nature_people' },
  'Merchant': { color: 'text-amber-500', icon: 'storefront' },
  'Noble': { color: 'text-indigo-500', icon: 'diamond' },
  'Sage': { color: 'text-blue-400', icon: 'menu_book' },
  'Sailor': { color: 'text-cyan-500', icon: 'sailing' },
  'Scribe': { color: 'text-slate-600', icon: 'edit_note' },
  'Soldier': { color: 'text-red-600', icon: 'shield' },
  'Wayfarer': { color: 'text-lime-600', icon: 'hiking' }
};