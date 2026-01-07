export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "Just now";
}

export function saveToHistory(tag: string, name: string, type: 'clan' | 'player', icon: string) {
  if (typeof window === 'undefined') return;
  const HISTORY_KEY = 'clash_search_history';
  const currentRaw = localStorage.getItem(HISTORY_KEY);
  let history = currentRaw ? JSON.parse(currentRaw) : [];
  history = history.filter((item: any) => item.tag !== tag);
  history.unshift({ tag, name, type, icon, timestamp: Date.now() });
  if (history.length > 5) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// --- NEW FAVORITES LOGIC ---
export function toggleFavorite(tag: string, name: string, type: 'clan' | 'player', icon: string) {
  if (typeof window === 'undefined') return false;
  const FAV_KEY = 'clash_favorites';
  const currentRaw = localStorage.getItem(FAV_KEY);
  let favs = currentRaw ? JSON.parse(currentRaw) : [];

  const exists = favs.find((f: any) => f.tag === tag);
  if (exists) {
    favs = favs.filter((f: any) => f.tag !== tag); // Remove
  } else {
    favs.push({ tag, name, type, icon }); // Add
  }
  
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return !exists; // Return new state (true = added, false = removed)
}

export function isFavorite(tag: string) {
  if (typeof window === 'undefined') return false;
  const favs = JSON.parse(localStorage.getItem('clash_favorites') || '[]');
  return !!favs.find((f: any) => f.tag === tag);
}

export function getFavorites() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('clash_favorites') || '[]');
}
