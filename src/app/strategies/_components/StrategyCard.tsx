import VideoPlayer from "./VideoPlayer";
import ArmyPanel from "./ArmyPanel";
import { Strategy } from "./types";

interface StrategyCardProps {
  strategy: Strategy;
  isPlaying: boolean;
  onPlay: () => void;
}

export default function StrategyCard({ strategy, isPlaying, onPlay }: StrategyCardProps) {
  // Helpers for styling tags based on difficulty
  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'Pro': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'Medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      default: return 'text-green-400 border-green-500/30 bg-green-500/10';
    }
  };

  return (
    <div className="bg-[#151c24] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 hover:border-skin-primary/30 transition-all shadow-xl hover:shadow-2xl group relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-skin-primary/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* LEFT: Content & Video */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {/* TH Badges */}
              {strategy.town_halls.map(th => (
                <span key={th} className="text-[10px] font-bold text-black bg-skin-primary px-2 py-0.5 rounded shadow-sm shadow-skin-primary/20">
                  TH{th}
                </span>
              ))}
              {/* Difficulty Badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getDifficultyStyles(strategy.difficulty)}`}>
                {strategy.difficulty}
              </span>
            </div>
            <h3 className="text-3xl font-clash text-white leading-tight group-hover:text-skin-primary transition-colors drop-shadow-md">
              {strategy.title}
            </h3>
          </div>
        </div>

        <div className="relative pl-6 border-l-2 border-white/10">
          <p className="text-sm text-skin-muted leading-relaxed">
            {strategy.description}
          </p>
        </div>

        {/* Video Component */}
        <VideoPlayer 
          url={strategy.video_url} 
          isPlaying={isPlaying} 
          onPlay={onPlay} 
        />
      </div>

      {/* RIGHT: Army Panel Component */}
      <ArmyPanel 
        composition={strategy.army_comp} 
        trainLink={strategy.army_link} 
      />
    </div>
  );
}
