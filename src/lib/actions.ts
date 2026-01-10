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
// --- NEW: FETCHING ---
export async function getLayouts() {
  if (!supabaseAdmin) return [];
  const { data } = await supabaseAdmin.from('layouts').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getStrategies() {
  if (!supabaseAdmin) return [];
  const { data } = await supabaseAdmin.from('strategies').select('*').order('created_at', { ascending: false });
  return data || [];
}

// --- NEW: DELETING ---
export async function deleteItem(table: 'layouts' | 'strategies', id: number) {
    if (!supabaseAdmin) throw new Error("Server config missing");
    const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

// --- NEW: UPDATING ---
export async function updateLayout(id: number, data: any) {
  if (!supabaseAdmin) throw new Error("Server config missing");
  const { title, townHall, type, imageUrl, copyLink } = data;
  
  const { error } = await supabaseAdmin
    .from('layouts')
    .update({ title, town_hall: townHall, type, image_url: imageUrl, copy_link: copyLink })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateStrategy(id: number, data: any) {
  if (!supabaseAdmin) throw new Error("Server config missing");
  const { title, description, townHalls, difficulty, videoUrl, armyComp, armyLink } = data;

  const { error } = await supabaseAdmin
    .from('strategies')
    .update({ 
        title, description, town_halls: townHalls, difficulty, 
        video_url: videoUrl, army_comp: armyComp, army_link: armyLink 
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
