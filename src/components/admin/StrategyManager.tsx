'use client';

import { RefreshCw, Pencil, Trash2 } from "lucide-react";

export default function StrategyManager({ strategies, onEdit, onDelete, onRefresh, fetching }: any) {
    return (
        <div className="space-y-4 animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">All Strategies ({strategies.length})</h3>
                <button onClick={onRefresh} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white"><RefreshCw size={16} className={fetching ? "animate-spin" : ""}/></button>
            </div>

            <div className="space-y-3">
                {strategies.map((item: any) => (
                    <div key={item.id} className="bg-[#1f2937] p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between group hover:border-skin-secondary/40 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center border border-white/10">
                                <span className="font-bold text-skin-secondary text-lg">TH{item.town_halls ? item.town_halls[0] : '??'}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base">{item.title}</h4>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] bg-white/10 text-skin-muted px-2 py-0.5 rounded uppercase">{item.difficulty}</span>
                                    <span className="text-[10px] bg-white/10 text-skin-muted px-2 py-0.5 rounded">{item.army_comp?.length || 0} Units</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onEdit(item)} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-500/20 flex items-center gap-2"><Pencil size={14}/> Edit</button>
                            <button onClick={() => onDelete(item.id)} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 flex items-center gap-2"><Trash2 size={14}/> Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
