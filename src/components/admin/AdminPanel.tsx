'use client';

import { useState } from 'react';
import { Shield, Sword, Lock, LogOut, Loader2, FileJson, Code } from "lucide-react";
import { verifyAdmin } from "@/lib/actions";
import { useRouter } from 'next/navigation';

// Import the systematic components
import LayoutEditor from './LayoutEditor';
import StrategyEditor from './StrategyEditor';
import BulkImport from './BulkImport';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secret, setSecret] = useState('');
  const [activeTab, setActiveTab] = useState<'layout' | 'strategy'>('layout');
  const [jsonMode, setJsonMode] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoginLoading(true);
    const res = await verifyAdmin(secret);
    if (res.success) setIsAuthenticated(true);
    else alert("Access Denied");
    setLoginLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1015]">
         <div className="bg-[#1f2937] p-8 rounded-xl border border-white/10 text-center space-y-4 w-full max-w-sm">
            <div className="inline-flex p-4 bg-skin-primary/10 rounded-full text-skin-primary mb-2"><Lock size={32}/></div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <input type="password" onChange={(e) => setSecret(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className="admin-input text-center" placeholder="Enter Key"/>
            <button onClick={handleLogin} className="admin-btn-primary">{loginLoading ? <Loader2 className="animate-spin"/> : "Login"}</button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 min-h-screen pb-24">
       {/* HEADER */}
       <div className="flex justify-between items-center mb-6 bg-[#1f2937] p-4 rounded-xl border border-white/5 shadow-lg">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-skin-primary text-black rounded-lg flex items-center justify-center font-bold text-xl">A</div>
             <div><h1 className="text-xl font-bold text-white">Admin Dashboard</h1></div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold flex gap-2"><LogOut size={14}/> Logout</button>
       </div>
       
       {/* CONTROLS */}
       <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-4 flex-1">
            <button onClick={() => {setActiveTab('layout'); setJsonMode(false);}} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'layout' ? 'bg-skin-primary text-black' : 'bg-[#1f2937] text-skin-muted'}`}><Shield size={20}/> Layouts</button>
            <button onClick={() => {setActiveTab('strategy'); setJsonMode(false);}} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'strategy' ? 'bg-skin-secondary text-black' : 'bg-[#1f2937] text-skin-muted'}`}><Sword size={20}/> Strategies</button>
          </div>
          <button onClick={() => setJsonMode(!jsonMode)} className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold border ${jsonMode ? 'bg-white/10 border-skin-primary text-skin-primary' : 'bg-[#1f2937] border-white/5 text-skin-muted'}`}>
             {jsonMode ? <Code size={20}/> : <FileJson size={20}/>} {jsonMode ? 'Visual Mode' : 'Bulk Import'}
          </button>
       </div>

       {/* CONTENT AREA */}
       {jsonMode ? (
           <BulkImport type={activeTab} />
       ) : (
           activeTab === 'layout' ? <LayoutEditor /> : <StrategyEditor />
       )}
    </div>
  );
}
