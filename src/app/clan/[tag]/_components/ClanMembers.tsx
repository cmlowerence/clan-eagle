import Link from "next/link";
import { Users, Trophy, ShieldPlus, Inbox } from "lucide-react";
import { ClanMember } from "./types";

export default function ClanMembers({ members }: { members: ClanMember[] }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Desktop Header */}
      <div className="hidden md:flex px-4 py-2 text-[10px] uppercase font-bold text-skin-muted tracking-widest">
        <div className="w-12 text-center">Rank</div>
        <div className="flex-1">Member</div>
        <div className="w-48 text-center">Donations</div>
        <div className="w-24 text-right">Trophies</div>
      </div>

      {/* Member Rows */}
      {members.map((member, i) => {
        const rank = i + 1;
        const isLeader = member.role === 'leader';
        const isCoLeader = member.role === 'coLeader';
        const roleColor = isLeader ? 'text-red-400' : isCoLeader ? 'text-orange-400' : 'text-skin-muted';
        const roleName = member.role === 'admin' ? 'Elder' : member.role === 'coLeader' ? 'Co-Leader' : member.role;

        return (
          <Link
            key={member.tag}
            href={`/player/${encodeURIComponent(member.tag)}`}
            className="group relative bg-[#2a3a4b] border border-[#3a4a5b] hover:border-[#5c9dd1] rounded-lg 
                       h-auto py-2 md:py-0 md:h-[70px] 
                       flex flex-row items-center overflow-hidden transition-all hover:-translate-y-0.5 shadow-md"
          >
            {/* Rank & League Icon */}
            <div className="flex md:contents">
              <div className="h-full w-10 md:w-12 flex items-center justify-center shrink-0 border-r md:border-r border-[#3a4a5b]/50 md:border-[#3a4a5b] md:bg-[#202b38] md:group-hover:bg-[#253241] relative">
                <div className="text-sm md:text-lg font-clash text-white/80 z-10">{rank}</div>
                <div className="hidden md:block absolute top-0 left-0 w-1 h-full bg-skin-primary"></div>
              </div>
              <div className="w-10 md:w-16 h-full flex items-center justify-center shrink-0">
                {member.leagueTier?.iconUrls?.small ? (
                  <img src={member.leagueTier.iconUrls.small} alt="League" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-md" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Trophy size={14} className="text-skin-muted" /></div>
                )}
              </div>
            </div>

            {/* Name & Role */}
            <div className="flex-1 flex flex-col justify-center px-2 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm truncate">{member.name}</span>
                <span className="hidden md:inline text-[10px] text-skin-muted opacity-60">Lvl {member.expLevel}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Users size={10} className={roleColor} />
                <span className={`text-[10px] uppercase font-bold ${roleColor}`}>{roleName}</span>
              </div>
            </div>

            {/* Mobile: Simple Stats */}
            <div className="flex md:hidden flex-col items-end gap-1 px-3 min-w-[80px]">
              <div className="flex items-center gap-1 bg-[#131b24] px-2 py-0.5 rounded-full border border-white/5">
                <Trophy size={10} className="text-[#ffd700]" fill="#ffd700" />
                <span className="text-xs font-bold text-white">{member.trophies}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-skin-muted">
                <span className="flex items-center text-green-400 gap-0.5"><ShieldPlus size={10} /> {member.donations}</span>
                <span className="flex items-center text-orange-400 gap-0.5"><Inbox size={10} /> {member.donationsReceived}</span>
              </div>
            </div>

            {/* Desktop: Detailed Stats */}
            <div className="hidden md:flex w-48 flex-col justify-center gap-1 px-2 border-l border-white/5 h-4/5 my-auto">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#a8c5a8] flex items-center gap-1"><ShieldPlus size={10} /> Donated:</span>
                <span className="font-bold text-white">{member.donations}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#c5a8a8] flex items-center gap-1"><Inbox size={10} /> Received:</span>
                <span className="font-bold text-white">{member.donationsReceived}</span>
              </div>
            </div>

            {/* Desktop: Trophy Count */}
            <div className="hidden md:flex w-24 items-center justify-end pr-4 pl-2 bg-[#202b38]/50 h-full">
              <div className="bg-[#131b24] border border-[#3a4a5b] rounded-full px-3 py-1 flex items-center gap-1.5 min-w-[70px] justify-center">
                <Trophy size={12} className="text-[#ffd700]" fill="#ffd700" />
                <span className="font-bold text-white text-sm">{member.trophies}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
