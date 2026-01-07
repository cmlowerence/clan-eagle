import { fetchClashAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Shield, Sword, Star, Zap } from "lucide-react";

// --- Types for Player Data ---
interface IconUrls {
  medium: string;
}

interface Troop {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase';
}

interface Hero {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase';
}

interface PlayerData {
  tag: string;
  name: string;
  townHallLevel: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  clan?: {
    tag: string;
    name: string;
    badgeUrls: { small: string };
  };
  league?: {
    name: string;
    iconUrls: { small: string };
  };
  troops: Troop[];
  heroes: Hero[];
}

export default async function PlayerPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const player = await fetchClashAPI<PlayerData>(`/players/${tag}`);

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-2xl font-bold text-skin-primary">Player Not Found</h2>
        <Link href="/" className="text-skin-secondary underline">Return Home</Link>
      </div>
    );
  }

  // Filter for Home Village only to keep UI clean, or separate them
  const homeHeroes = player.heroes.filter(h => h.village === 'home');
  const homeTroops = player.troops.filter(t => t.village === 'home' && t.name !== 'Super Barbarian'); // Basic filter example

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* 1. Navigation & Header */}
      <div className="flex flex-col gap-6">
        {player.clan ? (
          <Link 
            href={`/clan/${encodeURIComponent(player.clan.tag)}`}
            className="flex items-center gap-2 text-skin-muted hover:text-skin-primary transition-colors w-fit"
          >
            <ArrowLeft size={20} /> Back to {player.clan.name}
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-2 text-skin-muted hover:text-skin-primary transition-colors w-fit">
            <ArrowLeft size={20} /> Back Home
          </Link>
        )}

        <div className="bg-skin-surface border-l-4 border-skin-secondary p-8 rounded-r-xl shadow-lg relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 opacity-10 text-skin-primary">
            <Shield size={200} />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-5xl font-black text-skin-text uppercase">{player.name}</h1>
                <p className="text-skin-muted font-mono">{player.tag}</p>
              </div>
              
              <div className="flex gap-4 text-center">
                <div className="bg-skin-bg p-3 rounded-lg border border-skin-primary/30 min-w-[100px]">
                  <p className="text-xs text-skin-muted uppercase font-bold">Town Hall</p>
                  <p className="text-3xl font-bold text-skin-secondary">{player.townHallLevel}</p>
                </div>
                <div className="bg-skin-bg p-3 rounded-lg border border-skin-primary/30 min-w-[100px]">
                  <p className="text-xs text-skin-muted uppercase font-bold">War Stars</p>
                  <p className="text-3xl font-bold text-skin-primary">{player.warStars}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Heroes Section */}
      {homeHeroes.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-skin-text mb-4 flex items-center gap-2">
            <Sword className="text-skin-secondary" /> Heroes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {homeHeroes.map((hero) => (
              <div key={hero.name} className="bg-skin-surface p-4 rounded-lg border border-skin-surface hover:border-skin-primary transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-skin-text">{hero.name}</h3>
                  {hero.level === hero.maxLevel && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                </div>
                <div className="w-full bg-skin-bg h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-skin-primary" 
                    style={{ width: `${(hero.level / hero.maxLevel) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-skin-muted">
                  <span>Lvl {hero.level}</span>
                  <span>Max {hero.maxLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Troops Grid */}
      <section>
        <h2 className="text-2xl font-bold text-skin-text mb-4 flex items-center gap-2">
          <Zap className="text-skin-secondary" /> Troop Levels
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {homeTroops.map((troop) => (
            <div 
              key={troop.name} 
              className={`p-3 rounded border text-center transition-all ${
                troop.level === troop.maxLevel 
                  ? 'bg-skin-primary/10 border-skin-secondary/50' 
                  : 'bg-skin-bg border-skin-primary/10'
              }`}
            >
              <p className="text-sm font-bold text-skin-text truncate" title={troop.name}>{troop.name}</p>
              <p className="text-xs text-skin-muted mt-1">Lvl <span className="text-skin-secondary">{troop.level}</span></p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
