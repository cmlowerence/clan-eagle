import { TabType } from "./types";

interface ClanTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  memberCount: number;
}

export default function ClanTabs({ activeTab, setActiveTab, memberCount }: ClanTabsProps) {
  const tabs: TabType[] = ['overview', 'members', 'war', 'raids', 'cwl'];

  const getLabel = (tab: TabType) => {
    switch (tab) {
      case 'members': return `Members (${memberCount})`;
      case 'war': return 'Current War';
      case 'raids': return 'Raid Weekend';
      default: return tab;
    }
  };

  return (
    <div className="flex gap-2 md:gap-4 border-b border-skin-primary/10 pb-1 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 px-4 font-clash text-sm tracking-wide transition-all uppercase whitespace-nowrap relative
             ${activeTab === tab ? 'text-white' : 'text-skin-muted hover:text-skin-text'}
           `}
        >
          {getLabel(tab)}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-skin-primary shadow-[0_0_10px_var(--color-primary)]"></div>
          )}
        </button>
      ))}
    </div>
  );
}
