'use client';

import { useClashData } from "@/hooks/useClashData";
import { UNIT_CATEGORIES, getUnitCategory } from "@/lib/unitHelpers";
import { saveToHistory, toggleFavorite, isFavorite } from "@/lib/utils";
import { Crown, Droplets, Hammer, Rocket, FlaskConical } from "lucide-react";
import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/SkeletonLoader";
import ShareProfileModal from "@/components/ShareProfileModal";

// Local Components
import { PlayerData } from "./_components/types";
import PlayerHero from "./_components/PlayerHero";
import UnitSection from "./_components/UnitSection";

export default function PlayerPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const [isFav, setIsFav] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Data Fetching
  const { data: player, loading, isCached, timestamp, refresh } = useClashData<PlayerData>(`player_${tag}`, `/players/${tag}`);

  // Sync History & Fav State
  useEffect(() => {
    if (player) {
      const icon = `/assets/icons/town_hall_${player.townHallLevel}.png`;
      saveToHistory(player.tag, player.name, 'player', icon);
      setIsFav(isFavorite(player.tag));
    }
  }, [player]);

  const handleFav = () => {
    if(!player) return;
    const icon = `/assets/icons/town_hall_${player.townHallLevel}.png`;
    const newState = toggleFavorite(player.tag, player.name, 'player', icon);
    setIsFav(newState);
  };

  if (loading) return <SkeletonLoader />;
  if (!player) return <div className="p-10 text-center font-clash text-xl text-skin-muted">Player not found.</div>;

  // --- FILTERING LOGIC ---
  const homeHeroes = player.heroes.filter(h => h.village === 'home');
  const pets = player.troops.filter(t => UNIT_CATEGORIES.pets.includes(t.name));
  
  // Combine Heroes & Pets for one section
  const heroesAndPets = [...homeHeroes, ...pets];

  const allTroops = player.troops.filter(t => t.village === 'home' && !UNIT_CATEGORIES.pets.includes(t.name));
  
  const elixirTroops = allTroops.filter(t => getUnitCategory(t.name) === 'Elixir Troop');
  const darkTroops = allTroops.filter(t => getUnitCategory(t.name) === 'Dark Troop');
  const superTroops = allTroops.filter(t => getUnitCategory(t.name) === 'Super Troop');
  const siegeMachines = allTroops.filter(t => getUnitCategory(t.name) === 'Siege Machine');
  
  const elixirSpells = player.spells.filter(s => getUnitCategory(s.name, true) === 'Elixir Spell');
  const darkSpells = player.spells.filter(s => getUnitCategory(s.name, true) === 'Dark Spell');
  const allSpells = [...elixirSpells, ...darkSpells];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* 1. Header & Stats */}
      <PlayerHero 
        player={player} 
        isFav={isFav} 
        onToggleFav={handleFav} 
        onRefresh={refresh} 
        loading={loading}
        onShare={() => setShowShareModal(true)}
        isCached={isCached}
        timestamp={timestamp}
      />

      {/* 2. Heroes & Pets (Icon: Crown) */}
      <UnitSection 
        title="Heroes & Pets" 
        icon={<Crown size={18} className="text-skin-primary" />} 
        units={heroesAndPets} 
        type="Hero"
      />

      {/* 3. Super Troops (Icon: Rocket) */}
      <UnitSection 
        title="Super Troops" 
        icon={<Rocket size={18} className="text-yellow-400" />} 
        units={superTroops} 
        type="Super Troop"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 4. Elixir Troops (Icon: Pink Drop) */}
          <UnitSection 
            title="Elixir Troops" 
            icon={<Droplets size={18} className="text-pink-400" />} 
            units={elixirTroops} 
            type="Elixir Troop"
          />

          {/* 5. Dark Troops (Icon: Dark Drop - Indigo/Purple for contrast on dark/light) */}
          <UnitSection 
            title="Dark Troops" 
            icon={<Droplets size={18} className="text-indigo-500 dark:text-indigo-400" />} 
            units={darkTroops} 
            type="Dark Troop"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 6. Spells (Icon: Flask/Beaker) */}
          <UnitSection 
            title="Spells" 
            icon={<FlaskConical size={18} className="text-blue-400" />} 
            units={allSpells} 
            type="Spell"
          />
          
          {/* 7. Sieges (Icon: Hammer/Tool) */}
          <UnitSection 
            title="Siege Machines" 
            icon={<Hammer size={18} className="text-yellow-600 dark:text-yellow-500" />} 
            units={siegeMachines} 
            type="Siege Machine"
          />
      </div>

      {showShareModal && <ShareProfileModal player={player} onClose={() => setShowShareModal(false)} />}
    </div>
  );
}
