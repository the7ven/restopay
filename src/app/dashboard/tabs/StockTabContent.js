"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  X,
  ClipboardList,
  Loader2
} from "lucide-react";
import { supabase } from '@/lib/supabase';

export default function StockTabContent({ isDarkMode }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", category: "Épicerie", stock: 0, unit: "", min_stock: 0 });

  useEffect(() => {
    fetchInventory();
    
    // Écoute en temps réel des changements sur la table inventory
    const channel = supabase.channel('stock_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => fetchInventory())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('restaurant_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (err) {
      console.error("Erreur chargement stock:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ 
        name: item.name, 
        category: item.category, 
        stock: item.stock, 
        unit: item.unit, 
        min_stock: item.min_stock 
      });
    } else {
      setEditingItem(null);
      setFormData({ name: "", category: "Épicerie", stock: 0, unit: "", min_stock: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    const payload = { ...formData, restaurant_id: user.id };

    if (editingItem) {
      await supabase.from('inventory').update(payload).eq('id', editingItem.id);
    } else {
      await supabase.from('inventory').insert([payload]);
    }

    setIsModalOpen(false);
    fetchInventory();
  };

  const handleDelete = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
      await supabase.from('inventory').delete().eq('id', id);
      fetchInventory();
    }
  };

  const getStatusColor = (item) => {
    if (item.stock <= item.min_stock / 2) return "text-red-500 bg-red-500/10 border-red-500/20";
    if (item.stock <= item.min_stock) return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    return "text-green-500 bg-green-500/10 border-green-500/20";
  };

  const criticalCount = inventory.filter(item => item.stock <= item.min_stock).length;

  if (loading && inventory.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#00D9FF] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Inventaire en cours de chargement...</p>
      </div>
    );
  }

  return (
    <div className="fade-in text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="text-left">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">Inventaire & Stocks</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest text-left">Suivi des consommables et approvisionnement</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-[#00D9FF] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3"
        >
          <Plus size={16} /> Ajouter un article
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StockStatCard isDarkMode={isDarkMode} label="Articles en Alerte" value={String(criticalCount).padStart(2, "0")} icon={<AlertTriangle className="text-red-500" />} />
        <StockStatCard isDarkMode={isDarkMode} label="Total Références" value={String(inventory.length).padStart(2, "0")} icon={<Package className="text-[#00D9FF]" />} />
        <StockStatCard isDarkMode={isDarkMode} label="Mise à jour" value="Live" icon={<ClipboardList className="text-green-500" />} />
      </div>

      <div className={`rounded-[40px] border overflow-hidden ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDarkMode ? "border-white/5" : "border-gray-50"}`}>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black opacity-40">Produit</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black opacity-40">Stock / Min</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black opacity-40">Statut</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black opacity-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {inventory.length === 0 ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center opacity-20 italic">Aucun article en stock</td></tr>
              ) : inventory.map((item) => (
                <tr key={item.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6 text-left">
                    <p className="font-black text-sm tracking-tight uppercase">{item.name}</p>
                    <p className="text-[10px] opacity-40 font-bold">{item.category} • {item.unit}</p>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <div className="flex items-center gap-3">
                      <p className="font-black text-lg">{item.stock}</p>
                      <span className="text-[10px] opacity-30">/ min {item.min_stock}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(item)}`}>
                      {item.stock <= item.min_stock / 2 ? "Critique" : item.stock <= item.min_stock ? "Alerte" : "Normal"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(item)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? "bg-white/5 text-white/40 hover:text-[#00D9FF]" : "bg-gray-100 text-gray-500 hover:text-cyan-600"}`}><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? "bg-white/5 text-white/40 hover:text-red-500" : "bg-gray-100 text-gray-500 hover:text-red-600"}`}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
          <form onSubmit={handleSubmit} className={`w-full max-w-lg rounded-[45px] p-10 border shadow-2xl ${isDarkMode ? "bg-[#0a0a0a] border-white/10 text-white" : "bg-white border-gray-100"}`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">{editingItem ? "Modifier" : "Nouvel Article"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="opacity-40 hover:opacity-100"><X /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 mb-2 block text-left">Nom de l'article</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-white/5 border-white/10 focus:border-[#00D9FF]" : "bg-gray-50 border-gray-100"}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 mb-2 block text-left">Unité (ex: kg, sac)</label>
                  <input required type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className={`w-full px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 mb-2 block text-left">Catégorie</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={`w-full px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-[#151515] border-white/10" : "bg-gray-50 border-gray-100"}`}>
                    <option>Épicerie</option><option>Frais</option><option>Énergie</option><option>Liquide</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 mb-2 block text-left">Stock Actuel</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className={`w-full px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 mb-2 block text-left">Stock d'alerte</label>
                  <input required type="number" value={formData.min_stock} onChange={e => setFormData({...formData, min_stock: parseInt(e.target.value)})} className={`w-full px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"}`} />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold opacity-50 uppercase text-xs">Annuler</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-black bg-[#00D9FF] text-black shadow-lg shadow-cyan-500/20 uppercase text-xs tracking-widest">Enregistrer</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function StockStatCard({ isDarkMode, label, value, icon }) {
  return (
    <div className={`p-6 rounded-[35px] border flex items-center gap-5 ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
      <div className={`p-3.5 rounded-2xl ${isDarkMode ? "bg-white/5" : "bg-gray-50"}`}>{icon}</div>
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black">{label}</p>
        <p className="text-2xl font-black italic tracking-tighter">{value}</p>
      </div>
    </div>
  );
}