import React, { useState, useEffect, useMemo } from 'react';
import { Character, CreatorStep, Ability, Trait } from '../types';
import { MAP_TEXTURE, CLASS_UI_MAP, SPECIES_UI_MAP, BACKGROUND_UI_MAP } from '../constants';
import { 
  CLASS_LIST, 
  SPECIES_LIST, 
  BACKGROUNDS_DATA, 
  ALIGNMENTS, 
  LANGUAGES, 
  CLASS_SKILL_DATA, 
  SPECIES_DETAILS,
  CLASS_DETAILS,
  HIT_DIE,
  CLASS_STAT_PRIORITIES,
  SUBCLASS_OPTIONS,
  CLASS_PROGRESSION
} from '../Data/characterOptions';
import { FEAT_OPTIONS, GENERIC_FEATURES } from '../Data/feats';
import { SKILL_LIST } from '../Data/skills';
import { TRINKETS } from '../Data/items';

interface CreatorStepsProps {
  onBack: () => void;
  onFinish: (char: Character) => void;
}

const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

const SectionSeparator = ({ label }: { label: string }) => (
  <div className="relative py-6 flex items-center justify-center w-full px-6">
    <div className="absolute inset-0 flex items-center px-6">
      <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
    </div>
    <div className="relative flex justify-center">
      <span className="bg-background-light dark:bg-background-dark px-4 text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-white/10 rounded-full py-1 shadow-sm">
        {label}
      </span>
    </div>
  </div>
);

