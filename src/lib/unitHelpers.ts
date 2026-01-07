import { Sword, Zap, Skull, Shield, Star, Ghost, Flame, Crosshair, Hexagon } from "lucide-react";

// --- 1. Categorization Lists ---
export const UNIT_CATEGORIES = {
  elixirTroops: [
    "Barbarian", "Archer", "Giant", "Goblin", "Wall Breaker", "Balloon", "Wizard", 
    "Healer", "Dragon", "P.E.K.K.A", "Baby Dragon", "Miner", "Electro Dragon", 
    "Yeti", "Dragon Rider", "Electro Titan", "Root Rider"
  ],
  darkTroops: [
    "Minion", "Hog Rider", "Valkyrie", "Golem", "Witch", "Lava Hound", 
    "Bowler", "Ice Golem", "Headhunter", "Apprentice Warden", "Druid"
  ],
  superTroops: [
    "Super Barbarian", "Super Archer", "Super Wall Breaker", "Super Giant", 
    "Sneaky Goblin", "Super Miner", "Rocket Balloon", "Inferno Dragon", 
    "Super Valkyrie", "Super Witch", "Ice Hound", "Super Bowler", 
    "Super Dragon", "Super Wizard", "Super Minion", "Super Hog Rider", "Super Yeti"
  ],
  pets: [
    "L.A.S.S.I", "Mighty Yak", "Electro Owl", "Unicorn", "Diggy", "Frosty", 
    "Phoenix", "Poison Lizard", "Spirit Fox", "Angry Jelly"
  ],
  sieges: [
    "Wall Wrecker", "Battle Blimp", "Stone Slammer", "Siege Barracks", 
    "Log Launcher", "Flame Flinger", "Battle Drill"
  ],
  darkSpells: [
    "Poison Spell", "Earthquake Spell", "Haste Spell", "Skeleton Spell", 
    "Bat Spell", "Overgrowth Spell"
  ]
};

// --- 2. Icon Handling ---
// Returns a URL path. You should place images in /public/assets/icons/ later.
// For now, the UI will fall back to Lucide icons if <img> fails, 
// or you can implement a generic icon based on the category.

export const getUnitIconPath = (name: string) => {
  // Converts "Electro Dragon" -> "electro_dragon.png"
  const slug = name.toLowerCase().replace(/[\s\.]/g, "_"); 
  return `/assets/icons/${slug}.png`;
};

// Helper to determine category
export const getUnitCategory = (name: string, isSpell = false) => {
  if (isSpell) {
    return UNIT_CATEGORIES.darkSpells.includes(name) ? 'Dark Spell' : 'Elixir Spell';
  }
  if (UNIT_CATEGORIES.elixirTroops.includes(name)) return 'Elixir Troop';
  if (UNIT_CATEGORIES.darkTroops.includes(name)) return 'Dark Troop';
  if (UNIT_CATEGORIES.superTroops.includes(name)) return 'Super Troop';
  if (UNIT_CATEGORIES.pets.includes(name)) return 'Pet';
  if (UNIT_CATEGORIES.sieges.includes(name)) return 'Siege Machine';
  return 'Builder/Other';
};

// Helper for Lucide Placeholders based on category
export const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Elixir Troop': return Sword;
    case 'Dark Troop': return Skull;
    case 'Super Troop': return Zap;
    case 'Pet': return Ghost; // Ghost icon for pets/spirits
    case 'Siege Machine': return Hexagon;
    case 'Elixir Spell': return Flame;
    case 'Dark Spell': return Star;
    case 'Hero': return Shield;
    default: return Crosshair;
  }
};
