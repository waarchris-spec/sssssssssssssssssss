'use client';

import React from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Heart,
  Lock,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const WhyGHClinic: React.FC = () => {
  const pillars = [
    {
      icon: Stethoscope,
      title: 'Expertise Médicale Directe',
      description: 'Chaque examen et chaque acte est réalisé ou supervisé directement par Dr. Ghaouat Sarra, médecin qualifiée en médecine esthétique et lasers.',
    },
    {
      icon: ShieldCheck,
      title: 'Sécurité & Traçabilité 100%',
      description: 'Nous utilisons uniquement des produits certifiés CE Médical et FDA des plus prestigieux laboratoires mondiaux (Juvéderm, Teoxane, Galderma, IBSA).',
    },
    {
      icon: Zap,
      title: 'Technologies de Pointe Indolores',
      description: 'Équipements lasers de dernière génération avec refroidissement cryogénique intégré pour un confort absolu et une efficacité prouvée.',
    },
    {
      icon: Heart,
      title: 'Sublimation Naturelle & Éthique',
      description: 'Pas d’excès ni d’effets figés. Notre philosophie est de préserver votre charme unique et d’obtenir des résultats harmonieux et indétectables.',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-white border-b border-[#E5D4CB]/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E5D4CB] shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#9E6B55]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6B55]">
              Le Standard GH Clinic
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Pourquoi Choisir Notre Cabinet ?
          </h2>

          <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
            La médecine esthétique exige rigueur, sens artistique et sécurité sans compromis. 
            Découvrez les engagements qui font de GH Clinic la référence de confiance à Khemis Miliana.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#E5D4CB]/60 hover:border-[#C5A089] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white text-[#9E6B55] flex items-center justify-center mb-6 shadow-xs border border-[#E5D4CB]/60 group-hover:scale-110 group-hover:bg-[#9E6B55] group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <h3 className="font-serif font-bold text-xl text-stone-900 mb-3 group-hover:text-[#9E6B55] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-stone-200/60 flex items-center gap-1.5 text-xs font-semibold text-[#9E6B55]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Standard Médical Appliqué</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
