'use client';

import { useState } from 'react';
import { Shield, Sword, Lock, Plus, Check } from "lucide-react";
import { addLayout, addStrategy } from "@/lib/actions"; // We will create this next

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [activeTab, setActiveTab] = useState<'layout' | 'strategy'>('layout');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form States
  const [layoutForm, setLayoutForm] = useState({ title: '', townHall: 16, type: 'War', imageUrl: '', copyLink: '' });
  const [stratForm, setStratForm] = useState({ title: '', description: '', difficulty: 'Medium', videoUrl: '', thInput: '16', armyInput: '' });

  const handleLogin = () => {
    // Ideally this check happens server-side, but for a simple personal app:
    if(secret === 'EagleAdmin2026') { // Matches .env variable (conceptually)
        setIsAuthenticated(true);
    } else {
        alert('Wrong Password');
    }
  };

  const handleLayoutSubmit = async () => {
    setLoading(true);
    try {
        await addLayout(layoutForm);
        setMessage('✅ Layout Added!');
        setLayoutForm({ title: '', townHall: 16, type: 'War', imageUrl: '', copyLink: '' });
    } catch(e) {
        alert('Error adding layout');
    }
    setLoading(false);
  };

  const handleStratSubmit = async () => {
    setLoading(true);
    try {
        // Parse inputs
        const townHalls = stratForm.thInput.split(',').map(n => parseInt(n.trim()));
        // Simple parser: "7x Barbarian, 3x Archer" -> JSON
        // For now, we will just save raw string or simple structure
        const armyComp = { raw: stratForm.armyInput }; 
        
        await addStrategy({ ...stratForm, townHalls, armyComp });
        setMessage('✅ Strategy Added!');
        setStratForm({ ...stratForm, title: '', description: '' });
    } catch(e) {
        alert('Error adding strategy');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
         <div className="bg-[#1f2937] p-8 rounded-xl border border-white/10 text-center space-y-4">
            <div className="inline-flex p-3 bg-red-500/10 rounded-full text-red-500"><Lock size={32}/></div>
            <h1 className="text-2xl font-clash text-white">Admin Access</h1>
            <input 
              type="password" 
              placeholder="Enter PIN" 
              className="bg-black/30 text-white px-4 py-2 rounded-lg border border-white/10 w-full text-center"
              onChange={(e) => setSecret(e.target.value)}
            />
            <button onClick={handleLogin} className="w-full bg-skin-primary text-black font-bold py-2 rounded-lg hover:bg-skin-secondary">Unlock</button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
       <h1 className="text-4xl font-clash text-white mb-8">Admin Dashboard</h1>
       
       {/* TABS */}
       <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('layout')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'layout' ? 'bg-skin-primary text-black' : 'bg-[#1f2937] text-skin-muted'}`}>
             <Shield size={20}/> Add Layout
          </button>
          <button onClick={() => setActiveTab('strategy')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'strategy' ? 'bg-skin-secondary text-black' : 'bg-[#1f2937] text-skin-muted'}`}>
             <Sword size={20}/> Add Strategy
          </button>
       </div>

       {message && <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-4 flex items-center gap-2"><Check size={16}/> {message}</div>}

       {/* LAYOUT FORM */}
       {activeTab === 'layout' && (
          <div className="bg-[#1f2937] p-6 rounded-xl border border-white/5 space-y-4">
             <input value={layoutForm.title} onChange={e => setLayoutForm({...layoutForm, title: e.target.value})} placeholder="Base Title (e.g. Anti-3 Star)" className="w-full bg-black/20 p-3 rounded-lg text-white border border-white/5"/>
             
             <div className="flex gap-4">
                <select value={layoutForm.townHall} onChange={e => setLayoutForm({...layoutForm, townHall: parseInt(e.target.value)})} className="bg-black/20 p-3 rounded-lg text-white border border-white/5">
                   {[16,15,14,13,12,11,10].map(n => <option key={n} value={n}>TH {n}</option>)}
                </select>
                <select value={layoutForm.type} onChange={e => setLayoutForm({...layoutForm, type: e.target.value})} className="bg-black/20 p-3 rounded-lg text-white border border-white/5">
                   <option value="War">War</option><option value="Farm">Farm</option>
                </select>
             </div>

             <input value={layoutForm.imageUrl} onChange={e => setLayoutForm({...layoutForm, imageUrl: e.target.value})} placeholder="Image URL (Right click discord image > Copy Link)" className="w-full bg-black/20 p-3 rounded-lg text-white border border-white/5"/>
             <input value={layoutForm.copyLink} onChange={e => setLayoutForm({...layoutForm, copyLink: e.target.value})} placeholder="Clash Copy Link (https://link.clash...)" className="w-full bg-black/20 p-3 rounded-lg text-white border border-white/5"/>

             <button onClick={handleLayoutSubmit} disabled={loading} className="bg-skin-primary text-black w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90">
                {loading ? 'Saving...' : <><Plus size={20}/> Save Layout</>}
             </button>
          </div>
       )}

       {/* STRATEGY FORM */}
       {activeTab === 'strategy' && (
          <div className="bg-[#1f2937] p-6 rounded-xl border border-white/5 space-y-4">
             <input value={stratForm.title} onChange={e => setStratForm({...stratForm, title: e.target.value})} placeholder="Strategy Name (e.g. Queen Charge Hybrid)" className="w-full bg-black/20 p-3 rounded-lg text-white border border-white/5"/>
             <textarea value={stratForm.description} onChange={e => setStratForm({...stratForm, description: e.target.value})} placeholder="Brief guide description..." className="w-full bg-black/20 p-3 rounded-lg text-white border border-white/5 min-h-[100px]"/>
             
             <div className="flex gap-4">
                <select value={stratForm.difficulty} onChange={e => setStratForm({...stratForm, difficulty: e.target.value})} className="bg-black/20 p-3 rounded-lg text-white border border-white/5">
                   <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Pro">Pro</option>
                </select>
                <input value={stratForm.thInput} onChange={e => setStratForm({...stratForm, thInput: e.target.value})} placeholder="Town Halls (e.g. 13, 14, 15)" className="flex-1 bg-black/20 p-3 rounded-lg text-white border border-white/5"/>
             </div>

             <input value={stratForm.armyInput} onChange={e => setStratForm({...stratForm, armyInput: e.target.value})} placeholder="Army (e.g. 5x Healers, 14x Miners)" className="w-full bg-black/20 p-3 rounded-lg text-white border border-white/5"/>
             <input value={stratForm.videoUrl} onChange={e => setStratForm({...stratForm, videoUrl: e.target.value})} placeholder="YouTube Link" className="w-full bg-black/20 p-3 rounded-lg text-white border border-white/5"/>

             <button onClick={handleStratSubmit} disabled={loading} className="bg-skin-secondary text-black w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90">
                {loading ? 'Saving...' : <><Plus size={20}/> Save Strategy</>}
             </button>
          </div>
       )}
    </div>
  );
}
