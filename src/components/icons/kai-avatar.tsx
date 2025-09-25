import type { SVGProps } from 'react';

export function KaiAvatar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      {/* Head */}
      <path
        d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity="0.1"
      />
      
      {/* Ears */}
      <path d="M8 8.5A2.5 2.5 0 0 1 5.5 6 2.5 2.5 0 0 1 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 8.5A2.5 2.5 0 0 0 18.5 6 2.5 2.5 0 0 0 16 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Face */}
      <path d="M15.5,10.5a.5.5,0,1,1-.5-.5A.5.5,0,0,1,15.5,10.5Z" />
      <path d="M8.5,10.5a.5.5,0,1,1-.5-.5A.5.5,0,0,1,8.5,10.5Z" />
      <path d="M12 13a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42 1 1 0 0 1 1.42 0 1 1 0 0 1 0 1.42A1 1 0 0 1 12 13Z" />
      <path d="M9.5,16A2.5,2.5,0,0,0,12,18.5,2.5,2.5,0,0,0,14.5,16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Hands */}
      <path
        d="M5.5,18a2.5,2.5,0,0,0,0-5,2.5,2.5,0,0,0-2,4Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M18.5,18a2.5,2.5,0,0,1,0-5,2.5,2.5,0,0,1,2,4Z"
        fill="currentColor"
        opacity="0.8"
      />
    </svg>
  );
}
