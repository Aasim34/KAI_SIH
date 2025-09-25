import type { SVGProps } from 'react';

export function KaiAvatar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <defs>
        <radialGradient id="kai-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{stopColor: 'white', stopOpacity: 0.7}} />
          <stop offset="100%" style={{stopColor: 'white', stopOpacity: 0}} />
        </radialGradient>
      </defs>
      {/* Main body */}
      <path d="M25 50 C25 25 75 25 75 50 C90 70 70 95 50 95 C30 95 10 70 25 50 Z" fill="currentColor" />
      
      {/* Face */}
      <circle cx="42" cy="55" r="4" fill="white" />
      <circle cx="58" cy="55" r="4" fill="white" />
      <path d="M45 68 Q50 73 55 68" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Antenna with light */}
      <path d="M50 25 Q55 15 60 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="60" cy="10" r="4" fill="#6D28D9" />
      <circle cx="60"cy="10" r="2" fill="white" />
      
      {/* Blush */}
      <circle cx="35" cy="65" r="5" fill="white" opacity="0.2" />
      <circle cx="65" cy="65" r="5" fill="white" opacity="0.2" />

      {/* Reflection */}
      <circle cx="50" cy="50" r="30" fill="url(#kai-grad)" opacity="0.5" />
    </svg>
  );
}
