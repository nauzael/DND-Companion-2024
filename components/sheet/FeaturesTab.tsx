
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Character } from '../../types';
import { SPECIES_DETAILS, CLASS_DETAILS, CLASS_PROGRESSION, SUBCLASS_OPTIONS } from '../../Data/characterOptions';
import { FEAT_OPTIONS, GENERIC_FEATURES } from '../../Data/feats';

interface FeaturesTabProps {
    character: Character;
}

interface FeatureItem {
    name: string;
    description: string;
    level: number;
    source: 'Raza' | 'Clase' | 'Subclase' | 'Dote';
}

const ICON_MAP: Record<string, string> = { 
    'Clase': 'shield', 
    'Subclase': 'auto_awesome', 
    'Raza': 'face', 
    'Dote': 'military_tech' 
};

const FeaturesTab: React.FC<FeaturesTabProps> = ({ character }) => {
    const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

    const groupedFeatures = useMemo(() => {
        const list: FeatureItem[] = [];
        
        const speciesData = SPECIES_DETAILS[character.species];
        if (speciesData) {
            speciesData.traits.forEach(t => list.push({...t, source: 'Raza', level: 1}));
        }
        
        const classData = CLASS_DETAILS[character.class];
        if (classData) {
            classData.traits.forEach(t => list.push({...t, source: 'Clase', level: 1}));
        }
        
        const subclassList = SUBCLASS_OPTIONS[character.class] || [];
        const subclassData = subclassList.find(s => s.name === character.subclass);

        for (let l = 1; l <= character.level; l++) {
            const prog = CLASS_PROGRESSION[character.class]?.[l] || [];
            prog.forEach(featName => {
                if (l === 1 && classData?.traits.some(t => t.name === featName)) return;
                let desc = GENERIC_FEATURES[featName] || '';
                if (featName === 'Ability Score Improvement') desc = "Gain the Ability Score Improvement feat or another feat of your choice for which you qualify. You gain this feature again at higher levels.";
                list.push({ name: featName, description: desc, level: l, source: 'Clase' });
            });
            
            if (subclassData && subclassData.features[l]) {
                subclassData.features[l].forEach(t => {
                    list.push({ ...t, source: 'Subclase', level: l });
                });
            }
        }
        
        character.feats.forEach(f => {
            const featOpt = FEAT_OPTIONS.find(fo => fo.name === f);
            list.push({ name: f, description: featOpt?.description || 'Dote especial.', level: 1, source: 'Dote' });
        });

        const groups: Record<string, FeatureItem[]> = {
            'Raza': [],
            'Clase': [],
            'Subclase': [],
            'Dote': []
        };

        list.forEach(feat => {
            groups[feat.source].push(feat);
        });

        return groups;
    }, [character]);

    const renderSection = (title: string, items: FeatureItem[]) => {
        if (items.length === 0) return null;
        const icon = ICON_MAP[title] || 'stars';

        return (
            <div key={title} className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2 px-1">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-lg">{icon}</span>
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        {title === 'Dote' ? 'Dotes y Hazañas' : `Rasgos de ${title}`}
                    </h3>
                </div>
                
                <div className="space-y-2">
                    {items.map((feat, idx) => (
                        <div 
                            key={`${feat.name}-${idx}`} 
                            onClick={() => setSelectedFeature(feat)}
                            className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm hover:border-primary/40 transition-all cursor-pointer group active:scale-[0.98]"
                        >
                            <div className="p-4 flex items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-slate-900 dark:text-white text-base font-bold leading-tight truncate group-hover:text-primary transition-colors">
                                            {feat.name}
                                        </h4>
                                        {feat.level > 1 && (
                                            <span className="shrink-0 text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase">
                                                Lvl {feat.level}
                                            </span>
                                        )}
                                    </div>
                                    {feat.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-1 mt-0.5">
                                            {feat.description.split('\n')[0]}
                                        </p>
                                    )}
                                </div>
                                <span className="material-symbols-outlined text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity">chevron_right</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="px-4 pb-24 pt-4">
            {renderSection('Raza', groupedFeatures['Raza'])}
            {renderSection('Clase', groupedFeatures['Clase'])}
            {renderSection('Subclase', groupedFeatures['Subclase'])}
            {renderSection('Dote', groupedFeatures['Dote'])}

            {Object.values(groupedFeatures).every(g => g.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    <div className="size-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-4xl text-slate-400">auto_awesome_motion</span>
                    </div>
                    <p className="text-base font-bold text-slate-500">Sin rasgos detectados</p>
                </div>
            )}

            {/* Feature Detail Modal - Perfectly Centered */}
            {selectedFeature && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedFeature(null)}>
                    <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh] relative animate-scaleUp" onClick={e => e.stopPropagation()}>
                        
                        <div className="flex justify-between items-start mb-5 shrink-0">
                            <div className="min-w-0 pr-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight break-words">
                                    {selectedFeature.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                        <span className="material-symbols-outlined text-[12px]">{ICON_MAP[selectedFeature.source]}</span>
                                        {selectedFeature.source}
                                    </span>
                                    {selectedFeature.level > 1 && <span className="text-[10px] text-slate-500 font-bold uppercase">Nivel {selectedFeature.level}</span>}
                                </div>
                            </div>
                            <button onClick={() => setSelectedFeature(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 border-t border-slate-100 dark:border-white/5 pt-4">
                            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-body">
                                {selectedFeature.description || <span className="italic text-slate-400">Sin descripción adicional disponible.</span>}
                            </div>
                        </div>

                        <div className="mt-6 pt-2 shrink-0">
                            <button 
                                onClick={() => setSelectedFeature(null)} 
                                className="w-full py-3.5 rounded-2xl bg-primary text-background-dark font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.97] transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default FeaturesTab;
