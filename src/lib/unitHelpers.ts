 import { Sword, Zap, Skull, Shield, Star, Ghost, Flame, Crosshair, Hexagon } from "lucide-react";

// --- 1. Housing Space Constants ---
export const HOUSING_SPACE: Record<string, number> = {
  // Elixir Troops
  "Barbarian": 1, "Archer": 1, "Giant": 5, "Goblin": 1, "Wall Breaker": 2,
  "Balloon": 5, "Wizard": 4, "Healer": 14, "Dragon": 20, 
  "P.E.K.K.A": 25, // Only keeping the dotted version
  "Baby Dragon": 10, "Miner": 6, "Electro Dragon": 30, "Yeti": 18,
  "Dragon Rider": 25, "Electro Titan": 32, "Root Rider": 20, 
  "Electrofire Wizard": 14, "Druid": 16, "Thrower": 10,
  
  // Dark Troops
  "Minion": 2, "Hog Rider": 5, "Valkyrie": 8, "Golem": 30, "Witch": 12,
  "Lava Hound": 30, "Bowler": 6, "Ice Golem": 15, "Headhunter": 6,
  "Apprentice Warden": 20, "Furnace": 20,
  
  // Super Troops
  "Super Barbarian": 5, "Super Archer": 12, "Super Wall Breaker": 8,
  "Super Giant": 10, "Sneaky Goblin": 3, "Rocket Balloon": 8, "Super Wizard": 10,
  "Super Dragon": 40, "Inferno Dragon": 15, "Super Minion": 12, "Super Valkyrie": 20,
  "Super Witch": 40, "Ice Hound": 40, "Super Bowler": 30, "Super Miner": 24, "Super Hog Rider": 12,

  // Spells
  "Lightning Spell": 1, "Healing Spell": 2, "Rage Spell": 2, "Jump Spell": 2,
  "Freeze Spell": 1, "Clone Spell": 3, "Invisibility Spell": 1, "Recall Spell": 2,
  "Revive Spell": 2, "Totem Spell": 2,
  "Poison Spell": 1, "Earthquake Spell": 1, "Haste Spell": 1, "Skeleton Spell": 1,
  "Bat Spell": 1, "Overgrowth Spell": 2,
  
  // Sieges
  "Wall Wrecker": 1, "Battle Blimp": 1, "Stone Slammer": 1, "Siege Barracks": 1,
  "Log Launcher": 1, "Flame Flinger": 1, "Battle Drill": 1, "Troop Launcher": 1
};

// --- 2. Unlock Levels ---
export const UNIT_UNLOCKS: Record<string, number> = {
  // Standard Troops
  "Barbarian": 1, "Archer": 1, "Giant": 1, "Goblin": 2, "Wall Breaker": 2,
  "Balloon": 2, "Wizard": 5, "Healer": 6, "Dragon": 7, "P.E.K.K.A": 8,
  "Baby Dragon": 9, "Miner": 10, "Electro Dragon": 11, "Yeti": 12,
  "Dragon Rider": 13, "Electro Titan": 14, "Root Rider": 15, 
  "Electrofire Wizard": 16, "Druid": 17, "Thrower": 17,
  
  // Dark Troops
  "Minion": 7, "Hog Rider": 7, "Valkyrie": 8, "Golem": 8, "Witch": 9,
  "Lava Hound": 9, "Bowler": 10, "Ice Golem": 11, "Headhunter": 12,
  "Apprentice Warden": 13, "Furnace": 17,
  
  // Super Troops (Generally TH11+)
  "Super Barbarian": 11, "Super Archer": 11, "Super Wall Breaker": 11, "Super Giant": 11,
  "Sneaky Goblin": 11, "Rocket Balloon": 11, "Super Wizard": 11, "Super Dragon": 11,
  "Inferno Dragon": 11, "Super Minion": 11, "Super Valkyrie": 11, "Super Witch": 11,
  "Ice Hound": 11, "Super Bowler": 11, "Super Miner": 11, "Super Hog Rider": 11,

  // Spells
  "Lightning Spell": 5, "Healing Spell": 6, "Rage Spell": 7, "Jump Spell": 9,
  "Freeze Spell": 9, "Clone Spell": 10, "Invisibility Spell": 11, "Recall Spell": 13,
  "Revive Spell": 15, "Totem Spell": 16,
  "Poison Spell": 8, "Earthquake Spell": 8, "Haste Spell": 9, "Skeleton Spell": 9,
  "Bat Spell": 10, "Overgrowth Spell": 12,

  // Sieges
  "Wall Wrecker": 12, "Battle Blimp": 12, "Stone Slammer": 12, 
  "Siege Barracks": 13, "Log Launcher": 13, "Flame Flinger": 14, 
  "Battle Drill": 15, "Troop Launcher": 16
};

