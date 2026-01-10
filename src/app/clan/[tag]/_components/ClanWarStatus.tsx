import { Star, Percent } from "lucide-react";
import { WarData } from "@/components/WarMap"; // Assuming WarData is exported from here

export default function ClanWarStatus({ warData }: { warData: WarData }) {
  return (
    <div className="bg-[#1a232e] border border-skin-primary/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
      {/* Clan (Us) */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <img src={warData.clan.badgeUrls.small} className="w-12 h-12" alt="" />
        <div>
          <div className="text-lg font-clash text-white leading-none">{warData.clan.name}</div>
          <div className="flex items-center gap-3 mt-1 text-xs">
            <span className="flex items-center gap-1 text-[#ffd700] font-bold">
              <Star size={12} fill="#ffd700" /> {warData.clan.stars}
            </span>
            <span className="flex items-center gap-1 text-skin-muted">
              <Percent size={12} /> {warData.clan.destructionPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* VS Badge */}
      <div className="bg-red-500/10 px-3 py-1 rounded border border-red-500/20 text-red-400 font-clash text-xl">VS</div>

      {/* Opponent */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-row-reverse md:flex-row text-right md:text-left">
        <img src={warData.opponent.badgeUrls.small} className="w-12 h-12" alt="" />
        <div>
          <div className="text-lg font-clash text-white leading-none">{warData.opponent.name}</div>
          <div className="flex items-center gap-3 mt-1 text-xs justify-end md:justify-start">
            <span className="flex items-center gap-1 text-[#ffd700] font-bold">
              <Star size={12} fill="#ffd700" /> {warData.opponent.stars}
            </span>
            <span className="flex items-center gap-1 text-skin-muted">
              <Percent size={12} /> {warData.opponent.destructionPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
