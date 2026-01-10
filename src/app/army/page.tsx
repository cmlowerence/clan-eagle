'use client';

import { useArmyPlanner } from "./useArmyPlanner";
import ArmyHeader from "./_components/ArmyHeader";
import ArmyTabs from "./_components/ArmyTabs";
import ArmyStrip from "./_components/ArmyStrip";
import UnitGrid from "./_components/UnitGrid";
import ArmyFooter from "./_components/ArmyFooter";

export default function ArmyPlannerPage() {
  const {
    army,
    activeTab,
    setActiveTab,
    thLevel,
    setThLevel,
    caps,
    stats,
    updateUnit,
    clearArmy,
    generateLink,
    isSuper
  } = useArmyPlanner();

  const hasUnits = Object.keys(army).length > 0;

  return (
    // FIX: Removed fixed/min-h-screen constraints that break scrolling.
    // Added bottom padding to account for the fixed Footer.
    <div className="relative w-full pb-32 animate-in fade-in duration-500">
      
      <ArmyHeader 
        thLevel={thLevel} 
        setThLevel={setThLevel} 
        clearArmy={clearArmy} 
        hasUnits={hasUnits}
        superCount={stats.superCount} 
      />

      <ArmyTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <ArmyStrip 
        army={army} 
        updateUnit={updateUnit} 
      />

      <UnitGrid 
        activeTab={activeTab} 
        army={army} 
        thLevel={thLevel} 
        stats={stats} 
        caps={caps} 
        updateUnit={updateUnit} 
        isSuper={isSuper} 
      />

      <ArmyFooter 
        stats={stats} 
        caps={caps} 
        generateLink={generateLink} 
        hasUnits={hasUnits} 
      />
      
    </div>
  );
}
