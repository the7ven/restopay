"use client";

import React, { useState } from 'react';
import { 
  Wallet, Banknote, Smartphone, CreditCard, 
  ArrowUpRight, ArrowDownRight, History, ShieldCheck, 
  Lock, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CashierTabContent({ isDarkMode }) {
  const [sessionOpen, setSessionOpen] = useState(true);

  // Données pour les heures chaudes (Ventes par tranches horaires)
  const hourlyData = [
    { hour: '12h', sales: 120000 },
    { hour: '13h', sales: 185000 },
    { hour: '14h', sales: 95000 },
    { hour: '18h', sales: 45000 },
    { hour: '19h', sales: 110000 },
    { hour: '20h', sales: 220000 },
    { hour: '21h', sales: 150000 },
    { hour: '22h', sales: 70000 },
  ];

  const sessionStats = {
    openedAt: "12:30",
    totalSales: "795.500",
    paymentMethods: [
      { name: "Espèces", amount: "450.000", icon: <Banknote size={20} className="text-green-500" /> },
      { name: "Mobile Money", amount: "285.500", icon: <Smartphone size={20} className="text-[#00D9FF]" /> },
      { name: "Carte Bancaire", amount: "60.000", icon: <CreditCard size={20} className="text-purple-500" /> },
    ]
  };

  return (
    <div className="fade-in text-left">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">Gestion de Caisse</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">Flux financiers et rush journalier</p>
        </div>
        
        <div className="flex gap-4">
          <button className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold text-sm transition-all ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <History size={18} /> Historique
          </button>
          <button className="flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 hover:scale-105 transition-all">
            <Lock size={16} /> Clôturer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE --- */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Main Balance Card */}
          <div className={`p-10 rounded-[45px] border relative overflow-hidden group ${isDarkMode ? 'bg-[#0a0a0a] border-[#00D9FF]/20' : 'bg-white border-cyan-100 shadow-xl shadow-cyan-500/5'}`}>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Wallet size={150} className="text-[#00D9FF]" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[#00D9FF] text-xs font-black uppercase tracking-widest">Session Active • Depuis {sessionStats.openedAt}</p>
              </div>
              <h2 className={`text-5xl lg:text-7xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {sessionStats.totalSales} <span className="text-xl opacity-30 font-bold">FCFA</span>
              </h2>
              <p className="text-sm opacity-50 font-medium">Encaissement total en temps réel</p>
            </div>
          </div>

          {/* GRAPHIQUE DES HEURES CHAUDES */}
          <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-lg font-black flex items-center gap-2">
                <TrendingUp size={20} className="text-[#00D9FF]" /> Pics d'activité (Heures Chaudes)
              </h4>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Aujourd'hui</p>
            </div>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <XAxis 
                    dataKey="hour" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: isDarkMode ? '#555' : '#999', fontSize: 11, fontWeight: 'bold'}}
                  />
                  <Tooltip 
                    cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}}
                    contentStyle={{ backgroundColor: isDarkMode ? '#111' : '#fff', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="sales" radius={[6, 6, 6, 6]}>
                    {hourlyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.sales > 150000 ? '#00D9FF' : isDarkMode ? '#222' : '#eee'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {sessionStats.paymentMethods.map((method, idx) => (
              <div key={idx} className={`p-6 rounded-[35px] border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  {method.icon}
                </div>
                <p className="text-[10px] uppercase font-black opacity-40 tracking-widest mb-1">{method.name}</p>
                <p className="text-xl font-black italic">{method.amount} F</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- COLONNE DROITE --- */}
        <div className={`p-8 rounded-[40px] border flex flex-col ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h4 className="text-lg font-black mb-6 flex items-center gap-2">
            <ShieldCheck size={20} className="text-green-500" /> Flux récents
          </h4>
          
          <div className="space-y-4 flex-1">
            <CashFlowItem isDarkMode={isDarkMode} type="in" title="Table 05 • Espèces" amount="+8.500" time="14:20" />
            <CashFlowItem isDarkMode={isDarkMode} type="in" title="Table 12 • Orange Money" amount="+12.000" time="14:05" />
            <CashFlowItem isDarkMode={isDarkMode} type="out" title="Achat Gaz (Dépense)" amount="-15.000" time="13:45" color="text-red-400" />
            <CashFlowItem isDarkMode={isDarkMode} type="in" title="Table 02 • Espèces" amount="+4.500" time="13:20" />
          </div>

          <button className={`mt-8 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
            Voir tout le journal
          </button>
        </div>

      </div>
    </div>
  );
}

function CashFlowItem({ type, title, amount, time, isDarkMode, color = "text-[#00D9FF]" }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}>
      <div className="flex items-center gap-3 text-left">
        <div className={`p-2 rounded-lg ${type === 'in' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {type === 'in' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
        <div>
          <p className="text-xs font-black tracking-tight">{title}</p>
          <p className="text-[10px] opacity-40 font-bold">{time}</p>
        </div>
      </div>
      <p className={`font-black text-sm ${type === 'in' ? color : 'text-red-400'}`}>{amount} F</p>
    </div>
  );
}