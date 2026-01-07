'use client';

import { useEffect } from 'react';

const ICONS = [
  'barbarian.png', 'archer.png', 'giant.png', 'goblin.png', 
  'wizard.png', 'dragon.png', 'p_e_k_k_a.png', 'hog_rider.png',
  'witch.png', 'golem.png', 'lava_hound.png', 'bowler.png'
];

export default function FaviconManager() {
  useEffect(() => {
    const randomIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
    const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    
    if (!link) {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = `/assets/icons/${randomIcon}`;
      document.head.appendChild(newLink);
    } else {
      link.href = `/assets/icons/${randomIcon}`;
    }
  }, []);

  return null; // This component renders nothing visually
}
