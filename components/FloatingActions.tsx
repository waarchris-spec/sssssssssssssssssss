'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Sparkles,
  Calendar,
  ChevronUp,
  Phone
} from 'lucide-react';
import { ClinicSettings } from '@/lib/clinicData';

interface FloatingActionsProps {
  settings: ClinicSettings;
  onOpenBooking: () => void;
  onOpenAI: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  settings,
  onOpenBooking,
  onOpenAI,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-stone-700 shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-all pointer-events-auto hover:scale-105"
            aria-label="Retour en haut de page"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        {/* AI Receptionist Floating Trigger */}
        <button
          onClick={onOpenAI}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#1C1917] via-[#292524] to-[#1C1917] text-white shadow-xl hover:shadow-2xl border border-stone-700 hover:scale-105 transition-all pointer-events-auto"
          aria-label="Ouvrir l'assistante IA du cabinet"
        >
          <div className="w-7 h-7 rounded-full bg-[#9E6B55] text-white flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-4 h-4 text-[#DFBA9D]" />
          </div>
          <span className="text-xs font-semibold hidden sm:inline">
            Conseil & Tarifs IA
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border-2 border-white animate-pulse" />
        </button>

        {/* Direct WhatsApp Floating Trigger */}
        <a
          href={`https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent("Bonjour Dr. Ghaouat, je souhaite prendre un rendez-vous à la clinique.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all pointer-events-auto"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="text-xs font-bold hidden sm:inline">WhatsApp Direct</span>
        </a>

      </div>

      {/* Sticky Bottom Booking Bar on Mobile Viewports */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-[#E5D4CB] shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-stone-500 font-medium uppercase">Cabinet Dr. Ghaouat Sarra</div>
          <div className="text-xs font-bold text-[#9E6B55]">Khemis Miliana</div>
        </div>

        <button
          onClick={onOpenBooking}
          className="flex-1 max-w-[200px] py-2.5 px-4 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Prendre RDV</span>
        </button>
      </div>
    </>
  );
};
