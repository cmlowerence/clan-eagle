import Link from "next/link";
import { Sword, LayoutGrid, Crown, Globe } from "lucide-react";

export default function ToolsGrid() {
  const tools = [
    { href: "/army", label: "Army Planner", icon: Sword, color: "text-skin-primary", bg: "bg-skin-primary/20", hover: "hover:bg-skin-primary/10 hover:border-skin-primary/30" },
    { href: "/layouts", label: "Base Layouts", icon: LayoutGrid, color: "text-blue-400", bg: "bg-blue-500/20", hover: "hover:bg-blue-500/10 hover:border-blue-500/30" },
    { href: "/strategies", label: "Pro Guides", icon: Crown, color: "text-red-400", bg: "bg-red-500/20", hover: "hover:bg-red-500/10 hover:border-red-500/30" },
    { href: "/leaderboard", label: "Rankings", icon: Globe, color: "text-yellow-400", bg: "bg-yellow-500/20", hover: "hover:bg-yellow-500/10 hover:border-yellow-500/30" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
      {tools.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          className={`bg-skin-surface border border-skin-primary/10 p-4 rounded-xl flex flex-col items-center gap-2 transition-all group ${tool.hover}`}
        >
          <div className={`w-10 h-10 ${tool.bg} ${tool.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <tool.icon size={20} />
          </div>
          <span className="text-xs font-bold uppercase text-skin-text">{tool.label}</span>
        </Link>
      ))}
    </div>
  );
}
