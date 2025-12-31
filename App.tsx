
import React, { useState, useEffect } from 'react';
import { Character, ViewState } from './types';
import { MOCK_CHARACTERS } from './constants';
import CharacterList from './components/CharacterList';
import CreatorSteps from './components/CreatorSteps';
import SheetTabs from './components/SheetTabs';

const STORAGE_KEY = 'dnd-companion-characters-v1';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  
  // Initialize characters from localStorage or fallback to MOCK_CHARACTERS
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error al cargar personajes del almacenamiento local:", e);
    }
    return MOCK_CHARACTERS;
  });
  
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

  // Sync characters to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters]);

  const activeCharacter = characters.find(c => c.id === activeCharacterId) || characters[0];

  const handleCreateNew = () => {
    setView('create');
  };

  const handleSelectCharacter = (id: string) => {
    setActiveCharacterId(id);
    setView('sheet');
  };

  const handleDeleteCharacter = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres borrar este personaje permanentemente?")) {
      setCharacters(prev => prev.filter(c => c.id !== id));
      if (activeCharacterId === id) setActiveCharacterId(null);
    }
  };

  const handleFinishCreation = (newChar: Character) => {
    setCharacters(prev => [newChar, ...prev]);
    setActiveCharacterId(newChar.id);
    setView('sheet');
  };

  const handleCharacterUpdate = (updatedChar: Character) => {
    setCharacters(prev => prev.map(c => c.id === updatedChar.id ? updatedChar : c));
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
      <div className="mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl min-h-screen relative overflow-hidden">
        {view === 'list' && (
          <CharacterList 
            characters={characters} 
            onCreate={handleCreateNew} 
            onSelect={handleSelectCharacter}
            onDelete={handleDeleteCharacter}
          />
        )}
        {view === 'create' && (
          <CreatorSteps 
            onBack={() => setView('list')} 
            onFinish={handleFinishCreation} 
          />
        )}
        {view === 'sheet' && activeCharacter && (
          <SheetTabs 
            character={activeCharacter} 
            onBack={() => setView('list')}
            onUpdate={handleCharacterUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default App;
