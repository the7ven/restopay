"use client";

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, PieChart, ArrowDownCircle, ArrowUpCircle, 
  FileText, Wallet, Smartphone, Banknote, CreditCard,
  Filter, Download, ChevronRight, Calendar
} from 'lucide-react';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';

export default function ReportsTabContent({ isDarkMode }) {
  const [period, setPeriod] = useState('mensuel');

  // --- LOGIQUE DE DONNÉES FILTRÉES (Stats, Graphique ET Paiements) ---
  const stats = useMemo(() => {
    switch (period) {
      case 'journalier':
        return {
          recettes: "145.000 F", achats: "52.000 F", cash: "80.000 F", virtuel: "65.000 F",
          comparison: [
            { name: 'Matin', recettes: 45000, achats: 20000 }, 
            { name: 'Midi', recettes: 65000, achats: 12000 }, 
            { name: 'Soir', recettes: 35000, achats: 20000 }
          ],
          paymentDistribution: [
            { name: 'Espèces', value: 80000, color: '#22c55e' },
            { name: 'Orange Money', value: 35000, color: '#ff6b00' },
            { name: 'MTN MoMo', value: 20000, color: '#ffcc00' },
            { name: 'Wave', value: 10000, color: '#00d9ff' },
          ]
        };
      case 'hebdomadaire':
        return {
          recettes: "980.000 F", achats: "310.000 F", cash: "420.000 F", virtuel: "560.000 F",
          comparison: [
            { name: 'Lun-Mar', recettes: 270000, achats: 85000 }, 
            { name: 'Mer-Jeu', recettes: 240000, achats: 85000 }, 
            { name: 'Ven-Dim', recettes: 470000, achats: 140000 }
          ],
          paymentDistribution: [
            { name: 'Espèces', value: 420000, color: '#22c55e' },
            { name: 'Orange Money', value: 210000, color: '#ff6b00' },
            { name: 'MTN MoMo', value: 180000, color: '#ffcc00' },
            { name: 'Wave', value: 120000, color: '#00d9ff' },
            { name: 'CB', value: 50000, color: '#a259ff' },
          ]
        };
      default: // mensuel
        return {
          recettes: "4.750.000 F", achats: "1.850.000 F", cash: "2.100.000 F", virtuel: "2.650.000 F",
          comparison: [
            { name: 'Semaine 1', recettes: 1200000, achats: 450000 }, 
            { name: 'Semaine 2', recettes: 950000, achats: 380000 }, 
            { name: 'Semaine 3', recettes: 1500000, achats: 600000 }, 
            { name: 'Semaine 4', recettes: 1100000, achats: 420000 }
          ],
          paymentDistribution: [
            { name: 'Espèces', value: 2100000, color: '#22c55e' },
            { name: 'Orange Money', value: 850000, color: '#ff6b00' },
            { name: 'MTN MoMo', value: 750000, color: '#ffcc00' },
            { name: 'Wave', value: 650000, color: '#00d9ff' },
            { name: 'CB', value: 400000, color: '#a259ff' },
          ]
        };
    }
  }, [period]);

  return (
    <div className="fade-in text-left pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">Rapports Financiers</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">Bilan {period} : Recettes vs Dépenses</p>
        </div>
        
        <div className="flex gap-2">
          <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
            {['journalier', 'hebdomadaire', 'mensuel'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  period === p ? 'bg-[#00D9FF] text-black shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-current'
                }`}
              >
                {p.slice(0, 4)}
              </button>
            ))}
          </div>
          <button className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold text-sm transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* --- CARDS DE RÉSUMÉ --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <ReportSummaryCard isDarkMode={isDarkMode} label="Total Recettes" value={stats.recettes} icon={<ArrowUpCircle className="text-green-500" />} />
        <ReportSummaryCard isDarkMode={isDarkMode} label="Total Achats" value={stats.achats} icon={<ArrowDownCircle className="text-red-500" />} />
        <ReportSummaryCard isDarkMode={isDarkMode} label="Encaissement Cash" value={stats.cash} icon={<Banknote className="text-yellow-500" />} />
        <ReportSummaryCard isDarkMode={isDarkMode} label="Paiements Virtuels" value={stats.virtuel} icon={<Smartphone className="text-[#00D9FF]" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* --- GRAPHIQUE 1 : RÉPARTITION DES PAIEMENTS (Dynamique) --- */}
        <div className={`p-8 rounded-[45px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h4 className="text-lg font-black flex items-center gap-2 mb-8">
            <PieChart size={20} className="text-[#00D9FF]" /> Règlement {period}
          </h4>
          <div className="h-64 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={stats.paymentDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {stats.paymentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3 mt-6 md:mt-0">
              {stats.paymentDistribution.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: p.color}}></div>
                    <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">{p.name}</span>
                  </div>
                  <span className="text-xs font-black">{p.value.toLocaleString()} F</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- GRAPHIQUE 2 : COMPARAISON RECETTES vs ACHATS --- */}
        <div className={`p-8 rounded-[45px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h4 className="text-lg font-black flex items-center gap-2 mb-8">
            <BarChart3 size={20} className="text-purple-500" /> Rentabilité {period}
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.comparison}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#111' : '#fff', borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="recettes" fill="#00D9FF" radius={[4, 4, 0, 0]} name="Recettes" />
                <Bar dataKey="achats" fill="#ff4d4d" radius={[4, 4, 0, 0]} name="Achats" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- TABLEAU RÉCAPITULATIF DES FLUX --- */}
      <div className={`mt-8 rounded-[40px] border overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h4 className="font-black italic text-lg tracking-tighter">Détail des flux virtuels</h4>
          <Smartphone className="opacity-20" size={20} />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className={isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'}>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Opérateur</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Transactions</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40 text-right">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            <VirtualPaymentRow name="Orange Money" count="142" total="185.000" color="text-[#ff6b00]" isDarkMode={isDarkMode} />
            <VirtualPaymentRow name="MTN Mobile Money" count="98" total="125.000" color="text-yellow-500" isDarkMode={isDarkMode} />
            <VirtualPaymentRow name="Wave" count="115" total="95.000" color="text-[#00d9ff]" isDarkMode={isDarkMode} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

// COMPOSANTS DE STYLE CONSERVÉS
function ReportSummaryCard({ isDarkMode, label, value, icon }) {
  return (
    <div className={`p-6 rounded-[35px] border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-sm transition-all'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>{icon}</div>
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black mb-1">{label}</p>
      <p className="text-xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}

function VirtualPaymentRow({ name, count, total, color, isDarkMode }) {
  return (
    <tr className="group hover:bg-white/[0.01] transition-colors">
      <td className={`px-8 py-6 font-black text-sm ${color}`}>{name}</td>
      <td className="px-8 py-6 text-sm font-bold opacity-60">{count} ops</td>
      <td className="px-8 py-6 text-right font-black text-sm">{total} F</td>
    </tr>
  );
}