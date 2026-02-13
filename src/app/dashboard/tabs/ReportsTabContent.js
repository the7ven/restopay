"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, PieChart, ArrowDownCircle, ArrowUpCircle, 
  FileText, Wallet, Smartphone, Banknote, CreditCard,
  Filter, Download, ChevronRight, Calendar, Loader2
} from 'lucide-react';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { supabase } from '@/lib/supabase';

export default function ReportsTabContent({ isDarkMode }) {
  const [period, setPeriod] = useState('mensuel');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    recettes: 0,
    achats: 0,
    cash: 0,
    virtuel: 0,
    comparison: [],
    paymentDistribution: []
  });

  useEffect(() => {
    fetchReportData();
  }, [period]);

 const fetchReportData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      let startStr;

      // --- LOGIQUE DE PÉRIODE (Corrigée pour ne pas muter 'now') ---
      if (period === 'journalier') {
        const today = new Date();
        startStr = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      } else if (period === 'hebdomadaire') {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        startStr = lastWeek.toISOString();
      } else { // mensuel
        startStr = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      }

      // --- REQUÊTES PARALLÈLES SÉCURISÉES ---
      const [transRes, expRes] = await Promise.all([
        supabase.from('transactions')
          .select('*')
          .eq('restaurant_id', user.id) // ISOLATION
          .gte('created_at', startStr),
        supabase.from('expenses')
          .select('*')
          .eq('restaurant_id', user.id) // ISOLATION
          .gte('created_at', startStr)
      ]);

      if (transRes.error) throw transRes.error;
      if (expRes.error) throw expRes.error;

      const transactions = transRes.data || [];
      const expenses = expRes.data || [];

      // --- CALCULS DES STATS ---
      const totalRecettes = transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const totalAchats = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      
      const cashOnly = transactions
        .filter(t => !t.payment_method || t.payment_method === 'Espèces')
        .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

      // --- RÉPARTITION PAIEMENTS ---
      const methods = transactions.reduce((acc, curr) => {
        const m = curr.payment_method || 'Espèces';
        acc[m] = (acc[m] || 0) + (Number(curr.amount) || 0);
        return acc;
      }, {});

      const colors = { 
        'Espèces': '#22c55e', 
        'Orange Money': '#ff6b00', 
        'Wave': '#00d9ff', 
        'MTN MoMo': '#ffcc00',
        'CB': '#a259ff' 
      };

      const paymentDist = Object.entries(methods).map(([name, value]) => ({
        name,
        value,
        color: colors[name] || '#8884d8'
      }));

      // --- LOGIQUE DE COMPARAISON ---
      const comparisonData = [
        { name: 'Ventes', recettes: totalRecettes, achats: 0 },
        { name: 'Dépenses', recettes: 0, achats: totalAchats }
      ];

      setData({
        recettes: totalRecettes,
        achats: totalAchats,
        cash: cashOnly,
        virtuel: Math.max(0, totalRecettes - cashOnly), // Évite les chiffres négatifs bizarres
        comparison: comparisonData,
        paymentDistribution: paymentDist
      });

    } catch (err) {
      console.error("Erreur rapports:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#00D9FF] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Analyse des flux financiers...</p>
      </div>
    );
  }

  return (
    <div className="fade-in text-left pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="text-left">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">Rapports Financiers</h3>
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
        </div>
      </div>

      {/* --- CARDS DE RÉSUMÉ RÉELLES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <ReportSummaryCard isDarkMode={isDarkMode} label="Total Recettes" value={`${data.recettes.toLocaleString()} F`} icon={<ArrowUpCircle className="text-green-500" />} />
        <ReportSummaryCard isDarkMode={isDarkMode} label="Total Achats" value={`${data.achats.toLocaleString()} F`} icon={<ArrowDownCircle className="text-red-500" />} />
        <ReportSummaryCard isDarkMode={isDarkMode} label="Encaissement Cash" value={`${data.cash.toLocaleString()} F`} icon={<Banknote className="text-yellow-500" />} />
        <ReportSummaryCard isDarkMode={isDarkMode} label="Paiements Virtuels" value={`${data.virtuel.toLocaleString()} F`} icon={<Smartphone className="text-[#00D9FF]" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* --- GRAPHIQUE 1 : RÉPARTITION DES PAIEMENTS --- */}
        <div className={`p-8 rounded-[45px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h4 className="text-lg font-black flex items-center gap-2 mb-8 italic uppercase tracking-tighter">
            <PieChart size={20} className="text-[#00D9FF]" /> Règlement {period}
          </h4>
          <div className="h-64 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={data.paymentDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {data.paymentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDarkMode ? '#111' : '#fff' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3 mt-6 md:mt-0">
              {data.paymentDistribution.length === 0 ? <p className="text-[10px] opacity-20 italic">Aucune donnée</p> : 
                data.paymentDistribution.map((p, idx) => (
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

        {/* --- GRAPHIQUE 2 : RÉPABITILITÉ RECETTES vs ACHATS --- */}
        <div className={`p-8 rounded-[45px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h4 className="text-lg font-black flex items-center gap-2 mb-8 italic uppercase tracking-tighter">
            <BarChart3 size={20} className="text-purple-500" /> Comparatif {period}
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.comparison}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: isDarkMode ? '#111' : '#fff', borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
                <Bar dataKey="recettes" fill="#00D9FF" radius={[10, 10, 10, 10]} name="Recettes" barSize={40} />
                <Bar dataKey="achats" fill="#ff4d4d" radius={[10, 10, 10, 10]} name="Achats" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- TABLEAU RÉCAPITULATIF DES FLUX --- */}
      <div className={`mt-8 rounded-[40px] border overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h4 className="font-black italic text-lg tracking-tighter uppercase">Détail des flux</h4>
          <Smartphone className="opacity-20" size={20} />
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className={isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'}>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40">Opérateur</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black opacity-40 text-right">Montant Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {data.paymentDistribution.map((item, i) => (
               <tr key={i} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-6 font-black text-sm uppercase tracking-tighter" style={{color: item.color}}>{item.name}</td>
                  <td className="px-8 py-6 text-right font-black text-sm">{item.value.toLocaleString()} F</td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// COMPOSANTS DE STYLE
function ReportSummaryCard({ isDarkMode, label, value, icon }) {
  return (
    <div className={`p-6 rounded-[35px] border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>{icon}</div>
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-black mb-1">{label}</p>
      <p className="text-xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}