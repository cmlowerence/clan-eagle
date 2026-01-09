'use server';

import { supabaseAdmin } from "@/lib/supabase";

export async function verifyAdmin(inputPassword: string) {
  const correctPassword = process.env.ADMIN_SECRET_KEY;
  if (!correctPassword) return { success: false, error: "Server misconfigured" };
  if (inputPassword === correctPassword) return { success: true };
  return { success: false, error: "Incorrect Password" };
}

export async function addLayout(data: any) {
  const { title, townHall, type, imageUrl, copyLink } = data;
  
  if (!supabaseAdmin) throw new Error("Server configuration missing");

  // 1. DUPLICATE CHECK
  const { data: existing } = await supabaseAdmin
    .from('layouts')
    .select('id')
    .eq('copy_link', copyLink)
    .single();

  if (existing) {
    return { success: false, error: "Duplicate: Base link already exists in database." };
  }

  // 2. INSERT
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

  if (!supabaseAdmin) throw new Error("Server configuration missing");

  // 1. DUPLICATE CHECK (By Title)
  const { data: existing } = await supabaseAdmin
    .from('strategies')
    .select('id')
    .ilike('title', title) // Case-insensitive check
    .single();

  if (existing) {
    return { success: false, error: `Duplicate: Strategy "${title}" already exists.` };
  }

  // 2. INSERT
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
