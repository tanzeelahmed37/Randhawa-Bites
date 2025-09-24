import React from 'react';

export const RandhawaBitesLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 155" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="RANDHAWA Bites Logo">
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto+Condensed:wght@700&display=swap');
        .randhawa-font { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; fill: #F0EAD6; letter-spacing: -1px; }
        .bites-font { font-family: 'Roboto Condensed', sans-serif; font-size: 24px; font-weight: 700; letter-spacing: 2px; fill: #F0EAD6; }
      `}
    </style>
    <g transform="translate(0, 10)">
        <ellipse cx="100" cy="95" rx="95" ry="45" fill="none" stroke="#F0EAD6" strokeWidth="4" />
        <text x="100" y="92" textAnchor="middle" className="randhawa-font">RANDHAWA</text>
        <text x="100" y="122" textAnchor="middle" className="bites-font">BITES</text>
    </g>
    
    <g transform="translate(0, 0)">
      <path d="M78,65 C78,50 88,45 93,52 C96,45 104,45 107,52 C112,45 122,50 122,65 A24,24,0,0,1,78,65 Z" fill="#F9A825"/>
      <path d="M89,56 C91,53 94,53 96,56" stroke="#111827" fill="none" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M104,56 C106,53 109,53 111,56" stroke="#111827" fill="none" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M88 62 a 12 12 0 0 0 24 0" stroke="#111827" fill="none" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);


export const RandhawaBitesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox='0 0 32 32' className={className} xmlns='http://www.w3.org/2000/svg' aria-label="RANDHAWA Bites Icon">
        <path d='M4,25 A12,12 0 0,1 28,25 C 26 15, 22 15, 20 19 C 18 15, 14 15, 12 19 C 10 15, 6 15, 4 25 Z' fill='#F9A825'/>
        <path d='M11 17 q 1.5 -2 3 0' stroke='#111827' fill='none' strokeWidth='1.5' strokeLinecap='round' />
        <path d='M18 17 q 1.5 -2 3 0' stroke='#111827' fill='none' strokeWidth='1.5' strokeLinecap='round' />
        <path d='M11 22 a5 5 0 0 0 10 0' stroke='#111827' fill='none' strokeWidth='1.5' strokeLinecap='round' />
    </svg>
);
