"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, AlertCircle, X, ShoppingBag, Check, Minus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function MenuTabContent({ isDarkMode, cart, setCart, setActiveTab, pendingOrder, setPendingOrder }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la gestion du menu (CRUD)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // États pour la prise de commande
  const [orderType, setOrderType] = useState(pendingOrder?.order_type || "Sur place");
  const [tableNum, setTableNum] = useState(pendingOrder?.table_number || "");

  useEffect(() => { 
    fetchDishes(); 
    if (pendingOrder) {
        setOrderType(pendingOrder.order_type || "Sur place");
        setTableNum(pendingOrder.table_number || "");
    }
  }, [pendingOrder]);

  // --- 1. LECTURE FILTRÉE PAR USER_ID ---
  const fetchDishes = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser(); // Récupération user
      
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('restaurant_id', user.id) // FILTRE CRITIQUE
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) { 
      console.error('Erreur:', error.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const addToCart = (dish) => {
    setCart(prev => [...prev, { ...dish, cartId: Math.random() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // --- 2. FINALISATION COMMANDE AVEC USER_ID ---
  const finalizeOrder = async () => {
    if (orderType === "Sur place" && !tableNum) return alert("Précisez le numéro de table.");
    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('orders').insert([{
        restaurant_id: user.id, // INJECTION USER_ID
        table_number: orderType === "Emporter" ? "Emporter" : `Table ${tableNum}`,
        items_summary: cart.map(item => item.name).join(", "),
        items_details: cart,
        total_amount: total,
        status: "En cours"
      }]);
      
      if (error) throw error;
      
      setCart([]);
      setPendingOrder(null); 
      setActiveTab("orders");
    } catch (error) { 
      alert("Erreur: " + error.message); 
    }
  };

  // --- 3. SAUVEGARDE PLAT AVEC USER_ID ---
  const handleSaveDish = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const dishData = {
        restaurant_id: user.id, // INJECTION USER_ID
        name: formData.get('name'),
        price: parseInt(formData.get('price')),
        category: formData.get('category'),
        image_url: formData.get('image'),
        status: 'Disponible'
      };

      if (editingItem?.id) {
        // Update filtré par ID et UserID (Double sécurité)
        await supabase
          .from('dishes')
          .update(dishData)
          .eq('id', editingItem.id)
          .eq('restaurant_id', user.id);
      } else {
        await supabase.from('dishes').insert([dishData]);
      }
      
      setIsModalOpen(false);
      fetchDishes();
    } catch (error) { 
      alert("Erreur sauvegarde"); 
    }
  };

  const confirmDeleteDish = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase
        .from('dishes')
        .delete()
        .eq('id', itemToDelete.id)
        .eq('restaurant_id', user.id); // SÉCURITÉ : On ne supprime que chez soi
        
      setIsDeleteModalOpen(false);
      fetchDishes();
    } catch (error) { 
      alert("Erreur suppression"); 
    }
  };

  // ... (Le reste du JSX reste identique à ton code initial)
  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 overflow-hidden no-print">
      {/* --- PANIER PERMANENT (GAUCHE) --- */}
      <div className={`w-80 flex flex-col rounded-[40px] border transition-all ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
        <div className="p-6 border-b border-white/5 text-left">
          <div className="flex items-center gap-3 mb-1">
            <ShoppingBag className="text-[#00D9FF]" size={20} />
            <h3 className="font-black italic tracking-tighter text-xl text-left">Panier</h3>
          </div>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-left">Vérifiez la commande</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-sm">
              <Plus size={40} className="mb-2" />
              <p>Panier vide</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className={`group p-4 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-left-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="text-left">
                  <p className="text-xs font-black leading-none mb-1 text-left">{item.name}</p>
                  <p className="text-[10px] font-bold text-[#00D9FF]">{item.price.toLocaleString()} F</p>
                </div>
                <button onClick={() => removeFromCart(item.cartId)} className="p-2 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                  <Minus size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/5 space-y-4">
            <div className="space-y-2">
              <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className={`w-full p-3 rounded-xl text-xs font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                <option value="Sur place">Sur place</option>
                <option value="Emporter">Emporter</option>
              </select>
              {orderType === "Sur place" && (
                <input type="text" placeholder="N° Table" value={tableNum} onChange={(e) => setTableNum(e.target.value)} className={`w-full p-3 rounded-xl text-xs font-bold outline-none ${isDarkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-gray-50 border-gray-100'}`} />
              )}
            </div>
            <div className="flex justify-between items-end mb-2">
              <p className="text-[10px] font-black opacity-40 uppercase">Total</p>
              <p className="text-2xl font-black italic text-[#00D9FF]">{cart.reduce((a, b) => a + b.price, 0).toLocaleString()} F</p>
            </div>
            <button onClick={finalizeOrder} className="w-full py-4 bg-[#00D9FF] text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
              Valider la commande
            </button>
          </div>
        )}
      </div>

      {/* --- GRILLE DU MENU (DROITE) --- */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div className="text-left">
            <h3 className="text-3xl font-black italic tracking-tighter text-left">Carte du Restaurant</h3>
            <p className="opacity-50 text-sm font-light uppercase tracking-widest text-left text-left">Survolez un plat pour l'ajouter</p>
          </div>
          <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="bg-[#00D9FF] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3">
            <Plus size={18} /> ajouter un plat
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className={`group relative rounded-[35px] overflow-hidden border transition-all duration-500 ${isDarkMode ? 'bg-[#0a0a0a] border-white/5 hover:border-[#00D9FF]/30' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="h-44 relative overflow-hidden">
                <img src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                  <button onClick={() => addToCart(item)} className="w-12 h-12 bg-[#00D9FF] text-black rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    <Plus size={24} strokeWidth={3} />
                  </button>
                  <div className="flex gap-2 text-left">
                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-[#00D9FF] hover:text-black transition-all">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => { setItemToDelete(item); setIsDeleteModalOpen(true); }} className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-red-500 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 text-left">
                <div className="flex justify-between items-start mb-1 text-left">
                  <h4 className="text-lg font-black tracking-tight leading-tight text-left">{item.name}</h4>
                  <p className="text-[#00D9FF] font-black text-sm whitespace-nowrap ml-2">{item.price?.toLocaleString()} F</p>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30 italic text-left">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALES (Identiques mais appellent les fonctions sécurisées) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
          <form onSubmit={handleSaveDish} className={`w-full max-w-lg rounded-[45px] p-10 border shadow-2xl ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
            <h3 className="text-2xl font-black mb-8 italic tracking-tighter text-left">
              {editingItem?.id ? "Modifier le Plat" : "Nouveau Plat"}
            </h3>
            <div className="space-y-6 text-left">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">Nom du plat</label>
                <input name="name" type="text" required defaultValue={editingItem?.name} className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-[#00D9FF]' : 'bg-gray-50 border-gray-100'}`} placeholder="ex: Garba Royal" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">Prix (F)</label>
                  <input name="price" type="number" required defaultValue={editingItem?.price} className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`} />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">Catégorie</label>
                  <select name="category" defaultValue={editingItem?.category} className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-[#151515] border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                    <option>Plats</option>
                    <option>Boissons</option>
                    <option>Accompagnements</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">URL de la photo</label>
                <input name="image" type="text" defaultValue={editingItem?.image_url} className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`} placeholder="Lien de l'image" />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold opacity-50">Annuler</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl font-black bg-[#00D9FF] text-black shadow-lg">Enregistrer</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* MODALE SUPPRESSION PLAT */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
          <div className={`w-full max-w-sm rounded-[40px] p-8 border shadow-2xl ${isDarkMode ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-center mb-2 uppercase tracking-tighter">Supprimer de la carte ?</h3>
            <p className="text-sm opacity-50 text-center mb-8 italic">"{itemToDelete?.name}" disparaîtra définitivement.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-xs uppercase bg-white/5">Annuler</button>
              <button onClick={confirmDeleteDish} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase bg-red-500 text-white shadow-lg">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}