const CreatorSteps: React.FC<CreatorStepsProps> = ({ onBack, onFinish }) => {
  const [step, setStep] = useState<CreatorStep>(1);
  
  // Character State
  const [name, setName] = useState('');
  const [level, setLevel] = useState<number>(1);
  const [selectedClass, setSelectedClass] = useState(CLASS_LIST[0]);
  const [selectedSubclass, setSelectedSubclass] = useState<string>('');
  const [selectedSpecies, setSelectedSpecies] = useState(SPECIES_LIST[0]);
  const [selectedBackground, setSelectedBackground] = useState(Object.keys(BACKGROUNDS_DATA)[0]);
  const [selectedAlignment, setSelectedAlignment] = useState(ALIGNMENTS[0]);
  const [selectedLanguage1, setSelectedLanguage1] = useState<string>(''); 
  const [selectedLanguage2, setSelectedLanguage2] = useState<string>(''); 
  const [selectedFeat, setSelectedFeat] = useState<string>(''); 
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Stats State
  const [statMethod, setStatMethod] = useState<'pointBuy' | 'standard' | 'manual'>('pointBuy');
  // Base stats (before racial/background bonuses)
  const [baseStats, setBaseStats] = useState<Record<Ability, number>>({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });

  // Derived Data
  const speciesData = SPECIES_DETAILS[selectedSpecies];
  const classData = CLASS_DETAILS[selectedClass];
  const backgroundData = BACKGROUNDS_DATA[selectedBackground];
  const classSkillOptions = CLASS_SKILL_DATA[selectedClass];
  const availableSubclasses = useMemo(() => SUBCLASS_OPTIONS[selectedClass] || [], [selectedClass]);
  const selectedSubclassData = useMemo(() => availableSubclasses.find(s => s.name === selectedSubclass), [availableSubclasses, selectedSubclass]);

  // Calculate Final Stats (Base + Background Bonuses)
  const finalStats = useMemo(() => {
    const stats = { ...baseStats };
    backgroundData?.scores.forEach(ability => {
        stats[ability] = Math.min(20, stats[ability] + 1);
    });
    return stats;
  }, [baseStats, backgroundData]);

  // Point Buy Logic
  const usedPoints = useMemo(() => {
    return Object.values(baseStats).reduce((acc: number, val) => acc + (POINT_BUY_COSTS[val as number] || 0), 0);
  }, [baseStats]);
  
  const remainingPoints = 27 - usedPoints;

  // Effects
  useEffect(() => {
    if (speciesData?.name === 'Human') {
        if (!selectedFeat) setSelectedFeat(FEAT_OPTIONS[0].name);
    }
  }, [selectedSpecies, speciesData, selectedFeat]);

  // Auto-scroll logic (Reduced)
  useEffect(() => {
    const card = document.getElementById(`class-card-${selectedClass}`);
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedClass]);

  useEffect(() => {
    const card = document.getElementById(`species-card-${selectedSpecies}`);
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedSpecies]);

  useEffect(() => {
    const card = document.getElementById(`background-card-${selectedBackground}`);
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedBackground]);

  // Subclass auto-scroll
  useEffect(() => {
    if (selectedSubclass) {
        const card = document.getElementById(`subclass-card-${selectedSubclass}`);
        if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedSubclass]);

  // Reset skills/subclass when class changes
  useEffect(() => {
    setSelectedSkills([]);
    setSelectedSubclass('');
  }, [selectedClass]);

  // Auto-select first subclass if level >= 3 and none selected
  useEffect(() => {
    if (level >= 3 && !selectedSubclass && availableSubclasses.length > 0) {
        setSelectedSubclass(availableSubclasses[0].name);
    } else if (level < 3) {
        setSelectedSubclass('');
    }
  }, [level, availableSubclasses, selectedSubclass]);

  // Reset stats to safe defaults when method changes
  useEffect(() => {
    if (statMethod === 'pointBuy') {
        setBaseStats({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
    } else if (statMethod === 'standard') {
        setBaseStats({ STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 });
    } else if (statMethod === 'manual') {
        setBaseStats({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
    }
  }, [statMethod]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < classSkillOptions.count) {
        setSelectedSkills(prev => [...prev, skill]);
      }
    }
  };

  const handleStatChange = (stat: Ability, delta: number) => {
    if (statMethod === 'pointBuy') {
        const currentVal = baseStats[stat];
        const newVal = currentVal + delta;
        if (newVal < 8 || newVal > 15) return;
        
        const costDiff = (POINT_BUY_COSTS[newVal] - POINT_BUY_COSTS[currentVal]);
        if (remainingPoints - costDiff < 0) return;

        setBaseStats(prev => ({ ...prev, [stat]: newVal }));
    } else {
        setBaseStats(prev => ({ ...prev, [stat]: Math.max(1, Math.min(20, prev[stat] + delta)) }));
    }
  };

  const canProceed = () => {
    if (step === 4) {
        return selectedSkills.length === classSkillOptions.count;
    }
    return true;
  };

  // HP Calculation
  const calculateMaxHP = () => {
    const conMod = Math.floor((finalStats.CON - 10) / 2);
    const hitDie = HIT_DIE[selectedClass];
    // Level 1: Full Hit Die + CON
    let maxHP = hitDie + conMod;
    // Level > 1: Avg Hit Die (Die/2 + 1) + CON
    if (level > 1) {
        maxHP += (Math.floor(hitDie / 2) + 1 + conMod) * (level - 1);
    }
    return maxHP;
  };

  const generateTrinket = () => {
    const randomIndex = Math.floor(Math.random() * TRINKETS.length);
    return `Trinket: ${TRINKETS[randomIndex]}`;
  }

  const newCharacter: Character = {
    id: `c-${Date.now()}`,
    name: name || 'Heroe',
    level: level,
    class: selectedClass,
    subclass: selectedSubclass,
    species: selectedSpecies,
    background: selectedBackground,
    alignment: selectedAlignment,
    hp: { current: calculateMaxHP(), max: calculateMaxHP(), temp: 0 },
    ac: 10 + Math.floor((finalStats.DEX - 10) / 2),
    init: Math.floor((finalStats.DEX - 10) / 2),
    speed: speciesData?.speed || 30,
    profBonus: Math.ceil(1 + (level / 4)), // Approximate PB calculation
    stats: finalStats,
    skills: [...(backgroundData?.skills || []), ...selectedSkills],
    languages: ['Common', selectedLanguage1, selectedLanguage2].filter(Boolean),
    feats: [backgroundData?.feat, speciesData?.name === 'Human' ? selectedFeat : undefined].filter((f): f is string => !!f),
    inventory: [generateTrinket(), ...(backgroundData?.equipment || [])],
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZr-RDRTUNGSsd_-BR5U-r2yLkQsbKsJ6mAkTpEGl0e4IZW86PQSc2se3iegp_aML54kIgoYOyDhlwHDiNPfKasvRE8Wymti23tWDRa-QL1JZUqBNPNDJzOj5AknxSMaVS0FH7GW9srFK1u5uzt7Nb5M5LvPbaZUGy484PX685rHODXkI9CwFaha_RbMGbh-LOIz8R0OqlhyI9CDp--2zy5UhpgJ8GLuhKjmJsjCWKb-F8PJWpJtTk_3AmSP79rbDxmeLWsGsP61hv"
  };

  const nextStep = () => {
    if (!canProceed()) return;
    if (step < 5) setStep((s) => (s + 1) as CreatorStep);
    else onFinish(newCharacter);
  };
  
  const prevStep = () => {
    if (step > 1) setStep((s) => (s - 1) as CreatorStep);
    else onBack();
  };

  const renderProgressBar = () => (
    <div className="px-6 pb-2">
      <div className="flex w-full flex-row items-center justify-between gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary shadow-[0_0_10px_rgba(53,158,255,0.5)]' : 'bg-slate-300 dark:bg-surface-dark'}`}></div>
        ))}
      </div>
    </div>
  );

  const ClassProgressionList = ({ selectedClass }: { selectedClass: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="mt-6 space-y-3 px-6">
        <div className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-surface-dark overflow-hidden transition-all duration-300 shadow-sm">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-slate-50 dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                   <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                   <h3 className="text-base font-bold text-slate-900 dark:text-white">Progresión de Clase</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Ver niveles 1-20</p>
                </div>
              </div>
              <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                expand_more
              </span>
            </button>
            
            <div className={`transition-[grid-template-rows] duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="p-4 pt-2 space-y-0 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5">
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => {
                            let features: string[] = [];
                            if (lvl === 1) {
                               features = classData?.traits.map(t => t.name) || [];
                            } else {
                               features = CLASS_PROGRESSION[selectedClass]?.[lvl] || [];
                            }
                            
                            if (!features || features.length === 0) return null;

                            return (
                                <div key={lvl} className="relative pl-6 pb-6 border-l-2 border-slate-200 dark:border-slate-700 ml-2 last:border-0 last:pb-0">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${lvl <= level ? 'bg-primary border-primary' : 'bg-background-light dark:bg-background-dark border-slate-300 dark:border-slate-600'}`}></div>
                                    
                                    <div className="flex flex-col gap-1 -mt-1.5">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${lvl <= level ? 'text-primary' : 'text-slate-400'}`}>Nivel {lvl}</span>
                                        <div className="space-y-2 mt-1">
                                            {features.map(feat => {
                                                let desc = GENERIC_FEATURES?.[feat];
                                                if (lvl === 1 && !desc) {
                                                    const trait = classData?.traits.find(t => t.name === feat);
                                                    if (trait) desc = trait.description;
                                                }
                                                if (!desc && feat.includes("Subclass")) desc = "Ganás un rasgo de tu subclase elegida.";
                                                if (!desc && feat.includes("Ability Score")) desc = "Mejora una característica o elige una dote.";

                                                return (
                                                    <div key={feat} className={`bg-white dark:bg-surface-dark p-3 rounded-lg border shadow-sm ${lvl <= level ? 'border-primary/30' : 'border-slate-200 dark:border-white/5'}`}>
                                                        <span className={`block font-bold text-sm ${lvl <= level ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{feat}</span>
                                                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{desc}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-screen relative bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between p-4 pt-6 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0">
        <button onClick={prevStep} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex-1 text-center">
            {step < 5 && <h2 className="text-base font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">Paso {step} de 5</h2>}
            {step === 5 && <h2 className="text-lg font-bold">Resumen</h2>}
        </div>
        <div className="w-10"></div>
      </header>

      {step < 5 && renderProgressBar()}

      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-5">
        {step === 1 && (
            <>
                <div className="px-6 pt-3 pb-1">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                        Comienza tu <br/>
                        <span className="text-primary">Aventura</span>
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Define la identidad de tu héroe.</p>
                </div>

                <div className="px-6 mb-4 flex items-center gap-4">
                    <div className="relative shrink-0 group cursor-pointer">
                        <div className="w-20 h-20 rounded-2xl bg-surface-dark border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                            <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-primary transition-colors">add_a_photo</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background-dark">
                            <span className="material-symbols-outlined text-background-dark text-xs font-bold">edit</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nombre</label>
                        <input 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all shadow-sm" 
                            placeholder="Ej. Gandalf, Drizzt..." 
                            type="text" 
                        />
                    </div>
                </div>

                <SectionSeparator label="Clase" />

                <div className="mb-4">
                    <div className="px-6 flex justify-between items-end mb-3">
                        <h3 className="text-lg font-bold">Clase</h3>
                        <span className="text-primary text-xs font-medium">{classData?.name}</span>
                    </div>
                    
                    <div className="w-full relative group">
                        <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                        <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>

                        <div className="flex overflow-x-auto gap-4 px-6 py-6 no-scrollbar w-full snap-x snap-mandatory">
                            {CLASS_LIST.map((cls) => {
                                const ui = CLASS_UI_MAP[cls] || { role: 'Aventurero', color: 'text-slate-400', icon: 'person' };
                                const isSelected = selectedClass === cls;
                                return (
                                    <label key={cls} id={`class-card-${cls}`} className="relative shrink-0 cursor-pointer group/card snap-center scroll-m-6">
                                        <input 
                                            className="peer sr-only" 
                                            name="class" 
                                            type="radio" 
                                            checked={isSelected}
                                            onChange={() => setSelectedClass(cls)}
                                        />
                                        <div className={`
                                            w-36 h-52 rounded-3xl p-4 flex flex-col items-center justify-between transition-all duration-300 ease-out border-2
                                            ${isSelected 
                                                ? 'bg-white dark:bg-surface-dark border-primary shadow-[0_10px_30px_-10px_rgba(53,158,255,0.4)] scale-105 -translate-y-1' 
                                                : 'bg-white/60 dark:bg-surface-dark/60 border-transparent hover:border-slate-300 dark:hover:border-white/10 hover:bg-white dark:hover:bg-surface-dark shadow-sm'
                                            }
                                        `}>
                                            <div className={`
                                                w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-inner
                                                ${isSelected ? 'bg-primary/10 rotate-3' : 'bg-slate-100 dark:bg-white/5 group-hover/card:scale-110'}
                                            `}>
                                                <span className={`material-symbols-outlined text-4xl ${ui.color} transition-transform ${isSelected ? 'scale-110' : ''}`}>{ui.icon}</span>
                                            </div>
                                            
                                            <div className="text-center space-y-1 w-full">
                                                <span className={`block font-bold text-base tracking-tight truncate ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                                    {cls}
                                                </span>
                                                <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate w-full">
                                                    {ui.role}
                                                </span>
                                            </div>

                                            <div className={`
                                                absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black shadow-sm transition-all duration-300
                                                ${isSelected ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}
                                            `}>
                                                <span className="material-symbols-outlined text-sm font-bold">check</span>
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                            <div className="w-2 shrink-0"></div>
                        </div>
                    </div>

                    <div className="px-6 mt-2 space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                            {classData?.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 dark:bg-surface-dark p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Dado de Golpe</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">d{HIT_DIE[selectedClass]}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-surface-dark p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Habilidad Principal</span>
                                <span className="text-lg font-bold text-primary">{CLASS_STAT_PRIORITIES[selectedClass]?.[0]}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Rasgos de Clase</h4>
                            {classData?.traits.map(trait => (
                                <div key={trait.name} className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{trait.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{trait.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ClassProgressionList selectedClass={selectedClass} />

                    <div className="px-6 mt-4">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nivel</label>
                        <div className="relative">
                            <select
                                value={level}
                                onChange={(e) => setLevel(Number(e.target.value))}
                                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3 text-base font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 appearance-none transition-all shadow-sm"
                            >
                                {Array.from({length: 20}, (_, i) => i + 1).map(lvl => (
                                    <option key={lvl} value={lvl}>Nivel {lvl}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subclass Selection (Level 3+) */}
                {level >= 3 && availableSubclasses.length > 0 && (
                    <div className="mb-4 animate-fadeIn">
                        <SectionSeparator label="Subclase" />
                        <div className="px-6 flex flex-col items-center mb-4 text-center">
                            <h3 className="text-xl font-bold">Elige tu Camino</h3>
                            <span className="text-primary text-sm font-medium mt-1 max-w-[80%] truncate">{selectedSubclass || 'Selecciona una especialización'}</span>
                        </div>
                        
                        <div className="w-full relative group">
                            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>

                            <div className="flex overflow-x-auto gap-4 px-6 py-4 no-scrollbar w-full snap-x snap-mandatory">
                                {availableSubclasses.map((sub) => {
                                    const isSelected = selectedSubclass === sub.name;
                                    return (
                                        <label key={sub.name} id={`subclass-card-${sub.name}`} className="relative shrink-0 cursor-pointer group/card snap-center scroll-m-6">
                                            <input 
                                                className="peer sr-only" 
                                                name="subclass" 
                                                type="radio" 
                                                checked={isSelected}
                                                onChange={() => setSelectedSubclass(sub.name)}
                                            />
                                            <div className={`
                                                w-48 h-auto min-h-[140px] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 ease-out border-2 text-center
                                                ${isSelected 
                                                    ? 'bg-white dark:bg-surface-dark border-primary shadow-[0_10px_30px_-10px_rgba(53,158,255,0.4)] scale-105' 
                                                    : 'bg-white/60 dark:bg-surface-dark/60 border-transparent hover:border-slate-300 dark:hover:border-white/10 hover:bg-white dark:hover:bg-surface-dark shadow-sm'
                                                }
                                            `}>
                                                <div className="flex flex-col items-center w-full">
                                                    <span className={`block font-bold text-sm leading-tight mb-2 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                                        {sub.name}
                                                    </span>
                                                    <span className="block text-[10px] text-slate-500 leading-snug line-clamp-4">
                                                        {sub.description}
                                                    </span>
                                                </div>

                                                <div className={`
                                                    absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-black shadow-sm transition-all duration-300
                                                    ${isSelected ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}
                                                `}>
                                                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                                <div className="w-2 shrink-0"></div>
                            </div>
                        </div>

                        {selectedSubclassData && (
                            <div className="px-6 mt-4 space-y-3">
                                <div className="flex justify-center">
                                    <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full tracking-wider">Rasgos de {selectedSubclassData.name}</span>
                                </div>
                                {Object.entries(selectedSubclassData.features)
                                    .sort((a, b) => Number(a[0]) - Number(b[0]))
                                    .flatMap(([lvl, traits]) => {
                                    const featureLevel = Number(lvl);
                                    const isFuture = featureLevel > level;
                                    return (traits as Trait[]).map(trait => (
                                        <div key={trait.name} className={`bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm text-left ${isFuture ? 'opacity-75' : ''}`}>
                                            <div className="flex flex-col items-start gap-1 mb-2">
                                                <div className="flex w-full justify-between items-start">
                                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{trait.name}</p>
                                                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${isFuture ? 'bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10' : 'bg-primary/10 text-primary border-primary/20'}`}>Nivel {lvl}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{trait.description}</p>
                                        </div>
                                    ));
                                })}
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <SectionSeparator label="Raza" />
                    {/* ... (Rest of Step 1) */}
                    <div className="px-6">
                        <div className="flex justify-between items-end mb-3">
                             <h3 className="text-lg font-bold">Raza</h3>
                             <span className="text-primary text-xs font-medium">{speciesData?.name}</span>
                        </div>
                        
                        <div className="w-full relative group">
                            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>

                            <div className="flex overflow-x-auto gap-4 py-4 no-scrollbar w-full snap-x snap-mandatory">
                                {SPECIES_LIST.map((s) => {
                                    const ui = SPECIES_UI_MAP[s] || { icon: 'face', color: 'text-slate-400' };
                                    const isSelected = selectedSpecies === s;
                                    return (
                                        <label key={s} id={`species-card-${s}`} className="relative shrink-0 cursor-pointer group/card snap-center scroll-m-6">
                                            <input 
                                                className="peer sr-only" 
                                                name="species" 
                                                type="radio" 
                                                checked={isSelected}
                                                onChange={() => setSelectedSpecies(s)}
                                            />
                                            <div className={`
                                                w-28 h-32 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-out border-2
                                                ${isSelected 
                                                    ? 'bg-white dark:bg-surface-dark border-primary shadow-lg scale-105' 
                                                    : 'bg-white/70 dark:bg-surface-dark/70 border-transparent hover:border-slate-300 dark:hover:border-white/10 hover:bg-white dark:hover:bg-surface-dark'
                                                }
                                            `}>
                                                <div className={`
                                                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                                    ${isSelected ? 'bg-primary/10' : 'bg-slate-100 dark:bg-white/5'}
                                                `}>
                                                    <span className={`material-symbols-outlined text-2xl ${ui.color}`}>{ui.icon}</span>
                                                </div>
                                                <span className={`font-bold text-xs text-center leading-tight ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                                    {s}
                                                </span>
                                                <div className={`
                                                    absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-black shadow-sm transition-all duration-300
                                                    ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                                                `}>
                                                    <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                                <div className="w-2 shrink-0"></div>
                            </div>
                        </div>

                        <div className="mt-2 grid grid-cols-1 gap-2">
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-2">
                                {speciesData?.description}
                            </p>
                            {speciesData?.traits.slice(0, 2).map(trait => (
                                <div key={trait.name} className="flex flex-col bg-slate-100 dark:bg-white/5 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                                    <span className="text-xs font-bold text-slate-800 dark:text-white mb-1">{trait.name}</span>
                                    <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{trait.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <SectionSeparator label="Trasfondo" />
                    <div className="px-6">
                        <div className="flex justify-between items-end mb-3">
                             <h3 className="text-lg font-bold">Trasfondo</h3>
                             <span className="text-primary text-xs font-medium">{selectedBackground}</span>
                        </div>

                        <div className="w-full relative group">
                            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background-light to-transparent dark:from-background-dark z-10 pointer-events-none"></div>

                            <div className="flex overflow-x-auto gap-4 py-4 no-scrollbar w-full snap-x snap-mandatory">
                                {Object.keys(BACKGROUNDS_DATA).map((b) => {
                                    const ui = BACKGROUND_UI_MAP[b] || { icon: 'person', color: 'text-slate-400' };
                                    const bgData = BACKGROUNDS_DATA[b];
                                    const isSelected = selectedBackground === b;
                                    return (
                                        <label key={b} id={`background-card-${b}`} className="relative shrink-0 cursor-pointer group/card snap-center scroll-m-6">
                                            <input 
                                                className="peer sr-only" 
                                                name="background" 
                                                type="radio" 
                                                checked={isSelected}
                                                onChange={() => setSelectedBackground(b)}
                                            />
                                            <div className={`
                                                w-36 h-28 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out border-2
                                                ${isSelected 
                                                    ? 'bg-white dark:bg-surface-dark border-primary shadow-lg scale-105' 
                                                    : 'bg-white/70 dark:bg-surface-dark/70 border-transparent hover:border-slate-300 dark:hover:border-white/10 hover:bg-white dark:hover:bg-surface-dark'
                                                }
                                            `}>
                                                <span className={`material-symbols-outlined text-2xl ${ui.color} ${isSelected ? 'scale-110' : ''} transition-transform`}>{ui.icon}</span>
                                                <span className={`font-bold text-xs text-center leading-tight mt-1 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {b}
                                                </span>
                                                <span className="text-[9px] font-bold text-primary uppercase tracking-wider text-center">{bgData?.scores.join(' ')}</span>
                                                <div className={`
                                                    absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-black shadow-sm transition-all duration-300
                                                    ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                                                `}>
                                                    <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                                <div className="w-2 shrink-0"></div>
                            </div>
                        </div>

                        <div className="mt-2 p-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <span className="material-symbols-outlined">auto_stories</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedBackground}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{backgroundData?.description}</p>
                                </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 space-y-3">
                                <div className="flex gap-2 items-center">
                                    <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded">Stats</span>
                                    <span className="text-xs text-primary font-bold">{backgroundData?.scores.join(', ')} (+1)</span>
                                </div>
                                
                                <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 p-2.5 rounded-lg">
                                     <div className="bg-primary/20 p-1 rounded-md text-primary shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">military_tech</span>
                                     </div>
                                     <div>
                                         <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">Hazaña: {backgroundData?.feat}</p>
                                         <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">{backgroundData?.featDescription}</p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}

        {step === 2 && (
            <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between items-center mb-3">
                     <h3 className="text-xl font-bold">Atributos</h3>
                     {statMethod === 'pointBuy' && (
                         <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                             {remainingPoints} pts
                         </div>
                     )}
                </div>

                <div className="flex p-1 bg-slate-200 dark:bg-white/10 rounded-xl mb-3">
                    {(['pointBuy', 'manual'] as const).map(m => (
                        <button 
                            key={m}
                            onClick={() => setStatMethod(m)}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${statMethod === m ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            {m === 'pointBuy' ? 'Point Buy' : 'Manual'}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {(Object.keys(baseStats) as Ability[]).map(stat => (
                        <div key={stat} className="flex items-center justify-between bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                    {stat}
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-white">{stat}</span>
                                    <span className="text-xs text-slate-500">
                                        Final: <span className="text-primary font-bold">{finalStats[stat]}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleStatChange(stat, -1)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
                                    <span className="material-symbols-outlined text-sm">remove</span>
                                </button>
                                <span className="w-6 text-center font-bold text-lg">{baseStats[stat]}</span>
                                <button onClick={() => handleStatChange(stat, 1)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="px-6 py-4 space-y-4">
                <div>
                    <h3 className="text-xl font-bold mb-3">Alineamiento</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {ALIGNMENTS.map(align => (
                            <button 
                                key={align}
                                onClick={() => setSelectedAlignment(align)}
                                className={`p-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${selectedAlignment === align ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                            >
                                {align}
                            </button>
                        ))}
                    </div>
                </div>

                 <div className="space-y-3">
                    <h3 className="text-xl font-bold mb-1">Idiomas Adicionales (2)</h3>
                    <select 
                        value={selectedLanguage1}
                        onChange={(e) => setSelectedLanguage1(e.target.value)}
                        className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="" disabled>Selecciona el 1er idioma...</option>
                        {LANGUAGES.filter(l => l !== 'Common' && l !== selectedLanguage2).map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                    <select 
                        value={selectedLanguage2}
                        onChange={(e) => setSelectedLanguage2(e.target.value)}
                        className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="" disabled>Selecciona el 2do idioma...</option>
                        {LANGUAGES.filter(l => l !== 'Common' && l !== selectedLanguage1).map(l => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                </div>

                {selectedSpecies === 'Human' && (
                    <div>
                        <h3 className="text-xl font-bold mb-3">Hazaña de Humano</h3>
                         <select 
                            value={selectedFeat}
                            onChange={(e) => setSelectedFeat(e.target.value)}
                            className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            {FEAT_OPTIONS.map(f => (
                                <option key={f.name} value={f.name}>{f.name}</option>
                            ))}
                        </select>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-300 p-3 bg-slate-200 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/5">
                            {FEAT_OPTIONS.find(f => f.name === selectedFeat)?.description}
                        </p>
                    </div>
                )}
            </div>
        )}

        {step === 4 && (
            <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold">Habilidades</h3>
                     <div className="text-sm font-medium text-slate-500">
                        Elegidas: <span className={`${selectedSkills.length === classSkillOptions.count ? 'text-primary' : 'text-slate-900 dark:text-white'} font-bold`}>{selectedSkills.length}</span> / {classSkillOptions.count}
                     </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    {SKILL_LIST.map(skill => {
                        const isAvailable = classSkillOptions.options === 'Any' || classSkillOptions.options.includes(skill);
                        const isSelected = selectedSkills.includes(skill);
                        const isBackground = backgroundData?.skills.includes(skill);

                        if (!isAvailable && !isBackground) return null;

                        return (
                            <button 
                                key={skill}
                                onClick={() => !isBackground && toggleSkill(skill)}
                                disabled={isBackground}
                                className={`
                                    flex items-center justify-between p-3.5 rounded-xl border transition-all
                                    ${isBackground 
                                        ? 'bg-slate-100 dark:bg-white/5 border-transparent opacity-80' 
                                        : isSelected 
                                            ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(53,158,255,0.2)]' 
                                            : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10 hover:border-primary/50'
                                    }
                                `}
                            >
                                <span className={`font-bold ${isSelected || isBackground ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                    {skill} {isBackground && <span className="text-[10px] text-primary uppercase ml-2">(Trasfondo)</span>}
                                </span>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected || isBackground ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                    {(isSelected || isBackground) && <span className="material-symbols-outlined text-sm text-black font-bold">check</span>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        )}

        {step === 5 && (
            <div className="px-6 py-4 space-y-6">
                 {/* Header Identity */}
                 <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-3xl bg-slate-200 dark:bg-surface-light mb-3 shadow-lg border-2 border-white dark:border-white/10" style={{backgroundImage: `url(${newCharacter.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white leading-tight">{newCharacter.name}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-primary uppercase tracking-wide">{newCharacter.species}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{newCharacter.class}</span>
                        {newCharacter.subclass && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{newCharacter.subclass}</span>
                            </>
                        )}
                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                        <span className="text-sm font-bold text-slate-500">Lvl {newCharacter.level}</span>
                    </div>
                 </div>

                 {/* Combat Stats */}
                 <div className="grid grid-cols-4 gap-3">
                    {[
                      { l: 'HP', v: newCharacter.hp.max, i: 'favorite', c: 'text-red-500' },
                      { l: 'AC', v: newCharacter.ac, i: 'shield', c: 'text-blue-500' },
                      { l: 'SPD', v: newCharacter.speed, i: 'directions_run', c: 'text-green-500' },
                      { l: 'INI', v: `${newCharacter.init >= 0 ? '+' : ''}${newCharacter.init}`, i: 'bolt', c: 'text-yellow-500' }
                    ].map(s => (
                        <div key={s.l} className="flex flex-col items-center p-2.5 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 shadow-sm">
                            <span className={`material-symbols-outlined ${s.c} text-lg mb-1`}>{s.i}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.l}</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{s.v}</span>
                        </div>
                    ))}
                 </div>

                 {/* Abilities */}
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 pl-1">Atributos</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(newCharacter.stats).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/5">
                                <span className="text-xs font-bold text-slate-500">{key}</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{val}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Profile Details */}
                 <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Trasfondo</span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{newCharacter.background}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Alineamiento</span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{newCharacter.alignment}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hazañas & Rasgos</span>
                        <div className="flex flex-col gap-2">
                            {newCharacter.feats.map(f => (
                                <div key={f} className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm">military_tech</span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Idiomas</span>
                        <div className="flex flex-wrap gap-1.5">
                            {newCharacter.languages.map(l => (
                                <span key={l} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                                    {l}
                                </span>
                            ))}
                        </div>
                    </div>
                 </div>

                 {/* Skills */}
                 <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 pl-1">Habilidades Entrenadas</h4>
                    <div className="flex flex-wrap gap-2">
                        {newCharacter.skills.map(skill => (
                            <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                                <span className="material-symbols-outlined text-[14px]">check</span>
                                <span className="text-xs font-bold">{skill}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 <button 
                    onClick={nextStep}
                    className="w-full py-4 bg-primary text-background-dark font-bold rounded-xl shadow-[0_8px_30px_rgb(53,158,255,0.4)] text-lg hover:scale-[1.02] transition-transform mt-4"
                 >
                    Confirmar Personaje
                 </button>
            </div>
        )}

      </main>

      {step < 5 && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-background-dark sticky bottom-0 z-20">
            <button 
                onClick={nextStep}
                disabled={!canProceed()}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${canProceed() ? 'bg-primary text-background-dark shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'}`}
            >
                Continuar
            </button>
        </div>
      )}
    </div>
  );
};

export default CreatorSteps;