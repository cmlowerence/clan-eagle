import { useState, useMemo } from "react";
import { UNIT_CATEGORIES, getHousingSpace, TH_CAPS } from "@/lib/unitHelpers";

export function useArmyPlanner() {
  const [army, setArmy] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'troops' | 'spells' | 'sieges'>('troops');
  const [thLevel, setThLevel] = useState<number>(17);

  // Get Caps based on TH level (fallback to max if undefined)
  const caps = TH_CAPS[thLevel] || TH_CAPS[17];

  // -- Helpers --
  const isTroop = (name: string) => UNIT_CATEGORIES.troops.includes(name);
  const isSpell = (name: string) => UNIT_CATEGORIES.spells.includes(name);
  const isSiege = (name: string) => UNIT_CATEGORIES.sieges.includes(name);
  const isSuper = (name: string) => UNIT_CATEGORIES.superTroops.includes(name);

  // -- Statistics Calculation --
  const stats = useMemo(() => {
    let troopSpace = 0;
    let spellSpace = 0;
    let siegeCount = 0;
    let superCount = 0;

    Object.entries(army).forEach(([name, count]) => {
      const space = getHousingSpace(name);
      if (isTroop(name)) troopSpace += (space * count);
      if (isSpell(name)) spellSpace += (space * count);
      if (isSiege(name)) siegeCount += count;
      if (isSuper(name)) superCount++;
    });

    return { troopSpace, spellSpace, siegeCount, superCount };
  }, [army]);

  // -- Update Logic --
  const updateUnit = (name: string, delta: number) => {
    setArmy(prev => {
      const currentCount = prev[name] || 0;
      const unitSpace = getHousingSpace(name);

      // Removing unit
      if (delta < 0) {
        const next = Math.max(0, currentCount + delta);
        const newArmy = { ...prev, [name]: next };
        if (next === 0) delete newArmy[name];
        return newArmy;
      }

      // Adding unit (Check Caps)
      if (isTroop(name) && (stats.troopSpace + unitSpace) > caps.troops) return prev;
      if (isSpell(name) && (stats.spellSpace + unitSpace) > caps.spells) return prev;
      if (isSiege(name) && (stats.siegeCount + 1) > caps.sieges) return prev;
      if (isSuper(name) && currentCount === 0 && stats.superCount >= 2) return prev;

      return { ...prev, [name]: currentCount + delta };
    });
  };

  const clearArmy = () => setArmy({});

  const generateLink = () => {
    const encodedArmy = Object.entries(army)
      .map(([name, count]) => `${count}x${name.replace(/ /g, '')}`)
      .join('-');
    return `clashofclans://action=openarmy&army=${encodedArmy}`;
  };

  return {
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
  };
}
