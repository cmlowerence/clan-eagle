'use client';

import { useState } from 'react';
import { Shield, Sword, Lock, Plus, Check, LogOut } from "lucide-react";
import { addLayout, addStrategy } from "@/lib/actions";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [activeTab, setActiveTab] = useState<'layout' | 'strategy'>('layout');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form States
  const [layoutForm, setLayoutForm] = useState({ title: '', townHall: 16, type: 'War', imageUrl: '', copyLink: '' });
  const [stratForm, setStratForm] = useState({ 
    title: '', 
    description: '', 
    difficulty: 'Medium', 
    videoUrl: '', 
    armyLink: '', // NEW FIELD
    thInput: '16', 
    armyInput: '' 
  });

  const handleLogin = () => {
    // Simple client-side check. 
    // In production, use a real auth cookie/session, but this works for personal tools.
    if(secret === 'EagleAdmin2026') { 
        setIsAuthenticated(true);
    } else {
        alert('Access Denied');
    }
  };

  const handleLayoutSubmit = async () => {
    if(!layoutForm.title || !layoutForm.copyLink) return alert("Title and Link required");
    setLoading(true);
    try {
        await addLayout(layoutForm);
        setMessage('✅ Layout Added!');
        setLayoutForm({ title: '', townHall: 16, type: 'War', imageUrl: '', copyLink: '' });
        setTimeout(() => setMessage(''), 3000);
    } catch(e: any) {
        alert('Error: ' + e.message);
    }
    setLoading(false);
  };

  const handleStratSubmit = async () => {
    if(!stratForm.title || !stratForm.armyInput) return alert("Title and Army required");
    setLoading(true);
    try {
        const townHalls = stratForm.thInput.split(',').map(n => parseInt(n.trim()));
        
        // Simple Parser: Convert "7x Root Rider" -> JSON
        // You can make this smarter later, or just type raw JSON if you prefer.
        // For now, we will store a simple object wrapper.
        const armyComp = stratForm.armyInput.split(',').map(s => {
            const parts = s.trim().split('x '); // Expects "5x Healer"
            if(parts.length === 2) return { count: parseInt(parts[0]), unit: parts[1] };
            return { count: 1, unit: s.trim() }; // Fallback
        });
        
        await addStrategy({ ...stratForm, townHalls, armyComp });
        setMessage('✅ Strategy Added!');
        setStratForm({ ...stratForm, title: '', description: '', armyInput: '', videoUrl: '', armyLink: '' });
        setTimeout(() => setMessage(''), 3000);
    } catch(e: any) {
        alert('Error: ' + e.message);
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="bg-[#1f2937] p-8 rounded-xl border border-white/10 text-center space-y-4 w-full max-w-sm shadow-2xl">
            <div className="inline-flex p-4 bg-red-500/10 rounded-full text-red-500 mb-2"><Lock size={32}/></div>
            <h1 className="text-2xl font-clash text-white">Admin Access</h1>
            <input 
              type="password" 
              placeholder="Enter PIN" 
              className="bg-black/30 text-white px-4 py-3 rounded-lg border border-white/10 w-full text-center outline-none focus:border-skin-primary transition-colors"
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={handleLogin} className="w-full bg-skin-primary text-black font-bold py-3 rounded-lg hover:bg-skin-secondary transition-colors">UNLOCK</button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen">
       <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-clash text-white">Dashboard</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-red-400 hover:text-red-300"><LogOut size={20}/></button>
       </div>
       
       {/* TABS */}
       <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('layout')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'layout' ? 'bg-skin-primary text-black shadow-lg scale-105' : 'bg-[#1f2937] text-skin-muted hover:bg-white/5'}`}>
             <Shield size={20}/> Add Layout
          </button>
          <button onClick={() => setActiveTab('strategy')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'strategy' ? 'bg-skin-secondary text-black shadow-lg scale-105' : 'bg-[#1f2937] text-skin-muted hover:bg-white/5'}`}>
             <Sword size={20}/> Add Strategy
          </button>
       </div>

       {message && <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-xl mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-2"><Check size={18}/> {message}</div>}

       {/* LAYOUT FORM */}
       {activeTab === 'layout' && (
          <div className="bg-[#1f2937] p-6 md:p-8 rounded-2xl border border-white/5 space-y-5 shadow-xl">
             <div className="space-y-1">
                <label className="text-xs font-bold text-skin-muted uppercase ml-1">Base Title</label>
                <input value={layoutForm.title} onChange={e => setLayoutForm({...layoutForm, title: e.target.value})} placeholder="e.g. Anti-Root Rider Box" className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none focus:border-skin-primary"/>
             </div>
             
             <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-skin-muted uppercase ml-1">Town Hall</label>
                    <select value={layoutForm.townHall} onChange={e => setLayoutForm({...layoutForm, townHall: parseInt(e.target.value)})} className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none">
                    {[17,16,15,14,13,12,11,10,9].map(n => <option key={n} value={n}>TH {n}</option>)}
                    </select>
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-skin-muted uppercase ml-1">Type</label>
                    <select value={layoutForm.type} onChange={e => setLayoutForm({...layoutForm, type: e.target.value})} className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none">
                    <option value="War">War</option><option value="Farm">Farm</option><option value="Troll">Troll</option>
                    </select>
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-skin-muted uppercase ml-1">Image URL</label>
                <input value={layoutForm.imageUrl} onChange={e => setLayoutForm({...layoutForm, imageUrl: e.target.value})} placeholder="Direct Image Link (Imgur/Discord)" className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none focus:border-skin-primary"/>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-skin-muted uppercase ml-1">Copy Link</label>
                <input value={layoutForm.copyLink} onChange={e => setLayoutForm({...layoutForm, copyLink: e.target.value})} placeholder="https://link.clashofclans.com/..." className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none focus:border-skin-primary"/>
             </div>

             <button onClick={handleLayoutSubmit} disabled={loading} className="bg-skin-primary text-black w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all mt-4">
                {loading ? 'Saving...' : <><Plus size={20}/> Save Layout To DB</>}
             </button>
          </div>
       )}

       {/* STRATEGY FORM */}
       {activeTab === 'strategy' && (
          <div className="bg-[#1f2937] p-6 md:p-8 rounded-2xl border border-white/5 space-y-5 shadow-xl">
             <div className="space-y-1">
                <label className="text-xs font-bold text-skin-muted uppercase ml-1">Strategy Name</label>
                <input value={stratForm.title} onChange={e => setStratForm({...stratForm, title: e.target.value})} placeholder="e.g. Super Archer Blimp" className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none focus:border-skin-secondary"/>
             </div>
             
             <textarea value={stratForm.description} onChange={e => setStratForm({...stratForm, description: e.target.value})} placeholder="Brief guide description..." className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 min-h-[100px] outline-none focus:border-skin-secondary"/>
             
             <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-skin-muted uppercase ml-1">Difficulty</label>
                    <select value={stratForm.difficulty} onChange={e => setStratForm({...stratForm, difficulty: e.target.value})} className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none">
                    <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Pro">Pro</option>
                    </select>
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-skin-muted uppercase ml-1">Town Halls</label>
                    <input value={stratForm.thInput} onChange={e => setStratForm({...stratForm, thInput: e.target.value})} placeholder="e.g. 15, 16" className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none"/>
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-skin-muted uppercase ml-1">Army Composition (Format: 5x Healer, 10x Miner)</label>
                <input value={stratForm.armyInput} onChange={e => setStratForm({...stratForm, armyInput: e.target.value})} placeholder="e.g. 5x Healer, 3x Rage Spell" className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none focus:border-skin-secondary"/>
             </div>

             <div className="flex gap-4">
                 <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-skin-muted uppercase ml-1">YouTube URL</label>
                    <input value={stratForm.videoUrl} onChange={e => setStratForm({...stratForm, videoUrl: e.target.value})} placeholder="https://youtu.be/..." className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none focus:border-skin-secondary"/>
                 </div>
                 <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-skin-muted uppercase ml-1">Army Link</label>
                    <input value={stratForm.armyLink} onChange={e => setStratForm({...stratForm, armyLink: e.target.value})} placeholder="https://link.clash..." className="w-full bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none focus:border-skin-secondary"/>
                 </div>
             </div>

             <button onClick={handleStratSubmit} disabled={loading} className="bg-skin-secondary text-black w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all mt-4">
                {loading ? 'Saving...' : <><Plus size={20}/> Save Strategy To DB</>}
             </button>
          </div>
       )}
    </div>
  );
}
