import type { SVGProps } from 'react';

export function KaiAvatar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <circle cx="50" cy="40" r="25" fill="currentColor" opacity="0.9"/>
      <circle cx="42" cy="35" r="4" fill="white"/>
      <circle cx="58" cy="35" r="4" fill="white"/>
      <circle cx="42" cy="35" r="2" fill="#6D28D9"/>
      <circle cx="58" cy="35" r="2" fill="#6D28D9"/>
      <path d="M40 45 Q50 52 60 45" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <rect x="40" y="60" width="20" height="25" rx="10" fill="currentColor" opacity="0.8"/>
      <rect x="30" y="65" width="12" height="4" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="58" y="65" width="12" height="4" rx="2" fill="currentColor" opacity="0.7"/>
      <line x1="50" y1="15" x2="50" y2="10" stroke="white" strokeWidth="2"/>
      <circle cx="50" cy="8" r="2" fill="#22C55E"/>
    </svg>
  );
}
