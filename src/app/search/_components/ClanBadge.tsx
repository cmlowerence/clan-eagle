import { useState } from "react";
import { Shield } from "lucide-react";

interface ClanBadgeProps {
  url?: string;
  level: number;
}

export default function ClanBadge({ url, level }: ClanBadgeProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-14 h-14 relative shrink-0">
      {/* Real Image */}
      {!imgError && url && (
        <img 
          src={url} 
          className={`w-full h-full object-contain drop-shadow-md transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} 
          alt="Badge"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Placeholder (Visible loading or on error) */}
      {(!imgLoaded || imgError) && (
         <div className="absolute inset-0 flex items-center justify-center bg-[#0c1015] rounded-full border border-white/5 animate-pulse">
            <Shield size={24} className="text-skin-muted opacity-30" />
         </div>
      )}

      {/* Level Tag */}
      <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded border border-white/10 font-bold shadow-sm z-10">
        Lvl {level}
      </div>
    </div>
  );
}
