'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Trash2, Shield, Sword, ArrowRight } from "lucide-react";

export default function HistoryLog() {
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('clash_search_history');
    if (saved) setRecent(JSON.parse(saved));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('clash_search_history');
    setRecent([]);
  };

  if (recent.length === 0) return null;

  const recentClans = recent.filter(r => r.type === 'clan').slice(0, 4);
  const recentPlayers = recent.filter(r => r.type === 'player').slice(0, 4);

  return (
    <div className="w-full bg-[#131b24] border border-white/5 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
        <h3 className="text-sm font-bold text-skin-muted uppercase flex items-center gap-2 tracking-widest">
          <Clock size={14} /> Battle Log (History)
        </h3>
        <button onClick={clearHistory} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded transition-colors">
          <Trash2 size={10} /> CLEAR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Clan History List */}
        {recentClans.length > 0 && (
          <HistorySection title="Clans Scouted" items={recentClans} type="clan" icon={Shield} colorClass="text-skin-primary" />
        )}

        {/* Player History List */}
        {recentPlayers.length > 0 && (
          <HistorySection title="Players Scouted" items={recentPlayers} type="player" icon={Sword} colorClass="text-skin-secondary" />
        )}
      </div>
    </div>
  );
}

// Sub-component for lists to keep code DRY
function HistorySection({ title, items, type, icon: Icon, colorClass }: any) {
  return (
    <div className="space-y-3">
      <h4 className={`text-[10px] font-bold ${colorClass} uppercase tracking-widest flex items-center gap-2`}>
        <Icon size={10} /> {title}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {items.map((item: any, idx: number) => (
          <Link
            key={idx}
            href={`/${type}/${encodeURIComponent(item.tag)}`}
            className={`flex items-center gap-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-transparent hover:border-${type === 'clan' ? 'skin-primary' : 'skin-secondary'}/30 transition-all group`}
          >
            <div className="w-8 h-8 rounded bg-black/30 flex items-center justify-center shrink-0">
              <img src={item.icon} className="w-6 h-6 object-contain" alt="" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold text-white truncate group-hover:${colorClass} transition-colors`}>{item.name}</p>
              <p className="text-[10px] text-skin-muted font-mono truncate">{item.tag}</p>
            </div>
            <ArrowRight size={14} className="ml-auto text-skin-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
