'use client';

import Script from "next/script";

export default function Eruda() {
  return (
    <Script 
      src="//cdn.jsdelivr.net/npm/eruda" 
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-ignore
        if (typeof eruda !== 'undefined') eruda.init();
      }}
    />
  );
}
