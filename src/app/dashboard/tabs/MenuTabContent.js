"use client";

import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';

export default function MenuTabContent({ isDarkMode }) {
  const [items, setItems] = useState([
    { id: 1, name: "Poisson Grillé", price: 4500, category: "Plats", image: "https://images.unsplash.com/photo-1594005254533-257acb43eb94?q=80&w=500&auto=format&fit=crop", status: "Disponible" },
    { id: 2, name: "Bissap Royal", price: 1000, category: "Boissons", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=500&auto=format&fit=crop", status: "Disponible" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem({ name: "", price: "", category: "Plats", image: "", status: "Disponible" });
    setIsModalOpen(true);
  };

  return (
    <div className="fade-in text-left">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">Carte du Restaurant</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">Gérez vos créations culinaires</p>
          <button 
          onClick={handleAddNew}
          className="bg-[#00D9FF] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3"
        >
          <Plus size={18} /> ajouter un plat
        </button>
        </div>
        <button className="flex items-center gap-2 bg-[#00D9FF] text-black px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-cyan-500/20">
              <Plus size={18} /> <span className="hidden sm:inline">nouvelle commande</span>
        </button>
        
       
      </div>

      {/* Ajustement de la grille : 4 colonnes sur très grand écran, 3 sur large, 2 sur tablette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className={`group relative rounded-[35px] overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-[#0a0a0a] border-white/5 hover:border-[#00D9FF]/30' : 'bg-white border-gray-100 shadow-sm hover:shadow-xl'}`}>
            {/* Hauteur de l'image réduite (h-48 au lieu de h-56) */}
            <div className="h-44 relative overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                {item.category}
              </div>
            </div>

            {/* Padding réduit (p-6 au lieu de p-8) */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-black tracking-tight leading-tight">{item.name}</h4>
                <p className="text-[#00D9FF] font-black text-sm whitespace-nowrap">{item.price} F</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'Disponible' ? 'text-green-500' : 'text-red-400'}`}>
                  ● {item.status}
                </span>
                <div className="flex gap-1.5">
                  <button onClick={() => handleEdit(item)} className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-all">
                    <Edit3 size={16} />
                  </button>
                  <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
          <div className={`w-full max-w-lg rounded-[45px] p-10 border shadow-2xl ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
            <h3 className="text-2xl font-black mb-8 italic tracking-tighter text-left">
              {editingItem?.id ? "Éditer le Plat" : "Nouveau Plat"}
            </h3>
            
            <div className="space-y-6 text-left">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">Nom du plat</label>
                <input 
                  type="text" 
                  defaultValue={editingItem?.name}
                  className={`w-full mt-2 px-6 py-4 rounded-2xl border transition-all outline-none ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-[#00D9FF]' : 'bg-gray-50 border-gray-100 focus:border-[#00D9FF]'}`} 
                  placeholder="ex: Garba Royal"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">Prix (FCFA)</label>
                  <input type="number" defaultValue={editingItem?.price} className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">Catégorie</label>
                  <select className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-[#151515] border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <option>Plats</option>
                    <option>Boissons</option>
                    <option>Accompagnements</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">URL de la photo</label>
                <input type="text" defaultValue={editingItem?.image} className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`} placeholder="Lien de l'image (Unsplash, etc.)" />
              </div>

              <div className="flex gap-4 pt-6">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold opacity-50 hover:opacity-100 transition-opacity">Annuler</button>
                <button className="flex-1 py-4 rounded-2xl font-black bg-[#00D9FF] text-black shadow-lg shadow-cyan-500/20">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}