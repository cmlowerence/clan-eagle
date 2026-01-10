import { Sword, Zap, Home } from "lucide-react";

interface Props {
  activeTab: 'troops' | 'spells' | 'sieges';
  setActiveTab: (tab: 'troops' | 'spells' | 'sieges') => void;
}

export default function ArmyTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 sticky top-[64px] z-40 bg-skin-bg/95 backdrop-blur py-2 no-scrollbar border-b border-skin-primary/5">
      <button onClick={() => setActiveTab('troops')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs whitespace-nowrap transition-all ${activeTab === 'troops' ? 'bg-skin-primary text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}>
        <Sword size={14} /> Troops
      </button>
      <button onClick={() => setActiveTab('spells')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs whitespace-nowrap transition-all ${activeTab === 'spells' ? 'bg-skin-secondary text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}>
        <Zap size={14} /> Spells
      </button>
      <button onClick={() => setActiveTab('sieges')} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold uppercase text-xs whitespace-nowrap transition-all ${activeTab === 'sieges' ? 'bg-orange-500 text-black' : 'bg-skin-surface text-skin-muted border border-skin-primary/10'}`}>
        <Home size={14} /> Machines
      </button>
    </div>
  );
}
