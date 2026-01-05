
import React, { useState, useEffect } from 'react';
import { Character, ViewState } from './types';
import { MOCK_CHARACTERS } from './constants';
import CharacterList from './components/CharacterList';
import CreatorSteps from './components/CreatorSteps';
import SheetTabs from './components/SheetTabs';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  
  // Initialize characters from localStorage if available, otherwise use mocks
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem('dnd-characters');
      return saved ? JSON.parse(saved) : MOCK_CHARACTERS;
    } catch (e) {
      console.error("Failed to load characters from local storage", e);
      return MOCK_CHARACTERS;
    }
  });

  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

  // Persist characters to localStorage with debounce and error handling
  useEffect(() => {
    const saveData = setTimeout(() => {
        try {
            const dataToSave = JSON.stringify(characters);
            localStorage.setItem('dnd-characters', dataToSave);
        } catch (error) {
            console.error("Failed to save characters to localStorage:", error);
            if (error instanceof Error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                alert("⚠️ ¡Alerta de Memoria! El almacenamiento local está lleno. Es posible que tus últimos cambios no se guarden. Intenta borrar personajes antiguos o usar URLs de imagen más cortas.");
            }
        }
    }, 1000); // Wait 1s after last change before saving to prevent UI freeze on rapid updates

    return () => clearTimeout(saveData);
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
    if (window.confirm("¿Estás seguro de que quieres borrar este personaje?")) {
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

  // Export Logic
  const handleExportCharacters = () => {
    // Use Blob to handle larger data and special characters correctly
    const blob = new Blob([JSON.stringify(characters, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", `dnd_characters_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  // Import Logic
  const handleImportCharacters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, "UTF-8");
      
      fileReader.onload = event => {
        try {
          if (!event.target?.result) return;
          const parsed = JSON.parse(event.target.result as string);
          
          if (Array.isArray(parsed) && parsed.every(c => c.name && c.class)) {
             // Logic flow: Merge first, if canceled, ask to replace
             if (window.confirm(`Se encontraron ${parsed.length} personajes.\n\n[Aceptar] FUSIONAR con tu lista actual (recomendado)\n[Cancelar] Ver opción de reemplazar`)) {
                 // Merge: Generate new IDs to prevent collisions
                 const newChars = parsed.map(c => ({
                     ...c, 
                     id: `imp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
                 }));
                 setCharacters(prev => [...prev, ...newChars]);
             } else {
                 // Replace
                 if (window.confirm("⚠️ OPCIÓN DESTRUCTIVA\n\n¿Quieres BORRAR tu lista actual y reemplazarla completamente con este archivo?")) {
                     setCharacters(parsed);
                 }
             }
          } else {
              alert("El archivo seleccionado no tiene el formato correcto de personajes.");
          }
        } catch (err) {
          console.error(err);
          alert("Error al leer el archivo. Asegúrate de que es un JSON válido.");
        } finally {
            // Reset input so the same file can be selected again if needed
            fileInput.value = '';
        }
      };
    }
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
            onExport={handleExportCharacters}
            onImport={handleImportCharacters}
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
