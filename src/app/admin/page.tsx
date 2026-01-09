'use client';

import { useState, useRef, useEffect } from 'react';
import { Shield, Sword, Lock, Plus, Check, LogOut, Loader2, Play, Eye, ChevronDown, Castle, Link as LinkIcon, RefreshCw, X } from "lucide-react";
import { addLayout, addStrategy, verifyAdmin } from "@/lib/actions";
import { useRouter } from 'next/navigation';
import UnitSelector from '@/components/admin/UnitSelector';
import { getUnitIconPath, UNIT_CATEGORIES } from "@/lib/unitHelpers";

// --- COMPLETE CLASH OF CLANS ID MAP ---
const UNIT_ID_MAP: Record<string, number> = {
  // Elixir Troops
  "Barbarian": 1, "Archer": 2, "Giant": 3, "Goblin": 4, "Wall Breaker": 5,
  "Balloon": 6, "Wizard": 7, "Healer": 8, "Dragon": 9, "P.E.K.K.A": 10,
  "Baby Dragon": 23, "Miner": 24, "Electro Dragon": 59, "Yeti": 53,
  "Dragon Rider": 84, "Electro Titan": 95, "Root Rider": 110, 
  "Electrofire Wizard": 111, "Druid": 112, "Thrower": 113,
  
  // Dark Troops
  "Minion": 11, "Hog Rider": 12, "Valkyrie": 13, "Golem": 14, "Witch": 15,
  "Lava Hound": 17, "Bowler": 22, "Ice Golem": 58, "Headhunter": 82,
  "Apprentice Warden": 97, 
  
  // Super Troops
  "Super Barbarian": 26, "Super Archer": 27, "Super Wall Breaker": 29, "Super Giant": 28,
  "Sneaky Goblin": 55, "Rocket Balloon": 57, "Super Wizard": 83, "Super Dragon": 63,
  "Inferno Dragon": 62, "Super Minion": 80, "Super Valkyrie": 64, "Super Witch": 66,
  "Ice Hound": 76, "Super Bowler": 65, "Super Miner": 60, "Super Hog Rider": 61,

  // Spells
  "Lightning Spell": 1, "Healing Spell": 2, "Rage Spell": 3, "Jump Spell": 4,
  "Freeze Spell": 5, "Clone Spell": 12, "Invisibility Spell": 35, "Recall Spell": 36,
  "Revive Spell": 37, "Totem Spell": 38,
  "Poison Spell": 9, "Earthquake Spell": 10, "Haste Spell": 11, "Skeleton Spell": 13,
  "Bat Spell": 28, "Overgrowth Spell": 39,

  // Sieges
  "Wall Wrecker": 51, "Battle Blimp": 52, "Stone Slammer": 54, 
  "Siege Barracks": 62, "Log Launcher": 75, "Flame Flinger": 91, 
  "Battle Drill": 98, "Troop Launcher": 102
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [activeTab, setActiveTab] = useState<'layout' | 'strategy'>('layout');
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Forms
  const [layoutForm, setLayoutForm] = useState({ title: '', townHall: 16, type: 'War', imageUrl: '', copyLink: '' });
  
  // UPDATED: 'thInput' replaced with 'townHall' number
  const [stratForm, setStratForm] = useState({ 
    title: '', description: '', difficulty: 'Medium', videoUrl: '', armyLink: '', 
    townHall: 16, // Default TH
    armyComp: [] as { unit: string; count: number }[]
  });

  // Custom Selector States
  const [isTHDropdownOpen, setIsTHDropdownOpen] = useState(false);
  const thDropdownRef = useRef<HTMLDivElement>(null);
  const TOWN_HALLS = Array.from({ length: 17 }, (_, i) => 18 - i);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (thDropdownRef.current && !thDropdownRef.current.contains(event.target as Node)) {
        setIsTHDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- AUTO-GENERATE ARMY LINK ---
  useEffect(() => {
    if (stratForm.armyComp.length === 0) {
        setStratForm(prev => ({ ...prev, armyLink: '' }));
        return;
    }

    let troopsPart = "";
    let spellsPart = "";

    stratForm.armyComp.forEach(u => {
      const id = UNIT_ID_MAP[u.unit];
      const isSpell = UNIT_CATEGORIES.elixirSpells.includes(u.unit) || UNIT_CATEGORIES.darkSpells.includes(u.unit);
      
      if (id) {
          if (isSpell) spellsPart += `-${id}x${u.count}`;
          else troopsPart += `-${id}x${u.count}`;
      }
    });

    if (troopsPart.startsWith('-')) troopsPart = troopsPart.substring(1);
    if (spellsPart.startsWith('-')) spellsPart = spellsPart.substring(1);

    const link = `https://link.clashofclans.com/en?action=OpenArmy&troops=${troopsPart}&spells=${spellsPart}`;
    
    setStratForm(prev => {
        if (prev.armyLink !== link) return { ...prev, armyLink: link };
        return prev;
    });
    
  }, [stratForm.armyComp]);

  const handleLogin = async () => {
    if (!secret) return;
    setLoginLoading(true);
    try {
      const result = await verifyAdmin(secret);
      if (result.success) setIsAuthenticated(true);
      else alert(result.error || 'Access Denied');
    } catch (error) { alert("Login failed."); }
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
        setLayoutForm({ ...layoutForm, title: '', imageUrl: '', copyLink: '' });
        setTimeout(() => setMessage(''), 3000);
    } catch(e: any) { alert('Error: ' + e.message); }
    setLoading(false);
  };

  const handleStratSubmit = async () => {
    if(!stratForm.title || stratForm.armyComp.length === 0) return alert("Title and Army required");
    setLoading(true);
    try {
        // Send as array [townHall] to match backend expectation of 'town_halls'
        await addStrategy({ ...stratForm, townHalls: [stratForm.townHall] });
        setMessage('✅ Strategy Added!');
        setStratForm({ ...stratForm, title: '', description: '', armyComp: [], videoUrl: '', armyLink: '' });
        setTimeout(() => setMessage(''), 3000);
    } catch(e: any) { alert('Error: ' + e.message); }
    setLoading(false);
  };

  // --- REUSABLE TH DROPDOWN COMPONENT ---
  const THSelector = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => (
    <div className="relative w-full" ref={thDropdownRef}>
        <button 
            onClick={() => setIsTHDropdownOpen(!isTHDropdownOpen)}
            className="w-full flex items-center justify-between bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none hover:bg-black/30 transition-all"
        >
            <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex items-center justify-center bg-[#0c1015] rounded border border-white/10 overflow-hidden">
                     <Castle className="text-skin-muted opacity-30 w-5 h-5" />
                     <img 
                        src={`/assets/icons/town_hall_${value}.png`} 
                        alt={`TH${value}`} 
                        className="absolute inset-0 w-full h-full object-contain"
                        onError={(e) => e.currentTarget.style.display='none'}
                    />
                </div>
                <span className="text-sm font-bold uppercase">Town Hall {value}</span>
            </div>
            <ChevronDown size={16} className={`text-skin-muted transition-transform ${isTHDropdownOpen ? 'rotate-180' : ''}`}/>
        </button>

        {isTHDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 w-full max-h-60 overflow-y-auto bg-[#1f2937] border border-white/10 rounded-xl shadow-2xl z-50 custom-scrollbar animate-in fade-in zoom-in-95">
                {TOWN_HALLS.map(th => (
                    <button 
                        key={th} 
                        onClick={() => { onChange(th); setIsTHDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0 ${value === th ? 'bg-skin-primary/10' : ''}`}
                    >
                        <div className="relative w-8 h-8 flex items-center justify-center bg-[#0c1015] rounded border border-white/10 overflow-hidden">
                             <img src={`/assets/icons/town_hall_${th}.png`} alt={`TH${th}`} className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display='none'}/>
                        </div>
                        <span className={`text-sm font-bold uppercase ${value === th ? 'text-white' : 'text-skin-muted'}`}>Town Hall {th}</span>
                    </button>
                ))}
            </div>
        )}
    </div>
  );

  if (!isAuthenticated) { /* Login Code ... */ 
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="bg-[#1f2937] p-8 rounded-xl border border-white/10 text-center space-y-4 w-full max-w-sm shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-skin-primary to-skin-secondary"></div>
            <div className="inline-flex p-4 bg-skin-primary/10 rounded-full text-skin-primary mb-2"><Lock size={32}/></div>
            <h1 className="text-2xl font-clash text-white">Admin Portal</h1>
            <input type="password" placeholder="Enter Access Key" className="admin-input text-center" onChange={(e) => setSecret(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} disabled={loginLoading} />
            <button onClick={handleLogin} disabled={loginLoading} className="admin-btn-primary">{loginLoading ? <Loader2 size={18} className="animate-spin"/> : "Login"}</button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 min-h-screen pb-24">
       {/* HEADER */}
       <div className="flex justify-between items-center mb-6 bg-[#1f2937] p-4 rounded-xl border border-white/5 shadow-lg">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-skin-primary text-black rounded-lg flex items-center justify-center font-bold font-clash text-xl">A</div>
             <div><h1 className="text-xl font-bold text-white leading-none">Admin Dashboard</h1><p className="text-xs text-skin-muted">Manage content securely</p></div>
          </div>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"><LogOut size={14}/> Logout</button>
       </div>
       
       {/* TABS */}
       <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('layout')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'layout' ? 'bg-skin-primary text-black shadow-lg' : 'bg-[#1f2937] text-skin-muted hover:bg-white/5'}`}><Shield size={20}/> Layouts</button>
          <button onClick={() => setActiveTab('strategy')} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'strategy' ? 'bg-skin-secondary text-black shadow-lg' : 'bg-[#1f2937] text-skin-muted hover:bg-white/5'}`}><Sword size={20}/> Strategies</button>
       </div>

       {message && <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-xl mb-6 flex items-center gap-2"><Check size={18}/> {message}</div>}

       {/* === LAYOUT SECTION === */}
       {activeTab === 'layout' && (
          <div className="flex flex-col gap-8">
            <div className="bg-[#1f2937] p-6 rounded-2xl border border-white/5 space-y-5 shadow-xl">
                <h3 className="text-sm font-bold text-skin-muted uppercase border-b border-white/5 pb-2">Layout Details</h3>
                <input value={layoutForm.title} onChange={e => setLayoutForm({...layoutForm, title: e.target.value})} placeholder="Base Title" className="admin-input"/>
                
                <div className="flex flex-col md:flex-row gap-4">
                    {/* CUSTOM TH DROPDOWN */}
                    <THSelector value={layoutForm.townHall} onChange={(val) => setLayoutForm({...layoutForm, townHall: val})} />
                    
                    <select value={layoutForm.type} onChange={e => setLayoutForm({...layoutForm, type: e.target.value})} className="admin-select">
                        <option value="War">War</option><option value="Farm">Farm</option><option value="Troll">Troll</option>
                    </select>
                </div>

                <input value={layoutForm.imageUrl} onChange={e => setLayoutForm({...layoutForm, imageUrl: e.target.value})} placeholder="Image URL" className="admin-input"/>
                <input value={layoutForm.copyLink} onChange={e => setLayoutForm({...layoutForm, copyLink: e.target.value})} placeholder="Clash Copy Link" className="admin-input"/>
            </div>

            {/* PREVIEW */}
            <div className="space-y-2">
                <h3 className="text-xs font-bold text-skin-muted uppercase flex items-center gap-2"><Eye size={12}/> Live Preview</h3>
                <div className="group bg-[#1a232e] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl max-w-sm mx-auto">
                    <div className="aspect-[16/9] relative bg-[#0c1219] overflow-hidden border-b border-white/5">
                            {layoutForm.imageUrl ? <img src={layoutForm.imageUrl} className="w-full h-full object-cover" alt="Preview"/> : <div className="absolute inset-0 flex items-center justify-center text-skin-muted text-xs">No Image Preview</div>}
                            <div className="absolute top-2 right-2"><span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">TH {layoutForm.townHall}</span></div>
                    </div>
                    <div className="p-4 space-y-3">
                        <h3 className="font-bold text-white text-lg leading-tight">{layoutForm.title || "Base Title Preview"}</h3>
                    </div>
                </div>
            </div>

            <button onClick={handleLayoutSubmit} disabled={loading} className="admin-btn-primary mt-4">
                {loading ? <Loader2 size={20} className="animate-spin"/> : <><Plus size={20}/> Save Layout</>}
            </button>
          </div>
       )}

       {/* === STRATEGY SECTION === */}
       {activeTab === 'strategy' && (
          <div className="flex flex-col gap-8">
            <div className="bg-[#1f2937] p-6 rounded-2xl border border-white/5 space-y-5 shadow-xl">
                <h3 className="text-sm font-bold text-skin-muted uppercase border-b border-white/5 pb-2">Strategy Details</h3>
                <input value={stratForm.title} onChange={e => setStratForm({...stratForm, title: e.target.value})} placeholder="Strategy Name" className="admin-input"/>
                <textarea value={stratForm.description} onChange={e => setStratForm({...stratForm, description: e.target.value})} placeholder="Guide Description..." className="admin-input min-h-[80px]"/>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <select value={stratForm.difficulty} onChange={e => setStratForm({...stratForm, difficulty: e.target.value})} className="admin-select">
                        <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Pro">Pro</option>
                    </select>
                    
                    {/* UPDATED: VISUAL TH DROPDOWN (Replacing Text Box) */}
                    <THSelector value={stratForm.townHall} onChange={(val) => setStratForm({...stratForm, townHall: val})} />
                </div>

                {/* UNIT SELECTOR */}
                <UnitSelector 
                    army={stratForm.armyComp} 
                    setArmy={(army) => setStratForm({...stratForm, armyComp: army})} 
                    filterTH={stratForm.townHall} 
                />

                <input value={stratForm.videoUrl} onChange={e => setStratForm({...stratForm, videoUrl: e.target.value})} placeholder="YouTube URL" className="admin-input"/>
                
                {/* AUTO-GENERATED LINK */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon size={14} className="text-skin-muted"/>
                    </div>
                    <input 
                        value={stratForm.armyLink} 
                        readOnly 
                        placeholder="Link auto-generated..." 
                        className="admin-input pl-10 text-xs text-skin-muted cursor-not-allowed opacity-80"
                    />
                </div>
            </div>

            {/* PREVIEW */}
            <div className="space-y-2">
                <h3 className="text-xs font-bold text-skin-muted uppercase flex items-center gap-2"><Eye size={12}/> Live Preview</h3>
                <div className="bg-[#1a232e] border border-white/5 rounded-2xl p-4 shadow-xl">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-white text-lg">{stratForm.title || "Strategy Title"}</h3>
                        <span className="text-[10px] bg-skin-primary text-black px-1.5 py-0.5 rounded font-bold">TH{stratForm.townHall}</span>
                    </div>
                    <div className="bg-[#131b24] p-3 rounded-xl border border-white/5 flex flex-wrap gap-1">
                        {stratForm.armyComp.map((u, i) => (
                            <div key={i} className="relative w-8 h-8 bg-[#2a3a4b] rounded border border-white/10">
                                <img src={getUnitIconPath(u.unit)} className="w-full h-full object-contain p-0.5" alt=""/>
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] px-1 rounded">{u.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button onClick={handleStratSubmit} disabled={loading} className="bg-skin-secondary text-black w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg active:scale-95">
                {loading ? <Loader2 size={20} className="animate-spin"/> : <><Plus size={20}/> Save Strategy</>}
            </button>
          </div>
       )}
    </div>
  );
}
