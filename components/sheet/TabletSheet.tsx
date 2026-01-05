
import React, { useState, useMemo } from 'react';
import { Character, SheetTab } from '../../types';
import CombatTab from './CombatTab';
import InventoryTab from './InventoryTab';
import SpellsTab from './SpellsTab';
import FeaturesTab from './FeaturesTab';
import NotesTab from './NotesTab';
import { getEffectiveCasterType } from '../../utils/sheetUtils';

interface TabletSheetProps {
    character: Character;
    onBack: () => void;
    onUpdate: (char: Character) => void;
}

const TabletSheet: React.FC<TabletSheetProps> = ({ character, onBack, onUpdate }) => {
    // La columna derecha rotará entre las pestañas secundarias, la izquierda será fija con combate
    const [activeTab, setActiveTab] = useState<SheetTab>('features');
    
    const casterType = getEffectiveCasterType(character);
    const isCaster = casterType !== 'none' || (character.preparedSpells && character.preparedSpells.length > 0);

    // Pestañas para el panel derecho (excluimos combate porque ya está fijo a la izquierda)
    const tabs = [
        { id: 'features', icon: 'stars', label: 'Rasgos' },
        { id: 'spells', icon: 'auto_stories', label: 'Conjuros', disabled: !isCaster },
        { id: 'inventory', icon: 'backpack', label: 'Inventario' },
        { id: 'notes', icon: 'edit_note', label: 'Notas' },
    ];

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden pt-[env(safe-area-inset-top)]">
            {/* COLUMNA IZQUIERDA: Combate (Persistente) */}
            <aside className="w-[42%] min-w-[400px] max-w-[480px] flex flex-col border-r border-slate-200 dark:border-white/5 bg-white/40 dark:bg-surface-dark/10 backdrop-blur-sm shadow-xl z-10">
                <div className="p-4 border-b border-slate-200 dark:border-white/5 shrink-0 bg-white/50 dark:bg-surface-dark/30">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onBack} 
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">arrow_back</span>
                        </button>
                        <div className="flex items-center gap-3 min-w-0">
                            <div 
                                className="size-11 rounded-xl bg-cover bg-center border-2 border-white dark:border-white/10 shadow-sm shrink-0"
                                style={{ backgroundImage: `url(${character.imageUrl})` }}
                            ></div>
                            <div className="truncate">
                                <h2 className="text-lg font-bold leading-tight text-slate-900 dark:text-white truncate">{character.name}</h2>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Combate • Lvl {character.level}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <CombatTab character={character} onUpdate={onUpdate} />
                </div>
            </aside>

            {/* COLUMNA DERECHA: Navegable (Con diseño de tabs móvil) */}
            <main className="flex-1 flex flex-col relative bg-background-light dark:bg-background-dark">
                {/* Contenido Dinámico */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                    <div className="max-w-4xl mx-auto py-2">
                        {activeTab === 'features' && <FeaturesTab character={character} />}
                        {activeTab === 'spells' && <SpellsTab character={character} onUpdate={onUpdate} />}
                        {activeTab === 'inventory' && <InventoryTab character={character} onUpdate={onUpdate} />}
                        {activeTab === 'notes' && <NotesTab character={character} onUpdate={onUpdate} />}
                    </div>
                </div>

                {/* NAVEGACIÓN ESTILO MÓVIL (Ajustada al panel derecho) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 w-fit">
                    <div className="bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.15)] p-1.5 flex items-center gap-1.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => !tab.disabled && setActiveTab(tab.id as SheetTab)}
                                disabled={tab.disabled}
                                className={`flex items-center justify-center gap-2 h-12 rounded-full transition-all duration-300 overflow-hidden ${
                                    activeTab === tab.id 
                                        ? 'text-white bg-primary shadow-lg shadow-primary/25 px-6' 
                                        : `text-slate-400 dark:text-slate-500 w-12 hover:bg-black/5 dark:hover:bg-white/5 ${tab.disabled ? 'opacity-20 cursor-not-allowed' : ''}`
                                }`}
                            >
                                <span className="material-symbols-outlined text-[24px] shrink-0">{tab.icon}</span>
                                {activeTab === tab.id && (
                                    <span className="text-xs font-black uppercase tracking-wider whitespace-nowrap">{tab.label}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TabletSheet;
