'use client';

import { useState, useEffect } from 'react';
import { Database, Sword, Check } from "lucide-react";
import { getStrategies, deleteItem } from "@/lib/actions";
import StrategyForm from './StrategyForm';
import StrategyManager from './StrategyManager';

export default function StrategyEditor() {
    const [subTab, setSubTab] = useState<'create' | 'manage'>('create');
    const [fetching, setFetching] = useState(false);
    const [strategies, setStrategies] = useState<any[]>([]);
    const [editItem, setEditItem] = useState<any>(null);
    const [message, setMessage] = useState('');

    useEffect(() => { if(subTab === 'manage') fetchData(); }, [subTab]);

    const fetchData = async () => {
        setFetching(true);
        const data = await getStrategies();
        setStrategies(data);
        setFetching(false);
    };

    const handleEdit = (item: any) => {
        setEditItem(item);
        setSubTab('create');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if(!confirm("Are you sure?")) return;
        const res = await deleteItem('strategies', id);
        if(res.success) fetchData();
    };

    const handleSuccess = (msg: string) => {
        setMessage(`✅ Strategy ${msg}!`);
        setEditItem(null);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in">
             {/* SUB-TABS */}
             <div className="flex p-1 bg-black/20 rounded-xl border border-white/5 mx-auto w-full max-w-md">
                <button onClick={() => { setSubTab('create'); setEditItem(null); }} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${subTab === 'create' ? 'bg-skin-secondary text-black shadow' : 'text-skin-muted hover:text-white'}`}>
                    <Sword size={16}/> {editItem ? 'Editor Mode' : 'Create New'}
                </button>
                <button onClick={() => setSubTab('manage')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${subTab === 'manage' ? 'bg-skin-secondary text-black shadow' : 'text-skin-muted hover:text-white'}`}>
                    <Database size={16}/> Database
                </button>
            </div>

            {message && <div className="bg-green-500/20 text-green-400 p-4 rounded-xl flex gap-2 justify-center"><Check size={18}/> {message}</div>}

            {subTab === 'create' ? (
                <StrategyForm initialData={editItem} onCancel={() => { setEditItem(null); }} onSuccess={handleSuccess} />
            ) : (
                <StrategyManager strategies={strategies} onEdit={handleEdit} onDelete={handleDelete} onRefresh={fetchData} fetching={fetching} />
            )}
        </div>
    );
}
