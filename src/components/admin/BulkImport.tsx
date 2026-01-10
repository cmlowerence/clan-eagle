'use client';

import { useState } from 'react';
import { FileJson, Loader2, Plus, Check } from "lucide-react";
import { addLayout, addStrategy } from "@/lib/actions";

export default function BulkImport({ type }: { type: 'layout' | 'strategy' }) {
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleImport = async () => {
        if (!jsonInput) return;
        setLoading(true);
        try {
            const parsed = JSON.parse(jsonInput);
            const dataArray = Array.isArray(parsed) ? parsed : [parsed];
            let successCount = 0;

            for (const item of dataArray) {
                let res;
                if (type === 'layout') {
                    res = await addLayout({
                        title: item.title, townHall: item.townHall, type: item.type,
                        imageUrl: item.imageUrl, copyLink: item.copyLink
                    });
                } else {
                    res = await addStrategy({
                        title: item.title, description: item.description,
                        townHalls: [item.townHall], difficulty: item.difficulty,
                        videoUrl: item.videoUrl, armyComp: item.armyComp, armyLink: item.armyLink
                    });
                }
                if (res.success) successCount++;
            }
            setMessage(`✅ Imported ${successCount} items.`);
        } catch (e: any) { alert("Invalid JSON: " + e.message); }
        setLoading(false);
    };

    return (
        <div className="bg-[#1f2937] p-6 rounded-2xl border border-white/5 space-y-5 shadow-xl animate-in fade-in">
            {message && <div className="text-green-400 flex gap-2"><Check size={18}/> {message}</div>}
            <textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`[ { "title": "Example", "townHall": 16 ... } ]`}
                className="w-full h-96 bg-[#0c1015] p-4 rounded-xl text-xs font-mono text-green-400 border border-white/10 resize-y"
            />
            <button onClick={handleImport} disabled={loading} className="admin-btn-primary">
                {loading ? <Loader2 size={20} className="animate-spin"/> : <><Plus size={20}/> Import Data</>}
            </button>
        </div>
    );
}
