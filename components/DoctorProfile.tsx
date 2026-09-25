'use client';

import React from 'react';
import {
  Sparkles,
  Calendar,
  Instagram,
  Facebook,
  ShieldCheck,
  Quote,
  Award,
  GraduationCap,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { ClinicSettings } from '@/lib/clinicData';
import { OfficialLogo } from './OfficialLogo';

interface DoctorProfileProps {
  settings: ClinicSettings;
  onOpenBooking: () => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({
  settings,
  onOpenBooking,
}) => {
  return (
    <section id="doctor" className="py-20 bg-gradient-to-b from-white via-[#FAF8F5] to-white relative overflow-hidden">
      {/* Soft Glow Background Decorations */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#F4DCD6]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Container with Elegant Luxury Framing */}
        <div className="bg-white rounded-3xl border border-[#E5D4CB]/80 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#DFBA9D]/15 via-transparent to-transparent rounded-bl-full pointer-events-none" />

          <div className="space-y-8 relative z-10">
            
            {/* Header / Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5D4CB]/50 pb-6">
              <div className="flex items-center gap-3">
                <OfficialLogo size="sm" />
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF2F0] border border-[#E5D4CB] text-[#9E6B55] text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#C73859]" />
                    <span>Fondatrice & Médecin Traitant</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1C1917] mt-1 tracking-tight">
                    {settings.doctorName}
                  </h2>
                </div>
              </div>

              {/* Verified Practice Badge */}
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#FAF8F5] border border-[#E5D4CB]/70 text-xs text-stone-700">
                <ShieldCheck className="w-4 h-4 text-[#9E6B55]" />
                <span className="font-medium">Pratique certifiée & enregistrée • Khemis Miliana</span>
              </div>
            </div>

            {/* Doctor's Signature Quote */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-[#E5D4CB] shadow-2xs relative">
              <Quote className="w-10 h-10 text-[#E8B4B8]/30 absolute top-4 right-4 pointer-events-none" />
              <p className="font-serif italic text-base sm:text-lg text-stone-800 leading-relaxed max-w-3xl">
                « Mon approche repose sur une conviction intime : la véritable médecine esthétique ne cherche jamais à vous transformer, mais à magnifier votre singularité, réparer les effets du temps et vous redonner pleine confiance en vous, avec douceur et rigueur médicale. »
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-[1.5px] bg-[#9E6B55]" />
                <span className="text-xs font-bold tracking-wider text-[#9E6B55] uppercase">
                  {settings.doctorName} — Médecin Qualifiée
                </span>
              </div>
            </div>

            {/* Bio & Medical Vision Paragraphs */}
            <div className="space-y-4 text-stone-600 font-light text-sm sm:text-base leading-relaxed">
              <p>
                Diplômée et passionnée par l’anatomie faciale et les biotechnologies cutanées, <strong>Dr. Ghaouat Sarra</strong> a fondé son cabinet médico-esthétique à <strong>Khemis Miliana</strong> avec pour vocation d’offrir aux patientes de la région un plateau technique de niveau international, alliant protocoles lasers de pointe et gestes d’injections ultra précis.
              </p>
              <p>
                Chaque patiente bénéficie d&apos;une consultation médicale initiale approfondie, permettant d&apos;établir un diagnostic sur-mesure et d&apos;élaborer un plan de traitement personnalisé, dans le respect absolu de la sécurité, de la stérilité clinique et du naturel des résultats.
              </p>
            </div>

            {/* Core Competencies Matrix */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#9E6B55] mb-3">
                Expertises & Pôles de Soins Médicaux
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5D4CB]/60">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E5D4CB] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#C73859]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 block">Injections & Rajeunissement</span>
                    <span className="text-[11px] text-stone-500 font-light">Botox médical, Acide Hyaluronique, Skinboosters</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5D4CB]/60">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E5D4CB] flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#9E6B55]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 block">Épilation Laser Médicale</span>
                    <span className="text-[11px] text-stone-500 font-light">Laser diode triple onde haute performance</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5D4CB]/60">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E5D4CB] flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-[#9E6B55]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 block">Biostimulation & Régénération</span>
                    <span className="text-[11px] text-stone-500 font-light">PRP autologue, Mésothérapie, Profhilo</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5D4CB]/60">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E5D4CB] flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-4 h-4 text-[#C73859]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-800 block">Soins Cutanés & Éclat</span>
                    <span className="text-[11px] text-stone-500 font-light">Hydrafacial MD, Peelings dermatologiques</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Commitments */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-600 pt-2 border-t border-[#E5D4CB]/40">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#9E6B55]" />
                <span>Normes médicales strictes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#9E6B55]" />
                <span>Produits certifiés CE & traçabilité 100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#9E6B55]" />
                <span>Consultation confidentielle sur rendez-vous</span>
              </div>
            </div>

            {/* Action Buttons & Social Links */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5D4CB]/50">
              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] hover:from-[#d6ad8d] hover:to-[#8c5943] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Prendre RDV avec Dr. Sarra</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-500 font-medium">Réseaux officiels :</span>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-[#E5D4CB] hover:border-[#9E6B55] text-stone-700 hover:text-[#9E6B55] flex items-center justify-center transition-colors shadow-xs"
                  title="Instagram Dr. Ghaouat Sarra"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-[#E5D4CB] hover:border-[#9E6B55] text-stone-700 hover:text-[#9E6B55] flex items-center justify-center transition-colors shadow-xs"
                  title="Facebook Dr. Ghaouat Sarra"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
