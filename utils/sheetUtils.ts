
import { Character, InventoryItem, Ability, ItemData, ArmorData } from '../types';
import { ALL_ITEMS, MAGIC_ITEMS } from '../Data/items';
import { CLASS_SAVING_THROWS } from '../Data/characterOptions';

export const SCHOOL_THEMES: Record<string, { text: string, bg: string, border: string, icon: string }> = {
    'Abjuration': { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'shield' },
    'Conjuration': { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: 'apps' },
    'Divination': { text: 'text-indigo-300', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: 'visibility' },
    'Enchantment': { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: 'favorite' },
    'Evocation': { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'local_fire_department' },
    'Illusion': { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'auto_fix' },
    'Necromancy': { text: 'text-lime-400', bg: 'bg-lime-500/10', border: 'border-lime-500/20', icon: 'skull' },
    'Transmutation': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'change_circle' },
};

const DAMAGE_COLORS: Record<string, string> = {
    'Acid': 'text-lime-500 bg-lime-500/10 border-lime-500/20',
    'Bludgeoning': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    'Cold': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    'Fire': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    'Force': 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
    'Lightning': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    'Necrotic': 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20',
    'Piercing': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    'Poison': 'text-green-500 bg-green-500/10 border-green-500/20',
    'Psychic': 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    'Radiant': 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    'Slashing': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    'Thunder': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

const DAMAGE_ICONS: Record<string, string> = {
    'Acid': 'science',
    'Bludgeoning': 'hammer',
    'Cold': 'ac_unit',
    'Fire': 'local_fire_department',
    'Force': 'stars',
    'Lightning': 'flash_on',
    'Necrotic': 'skull',
    'Piercing': 'play_for_work',
    'Poison': 'coronavirus',
    'Psychic': 'psychology',
    'Radiant': 'sunny',
    'Slashing': 'content_cut',
    'Thunder': 'volume_up',
};

export const getItemData = (name: string): ItemData | undefined => {
    if (ALL_ITEMS[name]) return ALL_ITEMS[name];
    const match = name.match(/^(.*?) \((\d+)\)$/);
    if (match && ALL_ITEMS[match[1]]) return ALL_ITEMS[match[1]];
    return undefined;
};

export const formatModifier = (val: number) => `${val >= 0 ? '+' : ''}${val}`;

export const formatShort = (text: string) => {
    return text
        .replace('Bonus Action', 'Bonus')
        .replace('Action', '1 Act')
        .replace('Reaction', 'Reac')
        .replace('minutes', 'min')
        .replace('hours', 'h')
        .replace('feet', 'ft')
        .replace('Self', 'Self')
        .replace('Touch', 'Touch');
};

export const getSpellSummary = (description: string, school: string) => {
    // 1. Detect Damage
    const damageRegex = /(\d+d\d+)(\s+\+\s+\d+)?\s+(Acid|Bludgeoning|Cold|Fire|Force|Lightning|Necrotic|Piercing|Poison|Psychic|Radiant|Slashing|Thunder)\s+damage/i;
    const dmgMatch = description.match(damageRegex);
    if (dmgMatch) {
        const type = dmgMatch[3].charAt(0).toUpperCase() + dmgMatch[3].slice(1).toLowerCase();
        const colorClass = DAMAGE_COLORS[type] || 'text-red-400 bg-red-500/10 border-red-500/20';
        const icon = DAMAGE_ICONS[type] || 'swords';
        return { 
            classes: colorClass,
            icon: icon,
            label: `${dmgMatch[1]} ${type}`
        };
    }

    // 2. Detect Healing
    const healRegex = /(?:regains?|restore)\s+(\d+d\d+)(\s+\+\s+\w+)?\s+hit\s+points/i;
    const healMatch = description.match(healRegex);
    if (healMatch) {
        return { 
            classes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
            icon: 'healing',
            label: `${healMatch[1]} Heal`
        };
    }

    // 3. Detect Conditions (CC)
    const conditions = ['Charmed', 'Frightened', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious', 'Blinded', 'Deafened', 'Incapacitated', 'Invisible'];
    for (const cond of conditions) {
        if (description.includes(cond + ' condition') || description.includes('is ' + cond)) {
            let icon = 'error';
            if (cond === 'Invisible') icon = 'visibility_off';
            else if (cond === 'Charmed') icon = 'favorite';
            else if (cond === 'Frightened') icon = 'sentiment_very_dissatisfied';
            else if (cond === 'Prone') icon = 'download';
            
            return {
                classes: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                icon: icon,
                label: cond
            };
        }
    }

    // 4. Detect Buffs
    if (description.includes('Advantage') || description.includes('+') && (description.includes('AC') || description.includes('bonus'))) {
        return {
            classes: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            icon: 'arrow_upward',
            label: 'Buff'
        };
    }

    // 5. Fallback to School
    const theme = SCHOOL_THEMES[school] || { 
        text: 'text-slate-400', 
        bg: 'bg-slate-100 dark:bg-white/5', 
        border: 'border-slate-200 dark:border-white/5', 
        icon: 'auto_stories' 
    };
    return { 
        classes: `${theme.text} ${theme.bg} ${theme.border}`,
        icon: theme.icon,
        label: school
    };
};

export const getEffectiveCasterType = (character: Character): 'full' | 'half' | 'third' | 'pact' | 'none' => {
    if (character.class === 'Warlock') return 'pact';
    if (['Cleric', 'Druid', 'Bard', 'Sorcerer', 'Wizard'].includes(character.class)) return 'full';
    if (['Paladin', 'Ranger'].includes(character.class)) return 'half';
    if (['Eldritch Knight', 'Arcane Trickster'].includes(character.subclass || '')) return 'third';
    return 'none';
};

export const getFinalStats = (character: Character): Record<string, number> => {
    const stats = { ...character.stats };
    if (character.class === 'Barbarian' && character.level >= 20) {
        stats.STR = (stats.STR || 10) + 4;
        stats.CON = (stats.CON || 10) + 4;
    }
    if (character.class === 'Monk' && character.level >= 20) {
        stats.DEX = (stats.DEX || 10) + 4;
        stats.WIS = (stats.WIS || 10) + 4;
    }

    const equippedNames = (character.inventory || []).filter(i => i.equipped).map(i => i.name);
    
    if (equippedNames.includes('Belt of Dwarvenkind')) stats.CON = Math.min(20, (stats.CON || 10) + 2);
    if (equippedNames.includes('Book of Exalted Deeds')) stats.WIS = Math.min(24, (stats.WIS || 10) + 2);
    if (equippedNames.includes('Manual of Bodily Health')) stats.CON = Math.min(30, (stats.CON || 10) + 2);
    if (equippedNames.includes('Manual of Gainful Exercise')) stats.STR = Math.min(30, (stats.STR || 10) + 2);
    if (equippedNames.includes('Manual of Quickness of Action')) stats.DEX = Math.min(30, (stats.DEX || 10) + 2);
    if (equippedNames.includes('Tome of Clear Thought')) stats.INT = Math.min(30, (stats.INT || 10) + 2);
    if (equippedNames.includes('Tome of Leadership and Influence')) stats.CHA = Math.min(30, (stats.CHA || 10) + 2);
    if (equippedNames.includes('Tome of Understanding')) stats.WIS = Math.min(30, (stats.WIS || 10) + 2);

    if (equippedNames.includes('Ioun Stone (Agility)')) stats.DEX = Math.min(20, (stats.DEX || 10) + 2);
    if (equippedNames.includes('Ioun Stone (Fortitude)')) stats.CON = Math.min(20, (stats.CON || 10) + 2);
    if (equippedNames.includes('Ioun Stone (Insight)')) stats.WIS = Math.min(20, (stats.WIS || 10) + 2);
    if (equippedNames.includes('Ioun Stone (Intellect)')) stats.INT = Math.min(20, (stats.INT || 10) + 2);
    if (equippedNames.includes('Ioun Stone (Leadership)')) stats.CHA = Math.min(20, (stats.CHA || 10) + 2);
    if (equippedNames.includes('Ioun Stone (Strength)')) stats.STR = Math.min(20, (stats.STR || 10) + 2);
    
    if (equippedNames.includes('Gauntlets of Ogre Power')) stats.STR = Math.max(stats.STR, 19);
    if (equippedNames.includes('Headband of Intellect')) stats.INT = Math.max(stats.INT, 19);
    if (equippedNames.includes('Amulet of Health')) stats.CON = Math.max(stats.CON, 19);
    
    if (equippedNames.includes('Belt of Giant Strength (Hill)')) stats.STR = Math.max(stats.STR, 21);
    if (equippedNames.includes('Belt of Giant Strength (Frost)')) stats.STR = Math.max(stats.STR, 23);
    if (equippedNames.includes('Belt of Giant Strength (Stone)')) stats.STR = Math.max(stats.STR, 23);
    if (equippedNames.includes('Belt of Giant Strength (Fire)')) stats.STR = Math.max(stats.STR, 25);
    if (equippedNames.includes('Belt of Giant Strength (Cloud)')) stats.STR = Math.max(stats.STR, 27);
    if (equippedNames.includes('Belt of Giant Strength (Storm)')) stats.STR = Math.max(stats.STR, 29);

    if (equippedNames.includes('Potion of Giant Strength (Hill)')) stats.STR = Math.max(stats.STR, 21);
    if (equippedNames.includes('Potion of Giant Strength (Frost)')) stats.STR = Math.max(stats.STR, 23);
    if (equippedNames.includes('Potion of Giant Strength (Stone)')) stats.STR = Math.max(stats.STR, 23);
    if (equippedNames.includes('Potion of Giant Strength (Fire)')) stats.STR = Math.max(stats.STR, 25);
    if (equippedNames.includes('Potion of Giant Strength (Cloud)')) stats.STR = Math.max(stats.STR, 27);
    if (equippedNames.includes('Potion of Giant Strength (Storm)')) stats.STR = Math.max(stats.STR, 29);

    if (equippedNames.includes('Thunderous Greatclub')) stats.STR = Math.max(stats.STR, 20);
    if (equippedNames.some(n => n.includes('Hand of Vecna'))) stats.STR = Math.max(stats.STR, 20);

    return stats;
};

export const getSavingThrowBonus = (character: Character): number => {
    let bonus = 0;
    const inventory = character.inventory || [];
    
    inventory.forEach(item => {
        if (!item.equipped) return;
        if (item.name === 'Ring of Protection') bonus += 1;
        if (item.name === 'Cloak of Protection') bonus += 1;
        if (item.name === 'Stone of Good Luck') bonus += 1;
        if (item.name === 'Robe of Stars') bonus += 1;
        if (item.name === 'Scarab of Protection') bonus += 1;
    });
    
    return bonus;
};

export const getArmorClass = (character: Character, finalStats: Record<string, number>) => {
    const dexMod = Math.floor(((finalStats.DEX || 10) - 10) / 2);
    const chaMod = Math.floor(((finalStats.CHA || 10) - 10) / 2);
    let ac = 10 + dexMod;
    let hasArmor = false;
    let hasShield = false;
    let shieldBonus = 0;
    let magicBonus = 0;

    (character.inventory || []).forEach(item => {
        if (!item.equipped) return;
        const itemData = getItemData(item.name);
        if (!itemData) return;

        if (itemData.type === 'Armor') {
            const armorData = itemData as ArmorData;
            if (armorData.armorType === 'Shield') {
                shieldBonus += armorData.baseAC;
                hasShield = true;
            } else {
                hasArmor = true;
                let mod = dexMod;
                if (armorData.maxDex !== undefined) {
                    mod = Math.min(mod, armorData.maxDex);
                }
                ac = armorData.baseAC + mod;
            }
        }

        if (item.name === 'Ring of Protection') magicBonus += 1;
        if (item.name === 'Cloak of Protection') magicBonus += 1;
        if (item.name === 'Ioun Stone (Protection)') magicBonus += 1;
        if (item.name.includes('Armor +1')) magicBonus += 1; 
        if (item.name.includes('Armor +2')) magicBonus += 2; 
        if (item.name.includes('Armor +3')) magicBonus += 3; 
        if (item.name === 'Animated Shield' && item.equipped) shieldBonus += 2; 
    });

    if (!hasArmor) {
        if (character.class === 'Barbarian') {
            const conMod = Math.floor(((finalStats.CON || 10) - 10) / 2);
            ac = 10 + dexMod + conMod;
        } else if (character.class === 'Monk' && !hasShield) {
            const wisMod = Math.floor(((finalStats.WIS || 10) - 10) / 2);
            ac = 10 + dexMod + wisMod;
        } else if (character.class === 'Sorcerer' && character.subclass === 'Draconic Sorcery') {
            ac = 10 + dexMod + chaMod;
        }

        const equippedNames = (character.inventory || []).filter(i => i.equipped).map(i => i.name);
        if (equippedNames.includes('Bracers of Defense') && !hasShield) {
            magicBonus += 2;
        }
    }

    const hasDefenseStyle = character.feats.some(f => f.includes('Fighting Style: Defense') || f.includes('Defense'));
    if (hasDefenseStyle && hasArmor) ac += 1;

    return ac + shieldBonus + magicBonus;
};
