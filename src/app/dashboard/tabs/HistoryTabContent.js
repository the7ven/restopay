"use client";

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Download, Grid, ArrowRight, Star, Trophy, Award, Medal, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

export default function HistoryTabContent({ isDarkMode }) {
  const [showAllDays, setShowAllDays] = useState(false);
  
  // --- GÉNÉRATION DYNAMIQUE DES 31 JOURS ---
  const fullMonthlyHistory = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => {
      const dayNum = 31 - i; // Pour afficher du plus récent au plus ancien
      const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
      const isWeekend = dayNum % 7 === 6 || dayNum % 7 === 0;
      
      return {
        date: `${dayStr} Janv. 2026`,
        total: isWeekend 
          ? (Math.floor(Math.random() * 400 + 800) * 1000).toLocaleString() + " F"
          : (Math.floor(Math.random() * 300 + 300) * 1000).toLocaleString() + " F",
        occupancy: isWeekend ? Math.floor(Math.random() * 15 + 85) + "%" : Math.floor(Math.random() * 30 + 40) + "%",
        rawTotal: isWeekend ? 850000 : 400000, // Pour le graph
        rawOcc: isWeekend ? 90 : 50 // Pour le graph
      };
    });
  }, []);

  // On prépare les données pour les graphiques à partir de l'historique (inversé pour la chronologie)
  const chartData = [...fullMonthlyHistory].reverse().map((d, i) => ({
    day: (i + 1) < 10 ? `0${i+1}` : `${i+1}`,
    total: d.rawTotal,
    occupation: d.rawOcc
  }));

  // On limite l'affichage initial à 5 jours
  const displayedHistory = showAllDays ? fullMonthlyHistory : fullMonthlyHistory.slice(0, 5);

  const topThreeDishes = [
    { id: 1, name: "Poisson Grillé", sales: 1240, trend: "+12%", icon: <Trophy className="text-yellow-500" /> },
    { id: 2, name: "Garba Royal", sales: 980, trend: "+8%", icon: <Award className="text-[#00D9FF]" /> },
    { id: 3, name: "Poulet DG", sales: 750, trend: "+5%", icon: <Medal className="text-purple-500" /> },
  ];

  return (
    <div className="fade-in text-left pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">Archives & Performances</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">Janvier 2026 • Vue d'ensemble</p>
        </div>
        <button className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold text-sm transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <Download size={18} /> Export PDF
        </button>
      </div>

      {/* --- GRAPHIQUES --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
        <div className={`xl:col-span-2 p-8 rounded-[45px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
           <h4 className="text-lg font-black flex items-center gap-2 mb-8"><TrendingUp size={20} className="text-[#00D9FF]" /> Ventes (FCFA)</h4>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} interval={4} tick={{fill: '#666', fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#111' : '#fff', borderRadius: '12px', border: 'none' }} />
                <Area type="monotone" dataKey="total" stroke="#00D9FF" strokeWidth={3} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>
        <div className={`p-8 rounded-[45px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
           <h4 className="text-lg font-black flex items-center gap-2 mb-8"><Grid size={20} className="text-purple-500" /> Occupation (%)</h4>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} interval={6} tick={{fill: '#666', fontSize: 9}} />
                <Bar dataKey="occupation" radius={[2, 2, 2, 2]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.occupation > 80 ? '#A259FF' : isDarkMode ? '#222' : '#eee'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* --- TOP PLATS --- */}
      <div className="mb-12">
        <h4 className="text-xl font-black italic mb-6 tracking-tighter flex items-center gap-3">
          <Star className="text-yellow-500 fill-yellow-500" size={24} /> Palmarès du Mois
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThreeDishes.map((dish) => (
            <div key={dish.id} className={`p-8 rounded-[40px] border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>{dish.icon}</div>
                <span className="text-green-500 text-xs font-black">{dish.trend}</span>
              </div>
              <h5 className="text-xl font-black tracking-tight mb-1">{dish.name}</h5>
              <p className="text-[10px] uppercase font-bold opacity-40 tracking-[0.2em]">{dish.sales} portions</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- JOURNAL DES RECETTES AVEC BOUTON "VOIR TOUT" --- */}
      <div className={`rounded-[40px] border overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h4 className="font-black italic text-lg">Journal des Recettes</h4>
          <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">
            {showAllDays ? "Affichage : 31 jours" : "Affichage : 5 derniers jours"}
          </span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'}>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Date</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Recettes</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Occupation</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40 text-right">Détails</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {displayedHistory.map((day, idx) => (
              <tr key={idx} className="group hover:bg-white/[0.01] transition-colors">
                <td className="px-8 py-6 font-bold text-sm">{day.date}</td>
                <td className="px-8 py-6 font-black text-[#00D9FF]">{day.total}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden max-w-[80px]">
                      <div className="h-full bg-purple-500" style={{ width: day.occupancy }}></div>
                    </div>
                    <span className="text-[10px] font-black opacity-40">{day.occupancy}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-white/20 hover:text-white' : 'bg-gray-100 text-gray-400 hover:text-black shadow-sm'}`}><ArrowRight size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* BOUTON VOIR TOUT / RÉDUIRE */}
        <div className={`p-6 text-center border-t ${isDarkMode ? 'border-white/5 bg-white/[0.01]' : 'border-gray-50 bg-gray-50/30'}`}>
          <button 
            onClick={() => setShowAllDays(!showAllDays)}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
              isDarkMode 
                ? 'bg-white/5 text-white/60 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10' 
                : 'bg-white text-gray-500 shadow-sm border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {showAllDays ? (
              <><ChevronUp size={14} /> Réduire la liste</>
            ) : (
              <><ChevronDown size={14} /> Voir les 31 jours de recette</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}