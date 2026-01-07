'use client';

import { Download, X, Shield, Sword, Trophy } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";

interface ShareModalProps {
  player: any;
  onClose: () => void;
}

export default function ShareProfileModal({ player, onClose }: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      // Wait for images to load logic could go here, but usually short timeout works
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true, // Crucial for loading cross-origin images (like game assets)
        backgroundColor: null, // Transparent bg
        scale: 2, // Retina quality
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `ClanEagle_${player.name}.png`;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter Heroes for the card
  const heroes = player.heroes.filter((h: any) => h.village === 'home').slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-skin-surface border border-skin-primary/20 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-skin-primary/10 flex justify-between items-center bg-skin-bg">
           <h3 className="font-clash text-lg text-skin-text">Share Profile</h3>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
        </div>

        {/* PREVIEW AREA */}
        <div className="p-6 flex justify-center bg-[#0a0a0a] overflow-auto max-h-[60vh]">
           
           {/* --- THE CAPTURE TARGET --- */}
           <div 
             ref={cardRef} 
             className="w-[320px] h-[480px] bg-gradient-to-br from-gray-900 to-black border-2 border-[#FACC15] rounded-xl relative overflow-hidden flex flex-col shadow-2xl shrink-0"
           >
              {/* Background FX */}
              <div className="absolute inset-0 bg-[url('/assets/map_bg_pattern.png')] opacity-10 bg-repeat"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15] blur-[80px] opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 blur-[80px] opacity-20"></div>

              {/* Card Content */}
              <div className="relative z-10 flex-1 p-5 flex flex-col items-center text-center">
                 
                 {/* Branding */}
                 <div className="text-[10px] font-black tracking-[0.3em] text-white/30 mb-4 uppercase">Clan Eagle Card</div>

                 {/* Town Hall */}
                 <div className="relative w-24 h-24 mb-2">
                    <img src={`/assets/icons/town_hall_${player.townHallLevel}.png`} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" alt="" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FACC15] text-black text-xs font-black px-3 py-0.5 rounded border border-white/20 whitespace-nowrap">TH {player.townHallLevel}</div>
                 </div>

                 {/* Name */}
                 <h2 className="text-3xl font-clash text-white mt-3 truncate w-full">{player.name}</h2>
                 <p className="text-[#FACC15] font-mono text-xs mb-6">{player.tag}</p>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10 flex flex-col items-center">
                       <div className="text-[10px] text-gray-400 uppercase font-bold">Trophies</div>
                       <div className="text-xl font-clash text-white flex items-center gap-1"><Trophy size={14} className="text-[#FACC15]"/> {player.trophies}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10 flex flex-col items-center">
                       <div className="text-[10px] text-gray-400 uppercase font-bold">War Stars</div>
                       <div className="text-xl font-clash text-white flex items-center gap-1"><Sword size={14} className="text-orange-500"/> {player.warStars}</div>
                    </div>
                 </div>

                 {/* Clan */}
                 {player.clan && (
                   <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 w-full justify-center mb-auto">
                      <img src={player.clan.badgeUrls.small} className="w-6 h-6 object-contain" alt=""/>
                      <div className="text-left">
                         <div className="text-[9px] text-gray-400 uppercase font-bold leading-none">Clan</div>
                         <div className="text-sm font-bold text-white leading-none">{player.clan.name}</div>
                      </div>
                   </div>
                 )}

                 {/* Heroes Footer */}
                 <div className="flex gap-2 justify-center mt-4">
                    {heroes.map((h: any) => (
                       <div key={h.name} className="w-8 h-8 rounded border border-white/20 overflow-hidden bg-black/40 relative">
                          <img src={`/assets/icons/${h.name.toLowerCase().replace(/ /g, '_').replace(/\./g, '')}.png`} className="w-full h-full object-cover" alt=""/>
                          <div className="absolute bottom-0 right-0 bg-black/60 text-[6px] text-white px-1">{h.level}</div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-skin-primary/10 bg-skin-bg flex justify-center">
           <button 
             onClick={handleDownload}
             disabled={isGenerating}
             className="flex items-center gap-2 bg-[#FACC15] text-black font-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
           >
             {isGenerating ? "Capturing..." : <><Download size={18}/> Download Card</>}
           </button>
        </div>
      </div>
    </div>
  );
}
