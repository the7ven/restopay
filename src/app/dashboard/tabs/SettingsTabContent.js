"use client";

import React, { useState, useEffect } from "react";
import {
  Store, Database, Globe, Save, Camera, MapPin, 
  ChevronRight, Loader2, CheckCircle, Shield
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from 'next/navigation';

export default function SettingsTabContent({ isDarkMode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [settings, setSettings] = useState({
    name: "",
    location: "",
    logo_url: "",
    currency: "FCFA",
    tva: "18%",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // LECTURE : On récupère uniquement les infos liées à l'ID de l'utilisateur
      const { data, error } = await supabase
        .from("restaurants")
        .select("name, location, logo_url")
        .eq("id", user.id) // ISOLATION SÉCURISÉE
        .single();

      if (data) {
        setSettings(prev => ({
          ...prev,
          name: data.name || "",
          location: data.location || "",
          logo_url: data.logo_url || "",
        }));
      }
    } catch (err) {
      console.error("Erreur chargement paramètres:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // MISE À JOUR : On verrouille la modification sur l'ID de l'utilisateur
      const { error } = await supabase
        .from('restaurants')
        .update({
          name: settings.name,
          location: settings.location
        })
        .eq('id', user.id); // SÉCURITÉ CRITIQUE

      if (error) throw error;

      setSaveSuccess(true);
      router.refresh(); 

      setTimeout(() => {
        setSaveSuccess(false);
        fetchSettings(); 
      }, 1500);

    } catch (err) {
      console.error("Erreur système:", err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const { data: { user } } = await supabase.auth.getUser();

      if (!file || !user) return;

      // Organisation du stockage par ID utilisateur pour éviter les conflits
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      // Mise à jour de l'URL du logo dans la table restaurant
      await supabase
        .from('restaurants')
        .update({ logo_url: publicUrl })
        .eq('id', user.id); // SÉCURITÉ CRITIQUE

      setSettings(prev => ({ ...prev, logo_url: publicUrl }));
      alert("Logo mis à jour !");
    } catch (error) {
      console.error('Erreur upload:', error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#00D9FF] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">
          Synchronisation des paramètres...
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in text-left pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="text-left">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">
            Paramètres Système
          </h3>
          <p className="opacity-50 text-sm font-light uppercase tracking-widest">
            Configuration globale de votre établissement
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`${saveSuccess ? "bg-green-500" : "bg-[#00D9FF]"} text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center gap-3 active:scale-95`}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saveSuccess ? <CheckCircle size={16} /> : <Save size={16} />}
          {saveSuccess ? "Enregistré !" : "Enregistrer"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8 text-left">
          <div className={`p-8 rounded-[45px] border ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
            <h4 className="text-lg font-black flex items-center gap-3 mb-8 uppercase tracking-tighter italic">
              <Store size={20} className="text-[#00D9FF]" /> Profil de l'Établissement
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 text-left">
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 block">Nom du Restaurant</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all ${isDarkMode ? "bg-white/5 border-white/10 focus:border-[#00D9FF]" : "bg-gray-50 border-gray-100 focus:border-[#00D9FF]"}`}
                />
              </div>
              <div className="space-y-4 text-left">
                <label className="text-[10px] uppercase tracking-widest font-black opacity-40 ml-4 block">Localisation</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30" />
                  <input
                    type="text"
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                    placeholder="Douala, Cameroun"
                    className={`w-full pl-14 pr-6 py-4 rounded-2xl border outline-none ${isDarkMode ? "bg-white/5 border-white/10 focus:border-[#00D9FF]" : "bg-gray-50 border-gray-100 focus:border-[#00D9FF]"}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-6 p-6 rounded-[30px] border border-dashed border-white/10">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-[#00D9FF] overflow-hidden border border-white/10">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={30} />
                )}
              </div>
              <div className="text-left">
                <p className="font-black text-sm mb-1">Logo de l'établissement</p>
                <p className="text-xs opacity-40 font-medium">Format PNG ou JPG. Max 2MB.</p>
                <label className="mt-3 inline-block text-[#00D9FF] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:underline">
                  {uploading ? "Chargement..." : "Modifier l'image"}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Section Options (Monnaie, TVA, etc.) */}
          <div className={`p-8 rounded-[45px] border ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
             <h4 className="text-lg font-black flex items-center gap-3 mb-8 uppercase tracking-tighter italic">
              <Database size={20} className="text-[#00D9FF]" /> Configuration Locale
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SettingToggle label="Devise de la caisse" value={settings.currency} isDarkMode={isDarkMode} />
              <SettingToggle label="Taux TVA" value={settings.tva} isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>

        {/* Section Sécurité/Info */}
        <div className="space-y-6 text-left">
           <div className={`p-8 rounded-[40px] border ${isDarkMode ? "bg-[#00D9FF]/5 border-[#00D9FF]/20" : "bg-cyan-50 border-cyan-100"}`}>
            <Shield size={32} className="text-[#00D9FF] mb-4" />
            <h4 className="font-black text-sm uppercase mb-2">Protection des données</h4>
            <p className="text-xs opacity-60 leading-relaxed font-medium">
              Toutes vos modifications sont chiffrées et isolées. Seul votre établissement a accès à ces configurations via votre jeton sécurisé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ label, value, isDarkMode }) {
  return (
    <div className={`flex items-center justify-between p-5 rounded-3xl border ${isDarkMode ? "bg-white/[0.02] border-white/5" : "bg-gray-50 border-gray-100 shadow-sm"}`}>
      <div className="text-left">
        <p className="text-[9px] uppercase font-black opacity-40 tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black">{value}</p>
      </div>
      <div className="w-10 h-5 bg-[#00D9FF]/20 rounded-full relative cursor-pointer group">
        <div className="absolute right-1 top-1 w-3 h-3 bg-[#00D9FF] rounded-full shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform"></div>
      </div>
    </div>
  );
}