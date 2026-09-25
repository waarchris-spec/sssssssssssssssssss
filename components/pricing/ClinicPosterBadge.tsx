'use client';

import React from 'react';

export const ClinicPosterBadge: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 pt-2 pb-1">
      {/* Circular Emblem Badge: GH CLINIC By Dr. Ghaouat Sarra */}
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-full shadow-xs border border-pink-200/80 group">
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-rose-50 to-pink-100 border border-pink-300 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
          {/* Botanical Wreath / Face Silhouette Line Art SVG */}
          <svg viewBox="0 0 100 100" className="w-10 h-10 text-stone-700" fill="none" stroke="currentColor" strokeWidth="1.6">
            {/* Wreath leaves */}
            <path d="M 22 75 C 12 55 16 35 32 20 C 35 25 32 35 27 45 C 22 55 24 68 28 72" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 78 75 C 88 55 84 35 68 20 C 65 25 68 35 73 45 C 78 55 76 68 72 72" stroke="currentColor" strokeWidth="1.2" />
            {/* Serene face profile line art */}
            <path d="M 46 28 C 54 28 60 34 60 42 C 60 49 55 53 52 56 C 49 59 48 64 48 68" stroke="currentColor" strokeLinecap="round" />
            <path d="M 44 38 C 45 40 48 40 49 38" stroke="currentColor" strokeLinecap="round" />
            <path d="M 42 46 C 45 47 48 47 50 45" stroke="currentColor" strokeLinecap="round" />
            <path d="M 45 54 C 47 56 50 56 52 54" stroke="#D8436B" strokeLinecap="round" strokeWidth="1.8" />
            {/* Soft hair contour */}
            <path d="M 42 28 C 36 32 35 42 38 48 C 37 54 39 60 42 66" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="text-left">
          <div className="font-serif font-bold text-sm tracking-wider text-stone-900 leading-tight">
            GH CLINIC
          </div>
          <div className="font-serif italic text-[11px] text-[#C73859] tracking-tight">
            By Dr. Ghaouat Sarra
          </div>
        </div>
      </div>

      {/* Caduceus Medical Icon & Signature */}
      <div className="flex items-center gap-2.5">
        {/* Caduceus Pink SVG */}
        <div className="w-8 h-8 flex items-center justify-center text-[#D8436B]" title="Médecine Esthétique">
          <svg viewBox="0 0 64 64" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Wings */}
            <path d="M 16 18 C 24 14 30 18 32 24 C 34 18 40 14 48 18 C 44 26 36 26 32 25 C 28 26 20 26 16 18 Z" fill="#FCE4EC" stroke="#D8436B" />
            {/* Central Staff */}
            <line x1="32" y1="10" x2="32" y2="58" stroke="#D8436B" strokeWidth="2.5" />
            <circle cx="32" cy="10" r="3.5" fill="#D8436B" />
            {/* Entwined Serpents */}
            <path d="M 22 28 C 24 33 40 33 42 38 C 44 43 22 45 22 50 C 22 53 26 55 32 54 C 38 55 42 53 42 50" stroke="#D8436B" strokeWidth="2" />
          </svg>
        </div>

        {/* Doctor Signature */}
        <span className="font-serif italic text-xl sm:text-2xl text-[#8E2842] tracking-wide font-medium">
          Dr Ghaouat Sarra
        </span>
      </div>
    </div>
  );
};