// --- 3. Categories & Arrays ---
const elixirTroops = [
  "Barbarian", "Archer", "Giant", "Goblin", "Wall Breaker", "Balloon", 
  "Wizard", "Healer", "Dragon", "P.E.K.K.A", "Baby Dragon", "Miner", 
  "Electro Dragon", "Yeti", "Dragon Rider", "Electro Titan", "Root Rider", 
  "Electrofire Wizard", "Druid", "Thrower"
];

const darkTroops = [
  "Minion", "Hog Rider", "Valkyrie", "Golem", "Witch", "Lava Hound", 
  "Bowler", "Ice Golem", "Headhunter", "Apprentice Warden", "Furnace"
];

const superTroops = [
  "Super Barbarian", "Super Archer", "Super Wall Breaker", "Super Giant", 
  "Sneaky Goblin", "Super Miner", "Rocket Balloon", "Inferno Dragon", 
  "Super Valkyrie", "Super Witch", "Ice Hound", "Super Bowler", 
  "Super Dragon", "Super Wizard", "Super Minion", "Super Hog Rider"
];

const elixirSpells = ["Lightning Spell", "Healing Spell", "Rage Spell", "Jump Spell", "Freeze Spell", "Clone Spell", "Invisibility Spell", "Recall Spell", "Revive Spell", "Totem Spell"];
const darkSpells = ["Poison Spell", "Earthquake Spell", "Haste Spell", "Skeleton Spell", "Bat Spell", "Overgrowth Spell"];
const sieges = ["Wall Wrecker", "Battle Blimp", "Stone Slammer", "Siege Barracks", "Log Launcher", "Flame Flinger", "Battle Drill", "Troop Launcher"];
const pets = ["L.A.S.S.I", "Mighty Yak", "Electro Owl", "Unicorn", "Diggy", "Frosty", "Phoenix", "Poison Lizard", "Spirit Fox", "Angry Jelly"];

export const UNIT_CATEGORIES = {
  elixirTroops, darkTroops, superTroops, elixirSpells, darkSpells, pets, sieges,
  troops: [...elixirTroops, ...darkTroops, ...superTroops],
  spells: [...elixirSpells, ...darkSpells]
};

// --- 4. Helpers ---
export const getHousingSpace = (name: string) => HOUSING_SPACE[name] || 0;
export const getUnlockLevel = (name: string) => UNIT_UNLOCKS[name] || 1;

export const getUnitIconPath = (name: string) => {
  if (!name) return '/assets/icons/barbarian.png';
  
  // FIX: Replace dots with underscores (P.E.K.K.A -> p_e_k_k_a)
  const slug = name.toLowerCase().replace(/\./g, "_").replace(/ /g, "_");
  
  return `/assets/icons/${slug}.png`;
};

export const getUnitCategory = (name: string, isSpell = false) => {
  if (isSpell) return darkSpells.includes(name) ? 'Dark Spell' : 'Elixir Spell';
  if (pets.includes(name)) return 'Pet';
  if (darkTroops.includes(name)) return 'Dark Troop';
  if (superTroops.includes(name)) return 'Super Troop';
  if (sieges.includes(name)) return 'Siege Machine';
  return 'Elixir Troop';
};

export const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Elixir Troop': return Sword; case 'Dark Troop': return Skull;
    case 'Super Troop': return Zap; case 'Pet': return Ghost;
    case 'Siege Machine': return Hexagon; case 'Elixir Spell': return Flame;
    case 'Dark Spell': return Star; default: return Shield;
  }
};
