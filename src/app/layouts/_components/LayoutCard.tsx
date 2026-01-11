import { ShieldCheck, Castle, Sparkles, Copy } from "lucide-react";
import { BaseLayout } from "./types";

export default function LayoutCard({ layout }: { layout: BaseLayout }) {
  // Helper for badge styling
  const getTypeStyle = (type: string) => {
    switch(type) {
        case 'War': return 'bg-red-500/20 text-red-200 border-red-500/30';
        case 'Farm': return 'bg-green-500/20 text-green-200 border-green-500/30';
        default: return 'bg-gray-500/20 text-gray-200 border-white/10';
    }
  };

  return (
    <div className="group relative bg-[#151c24] rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-2">
      
      {/* Hover Glow Effects */}
      <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="absolute -inset-[1px] bg-skin-primary/50 blur-md rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative bg-[#151c24] rounded-2xl overflow-hidden flex flex-col h-full border border-white/5 group-hover:border-skin-primary/30">
          
          {/* Image Section */}
          <div className="aspect-[16/9] relative bg-[#0c1219] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#151c24] via-transparent to-transparent z-10 opacity-80"></div>
              
              <img 
                  src={layout.image_url} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110" 
                  alt={layout.title} 
                  onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }}
              />
              
              {/* Fallback View */}
              <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-skin-muted bg-[#0c1219] gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                      <ShieldCheck size={28} className="text-skin-muted opacity-30"/>
                  </div>
                  <span className="text-[10px] font-mono opacity-30 uppercase tracking-widest">Preview Missing</span>
              </div>

              {/* Badges */}
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 shadow-lg flex items-center gap-1">
                      <Castle size={10} className="text-skin-primary"/> TH {layout.town_hall}
                  </span>
              </div>
              <div className="absolute bottom-3 left-3 z-20">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg backdrop-blur-md border ${getTypeStyle(layout.type)}`}>
                      {layout.type}
                  </span>
              </div>
          </div>
          
          {/* Content Body */}
          <div className="p-5 flex flex-col flex-1 gap-4 relative z-20">
              <div className="flex-1 space-y-2">
                  <h3 className="font-clash text-white text-xl leading-tight truncate group-hover:text-skin-primary transition-colors">
                      {layout.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-skin-muted/70">
                      <Sparkles size={12}/> <span>Verified Strategy</span>
                  </div>
              </div>
              
              {/* Link Button */}
              <div className="mt-auto pt-2">
                  <a 
                      href={layout.copy_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/btn relative flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#2a3a4b] to-[#1f2937] hover:from-skin-primary hover:to-skin-secondary text-white hover:text-black border border-white/10 hover:border-transparent font-sans text-sm py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_-5px_var(--color-primary)] font-bold uppercase tracking-wide overflow-hidden"
                  >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                      <span className="relative z-10 flex items-center gap-2">
                          <Copy size={16} /> Copy Base Link
                      </span>
                  </a>
              </div>
          </div>
      </div>
    </div>
  );
}
