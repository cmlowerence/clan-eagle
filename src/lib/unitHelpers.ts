import { Sword, Zap, Skull, Shield, Star, Ghost, Flame, Crosshair, Hexagon } from "lucide-react";

// --- 1. Housing Space Constants ---
// Includes latest 2025-2026 additions
export const HOUSING_SPACE: Record<string, number> = {
  // Elixir Troops
  "Barbarian": 1, "Archer": 1, "Giant": 5, "Goblin": 1, "Wall Breaker": 2,
  "Balloon": 5, "Wizard": 4, "Healer": 14, "Dragon": 20, "PEKKA": 25,
  "Baby Dragon": 10, "Miner": 6, "Electro Dragon": 30, "Yeti": 18,
  "Dragon Rider": 25, "Electro Titan": 32, "Root Rider": 20, 
  "Electrofire Wizard": 14, "Druid": 16, "Thrower": 10, // Added Thrower
  
  // Dark Troops
  "Minion": 2, "Hog Rider": 5, "Valkyrie": 8, "Golem": 30, "Witch": 12,
  "Lava Hound": 30, "Bowler": 6, "Ice Golem": 15, "Headhunter": 6,
  "Apprentice Warden": 20, "Furnace": 20, // Added Furnace
  
  // Super Troops
  "Super Barbarian": 5, "Super Archer": 12, "Super Wall Breaker": 8,
  "Super Giant": 10, "Sneaky Goblin": 3, "Rocket Balloon": 8, "Super Wizard": 10,
  "Super Dragon": 40, "Inferno Dragon": 15, "Super Minion": 12, "Super Valkyrie": 20,
  "Super Witch": 40, "Ice Hound": 40, "Super Bowler": 30, "Super Miner": 24, "Super Hog Rider": 12,

  // Spells (1 Space = 1 Slot)
  "Lightning Spell": 1, "Healing Spell": 2, "Rage Spell": 2, "Jump Spell": 2,
  "Freeze Spell": 1, "Clone Spell": 3, "Invisibility Spell": 1, "Recall Spell": 2,
  "Revive Spell": 2, "Totem Spell": 2, // Added Totem Spell
  "Poison Spell": 1, "Earthquake Spell": 1, "Haste Spell": 1, "Skeleton Spell": 1,
  "Bat Spell": 1, "Overgrowth Spell": 2,
  
  // Sieges
  "Wall Wrecker": 1, "Battle Blimp": 1, "Stone Slammer": 1, "Siege Barracks": 1,
  "Log Launcher": 1, "Flame Flinger": 1, "Battle Drill": 1, "Troop Launcher": 1 // Added Troop Launcher
};

// --- 2. Categorization Lists ---
const elixirTroops = [
  "Barbarian", "Archer", "Giant", "Goblin", "Wall Breaker", "Balloon", "Wizard", 
  "Healer", "Dragon", "PEKKA", "Baby Dragon", "Miner", "Electro Dragon", 
  "Yeti", "Dragon Rider", "Electro Titan", "Root Rider", "Electrofire Wizard", 
  "Druid", "Thrower" // Added
];

const darkTroops = [
  "Minion", "Hog Rider", "Valkyrie", "Golem", "Witch", "Lava Hound", 
  "Bowler", "Ice Golem", "Headhunter", "Apprentice Warden", "Furnace" // Added
];

const superTroops = [
  "Super Barbarian", "Super Archer", "Super Wall Breaker", "Super Giant", 
  "Sneaky Goblin", "Super Miner", "Rocket Balloon", "Inferno Dragon", 
  "Super Valkyrie", "Super Witch", "Ice Hound", "Super Bowler", 
  "Super Dragon", "Super Wizard", "Super Minion", "Super Hog Rider"
];

const elixirSpells = [
  "Lightning Spell", "Healing Spell", "Rage Spell", "Jump Spell", "Freeze Spell", 
  "Clone Spell", "Invisibility Spell", "Recall Spell", "Revive Spell", "Totem Spell" // Added
];

const darkSpells = [
  "Poison Spell", "Earthquake Spell", "Haste Spell", "Skeleton Spell", 
  "Bat Spell", "Overgrowth Spell"
];

const sieges = [
  "Wall Wrecker", "Battle Blimp", "Stone Slammer", "Siege Barracks", 
  "Log Launcher", "Flame Flinger", "Battle Drill", "Troop Launcher" // Added
];

const pets = [
  "L.A.S.S.I", "Mighty Yak", "Electro Owl", "Unicorn", "Diggy", "Frosty", 
  "Phoenix", "Poison Lizard", "Spirit Fox", "Angry Jelly"
];

// EXPORTED OBJECT
export const UNIT_CATEGORIES = {
  // Granular Lists (For Player Profile)
  elixirTroops,
  darkTroops,
  superTroops,
  elixirSpells,
  darkSpells,
  pets,
  sieges,

  // Combined Lists (For Army Planner Tab Iteration)
  troops: [...elixirTroops, ...darkTroops, ...superTroops],
  spells: [...elixirSpells, ...darkSpells]
};


// --- 3. Town Hall Caps ---
export const TH_CAPS: Record<number, { troops: number; spells: number; sieges: number }> = {
  1: { troops: 20, spells: 0, sieges: 0 },
  2: { troops: 30, spells: 0, sieges: 0 },
  3: { troops: 70, spells: 0, sieges: 0 },
  4: { troops: 80, spells: 0, sieges: 0 },
  5: { troops: 135, spells: 2, sieges: 0 },
  6: { troops: 150, spells: 4, sieges: 0 },
  7: { troops: 200, spells: 6, sieges: 0 },
  8: { troops: 200, spells: 7, sieges: 0 },
  9: { troops: 220, spells: 9, sieges: 0 },
  10: { troops: 240, spells: 11, sieges: 0 },
  11: { troops: 260, spells: 11, sieges: 0 },
  12: { troops: 280, spells: 11, sieges: 1 },
  13: { troops: 300, spells: 11, sieges: 1 },
  14: { troops: 300, spells: 11, sieges: 1 },
  15: { troops: 320, spells: 11, sieges: 1 },
  16: { troops: 320, spells: 11, sieges: 1 },
  17: { troops: 340, spells: 11, sieges: 1 },
};

// --- 4. Helper Functions ---

export const getHousingSpace = (name: string) => HOUSING_SPACE[name] || 0;

export const getUnitIconPath = (name: string) => {
  if (!name) return '/assets/icons/barbarian.png';
  const slug = name.toLowerCase().replace(/[\s\.]/g, "_");
  return `/assets/icons/${slug}.png`;
};

// Robust Category Helper
export const getUnitCategory = (name: string, isSpell = false) => {
  if (isSpell) {
    return darkSpells.includes(name) ? 'Dark Spell' : 'Elixir Spell';
  }
  if (pets.includes(name)) return 'Pet';
  if (darkTroops.includes(name)) return 'Dark Troop';
  if (superTroops.includes(name)) return 'Super Troop';
  if (sieges.includes(name)) return 'Siege Machine';
  return 'Elixir Troop';
};

// Icon Helper for Player Profile
export const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Elixir Troop': return Sword;
    case 'Dark Troop': return Skull;
    case 'Super Troop': return Zap;
    case 'Pet': return Ghost;
    case 'Siege Machine': return Hexagon;
    case 'Elixir Spell': return Flame;
    case 'Dark Spell': return Star;
    case 'Hero': return Shield;
    default: return Crosshair;
  }
};
