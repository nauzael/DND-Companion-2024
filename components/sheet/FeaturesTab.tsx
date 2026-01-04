
import React, { useState } from 'react';
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
    source: string;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({ character }) => {
    const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

    const features: FeatureItem[] = [];
    const speciesData = SPECIES_DETAILS[character.species];
    
    if (speciesData) {
        speciesData.traits.forEach(t => features.push({...t, source: 'Raza', level: 1}));
    }
    
    const classData = CLASS_DETAILS[character.class];
    const subclassList = SUBCLASS_OPTIONS[character.class] || [];
    const subclassData = subclassList.find(s => s.name === character.subclass);
    
    if (classData) {
        classData.traits.forEach(t => {
             features.push({...t, source: 'Clase', level: 1});
        });
    }
    
    for (let l = 1; l <= character.level; l++) {
        const prog = CLASS_PROGRESSION[character.class]?.[l] || [];
        prog.forEach(featName => {
            if (l === 1 && classData?.traits.some(t => t.name === featName)) return;
            let desc = GENERIC_FEATURES[featName] || '';
            if (featName === 'Ability Score Improvement') desc = "Mejora de características o Dote.";
            features.push({ name: featName, description: desc, level: l, source: 'Clase' });
        });
        if (subclassData && subclassData.features[l]) {
            subclassData.features[l].forEach(t => {
                features.push({ ...t, source: 'Subclase', level: l });
            });
        }
    }
    
    character.feats.forEach(f => {
        const featOpt = FEAT_OPTIONS.find(fo => fo.name === f);
        features.push({ name: f, description: featOpt?.description || 'Dote', level: 1, source: 'Dote' });
    });

    const iconMap: Record<string, string> = { 'Clase': 'shield', 'Subclase': 'auto_awesome', 'Raza': 'face', 'Dote': 'military_tech' };

    return (
        <div className="px-4 pb-24 flex flex-col gap-3 mt-4">
            {features.map((feat, idx) => {
                const icon = iconMap[feat.source] || 'stars';
                return (
                    <div key={idx} onClick={() => setSelectedFeature(feat)} className="relative overflow-hidden rounded-xl bg-surface-dark border border-white/5 shadow-sm hover:border-primary/30 transition-all cursor-pointer group active:scale-[0.99]">
                        <div className="p-4 flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <h3 className="text-white text-base font-bold leading-tight truncate group-hover:text-primary transition-colors">{feat.name}</h3>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                        <span className="material-symbols-outlined text-[10px]">{icon}</span>
                                        {feat.source}
                                    </span>
                                    {feat.level > 0 && <span className="text-[10px] text-slate-500 font-bold px-1">Lvl {feat.level}</span>}
                                </div>
                                {feat.description && (
                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                        {feat.description.replace(/\n/g, ' ')}
                                    </p>
                                )}
                            </div>
                            <span className="material-symbols-outlined text-slate-500 opacity-50 group-hover:opacity-100 transition-opacity">chevron_right</span>
                        </div>
                    </div>
                );
            })}
            {features.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">sentiment_dissatisfied</span>
                    <p className="text-sm italic text-slate-400">No hay rasgos disponibles.</p>
                </div>
            )}

            {/* Feature Modal */}
            {selectedFeature && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedFeature(null)}>
                    <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] relative" onClick={e => e.stopPropagation()}>
                        
                        <div className="flex justify-between items-start mb-4 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{selectedFeature.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        <span className="material-symbols-outlined text-[10px]">{iconMap[selectedFeature.source] || 'stars'}</span>
                                        {selectedFeature.source}
                                    </span>
                                    {selectedFeature.level > 0 && <span className="text-[10px] text-slate-500 font-bold">Nivel {selectedFeature.level}</span>}
                                </div>
                            </div>
                            <button onClick={() => setSelectedFeature(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 border-t border-slate-100 dark:border-white/5 pt-4">
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {selectedFeature.description || <span className="italic text-slate-500">Sin descripción disponible.</span>}
                            </p>
                        </div>

                        <div className="mt-6 pt-0 shrink-0">
                            <button onClick={() => setSelectedFeature(null)} className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-sm transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturesTab;
