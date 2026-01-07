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
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return "Just now";
}

export function saveToHistory(tag: string, name: string, type: 'clan' | 'player', icon: string) {
  if (typeof window === 'undefined') return;
  const HISTORY_KEY = 'clash_search_history';
  const currentRaw = localStorage.getItem(HISTORY_KEY);
  let history = currentRaw ? JSON.parse(currentRaw) : [];

  // Remove duplicate if exists (move to top)
  history = history.filter((item: any) => item.tag !== tag);
  
  // Add to front
  history.unshift({ tag, name, type, icon, timestamp: Date.now() });
  
  // Keep max 5
  if (history.length > 5) history.pop();
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
