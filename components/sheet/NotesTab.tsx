
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Character, NoteItem } from '../../types';

interface NotesTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
}

// Sub-component for individual note interaction and auto-sizing
const NoteCard: React.FC<{
    note: NoteItem;
    onUpdate: (id: string, field: keyof NoteItem, value: string) => void;
    onDelete: (id: string) => void;
}> = ({ note, onUpdate, onDelete }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize logic
    const adjustHeight = () => {
        const element = textareaRef.current;
        if (element) {
            element.style.height = 'auto'; // Reset to calculate shrink
            element.style.height = `${element.scrollHeight}px`; // Set to content height
        }
    };

    // Adjust height on mount and whenever content changes
    useLayoutEffect(() => {
        adjustHeight();
    }, [note.content]);

    return (
        <div className="relative group bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300 hover:shadow-md overflow-hidden">
            {/* Decorative Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-primary/40"></div>
            
            <div className="flex justify-between items-start mb-3 pl-3">
                <input 
                    type="text" 
                    placeholder="Sin Título"
                    value={note.title}
                    onChange={(e) => onUpdate(note.id, 'title', e.target.value)}
                    className="bg-transparent border-none p-0 text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 w-full mr-2"
                />
                <button 
                    onClick={() => onDelete(note.id)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-300 hover:text-red-500 -mt-1 -mr-1 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    title="Eliminar nota"
                >
                    <span className="material-symbols-outlined text-xl">delete</span>
                </button>
            </div>
            
            <textarea
                ref={textareaRef}
                value={note.content}
                onChange={(e) => onUpdate(note.id, 'content', e.target.value)}
                className="w-full bg-transparent border-none p-0 pl-3 text-sm leading-7 text-slate-600 dark:text-slate-300 placeholder:text-slate-400/50 dark:placeholder:text-slate-600/50 focus:ring-0 resize-none overflow-hidden font-body"
                placeholder="Escribe aquí tus aventuras..."
                spellCheck={false}
                rows={1}
            />
            
            <div className="flex justify-end mt-2 pt-3 border-t border-slate-50 dark:border-white/5 pl-3">
                <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">calendar_today</span>
                    {note.date}
                </span>
            </div>
        </div>
    );
};

const NotesTab: React.FC<NotesTabProps> = ({ character, onUpdate }) => {
    // State to hold the array of notes.
    const [notesList, setNotesList] = useState<NoteItem[]>(() => {
        const raw = character.notes as unknown;
        if (Array.isArray(raw)) return raw as NoteItem[];
        if (typeof raw === 'string' && (raw as string).trim().length > 0) {
            return [{
                id: 'legacy-note',
                title: 'Notas Generales',
                content: raw as string,
                date: new Date().toLocaleDateString()
            }];
        }
        return [];
    });

    // Debounce save logic
    useEffect(() => {
        const handler = setTimeout(() => {
            onUpdate({ ...character, notes: notesList });
        }, 800);

        return () => clearTimeout(handler);
    }, [notesList]); 

    const addNote = () => {
        const newNote: NoteItem = {
            id: `note-${Date.now()}`,
            title: '',
            content: '',
            date: new Date().toLocaleDateString()
        };
        setNotesList([newNote, ...notesList]);
    };

    const deleteNote = (id: string) => {
        if (window.confirm("¿Borrar esta nota?")) {
            setNotesList(prev => prev.filter(n => n.id !== id));
        }
    };

    const updateNote = (id: string, field: keyof NoteItem, value: string) => {
        setNotesList(prev => prev.map(n => 
            n.id === id ? { ...n, [field]: value } : n
        ));
    };

    return (
        <div className="flex flex-col h-full px-4 pb-24 pt-4 min-h-[80vh]">
            {/* Header with improved styling */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-sm border border-amber-200/50 dark:border-amber-700/20">
                        <span className="material-symbols-outlined text-2xl">edit_note</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-xl leading-tight">Diario</h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tus crónicas y secretos.</p>
                    </div>
                </div>
                <button 
                    onClick={addNote}
                    className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
                    title="Nueva Nota"
                >
                    <span className="material-symbols-outlined text-2xl">add</span>
                </button>
            </div>

            {/* List Area */}
            <div className="flex-1 space-y-4">
                {notesList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40 select-none">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">history_edu</span>
                        </div>
                        <p className="text-base font-bold text-slate-500 dark:text-slate-400">Página en blanco</p>
                        <p className="text-sm text-slate-400 text-center mt-1">Toca el botón + para empezar a escribir.</p>
                    </div>
                )}

                {notesList.map((note) => (
                    <NoteCard 
                        key={note.id} 
                        note={note} 
                        onUpdate={updateNote} 
                        onDelete={deleteNote} 
                    />
                ))}
            </div>
        </div>
    );
};

export default NotesTab;
