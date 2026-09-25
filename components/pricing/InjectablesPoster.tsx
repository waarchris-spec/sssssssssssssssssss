'use client';

import React from 'react';
import { INJECTABLES_TARIFF_DATA } from '@/lib/clinicData';
import { ClinicPosterBadge } from './ClinicPosterBadge';
import { PosterFooter } from './PosterFooter';
import { Calendar } from 'lucide-react';

interface InjectablesPosterProps {
  onOpenBooking: (treatmentName?: string) => void;
}

export const InjectablesPoster: React.FC<InjectablesPosterProps> = ({ onOpenBooking }) => {
  const leftCategories = INJECTABLES_TARIFF_DATA.filter((c) => c.column === 'left');
  const rightCategories = INJECTABLES_TARIFF_DATA.filter((c) => c.column === 'right');

  return (
    <div
      id="injectables-poster"
      className="relative w-full max-w-5xl mx-auto rounded-3xl p-5 sm:p-10 lg:p-12 shadow-xl border border-pink-300/80 overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #FDECEF 0%, #FFF5F7 35%, #FDE4EB 70%, #FAD7DF 100%)',
      }}
    >
      {/* Decorative ambient background accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header with Badge, Caduceus & Signature */}
      <div className="relative z-10 flex flex-col items-center text-center mb-8 sm:mb-10">
        <ClinicPosterBadge />

        {/* Poster Main Title */}
        <div className="mt-4 sm:mt-6">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-tight">
            Tarification
          </h2>
          <div className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#C73859] tracking-wider uppercase mt-1">
            INJECTABLES:
          </div>
        </div>
      </div>

      {/* 2. Two-Column Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        
        {/* Left Column (SOINS VISAGE, PRP, PEELING) */}
        <div className="flex flex-col gap-6">
          {leftCategories.map((category) => (
            <div
              key={category.id}
              id={`card-${category.id}`}
              className="group rounded-2xl sm:rounded-3xl border border-stone-800 bg-[#FFF5F7]/90 backdrop-blur-xs p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Category Title with Pink/Rose Underline */}
              <div className="mb-4">
                <span className="font-serif font-bold text-base sm:text-lg tracking-widest text-[#C73859] uppercase inline-block border-b-2 border-[#C73859] pb-0.5">
                  {category.title}
                </span>
              </div>

              {/* Items List */}
              <ul className="space-y-3 font-serif">
                {category.items.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => onOpenBooking(item.name)}
                    className="flex items-baseline justify-between gap-2 text-stone-900 group/item cursor-pointer hover:text-[#C73859] transition-colors py-1 rounded-lg px-2 -mx-2 hover:bg-rose-50/60"
                    title={`Réserver pour : ${item.name}`}
                  >
                    <div className="flex items-baseline gap-2 min-w-0 pr-2">
                      <span className="text-[#C73859] font-bold text-sm shrink-0">•</span>
                      <span className="text-sm sm:text-base font-normal tracking-tight truncate group-hover/item:font-medium">
                        {item.name}
                      </span>
                    </div>

                    {/* Dotted Leader Line */}
                    <span className="flex-1 border-b border-dotted border-stone-400/60 mx-1 hidden sm:block relative -top-1" />

                    {/* Price in DA */}
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-stone-950 group-hover/item:text-[#C73859]">
                        {item.priceDZD.toLocaleString('fr-DZ')} DA
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Right Column (SKINBOOSTER, BOTOX, FILLER, LIPBOOSTER) */}
        <div className="flex flex-col gap-6">
          {rightCategories.map((category) => (
            <div
              key={category.id}
              id={`card-${category.id}`}
              className="group rounded-2xl sm:rounded-3xl border border-stone-800 bg-[#FFF5F7]/90 backdrop-blur-xs p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Category Title with Pink/Rose Underline */}
              <div className="mb-4">
                <span className="font-serif font-bold text-base sm:text-lg tracking-widest text-[#C73859] uppercase inline-block border-b-2 border-[#C73859] pb-0.5">
                  {category.title}
                </span>
              </div>

              {/* Items List */}
              <ul className="space-y-3 font-serif">
                {category.items.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => onOpenBooking(item.name)}
                    className="flex items-baseline justify-between gap-2 text-stone-900 group/item cursor-pointer hover:text-[#C73859] transition-colors py-1 rounded-lg px-2 -mx-2 hover:bg-rose-50/60"
                    title={`Réserver pour : ${item.name}`}
                  >
                    <div className="flex items-baseline gap-2 min-w-0 pr-2">
                      <span className="text-[#C73859] font-bold text-sm shrink-0">•</span>
                      <span className="text-sm sm:text-base font-normal tracking-tight truncate group-hover/item:font-medium">
                        {item.name}
                      </span>
                    </div>

                    {/* Dotted Leader Line */}
                    <span className="flex-1 border-b border-dotted border-stone-400/60 mx-1 hidden sm:block relative -top-1" />

                    {/* Price in DA */}
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-stone-950 group-hover/item:text-[#C73859]">
                        {item.priceDZD.toLocaleString('fr-DZ')} DA
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* 3. Footer: "Prenez rendez-vous", Phone, Location, Stethoscope & CTA */}
      <div className="relative z-10">
        <PosterFooter onOpenBooking={onOpenBooking} />
      </div>
    </div>
  );
};
