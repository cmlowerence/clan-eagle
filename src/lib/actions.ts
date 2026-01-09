'use server';

import { supabaseAdmin } from "@/lib/supabase";

export async function addLayout(data: any) {
  const { title, townHall, type, imageUrl, copyLink } = data;
  
  if (!supabaseAdmin) throw new Error("Server configuration missing (Service Role Key)");

  const { error } = await supabaseAdmin
    .from('layouts')
    .insert([{ 
        title, 
        town_hall: townHall, 
        type, 
        image_url: imageUrl, 
        copy_link: copyLink 
    }]);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function addStrategy(data: any) {
  const { title, description, townHalls, difficulty, videoUrl, armyComp, armyLink } = data;

  if (!supabaseAdmin) throw new Error("Server configuration missing (Service Role Key)");

  const { error } = await supabaseAdmin
    .from('strategies')
    .insert([{ 
        title, 
        description, 
        town_halls: townHalls, 
        difficulty, 
        video_url: videoUrl, 
        army_comp: armyComp,
        army_link: armyLink
    }]);

  if (error) throw new Error(error.message);
  return { success: true };
}
