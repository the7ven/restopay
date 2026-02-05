"use client";

import React, { useState } from 'react';
import { 
  ShoppingBag, Clock, CheckCircle2, ChevronRight, 
  Plus, Filter, MoreVertical, Flame, Utensils , Search
} from 'lucide-react';

export default function OrdersTabContent({ isDarkMode }) {
  const [orders, setOrders] = useState([
    { id: "ORD-7721", table: "T.05", items: "2x Poisson Grillé, 1x Alloco", time: "Il y a 5 min", status: "En cours", total: "10.000 F", priority: "high" },
    { id: "ORD-7722", table: "T.12", items: "1x Garba Royal, 2x Bissap", time: "Il y a 12 min", status: "Prêt", total: "4.500 F", priority: "medium" },
    { id: "ORD-7723", table: "T.02", items: "1x Poulet Braisé, 1x Coca", time: "Il y a 20 min", status: "Servi", total: "7.500 F", priority: "low" },
    { id: "ORD-7724", table: "T.08", items: "3x Choukouya de Mouton", time: "Il y a 2 min", status: "En cours", total: "15.000 F", priority: "high" },
  ]);

  const statusColors = {
    "En cours": isDarkMode ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-orange-50 text-orange-600 border-orange-100",
    "Prêt": isDarkMode ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-green-50 text-green-600 border-green-100",
    "Servi": isDarkMode ? "bg-white/5 text-white/30 border-white/5" : "bg-gray-50 text-gray-400 border-gray-100",
  };

  return (
    <div className="fade-in text-left">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">Commandes Live</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">Suivi des flux en cuisine et salle</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className={`flex-1 md:w-64 flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <Search size={18} className="opacity-30" />
            <input type="text" placeholder="Rechercher une table..." className="bg-transparent outline-none text-sm w-full" />
          </div>
          <button className="flex items-center gap-2 bg-[#00D9FF] text-black px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-cyan-500/20">
              <Plus size={18} /> <span className="hidden sm:inline">nouvelle commande</span>
          </button>
        </div>
      </div>

      {/* --- STATS RAPIDES --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <QuickStat isDarkMode={isDarkMode} label="En attente" value="14" icon={<Flame className="text-orange-500" />} />
        <QuickStat isDarkMode={isDarkMode} label="Prêt à servir" value="06" icon={<Utensils className="text-green-500" />} />
        <QuickStat isDarkMode={isDarkMode} label="Temps moyen" value="18 min" icon={<Clock className="text-[#00D9FF]" />} />
      </div>

      {/* --- LISTE DES COMMANDES --- */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className={`group p-6 rounded-[35px] border transition-all duration-500 flex flex-col lg:flex-row items-center justify-between gap-6 ${isDarkMode ? 'bg-[#0a0a0a] border-white/5 hover:border-[#00D9FF]/30' : 'bg-white border-gray-100 shadow-sm hover:shadow-xl'}`}>
            
            <div className="flex items-center gap-6 w-full lg:w-auto">
              <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center font-black text-xl transition-all ${order.status === 'En cours' ? 'bg-[#00D9FF] text-black shadow-lg shadow-cyan-500/20' : isDarkMode ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'}`}>
                {order.table}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-black text-lg tracking-tight">{order.id}</h4>
                  {order.priority === 'high' && <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
                </div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{order.items}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 lg:gap-12 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-white/5">
              <div className="text-left lg:text-right">
                <p className="text-[10px] uppercase tracking-widest opacity-40 font-black">Total</p>
                <p className="font-black text-[#00D9FF]">{order.total}</p>
              </div>
              
              <div className="text-left lg:text-right">
                <p className="text-[10px] uppercase tracking-widest opacity-40 font-black">Attente</p>
                <p className="text-xs font-bold flex items-center gap-2">
                  <Clock size={12} /> {order.time}
                </p>
              </div>

              <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.status]}`}>
                {order.status}
              </div>

              <button className={`p-3 rounded-2xl transition-all ${isDarkMode ? 'bg-white/5 text-white/20 hover:text-white' : 'bg-gray-50 text-gray-400 hover:text-black'}`}>
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickStat({ isDarkMode, label, value, icon }) {
  return (
    <div className={`p-6 rounded-[30px] border flex items-center gap-5 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>{icon}</div>
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black">{label}</p>
        <p className="text-2xl font-black italic">{value}</p>
      </div>
    </div>
  );
}