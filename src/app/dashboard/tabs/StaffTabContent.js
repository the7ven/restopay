"use client";

import React, { useState } from 'react';
import { 
  Users, UserPlus, Star, Clock, 
  Phone, Mail, MoreVertical, Edit3, 
  Trash2, ShieldCheck, CheckCircle2 
} from 'lucide-react';

export default function StaffTabContent({ isDarkMode }) {
  const [staff, setStaff] = useState([
    { id: 1, name: "Koffi Kouamé", role: "Chef de Rang", status: "Présent", sales: "145.000", rating: 4.8, phone: "+225 07070707" },
    { id: 2, name: "Sali Traoré", role: "Serveuse", status: "Présent", sales: "98.000", rating: 4.9, phone: "+225 01010101" },
    { id: 3, name: "Moussa Diakité", role: "Cuisinier", status: "En pause", sales: "0", rating: 4.7, phone: "+225 05050505" },
    { id: 4, name: "Awa Koné", role: "Serveuse", status: "Absent", sales: "0", rating: 4.5, phone: "+225 09090909" },
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Présent": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "En pause": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      default: return "text-red-400 bg-red-400/10 border-red-400/20";
    }
  };

  return (
    <div className="fade-in text-left pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">Gestion du Personnel</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">Équipe RestoPay • {staff.length} Membres</p>
        </div>
        
        <button className="bg-[#00D9FF] text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3">
          <UserPlus size={16} /> Ajouter un membre
        </button>
      </div>

      {/* --- STATS D'ÉQUIPE --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StaffQuickStat isDarkMode={isDarkMode} label="Présents" value={staff.filter(s => s.status === "Présent").length} icon={<CheckCircle2 className="text-green-500" />} />
        <StaffQuickStat isDarkMode={isDarkMode} label="Performance Équipe" value="4.7/5" icon={<Star className="text-yellow-500 fill-yellow-500" />} />
        <StaffQuickStat isDarkMode={isDarkMode} label="Rush Midi" value="OK" icon={<ShieldCheck className="text-[#00D9FF]" />} />
      </div>

      {/* --- LISTE DES EMPLOYÉS --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {staff.map((member) => (
          <div key={member.id} className={`p-6 rounded-[35px] border transition-all hover:scale-[1.01] group ${isDarkMode ? 'bg-[#0a0a0a] border-white/5 hover:border-[#00D9FF]/20' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar stylisé */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${isDarkMode ? 'bg-white/5 text-[#00D9FF]' : 'bg-gray-100 text-gray-700'}`}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-black text-lg tracking-tight">{member.name}</h4>
                  <p className="text-[10px] uppercase font-black opacity-40 tracking-widest">{member.role}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(member.status)}`}>
                {member.status}
              </span>
            </div>

            <div className={`mt-6 p-4 rounded-2xl flex justify-between items-center ${isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50'}`}>
              <div className="text-center">
                <p className="text-[9px] opacity-40 font-black uppercase tracking-widest">CA Réalisé</p>
                <p className="font-black text-[#00D9FF]">{member.sales} F</p>
              </div>
              <div className="h-8 w-[1px] bg-white/5"></div>
              <div className="text-center">
                <p className="text-[9px] opacity-40 font-black uppercase tracking-widest">Note Service</p>
                <p className="font-black">{member.rating}</p>
              </div>
              <div className="h-8 w-[1px] bg-white/5"></div>
              <div className="flex gap-2">
                <button className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-white text-gray-500 shadow-sm border border-gray-100'}`}>
                  <Phone size={14} />
                </button>
                <button className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10' : 'bg-white text-gray-500 shadow-sm border border-gray-100'}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffQuickStat({ isDarkMode, label, value, icon }) {
  return (
    <div className={`p-6 rounded-[35px] border flex items-center gap-4 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>{icon}</div>
      <div className="text-left">
        <p className="text-[10px] uppercase tracking-widest opacity-40 font-black">{label}</p>
        <p className="text-2xl font-black italic tracking-tighter">{value}</p>
      </div>
    </div>
  );
}