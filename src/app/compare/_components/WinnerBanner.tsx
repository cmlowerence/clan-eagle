import { Crown } from "lucide-react";
import { WinnerData } from "./types";

export default function WinnerBanner({ winner, isPlayer1 }: { winner: WinnerData; isPlayer1: boolean }) {
  if (!winner || !winner.tag) return null;

  const styleClass = isPlayer1
    ? 'bg-skin-primary/20 border-skin-primary text-skin-primary'
    : 'bg-skin-secondary/20 border-skin-secondary text-skin-secondary';

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-center gap-3 shadow-lg ${styleClass}`}>
      <Crown size={32} fill="currentColor" />
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-skin-muted">Statistical Winner</div>
        <div className="text-2xl font-clash">{winner.name}</div>
      </div>
    </div>
  );
}
