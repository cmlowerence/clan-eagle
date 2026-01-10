'use client';

import { useState } from 'react';
import { Shield, Sword, LogOut, FileJson, Code } from "lucide-react";
import { useRouter } from 'next/navigation';

// Import all systematic components
import LoginScreen from './LoginScreen';
import LayoutEditor from './LayoutEditor';
import StrategyEditor from './StrategyEditor';
import BulkImport from './BulkImport';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'strategy'>('layout');
  const [jsonMode, setJsonMode] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
      if (window.confirm("Are you sure you want to logout?")) {
          setIsAuthenticated(false);
          router.push('/');
      }
  };

  // 1. SHOW LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // 2. SHOW DASHBOARD IF AUTHENTICATED
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 min-h-screen pb-24 animate-in fade-in">
       {/* HEADER */}
       <div className="flex justify-between items-center mb-6 bg-[#1f2937] p-4 rounded-xl border border-white/5 shadow-lg">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-skin-primary text-black rounded-lg flex items-center justify-center font-bold text-xl">A</div>
             <div><h1 className="text-xl font-bold text-white">Admin Dashboard</h1></div>
          </div>
          <button onClick={handleLogout} className="text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold flex gap-2 hover:bg-red-500/20 transition-colors"><LogOut size={14}/> Logout</button>
       </div>
       
       {/* CONTROLS */}
       <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-4 flex-1">
            <button onClick={() => {setActiveTab('layout'); setJsonMode(false);}} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'layout' ? 'bg-skin-primary text-black shadow-lg' : 'bg-[#1f2937] text-skin-muted hover:bg-white/5'}`}><Shield size={20}/> Layouts</button>
            <button onClick={() => {setActiveTab('strategy'); setJsonMode(false);}} className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'strategy' ? 'bg-skin-secondary text-black shadow-lg' : 'bg-[#1f2937] text-skin-muted hover:bg-white/5'}`}><Sword size={20}/> Strategies</button>
          </div>
          <button onClick={() => setJsonMode(!jsonMode)} className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold border transition-all ${jsonMode ? 'bg-white/10 border-skin-primary text-skin-primary shadow-lg' : 'bg-[#1f2937] border-white/5 text-skin-muted hover:text-white'}`}>
             {jsonMode ? <Code size={20}/> : <FileJson size={20}/>} {jsonMode ? 'Visual Mode' : 'Bulk Import'}
          </button>
       </div>

       {/* CONTENT AREA */}
       <div className="transition-all duration-300">
           {jsonMode ? (
               <BulkImport type={activeTab} />
           ) : (
               activeTab === 'layout' ? <LayoutEditor /> : <StrategyEditor />
           )}
       </div>
    </div>
  );
}
