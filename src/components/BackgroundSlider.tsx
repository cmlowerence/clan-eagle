'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGE_COUNT = 6; 
const INTERVAL_MS = 15000; 

export default function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Generate paths: /assets/bg/coc_bg-1.webp ... coc_bg-5.webp
  const images = Array.from({ length: IMAGE_COUNT }, (_, i) => `/assets/bg/coc_bg-${i + 1}.webp`);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, INTERVAL_MS);

    setLoaded(true);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#0f172a]">
      {/* Image Rotation Layer */}
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out will-change-[opacity]
            ${index === currentIndex && loaded ? "opacity-100" : "opacity-0"}
          `}
        >
          <Image
            src={src}
            alt="Background"
            fill
            priority={index === 0}
            className="object-cover object-center scale-105"
            quality={60}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-[#0f151b]/70 backdrop-blur-[1px]"></div>
      
      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-50"></div>
    </div>
  );
}
