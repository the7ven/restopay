"use client";

import React, { useState, useEffect } from 'react';
import { 
  Receipt, Plus, Trash2, TrendingDown, Zap, Truck, Users, Coffee, Home, X, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ExpensesTabContent({ isDarkMode, selectedDate }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ label: '', amount: '', category: 'Divers', type: 'Variable' });

  const categories = [
    { name: "Loyer", icon: <Home size={16} /> },
    { name: "Énergie", icon: <Zap size={16} /> },
    { name: "Transport", icon: <Truck size={16} /> },
    { name: "Salaires", icon: <Users size={16} /> },
    { name: "Divers", icon: <Coffee size={16} /> },
  ];

  useEffect(() => {
    fetchExpenses();
    const channel = supabase.channel('expenses_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, fetchExpenses)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [selectedDate]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      // Filtrage strict sur la date sélectionnée (YYYY-MM-DD)
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('created_at', `${selectedDate}T00:00:00.000Z`)
        .lte('created_at', `${selectedDate}T23:59:59.999Z`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      // Construction du timestamp précis pour éviter les erreurs de schéma
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0]; // ex: "14:30:15"
      const fullTimestamp = `${selectedDate}T${timeString}Z`;

      const { error } = await supabase.from('expenses').insert([{
        label: newExpense.label,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        type: newExpense.type,
        created_at: fullTimestamp 
      }]);

      if (error) throw error;
      
      setIsModalOpen(false);
      setNewExpense({ label: '', amount: '', category: 'Divers', type: 'Variable' });
      fetchExpenses();
    } catch (err) {
      alert("Erreur Supabase: " + err.message);
    }
  };

  const deleteExpense = async (id) => {
    if(confirm("Supprimer cette dépense ?")) {
      await supabase.from('expenses').delete().eq('id', id);
      fetchExpenses();
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="fade-in text-left pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="text-left">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">Charges & Dépenses</h3>
          <p className="opacity-50 text-[10px] font-black uppercase tracking-widest text-left">
            Pointage du {new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00D9FF] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
        >
          <Plus size={16} /> Enregistrer un frais
        </button>
      </div>

      {/* --- RÉSUMÉ DES CHARGES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-600'}`}>
            <TrendingDown size={24} />
          </div>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-black mb-1 text-left">Sorties de caisse</p>
          <p className="text-3xl font-black italic text-left text-red-500">{totalExpenses.toLocaleString()} F</p>
        </div>

        <div className={`md:col-span-2 p-8 rounded-[40px] border flex flex-wrap gap-8 items-center ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          {categories.map((cat, idx) => {
            const amount = expenses.filter(e => e.category === cat.name).reduce((a, b) => a + b.amount, 0);
            return (
              <div key={idx} className="text-left">
                <div className="flex items-center gap-2 opacity-40 mb-1">
                  {cat.icon}
                  <span className="text-[10px] uppercase font-black tracking-widest">{cat.name}</span>
                </div>
                <p className={`font-bold text-lg ${amount > 0 ? 'text-red-500' : ''}`}>{amount.toLocaleString()} F</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* --- LISTE DES DÉPENSES --- */}
      <div className={`rounded-[40px] border overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#00D9FF] mb-4" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Lecture de la base...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'}>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Dépense</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40 text-center">Catégorie</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40 text-right">Montant</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {expenses.length === 0 ? (
                  <tr><td colSpan="4" className="p-20 text-center opacity-20 italic font-medium">Aucune charge enregistrée pour cette date.</td></tr>
                ) : expenses.map((exp) => (
                  <tr key={exp.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-8 py-6 text-left">
                      <p className="font-black text-sm tracking-tight text-left">{exp.label}</p>
                      <p className="text-[9px] opacity-40 font-bold uppercase tracking-tighter">{new Date(exp.created_at).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-tighter ${isDarkMode ? 'bg-white/5 border-white/10 text-white/50' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-sm text-red-500">-{exp.amount.toLocaleString()} F</td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => deleteExpense(exp.id)} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-white/20 hover:text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-600'}`}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODALE D'AJOUT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
          <div className={`w-full max-w-md p-10 rounded-[45px] border shadow-2xl ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Nouveau frais</h3>
              <button onClick={() => setIsModalOpen(false)} className="opacity-50 hover:opacity-100 transition-all"><X /></button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-6 text-left">
              <div>
                <label className="text-[10px] font-black uppercase opacity-40 ml-4">Libellé de la dépense</label>
                <input required value={newExpense.label} onChange={e => setNewExpense({...newExpense, label: e.target.value})} className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`} placeholder="ex: Facture CIE" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 ml-4">Montant (F)</label>
                  <input required type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`} placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 ml-4">Catégorie</label>
                  <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className={`w-full mt-2 px-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-[#00D9FF] text-black font-black rounded-2xl shadow-lg uppercase text-[10px] tracking-widest mt-4 active:scale-95 transition-all">
                Valider l'écriture
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}