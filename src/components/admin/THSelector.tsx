'use client';

import { useState, useRef, useEffect } from 'react';
import { Castle, ChevronDown } from "lucide-react";

const TOWN_HALLS = Array.from({ length: 17 }, (_, i) => 18 - i);

interface THSelectorProps {
    value: number;
    onChange: (val: number) => void;
}

export default function THSelector({ value, onChange }: THSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-black/20 p-4 rounded-xl text-white border border-white/10 outline-none hover:bg-black/30 transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center bg-[#0c1015] rounded border border-white/10 overflow-hidden">
                         <Castle className="text-skin-muted opacity-30 w-5 h-5" />
                         <img src={`/assets/icons/town_hall_${value}.png`} alt={`TH${value}`} className="absolute inset-0 w-full h-full object-contain" onError={(e) => e.currentTarget.style.display='none'}/>
                    </div>
                    <span className="text-sm font-bold uppercase">Town Hall {value}</span>
                </div>
                <ChevronDown size={16} className={`text-skin-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-full max-h-60 overflow-y-auto bg-[#1f2937] border border-white/10 rounded-xl shadow-2xl z-50 custom-scrollbar animate-in fade-in zoom-in-95">
                    {TOWN_HALLS.map(th => (
                        <button key={th} onClick={() => { onChange(th); setIsOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0 ${value === th ? 'bg-skin-primary/10' : ''}`}>
                            <div className="relative w-8 h-8 flex items-center justify-center bg-[#0c1015] rounded border border-white/10 overflow-hidden">
                                 <img src={`/assets/icons/town_hall_${th}.png`} alt={`TH${th}`} className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display='none'}/>
                            </div>
                            <span className={`text-sm font-bold uppercase ${value === th ? 'text-white' : 'text-skin-muted'}`}>Town Hall {th}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
