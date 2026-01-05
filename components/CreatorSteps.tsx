
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Character, CreatorStep, Ability, Trait, SubclassData } from '../types';
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
  CLASS_PROGRESSION,
  METAMAGIC_OPTIONS
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

const DEFAULT_CHAR_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAZr-RDRTUNGSsd_-BR5U-r2yLkQsbKsJ6mAkTpEGl0e4IZW86PQSc2se3iegp_aML54kIgoYOyDhlwHDiNPfKasvRE8Wymti23tWDRa-QL1JZUqBNPNDJzOj5AknxSMaVS0FH7GW9srFK1u5uzt7Nb5M5LvPbaZUGy484PX685rHODXkI9CwFaha_RbMGbh-LOIz8R0OqlhyI9CDp--2zy5UhpgJ8GLuhKjmJsjCWKb-F8PJWpJtTk_3AmSP79rbDxmeLWsGsP61hv";

interface AsiDecision {
    type: 'stat' | 'feat';
    stat1?: Ability;
    stat2?: Ability;
    feat?: string;
}

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

const ClassProgressionList = ({ selectedClass, subclassData, currentLevel }: { selectedClass: string, subclassData?: SubclassData, currentLevel: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const classData = CLASS_DETAILS[selectedClass];

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
                            const features: { name: string, desc: string }[] = [];
                            
                            if (lvl === 1) {
                               classData?.traits.forEach(t => features.push({ name: t.name, desc: t.description }));
                            } else {
                               const classFeats = CLASS_PROGRESSION[selectedClass]?.[lvl] || [];
                               classFeats.forEach(feat => {
                                   let desc = GENERIC_FEATURES?.[feat];
                                   if (!desc && feat.includes("Ability Score")) desc = "Mejora una característica o elige una dote.";
                                   if (!desc && feat.includes("Subclass")) desc = "Ganás un rasgo de tu subclase elegida.";
                                   features.push({ name: feat, desc: desc || "" });
                               });
                            }

                            if (subclassData && subclassData.features[lvl]) {
                                subclassData.features[lvl].forEach(trait => {
                                    features.push({ name: trait.name, desc: trait.description });
                                });
                            }
                            
                            if (features.length === 0) return null;

                            return (
                                <div key={lvl} className="relative pl-6 pb-6 border-l-2 border-slate-200 dark:border-slate-700 ml-2 last:border-0 last:pb-0">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${lvl <= currentLevel ? 'bg-primary border-primary' : 'bg-background-light dark:bg-background-dark border-slate-300 dark:border-slate-600'}`}></div>
                                    
                                    <div className="flex flex-col gap-1 -mt-1.5">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${lvl <= currentLevel ? 'text-primary' : 'text-slate-400'}`}>Nivel {lvl}</span>
                                        <div className="space-y-2 mt-1">
                                            {features.map((feat, idx) => (
                                                <div key={idx} className={`bg-white dark:bg-surface-dark p-3 rounded-lg border shadow-sm ${lvl <= currentLevel ? 'border-primary/30' : 'border-slate-200 dark:border-white/5'}`}>
                                                    <span className={`block font-bold text-sm ${lvl <= currentLevel ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{feat.name}</span>
                                                    {feat.desc && <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{feat.desc}</span>}
                                                </div>
                                            ))}
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

const CreatorSteps: React.FC<CreatorStepsProps> = ({ onBack, onFinish }) => {
  const [step, setStep] = useState<CreatorStep>(1);
  const mainRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [charImage, setCharImage] = useState(DEFAULT_CHAR_IMAGE);
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
  const [selectedHumanSkill, setSelectedHumanSkill] = useState<string>('');
  const [selectedElfSkill, setSelectedElfSkill] = useState<string>('');
  const [selectedMetamagics, setSelectedMetamagics] = useState<string[]>([]);
  
  const [statMethod, setStatMethod] = useState<'pointBuy' | 'standard' | 'manual'>('pointBuy');
  const [baseStats, setBaseStats] = useState<Record<Ability, number>>({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
  const [hpMethod, setHpMethod] = useState<'average' | 'manual'>('average');
  const [manualRolledHP, setManualRolledHP] = useState<number>(0);
  
  const [bgAsiMode, setBgAsiMode] = useState<'three' | 'two'>('three');
  const [bgPlus2, setBgPlus2] = useState<Ability>('STR');
  const [bgPlus1, setBgPlus1] = useState<Ability>('DEX');

  const [asiDecisions, setAsiDecisions] = useState<Record<number, AsiDecision>>({});

  const [showFeatModal, setShowFeatModal] = useState(false);
  const [featModalContext, setFeatModalContext] = useState<{ type: 'human' | 'asi', level?: number } | null>(null);
  const [featSearchQuery, setFeatSearchQuery] = useState('');

  const [trinket] = useState<string>(() => {
      const randomIndex = Math.floor(Math.random() * TRINKETS.length);
      return `Trinket: ${TRINKETS[randomIndex]}`;
  });

  const speciesData = SPECIES_DETAILS[selectedSpecies];
  const classData = CLASS_DETAILS[selectedClass];
  const backgroundData = BACKGROUNDS_DATA[selectedBackground];
  const classSkillOptions = CLASS_SKILL_DATA[selectedClass];
  const availableSubclasses = useMemo(() => SUBCLASS_OPTIONS[selectedClass] || [], [selectedClass]);
  const selectedSubclassData = useMemo(() => availableSubclasses.find(s => s.name === selectedSubclass), [availableSubclasses, selectedSubclass]);

  const asiLevels = useMemo(() => {
      const levels: number[] = [];
      const progression = CLASS_PROGRESSION[selectedClass] || {};
      for (let l = 1; l <= level; l++) {
          if (progression[l]?.includes('Ability Score Improvement')) {
              levels.push(l);
          }
      }
      return levels;
  }, [selectedClass, level]);

  const maxMetamagics = useMemo(() => {
      if (selectedClass !== 'Sorcerer' || level < 2) return 0;
      if (level >= 17) return 4;
      if (level >= 10) return 3;
      return 2;
  }, [selectedClass, level]);

  const finalStats = useMemo(() => {
    const stats = { ...baseStats };
    if (backgroundData?.scores) {
        if (bgAsiMode === 'three') {
             backgroundData.scores.forEach(ability => {
                stats[ability] = Math.min(20, stats[ability] + 1);
            });
        } else {
             if (bgPlus2) stats[bgPlus2] = Math.min(20, stats[bgPlus2] + 2);
             if (bgPlus1) stats[bgPlus1] = Math.min(20, stats[bgPlus1] + 1);
        }
    }
    asiLevels.forEach(lvl => {
        const decision = asiDecisions[lvl];
        if (decision?.type === 'stat') {
            if (decision.stat1) stats[decision.stat1] = Math.min(20, stats[decision.stat1] + 1);
            if (decision.stat2) stats[decision.stat2] = Math.min(20, stats[decision.stat2] + 1);
        }
    });
    return stats;
  }, [baseStats, backgroundData, bgAsiMode, bgPlus2, bgPlus1, asiLevels, asiDecisions]);

  const usedPoints = useMemo(() => {
    return Object.values(baseStats).reduce((acc: number, val) => acc + (POINT_BUY_COSTS[val as number] || 0), 0);
  }, [baseStats]);
  
  const remainingPoints = 27 - usedPoints;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  useEffect(() => {
    if (speciesData?.name === 'Human') {
        if (!selectedFeat) setSelectedFeat(FEAT_OPTIONS[0].name);
    } else {
        setSelectedHumanSkill('');
    }
    
    if (selectedSpecies !== 'Elf') {
        setSelectedElfSkill('');
    }
  }, [selectedSpecies, speciesData, selectedFeat]);

  useEffect(() => {
    setSelectedSkills([]);
    setSelectedSubclass('');
    setAsiDecisions({});
    setSelectedMetamagics([]);
  }, [selectedClass]);

  useEffect(() => {
      setManualRolledHP(0);
  }, [selectedClass]);

  useEffect(() => {
    if (backgroundData?.scores && backgroundData.scores.length >= 2) {
        setBgPlus2(backgroundData.scores[0]);
        setBgPlus1(backgroundData.scores[1]);
        setBgAsiMode('three');
    }
  }, [selectedBackground, backgroundData]);

  useEffect(() => {
    if (availableSubclasses.length > 0 && !selectedSubclass) {
        // Permitimos seleccionar subclase desde nivel 1 para previsualizar beneficios
    }
  }, [level, availableSubclasses, selectedSubclass]);

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

  const toggleMetamagic = (meta: string) => {
      if (selectedMetamagics.includes(meta)) {
          setSelectedMetamagics(prev => prev.filter(m => m !== meta));
      } else {
          if (selectedMetamagics.length < maxMetamagics) {
              setSelectedMetamagics(prev => [...prev, meta]);
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

  const handleAsiChange = (level: number, updates: Partial<AsiDecision>) => {
      setAsiDecisions(prev => ({
          ...prev,
          [level]: { ...(prev[level] || { type: 'stat', stat1: 'STR', stat2: 'STR' }), ...updates }
      }));
  };

  const openFeatModal = (context: { type: 'human' | 'asi', level?: number }) => {
      setFeatModalContext(context);
      setFeatSearchQuery('');
      setShowFeatModal(true);
  };

  const handleFeatSelect = (featName: string) => {
      if (featModalContext?.type === 'human') {
          setSelectedFeat(featName);
      } else if (featModalContext?.type === 'asi' && featModalContext.level) {
          handleAsiChange(featModalContext.level, { feat: featName });
      }
      setShowFeatModal(false);
  };

  const canProceed = () => {
    if (step === 4) {
        const classSkillsOk = selectedSkills.length === classSkillOptions.count;
        const humanSkillOk = selectedSpecies === 'Human' ? !!selectedHumanSkill : true;
        const elfSkillOk = selectedSpecies === 'Elf' ? !!selectedElfSkill : true;
        const metamagicOk = maxMetamagics > 0 ? selectedMetamagics.length === maxMetamagics : true;
        return classSkillsOk && humanSkillOk && elfSkillOk && metamagicOk;
    }
    return true;
  };

  const calculateAC = () => {
    const dexMod = Math.floor(((finalStats.DEX || 10) - 10) / 2);
    const conMod = Math.floor(((finalStats.CON || 10) - 10) / 2);
    const wisMod = Math.floor(((finalStats.WIS || 10) - 10) / 2);
    const chaMod = Math.floor(((finalStats.CHA || 10) - 10) / 2);
    
    let ac = 10 + dexMod;
    if (selectedClass === 'Barbarian') {
        ac = 10 + dexMod + conMod;
    } else if (selectedClass === 'Monk') {
        ac = 10 + dexMod + wisMod;
    } else if (selectedClass === 'Sorcerer' && selectedSubclass === 'Draconic Sorcery') {
        ac = 10 + dexMod + chaMod;
    }
    return ac;
  };

  const calculateMaxHP = () => {
    const conMod = Math.floor(((finalStats.CON || 10) - 10) / 2);
    const hitDie = HIT_DIE[selectedClass] || 8;
    let baseHp = 0;
    baseHp += hitDie + conMod;
    if (level > 1) {
        if (hpMethod === 'average') {
            const avg = Math.floor(hitDie / 2) + 1;
            baseHp += (avg + conMod) * (level - 1);
        } else {
            baseHp += manualRolledHP + (conMod * (level - 1));
        }
    }
    let bonusTotal = 0;
    if (selectedSpecies === 'Dwarf') bonusTotal += level;
    if (selectedClass === 'Sorcerer' && selectedSubclass === 'Draconic Sorcery') bonusTotal += level;
    
    const allFeats = [
        backgroundData?.feat, 
        speciesData?.name === 'Human' ? selectedFeat : undefined,
        ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)
    ].filter(Boolean);
    if (allFeats.includes('Tough')) bonusTotal += (level * 2);
    
    return Math.max(1, baseHp + bonusTotal);
  };

  const renderHpBreakdown = () => {
    const hitDie = HIT_DIE[selectedClass] || 8;
    const conMod = Math.floor(((finalStats.CON || 10) - 10) / 2);
    const avgRoll = Math.floor(hitDie / 2) + 1;
    
    let bonuses = [];
    if (selectedSpecies === 'Dwarf') bonuses.push({ name: 'Resistencia Enana', val: level });
    if (selectedClass === 'Sorcerer' && selectedSubclass === 'Draconic Sorcery') bonuses.push({ name: 'Resiliencia Dracónica', val: level });
    
    const allFeats = [
        backgroundData?.feat, 
        speciesData?.name === 'Human' ? selectedFeat : undefined,
        ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)
    ].filter(Boolean);
    if (allFeats.includes('Tough')) bonuses.push({ name: 'Dote: Duro', val: level * 2 });

    const lvl1Total = hitDie + conMod;
    const laterLvlBase = hpMethod === 'average' ? (avgRoll + conMod) * (level - 1) : manualRolledHP + (conMod * (level - 1));

    return (
        <div className="mt-3 p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-mono text-slate-600 dark:text-slate-400 shadow-inner">
            <div className="flex justify-between items-center mb-1">
                <span>Nivel 1 (Máx + CON):</span>
                <span>{hitDie} + {conMod} = <span className="font-bold text-slate-900 dark:text-white">{lvl1Total}</span></span>
            </div>
            {level > 1 && (
                <div className="flex justify-between items-center mb-1 border-t border-slate-200 dark:border-white/5 pt-1 border-dashed">
                    <span className="text-slate-500 dark:text-slate-400">
                        Niveles 2-{level} ({hpMethod === 'average' ? `Media (d${hitDie}/2 + 1 = ${avgRoll})` : 'Manual'} + CON):
                    </span>
                    <span>{laterLvlBase}</span>
                </div>
            )}
            {bonuses.map((b, i) => (
                <div key={i} className="flex justify-between items-center text-primary border-t border-slate-200 dark:border-white/5 pt-1 border-dashed">
                    <span>{b.name}:</span>
                    <span>+{b.val}</span>
                </div>
            ))}
            <div className="border-t-2 border-slate-200 dark:border-white/10 mt-2 pt-2 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>Total Puntos de Golpe:</span>
                <span className="text-primary">{calculateMaxHP()}</span>
            </div>
        </div>
    );
  };

  const calculateSpeed = () => {
    let speed = speciesData?.speed || 30;
    if (selectedClass === 'Monk' && level >= 2) {
        if (level >= 18) speed += 30;
        else if (level >= 14) speed += 25;
        else if (level >= 10) speed += 20;
        else if (level >= 6) speed += 15;
        else speed += 10;
    }
    if (selectedClass === 'Barbarian' && level >= 5) speed += 10;
    const allFeats = [
        backgroundData?.feat, 
        speciesData?.name === 'Human' ? selectedFeat : undefined,
        ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)
    ].filter(Boolean);
    if (allFeats.some(f => f === 'Mobile' || f === 'Speedy')) speed += 10;
    return speed;
  };

  const getActivePassives = () => {
      const passives: string[] = [];
      if (selectedClass === 'Barbarian') passives.push('Unarmored Defense (CON)');
      if (selectedClass === 'Monk') passives.push('Unarmored Defense (WIS)');
      if (selectedClass === 'Sorcerer' && selectedSubclass === 'Draconic Sorcery') passives.push('Draconic Resilience (AC 10+DEX+CHA, +1 HP/lvl)');
      if (selectedSpecies === 'Dwarf') passives.push('Dwarven Toughness (+1 HP/lvl)');
      const feats = [
          backgroundData?.feat, 
          speciesData?.name === 'Human' ? selectedFeat : undefined,
          ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)
      ].filter(Boolean);
      if (feats.includes('Tough')) passives.push('Tough Feat (+2 HP/lvl)');
      return passives;
  };

  const nextStep = () => {
    if (!canProceed()) return;
    if (step < 5) setStep((s) => (s + 1) as CreatorStep);
    else {
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
            ac: calculateAC(),
            init: Math.floor(((finalStats.DEX || 10) - 10) / 2),
            speed: calculateSpeed(),
            profBonus: Math.ceil(1 + (level / 4)),
            stats: finalStats,
            skills: [...(backgroundData?.skills || []), ...selectedSkills, ...(selectedHumanSkill ? [selectedHumanSkill] : []), ...(selectedElfSkill ? [selectedElfSkill] : [])],
            languages: ['Common', selectedLanguage1, selectedLanguage2].filter(Boolean),
            feats: [
                backgroundData?.feat, 
                speciesData?.name === 'Human' ? selectedFeat : undefined,
                ...asiLevels.map(l => asiDecisions[l]?.type === 'feat' ? asiDecisions[l]?.feat : undefined)
            ].filter((f): f is string => !!f),
            metamagics: selectedMetamagics,
            inventory: [trinket, ...(backgroundData?.equipment || [])].map((itemStr, i) => {
              const match = itemStr.match(/^(.*?) \((\d+)\)$/);
              return {
                id: `init-item-${i}`,
                name: match ? match[1] : itemStr,
                quantity: match ? parseInt(match[2]) : 1,
                equipped: false
              };
            }),
            imageUrl: charImage,
            notes: []
        };
        onFinish(newCharacter);
    }
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

  const activePassives = getActivePassives();

  return (
    <div className="flex flex-col h-full min-h-screen relative bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between p-4 pt-[calc(1.5rem+env(safe-area-inset-top))] z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm sticky top-0">
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

      <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-5">
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
                    <div 
                        className="relative shrink-0 group cursor-pointer" 
                        onClick={() => {
                            const url = window.prompt("Pegar URL de la imagen (Hotlink):", charImage === DEFAULT_CHAR_IMAGE ? "" : charImage);
                            if (url !== null) {
                                if (url.length > 5000) {
                                    alert("⛔ ¡URL demasiado larga! Parece que estás intentando pegar una imagen codificada en Base64. Por favor, usa un enlace directo a una imagen (que termine en .jpg o .png) para evitar que la aplicación falle.");
                                } else {
                                    setCharImage(url || DEFAULT_CHAR_IMAGE);
                                }
                            }
                        }}
                    >
                        <div 
                            className="w-20 h-20 rounded-2xl bg-surface-dark border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden hover:border-primary transition-all bg-cover bg-center"
                            style={charImage !== DEFAULT_CHAR_IMAGE ? { backgroundImage: `url(${charImage})`, borderStyle: 'solid' } : {}}
                        >
                            {charImage === DEFAULT_CHAR_IMAGE && <span className="material-symbols-outlined text-3xl text-slate-500 group-hover:text-primary transition-colors">add_a_photo</span>}
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

                    <div className="px-6 mt-4">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nivel</label>
                        <div className="relative">
                            <select
                                value={level}
                                onChange={(e) => setLevel(Number(e.target.value))}
                                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-3 text-base font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-sm appearance-none"
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

                    <ClassProgressionList selectedClass={selectedClass} subclassData={selectedSubclassData} currentLevel={level} />

                </div>

                {availableSubclasses.length > 0 && (
                    <div className="mb-4 animate-fadeIn">
                        <SectionSeparator label="Subclase / Linaje" />
                        <div className="px-6 flex flex-col items-center mb-4 text-center">
                            <h3 className="text-xl font-bold">Escoge tu Linaje</h3>
                            <span className="text-primary text-sm font-medium mt-1 max-w-[80%] truncate">{selectedSubclass || 'Selecciona una especialización'}</span>
                            {level < 3 && <p className="text-[10px] text-slate-400 mt-1 italic">Nota: En 2024 las subclases se eligen formalmente al nivel 3, pero puedes pre-seleccionarla para planear tu AC y HP.</p>}
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
                                                w-48 h-44 rounded-2xl p-5 flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-out border-2 text-center relative
                                                ${isSelected 
                                                    ? 'bg-white dark:bg-surface-dark border-primary shadow-[0_10px_30px_-10px_rgba(53,158,255,0.4)] scale-105' 
                                                    : 'bg-white/60 dark:bg-surface-dark/60 border-transparent hover:border-slate-300 dark:hover:border-white/10 hover:bg-white dark:hover:bg-surface-dark shadow-sm'
                                                }
                                            `}>
                                                <div className="flex flex-col items-center w-full gap-2">
                                                    <span className={`block font-bold text-sm leading-tight ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                                        {sub.name}
                                                    </span>
                                                    <span className="block text-[10px] text-slate-500 leading-relaxed line-clamp-4">
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
                            <div className="px-6 mt-4 animate-fadeIn">
                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4">
                                    <div className="flex items-start gap-3 mb-4 border-b border-slate-200 dark:border-white/10 pb-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                            <span className="material-symbols-outlined">auto_awesome</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{selectedSubclassData.name}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedSubclassData.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {Object.entries(selectedSubclassData.features)
                                            .sort(([a], [b]) => Number(a) - Number(b))
                                            .map(([lvl, features]: [string, Trait[]]) => (
                                            <div key={lvl} className="relative pl-4 border-l-2 border-slate-200 dark:border-white/10">
                                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 block">Nivel {lvl}</span>
                                                <div className="space-y-2">
                                                    {features.map((feat, idx) => (
                                                        <div key={idx} className="bg-white dark:bg-surface-dark p-3 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
                                                            <span className="font-bold text-sm text-slate-900 dark:text-white block mb-1">{feat.name}</span>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <SectionSeparator label="Raza" />
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
            <div className="px-6 py-4 space-y-6">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                        Bonificadores de Trasfondo <span className="text-slate-400 text-xs font-normal">({selectedBackground})</span>
                    </h3>
                    
                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-4">
                        <button 
                            onClick={() => setBgAsiMode('three')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${bgAsiMode === 'three' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}
                        >
                            +1 / +1 / +1
                        </button>
                        <button 
                            onClick={() => setBgAsiMode('two')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${bgAsiMode === 'two' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}
                        >
                            +2 / +1
                        </button>
                    </div>

                    {bgAsiMode === 'three' ? (
                        <div className="flex gap-2 justify-center">
                            {backgroundData?.scores.map(s => (
                                <div key={s} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg font-bold text-xs">
                                    {s} +1
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase w-8 text-right text-primary">+2</span>
                                <div className="flex gap-2 flex-1">
                                    {backgroundData?.scores.map(s => (
                                        <button 
                                            key={s}
                                            onClick={() => {
                                                setBgPlus2(s);
                                                if (bgPlus1 === s) {
                                                    const other = backgroundData.scores.find(x => x !== s) || s;
                                                    setBgPlus1(other);
                                                }
                                            }}
                                            className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${bgPlus2 === s ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase w-8 text-right text-slate-500">+1</span>
                                <div className="flex gap-2 flex-1">
                                    {backgroundData?.scores.map(s => (
                                        <button 
                                            key={s}
                                            onClick={() => setBgPlus1(s)}
                                            disabled={bgPlus2 === s}
                                            className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${bgPlus1 === s ? 'bg-slate-600 text-white border-slate-600' : bgPlus2 === s ? 'opacity-30 cursor-not-allowed bg-slate-100 border-transparent' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
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

                <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-lg font-bold">Puntos de Golpe</h3>
                    </div>
                    
                    <div className="flex p-1 bg-slate-200 dark:bg-white/10 rounded-xl mb-3">
                        {(['average', 'manual'] as const).map(m => (
                            <button 
                                key={m}
                                onClick={() => setHpMethod(m)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${hpMethod === m ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-slate-500 dark:text-slate-400'}`}
                            >
                                {m === 'average' ? 'Media Fija' : 'Manual'}
                            </button>
                        ))}
                    </div>

                    {hpMethod === 'manual' && level > 1 && (
                        <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 mb-3">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Suma tirada (Nivel 2-{level})</label>
                            <input 
                                type="number" 
                                value={manualRolledHP} 
                                onChange={(e) => setManualRolledHP(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-lg font-bold outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <p className="text-xs text-slate-400 mt-2">Introduce la suma total de los dados de golpe tirados para los niveles posteriores al 1. El nivel 1 siempre es máximo.</p>
                        </div>
                    )}

                    {renderHpBreakdown()}
                </div>

                {asiLevels.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-4">
                        <h3 className="text-lg font-bold">Mejoras de Nivel</h3>
                        {asiLevels.map(lvl => {
                            const decision = asiDecisions[lvl] || { type: 'stat', stat1: 'STR', stat2: 'STR' };
                            return (
                                <div key={lvl} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-primary uppercase tracking-wider">Nivel {lvl}</span>
                                        <div className="flex bg-slate-100 dark:bg-white/5 rounded-lg p-0.5">
                                            <button 
                                                onClick={() => handleAsiChange(lvl, { type: 'stat' })}
                                                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${decision.type === 'stat' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}
                                            >
                                                Stats
                                            </button>
                                            <button 
                                                onClick={() => handleAsiChange(lvl, { type: 'feat' })}
                                                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${decision.type === 'feat' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500'}`}
                                            >
                                                Dote
                                            </button>
                                        </div>
                                    </div>

                                    {decision.type === 'stat' ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">+1 a...</label>
                                                <select 
                                                    value={decision.stat1} 
                                                    onChange={(e) => handleAsiChange(lvl, { stat1: e.target.value as Ability })}
                                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-2 text-sm font-bold outline-none"
                                                >
                                                    {(Object.keys(baseStats) as Ability[]).map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">+1 a...</label>
                                                <select 
                                                    value={decision.stat2} 
                                                    onChange={(e) => handleAsiChange(lvl, { stat2: e.target.value as Ability })}
                                                    className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-2 text-sm font-bold outline-none"
                                                >
                                                    {(Object.keys(baseStats) as Ability[]).map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-span-2 text-xs text-center text-slate-400 mt-1">
                                                {decision.stat1 === decision.stat2 ? `+2 a ${decision.stat1}` : `+1 a ${decision.stat1}, +1 a ${decision.stat2}`}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <button
                                                onClick={() => openFeatModal({ type: 'asi', level: lvl })}
                                                className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all flex justify-between items-center"
                                            >
                                                <span className={`font-bold ${decision.feat ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                                    {decision.feat || 'Seleccionar Dote...'}
                                                </span>
                                                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                                            </button>
                                            {decision.feat && (
                                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 p-2 rounded-lg">
                                                    {FEAT_OPTIONS.find(f => f.name === decision.feat)?.description}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
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
                         <button
                            onClick={() => openFeatModal({ type: 'human' })}
                            className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all flex justify-between items-center"
                        >
                            <span className={`font-bold ${selectedFeat ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                {selectedFeat || 'Seleccionar Dote...'}
                            </span>
                            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                        </button>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-300 p-3 bg-slate-200 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/5">
                            {FEAT_OPTIONS.find(f => f.name === selectedFeat)?.description}
                        </p>
                    </div>
                )}
            </div>
        )}

        {step === 4 && (
            <div className="px-6 py-4 space-y-6">
                {selectedSpecies === 'Elf' && (
                    <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20 mb-4 animate-fadeIn">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-green-600">visibility</span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Keen Senses (Elfo)</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            Como elfo, tus sentidos están agudizados. Elige una de estas habilidades.
                        </p>
                        <select 
                            value={selectedElfSkill}
                            onChange={(e) => setSelectedElfSkill(e.target.value)}
                            className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="" disabled>Selecciona una habilidad...</option>
                            {['Insight', 'Perception', 'Survival'].map(skill => (
                                <option key={skill} value={skill}>{skill}</option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedSpecies === 'Human' && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="material-symbols-outlined text-primary">accessibility_new</span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Habilidad Racial (Humano)</h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            Los humanos aprenden rápido. Elige una habilidad adicional de cualquier tipo.
                        </p>
                        <select 
                            value={selectedHumanSkill}
                            onChange={(e) => setSelectedHumanSkill(e.target.value)}
                            className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="" disabled>Selecciona una habilidad extra...</option>
                            {SKILL_LIST.map(skill => {
                                if (backgroundData?.skills.includes(skill)) return null;
                                if (selectedSkills.includes(skill)) return null;
                                if (selectedElfSkill === skill) return null;
                                return <option key={skill} value={skill}>{skill}</option>;
                            })}
                        </select>
                    </div>
                )}

                <div>
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-bold">Habilidades de Clase</h3>
                         <div className="text-sm font-medium text-slate-500">
                            Elegidas: <span className={`${selectedSkills.length === classSkillOptions.count ? 'text-primary' : 'text-slate-900 dark:text-white'} font-bold`}>{selectedSkills.length}</span> / {classSkillOptions.count}
                         </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {SKILL_LIST.map(skill => {
                            const isAvailable = classSkillOptions.options === 'Any' || classSkillOptions.options.includes(skill);
                            const isSelected = selectedSkills.includes(skill);
                            const isBackground = backgroundData?.skills.includes(skill);
                            const isHumanSelected = selectedHumanSkill === skill;
                            const isElfSelected = selectedElfSkill === skill;

                            if (!isAvailable && !isBackground && !isHumanSelected && !isElfSelected) return null;

                            return (
                                <button 
                                    key={skill}
                                    onClick={() => !isBackground && !isHumanSelected && !isElfSelected && toggleSkill(skill)}
                                    disabled={isBackground || isHumanSelected || isElfSelected}
                                    className={`
                                        flex items-center justify-between p-3.5 rounded-xl border transition-all
                                        ${isBackground || isHumanSelected || isElfSelected
                                            ? 'bg-slate-100 dark:bg-white/5 border-transparent opacity-80' 
                                            : isSelected 
                                                ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(53,158,255,0.2)]' 
                                                : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10 hover:border-primary/50'
                                        }
                                    `}
                                >
                                    <span className={`font-bold ${isSelected || isBackground || isHumanSelected || isElfSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                        {skill} 
                                        {isBackground && <span className="text-[10px] text-primary uppercase ml-2">(Trasfondo)</span>}
                                        {isHumanSelected && <span className="text-[10px] text-blue-500 uppercase ml-2">(Humano)</span>}
                                        {isElfSelected && <span className="text-[10px] text-green-500 uppercase ml-2">(Elfo)</span>}
                                    </span>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected || isBackground || isHumanSelected || isElfSelected ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                        {(isSelected || isBackground || isHumanSelected || isElfSelected) && <span className="material-symbols-outlined text-sm text-black font-bold">check</span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {maxMetamagics > 0 && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Metamagias</h3>
                            <div className="text-sm font-medium text-slate-500">
                                Elegidas: <span className={`${selectedMetamagics.length === maxMetamagics ? 'text-primary' : 'text-slate-900 dark:text-white'} font-bold`}>{selectedMetamagics.length}</span> / {maxMetamagics}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {METAMAGIC_OPTIONS.map(meta => {
                                const isSelected = selectedMetamagics.includes(meta.name);
                                const isDisabled = !isSelected && selectedMetamagics.length >= maxMetamagics;

                                return (
                                    <button 
                                        key={meta.name}
                                        onClick={() => toggleMetamagic(meta.name)}
                                        disabled={isDisabled}
                                        className={`
                                            flex flex-col p-4 rounded-xl border transition-all text-left
                                            ${isSelected 
                                                ? 'bg-primary/5 border-primary shadow-sm' 
                                                : isDisabled 
                                                    ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-white/5'
                                                    : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10 hover:border-primary/40'
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`font-bold ${isSelected ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{meta.name}</span>
                                            {isSelected && <span className="material-symbols-outlined text-primary text-base">check_circle</span>}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{meta.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        )}

        {step === 5 && (
            <div className="px-6 py-4 space-y-6">
                 <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-3xl bg-slate-200 dark:bg-surface-light mb-3 shadow-lg border-2 border-white dark:border-white/10" style={{backgroundImage: `url(${charImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white leading-tight">{name || 'Heroe'}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-primary uppercase tracking-wide">{selectedSpecies}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">{selectedClass}</span>
                        {selectedSubclass && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{selectedSubclass}</span>
                            </>
                        )}
                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                        <span className="text-sm font-bold text-slate-500">Lvl {level}</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-4 gap-3">
                    {[
                      { l: 'HP', v: calculateMaxHP(), i: 'favorite', c: 'text-red-500' },
                      { l: 'AC', v: calculateAC(), i: 'shield', c: 'text-blue-500' },
                      { l: 'SPD', v: calculateSpeed(), i: 'directions_run', c: 'text-green-500' },
                      { l: 'INI', v: `${Math.floor(((finalStats.DEX || 10) - 10) / 2) >= 0 ? '+' : ''}${Math.floor(((finalStats.DEX || 10) - 10) / 2)}`, i: 'bolt', c: 'text-yellow-500' }
                    ].map(s => (
                        <div key={s.l} className="flex flex-col items-center p-2.5 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 shadow-sm">
                            <span className={`material-symbols-outlined ${s.c} text-lg mb-1`}>{s.i}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.l}</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{s.v}</span>
                        </div>
                    ))}
                 </div>

                 <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 pl-1">Atributos</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {Object.entries(finalStats).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent dark:border-white/5">
                                <span className="text-xs font-bold text-slate-500">{key}</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{val}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/5 pb-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Trasfondo</span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{selectedBackground}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Alineamiento</span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">{selectedAlignment}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hazañas & Rasgos</span>
                        <div className="flex flex-col gap-2">
                            {backgroundData?.feat && (
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm">military_tech</span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{backgroundData.feat}</span>
                                </div>
                            )}
                            {selectedSpecies === 'Human' && selectedFeat && (
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm">military_tech</span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{selectedFeat}</span>
                                </div>
                            )}
                            {asiLevels.map(l => {
                                const decision = asiDecisions[l];
                                if (decision?.type === 'feat' && decision.feat) {
                                    return (
                                        <div key={l} className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-sm">military_tech</span>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{decision.feat}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            {activePassives.map(p => (
                                <div key={p} className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-500 text-sm">auto_awesome</span>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{p}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedMetamagics.length > 0 && (
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Metamagias</span>
                            <div className="flex flex-wrap gap-1.5">
                                {selectedMetamagics.map(m => (
                                    <span key={m} className="px-2 py-1 rounded-md bg-purple-500/10 text-xs font-bold text-purple-400 border border-purple-500/20">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Idiomas</span>
                        <div className="flex flex-wrap gap-1.5">
                            {['Common', selectedLanguage1, selectedLanguage2].filter(Boolean).map(l => (
                                <span key={l} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                                    {l}
                                </span>
                            ))}
                        </div>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 pl-1">Habilidades Entrenadas</h4>
                    <div className="flex flex-wrap gap-2">
                        {[...(backgroundData?.skills || []), ...selectedSkills, ...(selectedHumanSkill ? [selectedHumanSkill] : []), ...(selectedElfSkill ? [selectedElfSkill] : [])].map(skill => (
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
        <div className="px-4 py-3 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-background-dark sticky bottom-0 z-20 mb-[env(safe-area-inset-bottom)]">
            <button 
                onClick={nextStep}
                disabled={!canProceed()}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${canProceed() ? 'bg-primary text-background-dark shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'}`}
            >
                Continuar
            </button>
        </div>
      )}

      {showFeatModal && (
          <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col animate-fadeIn pt-[env(safe-area-inset-top)]">
              <div className="flex flex-col border-b border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark">
                  <div className="flex items-center gap-4 p-4">
                      <button onClick={() => setShowFeatModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined text-slate-900 dark:text-white">close</span>
                      </button>
                      <div className="flex-1 relative">
                          <input 
                              type="text" 
                              placeholder="Buscar dote..." 
                              value={featSearchQuery} 
                              onChange={(e) => setFeatSearchQuery(e.target.value)} 
                              autoFocus
                              className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl py-2 pl-10 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:border-primary/50"
                          />
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500">search</span>
                      </div>
                  </div>
                  <h3 className="px-4 pb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Selecciona una Dote
                  </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-[env(safe-area-inset-bottom)]">
                  {FEAT_OPTIONS
                      .filter(f => f.name.toLowerCase().includes(featSearchQuery.toLowerCase()))
                      .map(feat => {
                          let isSelected = false;
                          if (featModalContext?.type === 'human') {
                              isSelected = selectedFeat === feat.name;
                          } else if (featModalContext?.type === 'asi' && featModalContext.level) {
                              isSelected = asiDecisions[featModalContext.level]?.feat === feat.name;
                          }

                          return (
                              <button 
                                  key={feat.name} 
                                  onClick={() => handleFeatSelect(feat.name)}
                                  className={`w-full text-left p-4 rounded-xl border transition-all ${isSelected ? 'bg-primary/10 border-primary/50' : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                              >
                                  <div className="flex justify-between items-start mb-1">
                                      <span className={`font-bold text-base ${isSelected ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{feat.name}</span>
                                      {isSelected && <span className="material-symbols-outlined text-primary text-xl">check_circle</span>}
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                      {feat.description}
                                  </p>
                              </button>
                          );
                      })
                  }
              </div>
          </div>
      )}
    </div>
  );
};

export default CreatorSteps;
