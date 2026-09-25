'use client';

import React from 'react';
import { LASER_TARIFF_DATA } from '@/lib/clinicData';
import { ClinicPosterBadge } from './ClinicPosterBadge';
import { PosterFooter } from './PosterFooter';
import { Calendar } from 'lucide-react';

interface LaserPosterProps {
  onOpenBooking: (treatmentName?: string) => void;
}

export const LaserPoster: React.FC<LaserPosterProps> = ({ onOpenBooking }) => {
  const leftGroups = LASER_TARIFF_DATA.filter((g) => g.column === 'left');
  const rightGroups = LASER_TARIFF_DATA.filter((g) => g.column === 'right');

  return (
    <div
      id="laser-poster"
      className="relative w-full max-w-5xl mx-auto rounded-3xl p-5 sm:p-10 lg:p-12 shadow-xl border border-pink-300/80 overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #FDECEF 0%, #FFF5F7 35%, #FDE4EB 70%, #FAD7DF 100%)',
      }}
    >
      {/* Decorative ambient background accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header with Title and Badge + Signature */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 sm:mb-10 text-center lg:text-left">
        {/* Poster Main Title */}
        <div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-tight">
            Tarification
          </h2>
          <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-2 mt-1">
            <span className="font-serif italic text-2xl sm:text-3xl text-[#C73859]">
              épilation laser
            </span>
            <span className="font-serif font-bold text-2xl sm:text-3xl text-[#C73859] tracking-wider uppercase">
              DIODE 2025
            </span>
          </div>
        </div>

        {/* Brand Badge & Caduceus Signature */}
        <div className="shrink-0">
          <ClinicPosterBadge />
        </div>
      </div>

      {/* 2. Two-Column Layout for Desktop & Stacked Cards for Mobile */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        
        {/* Left Column (VISAGE & BRAS) */}
        <div className="flex flex-col gap-6">
          {leftGroups.map((group) => (
            <div
              key={group.id}
              id={`table-${group.id}`}
              className="rounded-2xl sm:rounded-3xl border border-stone-800 bg-[#FFF5F7]/95 backdrop-blur-xs shadow-xs overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-b border-stone-800 px-4 py-2.5 flex items-center justify-between">
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#E58C9D]/20 text-[#8E2842] font-serif font-bold text-xs sm:text-sm tracking-widest uppercase border border-[#C73859]/30">
                  {group.title}
                </span>
                <span className="text-[11px] font-serif italic text-stone-600 hidden sm:inline">
                  1 séance vs 3 séances
                </span>
              </div>

              {/* Desktop Table Header Row (Hidden on mobile) */}
              <div className="hidden sm:grid grid-cols-12 items-center bg-pink-50/60 border-b border-stone-700/20 px-4 py-2 text-xs font-serif italic text-stone-700 font-medium">
                <div className="col-span-6">Zone</div>
                <div className="col-span-3 text-center">1 séance</div>
                <div className="col-span-3 text-center">3 séances</div>
              </div>

              {/* Rows List */}
              <div className="divide-y divide-stone-700/20 font-serif">
                {group.items.map((row, idx) => (
                  <div
                    key={idx}
                    className="hover:bg-rose-50/80 transition-colors"
                  >
                    {/* Desktop View (Table row) */}
                    <div
                      onClick={() => onOpenBooking(`Épilation Laser ${row.zone}`)}
                      className="hidden sm:grid grid-cols-12 items-center px-4 py-2.5 cursor-pointer group"
                      title={`Réserver pour l'épilation ${row.zone}`}
                    >
                      <div className="col-span-6 pr-2">
                        <span className="text-xs sm:text-sm font-semibold tracking-tight text-stone-900 group-hover:text-[#C73859] transition-colors">
                          {row.zone}
                        </span>
                      </div>
                      <div className="col-span-3 text-center border-l border-stone-700/20 px-1">
                        <span className="text-xs sm:text-sm font-bold text-stone-900">
                          {row.singleSessionDZD.toLocaleString('fr-DZ')} DA
                        </span>
                      </div>
                      <div className="col-span-3 text-center border-l border-stone-700/20 px-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-[#8E2842]">
                            {row.pack3DZD.toLocaleString('fr-DZ')} DA
                          </span>
                          <span className="text-[11px] font-medium text-[#C73859] line-through">
                            {row.oldPrice3DZD.toLocaleString('fr-DZ')} DA
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Stacked Card View */}
                    <div className="sm:hidden p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-stone-900 tracking-tight">
                          {row.zone}
                        </span>
                        <button
                          onClick={() => onOpenBooking(`Épilation Laser ${row.zone}`)}
                          className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#C73859] to-[#9E2A50] text-white text-[11px] font-serif font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <Calendar className="w-3 h-3 text-pink-200" />
                          <span>Rendez-vous</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-xl bg-white border border-pink-100 flex flex-col">
                          <span className="text-[10px] text-stone-500 font-serif italic">1 séance</span>
                          <span className="text-xs font-bold text-stone-900">
                            {row.singleSessionDZD.toLocaleString('fr-DZ')} DA
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-pink-50/80 border border-pink-200 flex flex-col">
                          <span className="text-[10px] text-[#9E2A50] font-serif italic">3 séances</span>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-[#8E2842]">
                              {row.pack3DZD.toLocaleString('fr-DZ')} DA
                            </span>
                            <span className="text-[10px] font-medium text-[#C73859] line-through">
                              {row.oldPrice3DZD.toLocaleString('fr-DZ')} DA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (CORPS & JAMBES) */}
        <div className="flex flex-col gap-6">
          {rightGroups.map((group) => (
            <div
              key={group.id}
              id={`table-${group.id}`}
              className="rounded-2xl sm:rounded-3xl border border-stone-800 bg-[#FFF5F7]/95 backdrop-blur-xs shadow-xs overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-b border-stone-800 px-4 py-2.5 flex items-center justify-between">
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#E58C9D]/20 text-[#8E2842] font-serif font-bold text-xs sm:text-sm tracking-widest uppercase border border-[#C73859]/30">
                  {group.title}
                </span>
                <span className="text-[11px] font-serif italic text-stone-600 hidden sm:inline">
                  1 séance vs 3 séances
                </span>
              </div>

              {/* Desktop Table Header Row (Hidden on mobile) */}
              <div className="hidden sm:grid grid-cols-12 items-center bg-pink-50/60 border-b border-stone-700/20 px-4 py-2 text-xs font-serif italic text-stone-700 font-medium">
                <div className="col-span-6">Zone</div>
                <div className="col-span-3 text-center">1 séance</div>
                <div className="col-span-3 text-center">3 séances</div>
              </div>

              {/* Rows List */}
              <div className="divide-y divide-stone-700/20 font-serif">
                {group.items.map((row, idx) => (
                  <div
                    key={idx}
                    className="hover:bg-rose-50/80 transition-colors"
                  >
                    {/* Desktop View (Table row) */}
                    <div
                      onClick={() => onOpenBooking(`Épilation Laser ${row.zone}`)}
                      className="hidden sm:grid grid-cols-12 items-center px-4 py-2.5 cursor-pointer group"
                      title={`Réserver pour l'épilation ${row.zone}`}
                    >
                      <div className="col-span-6 pr-2">
                        <span className="text-xs sm:text-sm font-semibold tracking-tight text-stone-900 group-hover:text-[#C73859] transition-colors">
                          {row.zone}
                        </span>
                      </div>
                      <div className="col-span-3 text-center border-l border-stone-700/20 px-1">
                        <span className="text-xs sm:text-sm font-bold text-stone-900">
                          {row.singleSessionDZD.toLocaleString('fr-DZ')} DA
                        </span>
                      </div>
                      <div className="col-span-3 text-center border-l border-stone-700/20 px-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-[#8E2842]">
                            {row.pack3DZD.toLocaleString('fr-DZ')} DA
                          </span>
                          <span className="text-[11px] font-medium text-[#C73859] line-through">
                            {row.oldPrice3DZD.toLocaleString('fr-DZ')} DA
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Stacked Card View */}
                    <div className="sm:hidden p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-stone-900 tracking-tight">
                          {row.zone}
                        </span>
                        <button
                          onClick={() => onOpenBooking(`Épilation Laser ${row.zone}`)}
                          className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#C73859] to-[#9E2A50] text-white text-[11px] font-serif font-semibold flex items-center gap-1 shadow-2xs"
                        >
                          <Calendar className="w-3 h-3 text-pink-200" />
                          <span>Rendez-vous</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-xl bg-white border border-pink-100 flex flex-col">
                          <span className="text-[10px] text-stone-500 font-serif italic">1 séance</span>
                          <span className="text-xs font-bold text-stone-900">
                            {row.singleSessionDZD.toLocaleString('fr-DZ')} DA
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-pink-50/80 border border-pink-200 flex flex-col">
                          <span className="text-[10px] text-[#9E2A50] font-serif italic">3 séances</span>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-[#8E2842]">
                              {row.pack3DZD.toLocaleString('fr-DZ')} DA
                            </span>
                            <span className="text-[10px] font-medium text-[#C73859] line-through">
                              {row.oldPrice3DZD.toLocaleString('fr-DZ')} DA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
