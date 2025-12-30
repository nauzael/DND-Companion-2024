import React, { useState } from 'react';
import { Character, SheetTab } from '../types';
import { ALL_WEAPONS } from '../Data/items';
import { SPELL_DETAILS } from '../Data/spells';

interface SheetTabsProps {
  character: Character;
  onBack: () => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({ character, onBack }) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('combat');

  const renderCombat = () => (
    <div className="px-4 pb-24">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 my-4">
        {[
          { icon: "shield", label: "AC", value: character.ac, color: "text-primary" },
          { icon: "bolt", label: "Init", value: `${character.init >= 0 ? '+' : ''}${character.init}`, color: "text-yellow-500" },
          { icon: "sprint", label: "Spd", value: character.speed, color: "text-blue-400" },
          { icon: "school", label: "Prof", value: `+${character.profBonus}`, color: "text-purple-400" },
        ].map(stat => (
           <div key={stat.label} className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-surface-dark p-3 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className={`material-symbols-outlined mb-1 ${stat.color} text-[20px]`}>{stat.icon}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <span className="text-xl font-bold dark:text-white text-slate-900 leading-none mt-1">{stat.value}</span>
           </div>
        ))}
      </div>

      {/* HP Section */}
      <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 mb-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Hit Points</span>
            <span className="text-2xl font-bold dark:text-white text-slate-900 leading-none">{character.hp.current} <span className="text-base font-normal text-slate-400">/ {character.hp.max}</span></span>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center justify-center size-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">remove</span></button>
             <button className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-black transition-colors"><span className="material-symbols-outlined text-[18px]">add</span></button>
          </div>
        </div>
        <div className="relative h-3 w-full rounded-full bg-slate-100 dark:bg-black/40 overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: `${(character.hp.current / character.hp.max) * 100}%` }}></div>
        </div>
        <div className="flex justify-between items-center text-xs mt-1">
          <span className="text-blue-400 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">shield_moon</span> Temp HP: {character.hp.temp}</span>
          <span className="text-slate-400 dark:text-slate-500">Hit Dice: {character.level}d8</span>
        </div>
      </div>

      {/* Weapons (Using real data sample) */}
      <div className="flex items-center justify-between group cursor-pointer mb-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weapons</h3>
        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add_circle</span>
      </div>
      <div className="flex flex-col gap-3 pb-6">
         {/* Sample weapons for display purposes */}
         {['Longsword', 'Dagger'].map(wName => {
             const weapon = ALL_WEAPONS[wName];
             if (!weapon) return null;
             return (
             <div key={weapon.name} className="rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm ring-1 ring-slate-200 dark:ring-white/5 hover:ring-primary/50 dark:hover:ring-primary/50 transition-all">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex gap-3">
                       <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-300">
                          <span className="material-symbols-outlined text-[24px]">swords</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{weapon.name}</h4>
                          <div className="flex gap-1 mt-1 flex-wrap">
                              {weapon.properties.map(p => (
                                <span key={p} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300">{p}</span>
                              ))}
                          </div>
                       </div>
                   </div>
                   <div className="flex flex-col items-end">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</span>
                       <span className="text-sm font-medium dark:text-slate-200">{weapon.type}</span>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-primary/10 dark:hover:bg-primary/20 hover:ring-1 ring-primary/50 transition-all group">
                       <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase tracking-wider mb-1">To Hit</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">+{character.profBonus + 3}</span> 
                   </button>
                   <button className="flex flex-col items-center justify-center py-2 px-4 rounded-xl bg-slate-50 dark:bg-black/20 hover:bg-primary/10 dark:hover:bg-primary/20 hover:ring-1 ring-primary/50 transition-all group">
                       <span className="text-xs font-bold text-slate-400 group-hover:text-primary uppercase tracking-wider mb-1">Damage</span>
                       <span className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary">{weapon.damage}</span>
                       <span className="text-[10px] text-slate-400">Mastery: {weapon.mastery}</span>
                   </button>
                </div>
             </div>
         )})}
      </div>
      
      {/* Actions Horizontal Scroll */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Actions</h3>
      <div className="flex gap-3 pb-6 overflow-x-auto no-scrollbar">
         {[
           { name: "Attack", sub: "Standard", icon: "swords", color: "text-primary" },
           { name: "Dash", sub: "Double mvmt", icon: "sprint", color: "text-blue-400" },
           { name: "Disengage", sub: "Avoid OA", icon: "directions_run", color: "text-purple-400" },
           { name: "Dodge", sub: "Disadv. to hit", icon: "shield", color: "text-yellow-400" },
         ].map(action => (
             <button key={action.name} className="flex flex-col gap-2 min-w-[100px] p-3 rounded-xl bg-white dark:bg-surface-dark ring-1 ring-slate-200 dark:ring-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left">
                <span className={`material-symbols-outlined ${action.color} text-[24px]`}>{action.icon}</span>
                <div>
                   <span className="block text-sm font-bold dark:text-white">{action.name}</span>
                   <span className="text-[10px] text-slate-500">{action.sub}</span>
                </div>
             </button>
         ))}
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="flex flex-col gap-5 px-4 pb-24">
       {/* Encumbrance */}
       <div className="pt-4">
           <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                 <label className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Encumbrance</label>
                 <span className="text-slate-800 dark:text-white text-sm font-medium"><span className="text-primary">68</span> / 150 lbs</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-surface-dark rounded-full overflow-hidden">
                 <div className="h-full bg-primary rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-body">
                 <span>Light</span><span>Heavy</span><span>Encumbered</span>
              </div>
           </div>
       </div>

       {/* Coinage */}
       <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="flex gap-3 pr-4 min-w-max">
             {[
               { l: "GP", v: 125, c: "text-amber-400" },
               { l: "SP", v: 42, c: "text-slate-400" },
               { l: "CP", v: 15, c: "text-orange-700" },
               { l: "EP", v: 0, c: "text-blue-300", o: "opacity-60" },
               { l: "PP", v: 2, c: "text-slate-200", o: "opacity-60" }
             ].map(c => (
                <div key={c.l} className={`flex flex-col items-center justify-center min-w-[72px] p-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm ${c.o || ''}`}>
                   <span className={`${c.c} text-sm font-bold`}>{c.l}</span>
                   <span className="text-slate-800 dark:text-white text-lg font-bold">{c.v}</span>
                </div>
             ))}
          </div>
       </div>

       {/* Items */}
       <div>
           <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 pl-1">Weapons & Armor</h3>
           <div className="flex flex-col gap-3">
              <div className="group relative flex items-center gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform">
                 <div className="size-12 rounded-lg bg-gray-100 dark:bg-black/40 flex items-center justify-center shrink-0 text-slate-600 dark:text-white relative overflow-hidden">
                    <span className="material-symbols-outlined relative z-10">swords</span>
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <p className="text-slate-900 dark:text-white font-semibold truncate">Longsword</p>
                       <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">EQUIPPED</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-body truncate">1d8 slashing, Versatile (1d10)</p>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    <button className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">3 lb</span>
                 </div>
              </div>
           </div>
       </div>
    </div>
  );

  const renderSpells = () => (
    <div className="flex flex-col gap-6 px-4 pb-24">
       {/* Stats */}
       <div className="grid grid-cols-3 gap-3 mt-4">
           <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 p-3 items-center text-center shadow-sm">
              <p className="text-primary tracking-tight text-2xl font-bold leading-none">+{Math.floor((character.stats.INT - 10) / 2)}</p>
              <div className="flex items-center gap-1 opacity-80">
                 <span className="material-symbols-outlined text-gray-500 dark:text-slate-400 text-[16px]">psychology</span>
                 <p className="text-gray-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">MOD</p>
              </div>
           </div>
           <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border-2 border-primary/20 dark:border-primary/30 p-3 items-center text-center shadow-sm relative overflow-hidden">
              <p className="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-none">{8 + character.profBonus + Math.floor((character.stats.INT - 10) / 2)}</p>
              <div className="flex items-center gap-1 opacity-80 z-10">
                 <span className="material-symbols-outlined text-gray-500 dark:text-slate-400 text-[16px]">shield</span>
                 <p className="text-gray-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Save DC</p>
              </div>
           </div>
           <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 p-3 items-center text-center shadow-sm">
              <p className="text-primary tracking-tight text-2xl font-bold leading-none">+{character.profBonus + Math.floor((character.stats.INT - 10) / 2)}</p>
              <div className="flex items-center gap-1 opacity-80">
                 <span className="material-symbols-outlined text-gray-500 dark:text-slate-400 text-[16px]">swords</span>
                 <p className="text-gray-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Attack</p>
              </div>
           </div>
       </div>

       {/* Slot Tracker */}
       <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end px-1">
             <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">Spell Slots (Level 1)</h3>
             <button className="text-xs text-primary font-medium hover:underline">Reset All</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
             {[1, 2, 3, 4].map(i => (
                 <label key={i} className="group relative flex flex-col items-center justify-center gap-2 cursor-pointer">
                    <input type="checkbox" className="peer sr-only" defaultChecked={i <= 2} />
                    <div className="h-12 w-full rounded-lg border-2 border-gray-300 dark:border-white/10 bg-white dark:bg-surface-dark peer-checked:bg-primary/10 peer-checked:border-primary transition-all flex items-center justify-center">
                       <span className="material-symbols-outlined text-transparent peer-checked:text-primary scale-0 peer-checked:scale-100 transition-transform duration-300">bolt</span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{i === 1 ? '1st' : i === 2 ? '2nd' : i === 3 ? '3rd' : '4th'}</span>
                 </label>
             ))}
          </div>
       </div>

       {/* Spells List - Dynamic */}
       <div className="flex flex-col gap-4 mt-2">
           {['Magic Missile', 'Cure Wounds', 'Shield'].map(spellName => {
               const spell = SPELL_DETAILS[spellName];
               if (!spell) return null;
               return (
               <div key={spellName} className="relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm">
                  <div className="p-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-gray-900 dark:text-white text-lg font-bold">{spell.name}</h3>
                              <span className="material-symbols-outlined text-primary text-[16px]" title="Prepared">check_circle</span>
                          </div>
                          <p className="text-primary text-xs font-bold uppercase tracking-wide">Level {spell.level} {spell.school}</p>
                      </div>
                      <button className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                      </button>
                  </div>
                  <div className="grid grid-cols-3 border-y border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 text-xs">
                      <div className="p-2 flex flex-col items-center justify-center gap-1 border-r border-gray-100 dark:border-white/5"><span className="material-symbols-outlined text-gray-400 text-[16px]">timer</span><span className="text-gray-600 dark:text-slate-300 font-medium text-center">{spell.castingTime}</span></div>
                      <div className="p-2 flex flex-col items-center justify-center gap-1 border-r border-gray-100 dark:border-white/5"><span className="material-symbols-outlined text-gray-400 text-[16px]">straighten</span><span className="text-gray-600 dark:text-slate-300 font-medium text-center">{spell.range}</span></div>
                      <div className="p-2 flex flex-col items-center justify-center gap-1"><span className="material-symbols-outlined text-gray-400 text-[16px]">science</span><span className="text-gray-600 dark:text-slate-300 font-medium text-center">{spell.components}</span></div>
                  </div>
                  <div className="p-4 pt-3">
                      <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {spell.description}
                      </p>
                  </div>
                  <div className="px-4 pb-4">
                      <button className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-primary hover:bg-primary/90 text-background-dark font-bold text-sm transition-colors">
                          <span className="material-symbols-outlined text-[18px]">auto_fix</span>
                          Cast Spell
                      </button>
                  </div>
               </div>
           )})}
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full min-h-screen relative bg-background-light dark:bg-background-dark">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-4 h-16 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full active:bg-black/5 dark:active:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
             <h1 className="text-lg font-bold tracking-tight leading-none">{character.name}</h1>
             <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{character.species} {character.class} {character.level}</span>
        </div>
        <button className="text-primary font-semibold text-sm px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors">
            Edit
        </button>
      </nav>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
         {activeTab === 'combat' && renderCombat()}
         {activeTab === 'inventory' && renderInventory()}
         {activeTab === 'spells' && renderSpells()}
      </main>

      {/* Bottom Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-white/5 px-6 py-3 flex justify-around items-center max-w-md mx-auto">
         <button onClick={() => setActiveTab('combat')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'combat' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
             <span className={`material-symbols-outlined text-[24px] ${activeTab==='combat' ? 'fill-current' : ''}`}>swords</span>
             <span className="text-[10px] font-bold">Combat</span>
         </button>
         <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'inventory' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
             <span className={`material-symbols-outlined text-[24px] ${activeTab==='inventory' ? 'fill-current' : ''}`}>backpack</span>
             <span className="text-[10px] font-bold">Inv</span>
         </button>
         <button onClick={() => setActiveTab('spells')} className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'spells' ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}>
             <span className={`material-symbols-outlined text-[24px] ${activeTab==='spells' ? 'fill-current' : ''}`}>auto_stories</span>
             <span className="text-[10px] font-bold">Spells</span>
         </button>
      </nav>
    </div>
  );
};

export default SheetTabs;