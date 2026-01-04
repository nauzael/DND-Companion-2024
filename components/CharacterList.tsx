
import React, { useState, useRef } from 'react';
import { Character } from '../types';

interface CharacterListProps {
  characters: Character[];
  onCreate: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, onCreate, onSelect, onDelete, onExport, onImport }) => {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col h-full min-h-screen pb-24 relative">
      {/* Header with Safe Area Padding */}
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between p-4">
          <div className="w-10"></div> {/* Spacer */}
          <div className="text-center">
            <h2 className="text-2xl font-bold leading-tight tracking-tight">Personajes</h2>
            <p className="text-xs font-medium text-slate-500 dark:text-primary/80 mt-0.5">D&D 2024 Edition</p>
          </div>
          <div className="w-10 flex justify-end relative">
            <button 
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">settings</span>
            </button>
            
            {showMenu && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-40 animate-fadeIn">
                        <button 
                            onClick={() => { onExport(); setShowMenu(false); }} 
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-white/5"
                        >
                            <span className="material-symbols-outlined text-lg text-primary">download</span> 
                            Exportar Datos
                        </button>
                        <button 
                            onClick={() => { fileInputRef.current?.click(); setShowMenu(false); }} 
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200"
                        >
                            <span className="material-symbols-outlined text-lg text-green-500">upload</span> 
                            Importar Datos
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>
      </header>

      {/* Hidden Input for Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onImport} 
        className="hidden" 
        accept=".json" 
      />

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-4">
        {characters.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 h-[60vh] opacity-50">
                <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-full mb-4">
                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">person_add</span>
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Sin Personajes</h3>
                <p className="text-sm text-slate-400 text-center max-w-[200px] mt-1">
                    Tu lista está vacía. Crea un nuevo héroe para comenzar tu aventura.
                </p>
            </div>
        )}

        {characters.map((char) => (
          <article 
            key={char.id}
            onClick={() => onSelect(char.id)}
            className="group relative flex items-center gap-4 bg-card-light dark:bg-surface-dark p-3 rounded-2xl shadow-sm border border-transparent hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {/* Avatar */}
            <div className="relative shrink-0">
              <div 
                className="h-16 w-16 rounded-xl bg-center bg-cover border-2 border-slate-100 dark:border-slate-700 shadow-inner" 
                style={{ backgroundImage: `url("${char.imageUrl}")` }}
              ></div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 ring-2 ring-card-light dark:ring-surface-dark">
                 <span className={`material-symbols-outlined text-[14px] ${char.class === 'Paladin' ? 'text-yellow-500' : char.class === 'Wizard' ? 'text-purple-400' : char.class === 'Barbarian' ? 'text-red-500' : 'text-slate-400'}`}>
                    {char.class === 'Paladin' ? 'shield' : char.class === 'Wizard' ? 'auto_fix_high' : char.class === 'Barbarian' ? 'swords' : 'visibility_off'}
                 </span>
              </div>
            </div>
            {/* Content */}
            <div className="flex flex-1 flex-col justify-center min-w-0 z-10">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white truncate pr-2">{char.name}</h3>
                <span className="shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-primary/20 text-xs font-bold text-slate-600 dark:text-primary">
                  Lvl {char.level}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{char.class} <span className="text-slate-300 dark:text-slate-600">•</span> {char.subclass || 'Base'}</p>
              <div className="flex gap-3 mt-2">
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> HP {char.hp.max}
                </div>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> AC {char.ac}
                </div>
              </div>
            </div>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(char.id);
                }}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors z-10"
                title="Borrar personaje"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </article>
        ))}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-6 z-30 mb-[env(safe-area-inset-bottom)]">
        <button 
            onClick={onCreate}
            className="group flex items-center justify-center gap-2 h-14 pl-4 pr-6 bg-primary text-background-dark rounded-full shadow-[0_8px_30px_rgb(53,158,255,0.4)] hover:scale-105 hover:bg-white hover:text-background-dark transition-all duration-300"
        >
          <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-300">add</span>
          <span className="text-base font-bold">Crear Personaje</span>
        </button>
      </div>
    </div>
  );
};

export default CharacterList;
