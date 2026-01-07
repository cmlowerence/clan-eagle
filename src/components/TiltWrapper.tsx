'use client';

import Tilt from 'react-parallax-tilt';
import { useTheme } from './ThemeProvider';

export default function TiltWrapper({ children, isMax }: { children: React.ReactNode, isMax: boolean }) {
  const { theme } = useTheme();
  
  // Define glare color based on theme
  let glareColor = "#ffffff";
  if (theme === 'classic' || theme === 'edrag') glareColor = "#FACC15"; // Gold glare
  if (theme === 'pekka') glareColor = "#00FFFF"; // Neon glare
  if (theme === 'lava') glareColor = "#F97316"; // Orange glare

  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      perspective={1000}
      scale={1.05}
      transitionSpeed={1000}
      glareEnable={true}
      glareMaxOpacity={isMax ? 0.4 : 0.1} // More glare if maxed
      glareColor={glareColor}
      glarePosition="all"
      glareBorderRadius="0.5rem"
      className="parallax-effect-glare-scale h-full" // Ensure it fills height
    >
      {children}
    </Tilt>
  );
}
