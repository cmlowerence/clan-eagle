'use client';

import { RefreshCw, Pencil, Trash2 } from "lucide-react";

export default function LayoutManager({ layouts, onEdit, onDelete, onRefresh, fetching }: any) {
    return (
        <div className="space-y-4 animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">All Layouts ({layouts.length})</h3>
                <button onClick={onRefresh} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white"><RefreshCw size={16} className={fetching ? "animate-spin" : ""}/></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {layouts.map((item: any) => (
                    <div key={item.id} className="bg-[#1f2937] rounded-xl border border-white/5 overflow-hidden group relative hover:border-skin-primary/50 transition-colors">
                        <div className="aspect-video relative bg-black">
                            <img src={item.image_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt=""/>
                            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-bold">TH {item.town_hall}</div>
                        </div>
                        <div className="p-4 flex justify-between items-start">
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                                <span className="text-xs text-skin-muted bg-white/5 px-2 py-0.5 rounded">{item.type}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => onEdit(item)} className="p-2 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20"><Pencil size={14}/></button>
                                <button onClick={() => onDelete(item.id)} className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
