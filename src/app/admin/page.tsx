'use client';

import { useState } from 'react';
import { Shield, Sword, Lock, Plus, Check, LogOut, Loader2, Play, Eye, Trash2 } from "lucide-react";
import { addLayout, addStrategy, verifyAdmin } from "@/lib/actions";
import { useRouter } from 'next/navigation';
import UnitSelector from '@/components/admin/UnitSelector';
import { getUnitIconPath } from '@/lib/unitHelpers';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [activeTab, setActiveTab] = useState<'layout' | 'strategy'>('layout');
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // --- FORMS ---
  const [layoutForm, setLayoutForm] = useState({ title: '', townHall: 16, type: 'War', imageUrl: '', copyLink: '' });
  const [stratForm, setStratForm] = useState({ 
    title: '', description: '', difficulty: 'Medium', videoUrl: '', armyLink: '', thInput: '16', 
    armyComp: [] as { unit: string; count: number }[]
  });

  // --- ACTIONS ---
  const handleLogin = async () => {
    if (!secret) return;
    setLoginLoading(true);
    try {
      const result = await verifyAdmin(secret);
      if (result.success) setIsAuthenticated(true);
      else alert(result.error || 'Access Denied');
    } catch (error) { alert("Login failed. Check connection."); }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
        setIsAuthenticated(false);
        router.push('/');
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
    } catch(e: any) { alert('Error: ' + e.message); }
    setLoading(false);
  };

  const handleStratSubmit = async () => {
    if(!stratForm.title || stratForm.armyComp.length === 0) return alert("Title and Army required");
    setLoading(true);
    try {
        const townHalls = stratForm.thInput.split(',').map(n => parseInt(n.trim()));
        await addStrategy({ ...stratForm, townHalls });
        setMessage('✅ Strategy Added!');
        setStratForm({ ...stratForm, title: '', description: '', armyComp: [], videoUrl: '', armyLink: '' });
        setTimeout(() => setMessage(''), 3000);
    } catch(e: any) { alert('Error: ' + e.message); }
    setLoading(false);
  };

  // Helper for YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="bg-[#1f2937] p-8 rounded-xl border border-white/10 text-center space-y-4 w-full max-w-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-skin-primary to-skin-secondary"></div>
            <div className="inline-flex p-4 bg-skin-primary/10 rounded-full text-skin-primary mb-2"><Lock size={32}/></div>
            <h1 className="text-2xl font-clash text-white">Admin Portal</h1>
            <input 
              type="password" 
              placeholder="Enter Access Key" 
              className="bg-black/30 text-white px-4 py-3 rounded-lg border border-white/10 w-full text-center outline-none focus:border-skin-primary transition-colors"
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loginLoading}
            />
            <button onClick={handleLogin} disabled={loginLoading} className="w-full bg-skin-primary text-black font-bold py-3 rounded-lg hover:bg-skin-secondary transition-colors flex items-center justify-center gap-2">
              {loginLoading ? <Loader2 size={18} className="animate-spin"/> : "Login"}
            </button>
         </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 min-h-screen">
       {/* HEADER */}
       <div className="flex justify-between items-center mb-8 bg-[#1f2937] p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-skin-primary text-black rounded-lg flex items-center justify-center font-bold font-clash text-xl">A</div>
             <div>
                <h1 className="text-xl font-bold text-white leading-none">Admin Dashboard</h1>
                <p className="text-xs text-skin-muted">Manage content securely</p>
             </div>
          </div>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
            <LogOut size={14}/> Logout
          </button>
       </div>
       
       {/* TABS */}
       <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('layout')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'layout' ? 'bg-skin-primary text-black shadow-lg' : 'bg-[#1f2937] text-skin-muted hover:bg-white/5'}`}>
             <Shield size={20}/> Add Layout
          </button>
          <button onClick={() => setActiveTab('strategy')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'strategy' ? 'bg-skin-secondary text-black shadow-lg' : 'bg-[#1f2937] text-skin-muted hover:bg-white/5'}`}>
             <Sword size={20}/> Add Strategy
          </button>
       </div>

       {message && <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-xl mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-2"><Check size={18}/> {message}</div>}

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* === LAYOUT FORM === */}
           {activeTab === 'layout' && (
              <>
                <div className="bg-[#1f2937] p-6 rounded-2xl border border-white/5 space-y-5 shadow-xl">
                    <h3 className="text-sm font-bold text-skin-muted uppercase border-b border-white/5 pb-2">Layout Details</h3>
                    <input value={layoutForm.title} onChange={e => setLayoutForm({...layoutForm, title: e.target.value})} placeholder="Base Title" className="admin-input"/>
                    
                    <div className="flex gap-4">
                        <select value={layoutForm.townHall} onChange={e => setLayoutForm({...layoutForm, townHall: parseInt(e.target.value)})} className="admin-select">
                        {[17,16,15,14,13,12,11,10,9].map(n => <option key={n} value={n}>TH {n}</option>)}
                        </select>
                        <select value={layoutForm.type} onChange={e => setLayoutForm({...layoutForm, type: e.target.value})} className="admin-select">
                        <option value="War">War</option><option value="Farm">Farm</option><option value="Troll">Troll</option>
                        </select>
                    </div>

                    <input value={layoutForm.imageUrl} onChange={e => setLayoutForm({...layoutForm, imageUrl: e.target.value})} placeholder="Image URL" className="admin-input"/>
                    <input value={layoutForm.copyLink} onChange={e => setLayoutForm({...layoutForm, copyLink: e.target.value})} placeholder="Clash Copy Link" className="admin-input"/>

                    <button onClick={handleLayoutSubmit} disabled={loading} className="admin-btn-primary">
                        {loading ? <Loader2 size={20} className="animate-spin"/> : <><Plus size={20}/> Save Layout</>}
                    </button>
                </div>

                {/* LAYOUT PREVIEW CARD */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-skin-muted uppercase flex items-center gap-2"><Eye size={12}/> Live Preview</h3>
                    <div className="group bg-[#1a232e] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl max-w-sm mx-auto">
                        <div className="aspect-[16/9] relative bg-[#0c1219] overflow-hidden border-b border-white/5">
                             {layoutForm.imageUrl ? (
                                <img src={layoutForm.imageUrl} className="w-full h-full object-cover" alt="Preview"/>
                             ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-skin-muted text-xs">No Image Preview</div>
                             )}
                             <div className="absolute top-2 right-2"><span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">TH {layoutForm.townHall}</span></div>
                             <div className="absolute bottom-2 left-2"><span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">{layoutForm.type}</span></div>
                        </div>
                        <div className="p-4 space-y-3">
                           <h3 className="font-bold text-white text-lg leading-tight">{layoutForm.title || "Base Title Preview"}</h3>
                           <button className="w-full bg-[#2a3a4b] text-white font-bold text-xs py-3 rounded-lg uppercase tracking-wide opacity-50 cursor-not-allowed">Copy Base Link</button>
                        </div>
                    </div>
                </div>
              </>
           )}

           {/* === STRATEGY FORM === */}
           {activeTab === 'strategy' && (
              <>
                <div className="bg-[#1f2937] p-6 rounded-2xl border border-white/5 space-y-5 shadow-xl h-fit">
                    <h3 className="text-sm font-bold text-skin-muted uppercase border-b border-white/5 pb-2">Strategy Details</h3>
                    <input value={stratForm.title} onChange={e => setStratForm({...stratForm, title: e.target.value})} placeholder="Strategy Name" className="admin-input"/>
                    
                    <textarea value={stratForm.description} onChange={e => setStratForm({...stratForm, description: e.target.value})} placeholder="Guide Description..." className="admin-input min-h-[80px]"/>
                    
                    <div className="flex gap-4">
                        <select value={stratForm.difficulty} onChange={e => setStratForm({...stratForm, difficulty: e.target.value})} className="admin-select">
                        <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Pro">Pro</option>
                        </select>
                        <input value={stratForm.thInput} onChange={e => setStratForm({...stratForm, thInput: e.target.value})} placeholder="TH Levels (e.g. 15, 16)" className="admin-input"/>
                    </div>

                    <div className="space-y-4">
                        {/* VISUAL UNIT SELECTOR */}
                        <UnitSelector 
                            army={stratForm.armyComp} 
                            setArmy={(army) => setStratForm({...stratForm, armyComp: army})} 
                            filterTH={parseInt(stratForm.thInput.split(',')[0] || '16')}
                        />
                    </div>

                    <input value={stratForm.videoUrl} onChange={e => setStratForm({...stratForm, videoUrl: e.target.value})} placeholder="YouTube URL" className="admin-input"/>
                    <input value={stratForm.armyLink} onChange={e => setStratForm({...stratForm, armyLink: e.target.value})} placeholder="Army Link" className="admin-input"/>

                    <button onClick={handleStratSubmit} disabled={loading} className="bg-skin-secondary text-black w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                        {loading ? <Loader2 size={20} className="animate-spin"/> : <><Plus size={20}/> Save Strategy</>}
                    </button>
                </div>

                {/* STRATEGY PREVIEW */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-skin-muted uppercase flex items-center gap-2"><Eye size={12}/> Live Preview</h3>
                    
                    {/* Video Preview */}
                    {getYoutubeId(stratForm.videoUrl) && (
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg mb-4">
                             <iframe src={`https://www.youtube.com/embed/${getYoutubeId(stratForm.videoUrl)}`} className="w-full h-full"></iframe>
                        </div>
                    )}

                    {/* Card Preview */}
                    <div className="bg-[#1a232e] border border-white/5 rounded-2xl p-4 shadow-xl">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="font-bold text-white text-lg">{stratForm.title || "Strategy Title"}</h3>
                           <span className="text-[10px] bg-skin-primary text-black px-1.5 py-0.5 rounded font-bold">TH{stratForm.thInput.split(',')[0]}</span>
                        </div>
                        <p className="text-xs text-skin-muted line-clamp-3 mb-4">{stratForm.description || "Description preview..."}</p>
                        
                        {/* Army Preview Mini */}
                        <div className="bg-[#131b24] p-3 rounded-xl border border-white/5">
                            <div className="flex flex-wrap gap-1">
                                {stratForm.armyComp.length === 0 && <span className="text-[10px] text-skin-muted italic">No army selected</span>}
                                {stratForm.armyComp.map((u, i) => (
                                    <div key={i} className="relative w-8 h-8 bg-[#2a3a4b] rounded border border-white/10">
                                        <img src={getUnitIconPath(u.unit)} className="w-full h-full object-contain p-0.5" alt=""/>
                                        <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] px-1 rounded">{u.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              </>
           )}
       </div>
    </div>
  );
}
