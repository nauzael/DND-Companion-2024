
import { Character } from "./types";

export const MOCK_CHARACTERS: Character[] = [];

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
