import type { SVGProps } from 'react';

export function KaiAvatar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      {/* Glow */}
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />

      {/* Main Head */}
      <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.2" />

      {/* Inner face */}
      <g transform="translate(0, -1)">
        {/* Eyes */}
        <circle cx="9.5" cy="11.5" r="1.2" fill="white" />
        <circle cx="14.5" cy="11.5" r="1.2" fill="white" />

        {/* Mouth */}
        <path d="M9.5 15.5 C 10.5 17, 13.5 17, 14.5 15.5" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        
        {/* Little antenna */}
        <path d="M12 6 V 4.5 M 12 3.5 a 1 1 0 1 1 0 -2 a 1 1 0 0 1 0 2" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
