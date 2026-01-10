'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2, RefreshCw, X } from "lucide-react";
import THSelector from './THSelector';
import { addLayout, updateLayout } from "@/lib/actions";

export default function LayoutForm({ initialData, onCancel, onSuccess }: any) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: '', townHall: 16, type: 'War', imageUrl: '', copyLink: '' });

    // Load initial data if editing
    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title,
                townHall: initialData.town_hall,
                type: initialData.type,
                imageUrl: initialData.image_url,
                copyLink: initialData.copy_link
            });
        }
    }, [initialData]);

    const handleSubmit = async () => {
        if(!form.title || !form.copyLink) return alert("Title and Link required");
        setLoading(true);
        try {
            const res = initialData 
                ? await updateLayout(initialData.id, form) 
                : await addLayout(form);

            if(!res.success) {
                alert(res.error);
            } else {
                setForm({ title: '', townHall: 16, type: 'War', imageUrl: '', copyLink: '' });
                onSuccess(initialData ? 'Updated' : 'Created');
            }
        } catch(e: any) { alert('Error: ' + e.message); }
        setLoading(false);
    };

    return (
        <div className={`p-6 rounded-2xl border space-y-5 shadow-xl animate-in slide-in-from-left-4 ${initialData ? 'bg-skin-primary/5 border-skin-primary/30' : 'bg-[#1f2937] border-white/5'}`}>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-sm font-bold text-skin-muted uppercase">
                    {initialData ? `Editing Layout #${initialData.id}` : "Add New Layout"}
                </h3>
                {initialData && <button onClick={onCancel} className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300"><X size={12}/> Cancel Edit</button>}
            </div>

            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Base Title" className="admin-input"/>
            
            <div className="flex flex-col md:flex-row gap-4">
                <THSelector value={form.townHall} onChange={(val) => setForm({...form, townHall: val})} />
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="admin-select">
                    <option value="War">War</option><option value="Farm">Farm</option><option value="Hybrid">Hybrid</option><option value="Troll">Troll</option>
                </select>
            </div>

            <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="Image URL" className="admin-input"/>
            <input value={form.copyLink} onChange={e => setForm({...form, copyLink: e.target.value})} placeholder="Clash Copy Link" className="admin-input"/>

            <div className="group bg-[#1a232e] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl max-w-sm mx-auto w-full">
                <div className="aspect-[16/9] relative bg-[#0c1219] overflow-hidden border-b border-white/5">
                    {form.imageUrl ? <img src={form.imageUrl} className="w-full h-full object-cover" alt="Preview"/> : <div className="absolute inset-0 flex items-center justify-center text-skin-muted text-xs">No Image Preview</div>}
                    <div className="absolute top-2 right-2"><span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">TH {form.townHall}</span></div>
                </div>
                <div className="p-4"><h3 className="font-bold text-white text-lg">{form.title || "Base Title Preview"}</h3></div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg ${initialData ? 'bg-skin-primary text-black' : 'bg-[#2a3a4b] text-white'}`}>
                {loading ? <Loader2 size={20} className="animate-spin"/> : initialData ? <><RefreshCw size={20}/> Update Layout</> : <><Plus size={20}/> Save Layout</>}
            </button>
        </div>
    );
}
