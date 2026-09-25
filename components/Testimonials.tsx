'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Testimonial } from '@/lib/clinicData';

interface TestimonialsProps {
  testimonials: Testimonial[];
  onOpenBooking: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials,
  onOpenBooking,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5D4CB] shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6B55]">
              Expériences & Avis Vérifiés
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            La Voix de Nos Patientes
          </h2>

          <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
            La plus belle reconnaissance de notre travail réside dans la confiance et le sourire de nos patientes à Khemis Miliana et à travers toute l’Algérie.
          </p>

          {/* Rating Summary Pill */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-[#E5D4CB] shadow-xs mt-2">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <div className="text-xs font-bold text-stone-900">
              4.9 / 5.0 • <span className="font-normal text-stone-500">Excellence Recommandée</span>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel & Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((t, index) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-white border border-[#E5D4CB]/80 hover:border-[#C5A089] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* 5 Stars and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400">{t.date}</span>
                </div>

                {/* Treatment Pill */}
                <div className="inline-block px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#9E6B55] text-[11px] font-semibold border border-[#E5D4CB]/60">
                  {t.treatment}
                </div>

                {/* Comment Body */}
                <p className="text-xs sm:text-sm text-stone-700 font-light leading-relaxed italic">
                  « {t.comment} »
                </p>
              </div>

              {/* Patient Author Info */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>{t.patientName}</span>
                    {t.verified && (
                      <span title="Patiente Vérifiée">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-400">{t.city}</div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#9E6B55] flex items-center justify-center font-serif font-bold text-xs border border-[#E5D4CB]">
                  {t.patientName[0]}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Direct Appointment CTA Box */}
        <div className="text-center pt-4">
          <button
            onClick={onOpenBooking}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] hover:from-[#d6ad8d] hover:to-[#8c5943] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Rejoindre nos patientes comblées — Prendre RDV</span>
          </button>
        </div>

      </div>
    </section>
  );
};
