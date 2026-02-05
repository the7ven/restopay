"use client";

import React, { useState } from 'react';
import { 
  Grid, Users, Printer, X, 
  Plus, Receipt, CreditCard, CheckCircle2, MoreHorizontal 
} from 'lucide-react';

export default function TablesTabContent({ isDarkMode }) {
  const [selectedTable, setSelectedTable] = useState(null);
  
  // Génération de 20 tables avec des statuts variés pour le test
  const [tables] = useState([...Array(20)].map((_, i) => ({
    id: i + 1,
    name: `Table ${String(i + 1).padStart(2, '0')}`,
    capacity: i % 3 === 0 ? 4 : (i % 5 === 0 ? 6 : 2),
    status: i === 1 ? "Occupée" : (i === 4 ? "Addition" : "Libre"),
    orders: i === 1 ? [
      { item: "Poisson Grillé", qty: 2, price: 4500 },
      { item: "Alloco", qty: 1, price: 1000 }
    ] : i === 4 ? [
      { item: "Garba Royal", qty: 2, price: 1500 },
      { item: "Bissap", qty: 2, price: 500 }
    ] : []
  })));

  const calculateTotal = (orders) => orders.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);

  const handlePrint = () => {
    window.print();
  };

 const getStatusStyle = (status) => {
  switch (status) {
    case "Occupée": 
      return isDarkMode 
        ? "border-[#00D9FF]/40 bg-[#00D9FF]/5 text-[#00D9FF]" 
        : "border-cyan-200 bg-cyan-50/50 text-cyan-600 shadow-sm shadow-cyan-500/5";
    case "Addition": 
      return isDarkMode 
        ? "border-orange-500/40 bg-orange-500/5 text-orange-400 animate-pulse" 
        : "border-orange-200 bg-orange-50/50 text-orange-600 shadow-sm shadow-orange-500/5 animate-pulse";
    default: 
      return isDarkMode 
        ? "border-white/5 bg-white/[0.02] text-white/30" 
        : "border-gray-200 bg-white text-gray-400 shadow-sm shadow-gray-200/50"; // Plus visible en Light
  }
};

  // Stats pour le résumé
  const occupiedCount = tables.filter(t => t.status !== "Libre").length;
  const additionCount = tables.filter(t => t.status === "Addition").length;

  return (
    <div className="fade-in text-left">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 no-print">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">Plan de Salle</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">Visualisation en temps réel (20 Tables)</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF]"></span>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Occupée</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Addition</span>
            </div>
          </div>
         <button className="flex items-center gap-2 bg-[#00D9FF] text-black px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-cyan-500/20">
              <Plus size={18} /> <span className="hidden sm:inline">nouvelle commande</span>
         </button>
        </div>
      </div>

      {/* --- GRILLE DES 20 TABLES --- */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 no-print">
  {tables.map((table) => (
    <div 
      key={table.id} 
      onClick={() => table.status !== "Libre" && setSelectedTable(table)}
      className={`group relative p-8 rounded-[40px] border transition-all duration-500 flex flex-col items-center justify-center gap-4 cursor-pointer ${getStatusStyle(table.status)} hover:scale-[1.03] hover:shadow-md`}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${
        table.status === 'Libre' 
          ? isDarkMode ? 'border-dashed border-white/10' : 'border-dashed border-gray-300' 
          : 'border-current'
      }`}>
        <Grid size={24} />
      </div>
      
      <div className="text-center">
        <h4 className={`text-lg font-black tracking-tight ${
          table.status === 'Libre' 
            ? isDarkMode ? 'text-white/40' : 'text-gray-400' // Gris plus soutenu en Light
            : 'text-current'
        }`}>
          {table.name}
        </h4>
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 flex items-center justify-center gap-1">
          <Users size={10} /> {table.capacity} p.
        </p>
      </div>

      {table.status !== "Libre" && (
        <div className="mt-2 pt-2 border-t border-current/10 w-full text-center">
          <p className="text-xs font-black">{calculateTotal(table.orders)} F</p>
        </div>
      )}
    </div>
  ))}
</div>

      {/* --- RÉSUMÉ EN BAS --- */}
      <div className={`mt-12 p-8 rounded-[35px] border no-print ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'} flex flex-wrap justify-around items-center gap-8 text-center`}>
        <div>
          <p className="text-4xl font-black italic">{occupiedCount} / 20</p>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mt-1">Tables Occupées</p>
        </div>
        <div className="h-10 w-[1px] bg-white/5 hidden md:block"></div>
        <div>
          <p className="text-4xl font-black italic text-[#00D9FF]">{Math.round((occupiedCount/20)*100)}%</p>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mt-1">Occupation</p>
        </div>
        <div className="h-10 w-[1px] bg-white/5 hidden md:block"></div>
        <div className={additionCount > 0 ? "text-orange-400" : ""}>
          <p className="text-4xl font-black italic">{additionCount}</p>
          <p className="text-[10px] uppercase tracking-widest font-bold mt-1">Additions prêtes</p>
        </div>
      </div>

      {/* --- MODALE DE FACTURATION --- */}
      {selectedTable && (
        <div className="fixed inset-0 z-[300] flex items-center justify-end p-0 sm:p-4 backdrop-blur-md bg-black/40 no-print">
          <div className={`h-full sm:h-auto w-full max-w-md sm:rounded-[45px] p-8 border shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic tracking-tighter">Détail {selectedTable.name}</h3>
              <button onClick={() => setSelectedTable(null)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto mb-6">
              {selectedTable.orders.map((order, idx) => (
                <div key={idx} className="flex justify-between border-b border-white/5 pb-3">
                  <div className="text-left">
                    <p className="font-bold text-sm">{order.item}</p>
                    <p className="text-[10px] opacity-40">{order.qty} x {order.price} F</p>
                  </div>
                  <p className="font-black text-sm">{order.qty * order.price} F</p>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center text-2xl font-black">
                <span>Total</span>
                <span className="text-[#00D9FF]">{calculateTotal(selectedTable.orders)} F</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handlePrint} className="flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00D9FF] hover:text-white transition-all">
                  <Printer size={18} /> Imprimer
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#00D9FF] text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20">
                  <CreditCard size={18} /> Encaisser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TICKET IMPRIMABLE --- */}
      <div id="printable-receipt" className="hidden print:block text-black bg-white w-[80mm] mx-auto text-left font-mono text-sm">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold uppercase italic">RestoPay Luxe</h2>
          <p className="text-[10px]">Abidjan, Côte d'Ivoire</p>
          <p className="border-b border-dashed border-black pb-2"></p>
        </div>
        <div className="flex justify-between mb-4 text-[10px]">
          <span>{selectedTable?.name}</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="space-y-1 mb-4">
          {selectedTable?.orders.map((o, i) => (
            <div key={i} className="flex justify-between">
              <span>{o.qty}x {o.item}</span>
              <span>{o.qty * o.price}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-black pt-2 flex justify-between font-bold text-lg">
          <span>TOTAL</span>
          <span>{selectedTable ? calculateTotal(selectedTable.orders) : 0} F</span>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}