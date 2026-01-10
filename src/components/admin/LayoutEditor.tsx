'use client';

import { useState } from 'react';
import { Plus, Eye, Loader2, Check } from "lucide-react";
import THSelector from './THSelector';
import { addLayout } from "@/lib/actions";

export default function LayoutEditor() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [form, setForm] = useState({ title: '', townHall: 16, type: 'War', imageUrl: '', copyLink: '' });

    const handleSubmit = async () => {
        if(!form.title || !form.copyLink) return alert("Title and Link required");
        setLoading(true);
        try {
            const res = await addLayout(form);
            if(!res.success) {
                alert(res.error);
            } else {
                setMessage('✅ Layout Added!');
                setForm({ ...form, title: '', imageUrl: '', copyLink: '' });
                setTimeout(() => setMessage(''), 3000);
            }
        } catch(e: any) { alert('Error: ' + e.message); }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in">
            {message && <div className="bg-green-500/20 text-green-400 p-4 rounded-xl flex gap-2"><Check size={18}/> {message}</div>}
            
            <div className="bg-[#1f2937] p-6 rounded-2xl border border-white/5 space-y-5 shadow-xl">
                <h3 className="text-sm font-bold text-skin-muted uppercase border-b border-white/5 pb-2">Layout Details</h3>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Base Title" className="admin-input"/>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <THSelector value={form.townHall} onChange={(val) => setForm({...form, townHall: val})} />
                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="admin-select">
                        <option value="War">War</option>
                        <option value="Farm">Farm</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Troll">Troll</option>
                    </select>
                </div>

                <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="Image URL" className="admin-input"/>
                <input value={form.copyLink} onChange={e => setForm({...form, copyLink: e.target.value})} placeholder="Clash Copy Link" className="admin-input"/>
            </div>

            {/* PREVIEW */}
            <div className="group bg-[#1a232e] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl max-w-sm mx-auto w-full">
                <div className="aspect-[16/9] relative bg-[#0c1219] overflow-hidden border-b border-white/5">
                    {form.imageUrl ? <img src={form.imageUrl} className="w-full h-full object-cover" alt="Preview"/> : <div className="absolute inset-0 flex items-center justify-center text-skin-muted text-xs">No Image Preview</div>}
                    <div className="absolute top-2 right-2"><span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">TH {form.townHall}</span></div>
                </div>
                <div className="p-4"><h3 className="font-bold text-white text-lg">{form.title || "Base Title Preview"}</h3></div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="admin-btn-primary mt-4">
                {loading ? <Loader2 size={20} className="animate-spin"/> : <><Plus size={20}/> Save Layout</>}
            </button>
        </div>
    );
}
