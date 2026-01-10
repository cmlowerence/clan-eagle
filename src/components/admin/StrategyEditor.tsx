'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2, Link as LinkIcon, Check } from "lucide-react";
import THSelector from './THSelector';
import UnitSelector from '@/components/admin/UnitSelector';
import { getUnitIconPath, UNIT_CATEGORIES } from "@/lib/unitHelpers";
import { addStrategy } from "@/lib/actions";

// Move the ID Map here to keep main file clean
const UNIT_ID_MAP: Record<string, number> = {
  "Barbarian": 1, "Archer": 2, "Giant": 3, "Goblin": 4, "Wall Breaker": 5,
  "Balloon": 6, "Wizard": 7, "Healer": 8, "Dragon": 9, "P.E.K.K.A": 10,
  "Minion": 11, "Hog Rider": 12, "Valkyrie": 13, "Golem": 14, "Witch": 15,
  "Lava Hound": 17, "Bowler": 22, "Baby Dragon": 23, "Miner": 24, 
  "Electro Dragon": 59, "Yeti": 53, "Ice Golem": 58, "Root Rider": 110,
  // ... (Add all other IDs from your original list here if needed for completeness)
  "Lightning Spell": 1, "Healing Spell": 2, "Rage Spell": 3, "Jump Spell": 4,
  "Freeze Spell": 5, "Poison Spell": 9, "Earthquake Spell": 10, "Haste Spell": 11,
  "Wall Wrecker": 51, "Battle Blimp": 52, "Stone Slammer": 54, "Log Launcher": 75
};

export default function StrategyEditor() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({ 
        title: '', description: '', difficulty: 'Medium', videoUrl: '', armyLink: '', 
        townHall: 16, armyComp: [] as { unit: string; count: number }[]
    });

    // Auto-Generate Link Logic
    useEffect(() => {
        if (form.armyComp.length === 0) return;
        let troopsPart = "";
        let spellsPart = "";

        form.armyComp.forEach(u => {
            const id = UNIT_ID_MAP[u.unit];
            // Simple check: Spells are usually identifiable via category helper
            const isSpell = UNIT_CATEGORIES.elixirSpells.includes(u.unit) || UNIT_CATEGORIES.darkSpells.includes(u.unit);
            
            if (id) {
                if (isSpell) spellsPart += `-${id}x${u.count}`;
                else troopsPart += `-${id}x${u.count}`;
            }
        });

        const link = `https://link.clashofclans.com/en?action=OpenArmy&troops=${troopsPart.replace(/^-/, '')}&spells=${spellsPart.replace(/^-/, '')}`;
        if(form.armyLink !== link) setForm(prev => ({ ...prev, armyLink: link }));
    }, [form.armyComp]);

    const handleSubmit = async () => {
        if(!form.title || form.armyComp.length === 0) return alert("Title and Army required");
        setLoading(true);
        try {
            const res = await addStrategy({ ...form, townHalls: [form.townHall] });
            if(!res.success) alert(res.error);
            else {
                setMessage('✅ Strategy Added!');
                setForm({ ...form, title: '', description: '', armyComp: [], videoUrl: '', armyLink: '' });
                setTimeout(() => setMessage(''), 3000);
            }
        } catch(e: any) { alert('Error: ' + e.message); }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in">
            {message && <div className="bg-green-500/20 text-green-400 p-4 rounded-xl flex gap-2"><Check size={18}/> {message}</div>}

            <div className="bg-[#1f2937] p-6 rounded-2xl border border-white/5 space-y-5 shadow-xl">
                <h3 className="text-sm font-bold text-skin-muted uppercase border-b border-white/5 pb-2">Strategy Details</h3>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Strategy Name" className="admin-input"/>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Guide Description..." className="admin-input min-h-[80px]"/>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="admin-select">
                        <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Pro">Pro</option>
                    </select>
                    {/* ✅ Using the same THSelector here as requested */}
                    <THSelector value={form.townHall} onChange={(val) => setForm({...form, townHall: val})} />
                </div>

                <UnitSelector army={form.armyComp} setArmy={(army) => setForm({...form, armyComp: army})} filterTH={form.townHall} />

                <input value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} placeholder="YouTube URL" className="admin-input"/>
                <div className="relative">
                    <LinkIcon size={14} className="absolute left-3 top-4 text-skin-muted"/>
                    <input value={form.armyLink} readOnly placeholder="Link auto-generated..." className="admin-input pl-10 text-xs text-skin-muted cursor-not-allowed opacity-80"/>
                </div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="bg-skin-secondary text-black w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg">
                {loading ? <Loader2 size={20} className="animate-spin"/> : <><Plus size={20}/> Save Strategy</>}
            </button>
        </div>
    );
}
