"use client";

import React, { useState } from 'react';
import { 
  Receipt, Plus, Trash2, Filter, 
  TrendingDown, Zap, Truck, Users, Coffee, Home
} from 'lucide-react';

export default function ExpensesTabContent({ isDarkMode }) {
  const [expenses, setExpenses] = useState([
    { id: 1, label: "Loyer Local Janvier", amount: 150000, category: "Loyer", date: "05 Janv. 2026", type: "Fixe" },
    { id: 2, label: "Facture Électricité", amount: 45000, category: "Énergie", date: "12 Janv. 2026", type: "Fixe" },
    { id: 3, label: "Course Marché (Transport)", amount: 5000, category: "Transport", date: "28 Janv. 2026", type: "Variable" },
    { id: 4, label: "Achat Emballages", amount: 12000, category: "Divers", date: "30 Janv. 2026", type: "Variable" },
  ]);

  const categories = [
    { name: "Loyer", icon: <Home size={16} /> },
    { name: "Énergie", icon: <Zap size={16} /> },
    { name: "Transport", icon: <Truck size={16} /> },
    { name: "Salaires", icon: <Users size={16} /> },
    { name: "Divers", icon: <Coffee size={16} /> },
  ];

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="fade-in text-left pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">Charges & Dépenses</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">Gestion des frais hors inventaire</p>
        </div>
        
        <button className="bg-[#00D9FF] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3">
          <Plus size={16} /> Enregistrer un frais
        </button>
      </div>

      {/* --- RÉSUMÉ --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-600'}`}>
              <TrendingDown size={24} />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-black mb-1">Total Charges</p>
          <p className="text-3xl font-black italic">{totalExpenses.toLocaleString()} F</p>
        </div>

        {/* Petit breakdown rapide */}
        <div className={`md:col-span-2 p-8 rounded-[40px] border flex flex-wrap gap-8 items-center ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          {categories.slice(0, 4).map((cat, idx) => (
            <div key={idx} className="text-left">
              <div className="flex items-center gap-2 opacity-40 mb-1">
                {cat.icon}
                <span className="text-[10px] uppercase font-black tracking-widest">{cat.name}</span>
              </div>
              <p className="font-bold text-lg">
                {expenses.filter(e => e.category === cat.name).reduce((a, b) => a + b.amount, 0).toLocaleString()} F
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- TABLEAU DES DÉPENSES --- */}
      <div className={`rounded-[40px] border overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <table className="w-full text-left">
          <thead>
            <tr className={isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'}>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Libellé / Date</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Catégorie</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Type</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40 text-right">Montant</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {expenses.map((exp) => (
              <tr key={exp.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="px-8 py-6">
                  <p className="font-black text-sm tracking-tight">{exp.label}</p>
                  <p className="text-[10px] opacity-40 font-bold">{exp.date}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    {exp.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${exp.type === 'Fixe' ? 'text-purple-500' : 'text-[#00D9FF]'}`}>
                    ● {exp.type}
                  </span>
                </td>
                <td className="px-8 py-6 text-right font-black text-sm">{exp.amount.toLocaleString()} F</td>
                <td className="px-8 py-6 text-right">
                  <button className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10' : 'bg-gray-100 text-gray-500 hover:text-red-600 hover:bg-red-50'}`}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}