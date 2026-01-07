import { fetchClashAPI } from "@/lib/api";
import Link from "next/link";
import { Users, Swords, Trophy, Map } from "lucide-react";

// --- Types for Clan Data ---
interface ClanMember {
  tag: string;
  name: string;
  role: string;
  expLevel: number;
  league: {
    name: string;
    iconUrls: { small: string };
  };
  trophies: number;
  donations: number;
}

interface ClanData {
  tag: string;
  name: string;
  description: string;
  badgeUrls: { large: string };
  clanLevel: number;
  members: number;
  memberList: ClanMember[];
}

interface WarData {
  state: string;
  teamSize: number;
  clan: {
    stars: number;
    destructionPercentage: number;
    name: string;
  };
  opponent: {
    stars: number;
    destructionPercentage: number;
    name: string;
  };
}

// --- Component ---
export default async function ClanPage({ params }: { params: { tag: string } }) {
  // Decode the tag from the URL
  const tag = decodeURIComponent(params.tag);
  
  // Parallel Data Fetching
  const clanDataPromise = fetchClashAPI<ClanData>(`/clans/${tag}`);
  const warDataPromise = fetchClashAPI<WarData>(`/clans/${tag}/currentwar`);

  const [clan, war] = await Promise.all([clanDataPromise, warDataPromise]);

  if (!clan) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-skin-primary font-bold">Clan Not Found</h2>
        <p className="text-skin-muted">Could not retrieve data for {tag}</p>
        <Link href="/" className="underline text-skin-secondary mt-4 block">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header Section */}
      <div className="bg-skin-surface border border-skin-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg shadow-skin-primary/5">
        <img src={clan.badgeUrls.large} alt={clan.name} className="w-24 h-24 drop-shadow-md" />
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl font-black text-skin-text tracking-tight">{clan.name}</h1>
          <p className="text-skin-secondary font-mono text-sm">{clan.tag}</p>
          <p className="text-skin-muted mt-2 max-w-xl">{clan.description}</p>
        </div>
        <div className="text-center p-4 bg-skin-bg rounded-lg border border-skin-primary/10">
          <p className="text-sm text-skin-muted uppercase font-bold">Clan Level</p>
          <p className="text-3xl font-bold text-skin-primary">{clan.clanLevel}</p>
        </div>
      </div>

      {/* 2. Grid Layout for Tabs Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Members List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-skin-secondary" />
            <h3 className="text-xl font-bold text-skin-text">Roster ({clan.members}/50)</h3>
          </div>
          
          <div className="grid gap-3">
            {clan.memberList.map((member) => (
              <Link 
                key={member.tag} 
                href={`/player/${encodeURIComponent(member.tag)}`}
                className="group flex items-center justify-between p-4 bg-skin-surface border border-skin-surface hover:border-skin-primary rounded-lg transition-all hover:bg-skin-bg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 relative">
                     {/* Placeholder league icon if needed, or use text */}
                     {member.league?.iconUrls?.small && <img src={member.league.iconUrls.small} alt="League" />}
                  </div>
                  <div>
                    <p className="font-bold text-skin-text group-hover:text-skin-secondary">{member.name}</p>
                    <p className="text-xs text-skin-muted">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-skin-primary">{member.trophies} 🏆</p>
                  <p className="text-xs text-skin-muted">Donations: {member.donations}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Col: War Status & Overview */}
        <div className="space-y-8">
            
            {/* War Card */}
            <div className="bg-skin-surface border border-skin-secondary/20 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4 border-b border-skin-muted/20 pb-2">
                <Swords className="text-skin-primary" />
                <h3 className="text-lg font-bold">War Status</h3>
              </div>
              
              {war && war.state !== 'notInWar' ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-skin-primary">{war.clan.name}</span>
                    <span className="text-red-500">{war.opponent.name}</span>
                  </div>
                  
                  {/* Score Board */}
                  <div className="flex justify-between items-center bg-skin-bg p-3 rounded">
                    <div className="text-center">
                      <p className="text-2xl font-black">{war.clan.stars}</p>
                      <p className="text-xs text-skin-muted">{war.clan.destructionPercentage.toFixed(1)}%</p>
                    </div>
                    <div className="text-xs text-skin-muted font-mono">VS</div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-red-400">{war.opponent.stars}</p>
                      <p className="text-xs text-skin-muted">{war.opponent.destructionPercentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      war.state === 'inWar' ? 'bg-red-900/50 text-red-200' : 'bg-yellow-900/50 text-yellow-200'
                    }`}>
                      {war.state.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-skin-muted">
                  <p>Clan is not currently in war.</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-skin-surface border border-skin-primary/20 p-6 rounded-xl">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <Trophy className="text-skin-secondary" size={20} /> Requirements
               </h3>
               <div className="space-y-2 text-sm text-skin-muted">
                 <p>Type: <span className="text-skin-text font-semibold">Invite Only</span></p>
                 <p>Required Trophies: <span className="text-skin-text font-semibold">2000</span></p>
                 <p>War Frequency: <span className="text-skin-text font-semibold">Always</span></p>
               </div>
            </div>

        </div>
      </div>
    </div>
  );
}
