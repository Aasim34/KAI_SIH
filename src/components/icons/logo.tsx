import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <path d="M30 35C25 35 20 40 20 45C20 50 25 55 30 55C32 55 34 54 35 52C36 54 38 55 40 55C45 55 50 50 50 45" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M50 45C50 40 55 35 60 35C65 35 70 40 70 45C70 50 65 55 60 55C58 55 56 54 55 52C54 54 52 55 50 55" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M35 65C35 60 40 55 45 55C50 55 55 60 55 65C55 70 50 75 45 80C40 75 35 70 35 65Z" fill="currentColor" opacity="0.8"/>
      <circle cx="42" cy="62" r="2" fill="white" opacity="0.9"/>
      <circle cx="48" cy="62" r="2" fill="white" opacity="0.9"/>
      <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="75" cy="25" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="25" cy="75" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="75" cy="75" r="2" fill="currentColor" opacity="0.6"/>
      <line x1="25" y1="25" x2="35" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="75" y1="25" x2="65" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="25" y1="75" x2="35" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="75" y1="75" x2="65" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <circle cx="50" cy="50" r="8" fill="white" opacity="0.2"/>
      <circle cx="50" cy="50" r="4" fill="white" opacity="0.4"/>
    </svg>
  );
}
