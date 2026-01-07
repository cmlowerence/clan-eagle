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

export const HOUSING_SPACE: Record<string, number> = {
  // Elixir Troops
  "Barbarian": 1, "Archer": 1, "Giant": 5, "Goblin": 1, "Wall Breaker": 2,
  "Balloon": 5, "Wizard": 4, "Healer": 14, "Dragon": 20, "PEKKA": 25,
  "Baby Dragon": 10, "Miner": 6, "Electro Dragon": 30, "Yeti": 18,
  "Dragon Rider": 25, "Electro Titan": 32, "Root Rider": 20,
  
  // Dark Troops
  "Minion": 2, "Hog Rider": 5, "Valkyrie": 8, "Golem": 30, "Witch": 12,
  "Lava Hound": 30, "Bowler": 6, "Ice Golem": 15, "Headhunter": 6,
  "Apprentice Warden": 20,
  
  // Super Troops (Common ones)
  "Super Barbarian": 5, "Super Archer": 12, "Super Wall Breaker": 8,
  "Super Giant": 10, "Sneaky Goblin": 3, "Rocket Balloon": 8, "Super Wizard": 10,
  "Super Dragon": 40, "Inferno Dragon": 15, "Super Minion": 12, "Super Valkyrie": 20,
  "Super Witch": 40, "Ice Hound": 40, "Super Bowler": 30, "Super Miner": 24, "Super Hog Rider": 12,

  // Spells (Housing space = slots)
  "Lightning Spell": 1, "Healing Spell": 2, "Rage Spell": 2, "Jump Spell": 2,
  "Freeze Spell": 1, "Clone Spell": 3, "Invisibility Spell": 1, "Recall Spell": 2,
  "Poison Spell": 1, "Earthquake Spell": 1, "Haste Spell": 1, "Skeleton Spell": 1,
  "Bat Spell": 1, "Overgrowth Spell": 2,
  
  // Sieges
  "Wall Wrecker": 1, "Battle Blimp": 1, "Stone Slammer": 1, "Siege Barracks": 1,
  "Log Launcher": 1, "Flame Flinger": 1, "Battle Drill": 1
};

export const getHousingSpace = (name: string) => HOUSING_SPACE[name] || 0;
