
import React, { useState } from 'react';
import { Character, InventoryItem, ItemData, WeaponData, ArmorData } from '../../types';
import { ALL_ITEMS, MASTERY_DESCRIPTIONS, MAGIC_ITEMS } from '../../Data/items';
import { getItemData, getFinalStats } from '../../utils/sheetUtils';

interface InventoryTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
}

const InventoryTab: React.FC<InventoryTabProps> = ({ character, onUpdate }) => {
    const [showAddItem, setShowAddItem] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const inventory = character.inventory || [];

    const updateInventory = (newInventory: InventoryItem[]) => {
        onUpdate({ ...character, inventory: newInventory });
    };

    const addItem = (itemName: string) => {
        const newItem: InventoryItem = {
            id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: itemName,
            quantity: 1,
            equipped: false
        };
        updateInventory([newItem, ...inventory]);
        setShowAddItem(false);
        setSearchQuery('');
    };

    const toggleEquip = (itemId: string) => {
        const itemToToggle = inventory.find(i => i.id === itemId);
        if (!itemToToggle) return;
        
        const itemData = getItemData(itemToToggle.name);
        const isArmor = itemData?.type === 'Armor';
        const isShield = isArmor && (itemData as ArmorData).armorType === 'Shield';
        const isStandardArmor = isArmor && !isShield;
        
        const newInv = inventory.map(item => {
            if (item.id === itemId) return { ...item, equipped: !item.equipped };
            
            if (isShield && !itemToToggle.equipped && item.equipped) {
                 const idata = getItemData(item.name);
                 if (idata?.type === 'Armor' && (idata as ArmorData).armorType === 'Shield') {
                     return { ...item, equipped: false };
                 }
            }
            if (isStandardArmor && !itemToToggle.equipped && item.equipped) {
                 const idata = getItemData(item.name);
                 if (idata?.type === 'Armor' && (idata as ArmorData).armorType !== 'Shield') {
                     return { ...item, equipped: false };
                 }
            }
            return item;
        });
        updateInventory(newInv);
    };

    const removeItem = (itemId: string) => {
        updateInventory(inventory.filter(i => i.id !== itemId));
    };

    const totalWeight = inventory.reduce((acc, item) => {
        const itemData = getItemData(item.name);
        return acc + (itemData ? itemData.weight * item.quantity : 0);
    }, 0);
    
    const finalStats = getFinalStats(character);
    const carryCap = (finalStats.STR || 10) * 15;
    const equippedItems = inventory.filter(i => i.equipped);
    const backpackItems = inventory.filter(i => !i.equipped);

    const renderItemRow = (item: InventoryItem) => {
        const itemData = getItemData(item.name) || { name: item.name, type: 'Gear', weight: 0, cost: '-', description: '' };
        const isMagic = MAGIC_ITEMS[item.name] !== undefined;
        const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor' || isMagic;
        
        return (
        <div key={item.id} onClick={() => setSelectedItem(item)} className="group relative flex items-center gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
            <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden ${item.equipped ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-black/40 text-slate-600 dark:text-white'}`}>
            <span className="material-symbols-outlined relative z-10">{itemData.type === 'Weapon' ? 'swords' : itemData.type === 'Armor' ? 'shield' : isMagic ? 'auto_awesome' : 'backpack'}</span>
            </div>
            <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <p className="text-slate-900 dark:text-white font-semibold truncate">{item.name}</p>
                {item.quantity > 1 && <span className="text-xs text-slate-500">x{item.quantity}</span>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-body truncate">{itemData.weight} lb • {itemData.cost}</p>
            </div>
            <div className="flex items-center gap-2">
            {isEquippable && (<button onClick={(e) => { e.stopPropagation(); toggleEquip(item.id); }} className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${item.equipped ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-transparent'}`}>{item.equipped ? 'Equipped' : 'Equip'}</button>)}
            <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
            </div>
        </div>
        );
    };

    return (
    <div className="flex flex-col gap-5 px-4 pb-20">
       <div className="pt-4 shrink-0 flex flex-col gap-4">
           <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                 <label className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Encumbrance</label>
                 <span className="text-slate-800 dark:text-white text-sm font-medium"><span className={`${totalWeight > carryCap ? 'text-red-500' : 'text-primary'}`}>{totalWeight}</span> / {carryCap} lbs</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-surface-dark rounded-full overflow-hidden">
                 <div className={`h-full rounded-full ${totalWeight > carryCap ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (totalWeight / carryCap) * 100)}%` }}></div>
              </div>
           </div>

           <button 
                onClick={() => setShowAddItem(true)} 
                className="flex items-center justify-center gap-2 w-full py-3 bg-surface-light dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-xl text-primary font-bold hover:bg-primary/5 dark:hover:bg-white/10 transition-colors"
           >
               <span className="material-symbols-outlined text-lg">add_circle</span>
               <span>Add Item</span>
           </button>
       </div>

       {equippedItems.length > 0 && (<div className="flex flex-col gap-3"><h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">Equipamiento ({equippedItems.length})</h3>{equippedItems.map(renderItemRow)}</div>)}
       
       <div className="flex flex-col gap-3">
           <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">Mochila ({backpackItems.length})</h3>
           {backpackItems.length === 0 && (<div className="p-4 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-xl"><p className="text-sm text-slate-400 italic">La mochila está vacía.</p></div>)}
           {backpackItems.map(renderItemRow)}
       </div>

       {showAddItem && (
           <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col p-4 animate-fadeIn pt-[env(safe-area-inset-top)]">
               <div className="flex items-center gap-3 mb-4">
                   <button onClick={() => setShowAddItem(false)} className="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                   <div className="flex-1 relative"><input autoFocus type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 ring-primary/50"/><span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span></div>
               </div>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                   {Object.keys(ALL_ITEMS).filter(name => name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 50).map(name => {
                           const item = ALL_ITEMS[name];
                           return (<button key={name} onClick={() => addItem(name)} className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex justify-between items-center border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"><div><p className="font-bold text-slate-900 dark:text-white">{name}</p><p className="text-xs text-slate-500">{item.type} • {item.cost}</p></div><span className="material-symbols-outlined text-slate-300">add</span></button>);
                       })}
               </div>
           </div>
       )}

       {/* Centered Item Detail Modal */}
       {selectedItem && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedItem(null)}>
            <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl animate-scaleUp flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                {(() => {
                    const itemData = (getItemData(selectedItem.name) || { name: selectedItem.name, type: 'Gear', weight: 0, cost: '-', description: '' }) as ItemData;
                    const isMagic = MAGIC_ITEMS[selectedItem.name] !== undefined;
                    const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor' || isMagic;
                    const asWeapon = itemData as WeaponData;
                    const asArmor = itemData as ArmorData;
                    return (
                        <>
                           <div className="flex items-start justify-between mb-4">
                               <div className="min-w-0 pr-4">
                                   <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{selectedItem.name}</h3>
                                   <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{itemData.type}</span>
                               </div>
                               <button onClick={() => setSelectedItem(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600">
                                   <span className="material-symbols-outlined">close</span>
                               </button>
                           </div>
                           <div className="flex-1 overflow-y-auto space-y-3 mb-6 no-scrollbar pr-1 border-t border-slate-100 dark:border-white/5 pt-4">
                               <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">Weight</span><span className="font-bold text-slate-900 dark:text-white">{itemData.weight} lb</span></div>
                               <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">Cost</span><span className="font-bold text-slate-900 dark:text-white">{itemData.cost}</span></div>
                               {itemData.type === 'Weapon' && (<><div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">Damage</span><span className="font-bold text-slate-900 dark:text-white">{asWeapon.damage} {asWeapon.damageType}</span></div>{asWeapon.properties && asWeapon.properties.length > 0 && (<div className="py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500 block mb-1">Properties</span><div className="flex flex-wrap gap-1">{asWeapon.properties.map(p => (<span key={p} className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded text-xs font-medium text-slate-600 dark:text-slate-300">{p}</span>))}</div></div>)}{asWeapon.mastery && (<div className="py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500 block mb-1">Mastery: <span className="font-bold text-primary">{asWeapon.mastery}</span></span><p className="text-xs text-slate-400 italic leading-snug">{MASTERY_DESCRIPTIONS[asWeapon.mastery]}</p></div>)}</>)}
                               {itemData.type === 'Armor' && (<div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">AC</span><span className="font-bold text-slate-900 dark:text-white">{asArmor.baseAC} {asArmor.armorType === 'Shield' ? '(Shield)' : asArmor.armorType === 'Light' ? '+ Dex' : asArmor.armorType === 'Medium' ? '+ Dex (max 2)' : ''}</span></div>)}
                               {itemData.description && (<div className="py-2"><p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">{itemData.description}</p></div>)}
                           </div>
                           <div className="grid grid-cols-2 gap-3 shrink-0 pt-2">
                               {isEquippable && (
                                   <button 
                                       onClick={() => { toggleEquip(selectedItem.id); setSelectedItem(null); }} 
                                       className={`py-3.5 rounded-2xl font-bold text-sm transition-all ${selectedItem.equipped ? 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' : 'bg-primary text-background-dark shadow-lg shadow-primary/20'}`}
                                   >
                                       {selectedItem.equipped ? 'Unequip' : 'Equip'}
                                   </button>
                               )}
                               <button 
                                   onClick={() => { removeItem(selectedItem.id); setSelectedItem(null); }} 
                                   className={`py-3.5 rounded-2xl font-bold text-sm bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all ${!isEquippable ? 'col-span-2' : ''}`}
                               >
                                   Remove
                               </button>
                           </div>
                        </>
                    );
                })()}
            </div>
         </div>
       )}
    </div>
  );
};

export default InventoryTab;
