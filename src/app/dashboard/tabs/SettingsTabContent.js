"use client";

import React, { useState } from 'react';
import { 
  Settings, Store, Bell, Shield, 
  Database, Palette, Globe, Save,
  Camera, MapPin, Smartphone,
  ChevronRight,
} from 'lucide-react';

export default function SettingsTabContent({ isDarkMode }) {
  const [restaurantName, setRestaurantName] = useState("RestoPay Abidjan");

  return (
    <div className="fade-in text-left pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter">Paramètres Système</h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">Configuration globale de votre établissement</p>
        </div>
        
        <button className="bg-[#00D9FF] text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3">
          <Save size={16} /> Enregistrer
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE : IDENTITÉ --- */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Section Identité */}
          <div className={`p-8 rounded-[45px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h4 className="text-lg font-black flex items-center gap-3 mb-8">
              <Store size={20} className="text-[#00D9FF]" /> Profil de l'Établissement
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">Nom du Restaurant</label>
                <input 
                  type="text" 
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-[#00D9FF]' : 'bg-gray-50 border-gray-100 focus:border-[#00D9FF]'}`} 
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4">Localisation</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" />
                  <input 
                    type="text" 
                    placeholder="Abidjan, Côte d'Ivoire"
                    className={`w-full pl-14 pr-6 py-4 rounded-2xl border outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`} 
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-6 p-6 rounded-[30px] border border-dashed border-white/10">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-[#00D9FF]">
                <Camera size={30} />
              </div>
              <div>
                <p className="font-black text-sm mb-1">Logo de l'établissement</p>
                <p className="text-xs opacity-40 font-medium">Format PNG ou JPG. Max 2MB.</p>
                <button className="mt-3 text-[#00D9FF] text-[10px] font-black uppercase tracking-widest">Modifier</button>
              </div>
            </div>
          </div>

          {/* Section Paiements & Devises */}
          <div className={`p-8 rounded-[45px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h4 className="text-lg font-black flex items-center gap-3 mb-8">
              <Globe size={20} className="text-purple-500" /> Régional & Paiement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SettingToggle label="Devise Principale" value="FCFA (CFA)" isDarkMode={isDarkMode} />
              <SettingToggle label="Facturation Mobile" value="Activée" isDarkMode={isDarkMode} />
              <SettingToggle label="TVA Automatique" value="18%" isDarkMode={isDarkMode} />
              <SettingToggle label="Impression Ticket" value="Bluetooth" isDarkMode={isDarkMode} />
            </div>
          </div>

        </div>

        {/* --- COLONNE DROITE : SÉCURITÉ & CLOUD --- */}
        <div className="space-y-8">
          
          {/* Status Cloud (Supabase) */}
          <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h4 className="text-sm font-black flex items-center gap-2 mb-6">
              <Database size={16} className="text-green-500" /> État du Cloud
            </h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-xs font-bold">Synchronisé avec Supabase</p>
            </div>
            <button className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
              Forcer la synchro
            </button>
          </div>

          {/* Sécurité */}
          <div className={`p-8 rounded-[40px] border ${isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <h4 className="text-sm font-black flex items-center gap-2 mb-6">
              <Shield size={16} className="text-[#00D9FF]" /> Sécurité Accès
            </h4>
            <div className="space-y-4">
              <button className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <span className="text-xs font-bold">Changer le PIN Admin</span>
                <ChevronRight size={16} className="opacity-30" />
              </button>
              <button className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <span className="text-xs font-bold">Logs de Connexion</span>
                <ChevronRight size={16} className="opacity-30" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function SettingToggle({ label, value, isDarkMode }) {
  return (
    <div className={`flex items-center justify-between p-5 rounded-3xl border ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
      <div className="text-left">
        <p className="text-[9px] uppercase font-black opacity-40 tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black">{value}</p>
      </div>
      <div className="w-10 h-5 bg-[#00D9FF]/20 rounded-full relative">
        <div className="absolute right-1 top-1 w-3 h-3 bg-[#00D9FF] rounded-full shadow-lg shadow-cyan-500/50"></div>
      </div>
    </div>
  );
}