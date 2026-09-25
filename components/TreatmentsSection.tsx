'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Syringe,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Clock,
  Heart,
  HelpCircle,
  X,
  RotateCcw
} from 'lucide-react';
import { Treatment, INJECTABLES_TARIFF_DATA, LASER_TARIFF_DATA, PRICING_CATEGORIES } from '@/lib/clinicData';
import { ClinicPosterBadge } from './pricing/ClinicPosterBadge';
import { AppointmentCtaSection } from './AppointmentCtaSection';
import laserImg from '@/src/assets/images/regenerated_image_1788824049965.jpg';
import botoxImg from '@/src/assets/images/regenerated_image_1788824051653.jpg';
import fillersImg from '@/src/assets/images/regenerated_image_1788821569480.jpg';
import hydrafacialImg from '@/src/assets/images/regenerated_image_1788821571843.jpg';

interface BestSellerCardData {
  id: string;
  category: string;
  title: string;
  description: string;
  priceLabel: string;
  priceDZD: number;
  image: string;
  bookingTreatmentName: string;
}

interface TarificationSectionProps {
  treatments?: Treatment[];
  onSelectTreatment?: (treatment: Treatment) => void;
  onBookTreatment: (treatmentNameOrId: string) => void;
}

type MainCategoryKey = 'all' | 'laser' | 'injections' | 'skincare';

// Helper to highlight matching text in real-time
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim()) return <>{text}</>;
  
  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[#FFE2E8] text-[#9E2A50] font-bold px-1 py-0.5 rounded-sm border border-pink-300"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export const TarificationSection: React.FC<TarificationSectionProps> = ({
  onBookTreatment,
}) => {
  // 1. The 4 Best-Seller Treatments Spotlight
  const bestSellers: BestSellerCardData[] = [
    {
      id: 'best-seller-laser',
      category: 'Épilation Laser',
      title: 'Épilation Laser Médicale',
      description: 'Technologie laser diode triple onde pour une peau durablement nette et sans repousse.',
      priceLabel: 'À partir de',
      priceDZD: 4500,
      image: typeof laserImg === 'string' ? laserImg : laserImg.src,
      bookingTreatmentName: 'Épilation Laser Médicale',
    },
    {
      id: 'best-seller-botox',
      category: 'Injections',
      title: 'Botox Médical',
      description: 'Lissage précis des rides d’expression du haut du visage pour un résultat frais et naturel.',
      priceLabel: 'À partir de',
      priceDZD: 15000,
      image: typeof botoxImg === 'string' ? botoxImg : botoxImg.src,
      bookingTreatmentName: 'Injections de Botox',
    },
    {
      id: 'best-seller-filler',
      category: 'Injections',
      title: 'Filler Lèvres (Russian Lips)',
      description: 'Sublimation et hydratation sur-mesure des lèvres par acide hyaluronique haute pureté.',
      priceLabel: 'À partir de',
      priceDZD: 28000,
      image: typeof fillersImg === 'string' ? fillersImg : fillersImg.src,
      bookingTreatmentName: 'Filler Lèvres (Acide Hyaluronique)',
    },
    {
      id: 'best-seller-hydrafacial',
      category: 'Skin Care',
      title: 'Hydrafacial MD Médical',
      description: 'Nettoyage en profondeur, extraction vortex et infusion d’antioxydants pour un éclat immédiat.',
      priceLabel: 'À partir de',
      priceDZD: 6000,
      image: typeof hydrafacialImg === 'string' ? hydrafacialImg : hydrafacialImg.src,
      bookingTreatmentName: 'Hydrafacial Médical',
    },
  ];

  // Quick suggestions for fast search exploration
  const quickSearchTags = [
    'Botox',
    'Hydrafacial',
    'Russian Lips',
    'PRP',
    'Aisselles',
    'Jambes complètes',
    'Profhilo',
    'Peeling',
    'Corps complet',
  ];

  // 2. State for category filter & search & collapsible sections
  const [selectedFilter, setSelectedFilter] = useState<MainCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Collapsed / Expanded state per main category
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    laser: true,
    injections: true,
    skincare: true,
  });

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length > 0) {
      setOpenSections({ laser: true, injections: true, skincare: true });
    }
  };

  const handleSelectTag = (tag: string) => {
    setSearchQuery(tag);
    setOpenSections({ laser: true, injections: true, skincare: true });
  };

  const handleResetSearch = () => {
    setSearchQuery('');
  };

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const expandAll = () => {
    setOpenSections({ laser: true, injections: true, skincare: true });
  };

  const collapseAll = () => {
    setOpenSections({ laser: false, injections: false, skincare: false });
  };

  // 3. Raw Data Grouping
  const laserGroups = LASER_TARIFF_DATA; // Visage, Bras, Corps, Jambes
  const injectablesCategories = INJECTABLES_TARIFF_DATA; // SOINS VISAGE, PRP, PEELING, SKINBOOSTER, BOTOX, FILLER, LIPBOOSTER

  // Split injectables data into Injections vs Skin Care
  const pureInjections = useMemo(() => {
    return injectablesCategories.filter((cat) =>
      ['skinbooster', 'botox', 'filler', 'lipbooster'].includes(cat.id.toLowerCase())
    );
  }, [injectablesCategories]);

  const skinCareTreatments = useMemo(() => {
    return injectablesCategories.filter((cat) =>
      ['soins-visage', 'prp', 'peeling'].includes(cat.id.toLowerCase())
    );
  }, [injectablesCategories]);

  // Filtered lists based on search in real-time
  const q = searchQuery.trim().toLowerCase();

  const filteredLaserGroups = useMemo(() => {
    if (!q) return laserGroups;
    return laserGroups
      .map((grp) => {
        const matchingItems = grp.items.filter(
          (item) =>
            item.zone.toLowerCase().includes(q) ||
            grp.title.toLowerCase().includes(q) ||
            item.singleSessionDZD.toString().includes(q) ||
            item.pack3DZD.toString().includes(q)
        );
        return { ...grp, items: matchingItems };
      })
      .filter((grp) => grp.items.length > 0);
  }, [laserGroups, q]);

  const filteredInjections = useMemo(() => {
    if (!q) return pureInjections;
    return pureInjections
      .map((cat) => {
        const matchingItems = cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            cat.title.toLowerCase().includes(q) ||
            item.priceDZD.toString().includes(q)
        );
        return { ...cat, items: matchingItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [pureInjections, q]);

  const filteredSkinCare = useMemo(() => {
    if (!q) return skinCareTreatments;
    return skinCareTreatments
      .map((cat) => {
        const matchingItems = cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            cat.title.toLowerCase().includes(q) ||
            item.priceDZD.toString().includes(q)
        );
        return { ...cat, items: matchingItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [skinCareTreatments, q]);

  // Real-time Counts
  const laserMatchCount = filteredLaserGroups.reduce((acc, g) => acc + g.items.length, 0);
  const injectionsMatchCount = filteredInjections.reduce((acc, c) => acc + c.items.length, 0);
  const skinCareMatchCount = filteredSkinCare.reduce((acc, c) => acc + c.items.length, 0);
  const totalMatchesCount = laserMatchCount + injectionsMatchCount + skinCareMatchCount;

  const laserTotalCount = laserGroups.reduce((acc, g) => acc + g.items.length, 0);
  const injectionsTotalCount = pureInjections.reduce((acc, c) => acc + c.items.length, 0);
  const skinCareTotalCount = skinCareTreatments.reduce((acc, c) => acc + c.items.length, 0);

  const showLaser = (selectedFilter === 'all' || selectedFilter === 'laser') && (filteredLaserGroups.length > 0 || !q);
  const showInjections = (selectedFilter === 'all' || selectedFilter === 'injections') && (filteredInjections.length > 0 || !q);
  const showSkinCare = (selectedFilter === 'all' || selectedFilter === 'skincare') && (filteredSkinCare.length > 0 || !q);

  const isFilteredEmpty = q.length > 0 && totalMatchesCount === 0;

  return (
    <section
      id="tarification"
      className="py-20 sm:py-28 relative overflow-hidden transition-colors duration-500"
      style={{
        background: 'linear-gradient(180deg, #FAF8F5 0%, #FFF5F7 20%, #FDF0F3 50%, #FAF5F7 80%, #FAF8F5 100%)',
      }}
    >
      {/* Target anchors for backward compatibility */}
      <span id="treatments" className="absolute -top-24 pointer-events-none" />
      <span id="pricing" className="absolute -top-24 pointer-events-none" />

      {/* Soft Ambient Accents */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-pink-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[500px] bg-pink-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. SECTION HEADER                                                         */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          
          <div className="flex justify-center mb-2">
            <ClinicPosterBadge />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-pink-200/90 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C73859]" />
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#9E2A50]">
              Tarification Médicale Officielle
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            Tarifs & Forfaits Médicaux
          </h2>

          <p className="text-[#9E2A50] font-serif italic text-xl sm:text-2xl font-medium">
            Découvrez nos soins classés par catégorie
          </p>

          <p className="text-stone-600 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Consultez notre grille tarifaire officielle en Dinars Algériens (DZD). Tous les actes médicaux sont pratiqués avec du matériel stérile certifié et sous la responsabilité directe de Dr. Ghaouat Sarra.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. 4 BEST-SELLER SPOTLIGHT CARDS                                          */}
        {/* ========================================================================= */}
        {!q && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 items-stretch mb-14 sm:mb-18">
            {bestSellers.map((card, index) => (
              <motion.div
                key={card.id}
                id={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group rounded-3xl bg-white/95 backdrop-blur-xs border border-pink-200/80 p-5 sm:p-6 shadow-xs gh-card-hover flex flex-col justify-between space-y-5 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFBFD 70%, #FDF2F5 100%)',
                }}
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-200 via-[#D8436B] to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-pink-50 shadow-2xs gh-img-sheen">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-50 transition-opacity" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#9E2A50] text-[11px] font-serif font-bold uppercase tracking-wider shadow-2xs border border-pink-200 group-hover:border-pink-300 group-hover:bg-white transition-all">
                        {card.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#C73859] to-[#9E2A50] text-white text-[10px] font-serif font-bold uppercase tracking-wider shadow-xs group-hover:scale-105 transition-transform">
                        <Sparkles className="w-2.5 h-2.5 text-pink-200" />
                        <span>BEST-SELLER</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-[#9E2A50] transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm font-light mt-2 line-clamp-3 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-pink-100/90 space-y-3.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-500 font-serif italic">
                      {card.priceLabel ? card.priceLabel : 'Tarif'}
                    </span>
                    <span className="font-serif font-bold text-2xl text-[#8E2842] tracking-tight group-hover:scale-105 transition-transform duration-300">
                      {card.priceDZD.toLocaleString('fr-DZ')} DA
                    </span>
                  </div>

                  <button
                    onClick={() => onBookTreatment(card.bookingTreatmentName)}
                    className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#C73859] via-[#D8436B] to-[#9E2A50] hover:brightness-105 text-white text-xs font-serif font-bold tracking-wider uppercase shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-98"
                    id={`btn-book-${card.id}`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-pink-200" />
                    <span>Prendre rendez-vous</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. PROMINENT REAL-TIME SEARCH BAR & INTERACTIVE FILTERS                   */}
        {/* ========================================================================= */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-pink-200/90 p-5 sm:p-7 shadow-lg shadow-pink-900/5 mb-10 space-y-5">
          
          {/* Main Real-Time Search Bar Input */}
          <div className="relative">
            <div className="relative flex items-center">
              <div className="absolute left-4.5 flex items-center pointer-events-none">
                <Search className={`w-5 h-5 transition-colors duration-200 ${q ? 'text-[#C73859]' : 'text-stone-400'}`} />
              </div>
              
              <input
                id="treatment-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Rechercher un soin en temps réel (ex: Botox, Hydrafacial, Aisselles, Lèvres, PRP, Peeling...)"
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl bg-[#FAF8F5] border-2 border-pink-200/90 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#C73859] focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all font-serif"
              />

              {/* Action Buttons inside Search Bar */}
              <div className="absolute right-3 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    onClick={handleResetSearch}
                    className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-stone-600 hover:text-stone-900 transition-colors"
                    title="Effacer la recherche"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-sans font-medium text-stone-400 bg-stone-100 rounded-lg border border-stone-200">
                    Recherche en direct
                  </span>
                )}
              </div>
            </div>

            {/* Live Search Status Bar */}
            {q && (
              <div className="mt-2.5 flex items-center justify-between text-xs text-stone-600 px-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-serif">
                    <strong>{totalMatchesCount}</strong> {totalMatchesCount > 1 ? 'soins trouvés' : 'soin trouvé'} pour « <span className="text-[#C73859] font-semibold">{q}</span> »
                  </span>
                </div>
                <button
                  onClick={handleResetSearch}
                  className="text-xs text-[#C73859] hover:underline font-serif font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Filter Suggested Search Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-serif font-medium text-stone-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C73859]" />
              Suggestions rapides :
            </span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSelectTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-serif transition-all duration-200 ${
                  q.toLowerCase() === tag.toLowerCase()
                    ? 'bg-[#C73859] text-white font-bold shadow-xs'
                    : 'bg-[#FAF8F5] hover:bg-pink-100 text-stone-700 border border-pink-200/80 hover:border-pink-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Category Filter Tabs & Collapsible Controls Row */}
          <div className="pt-3 border-t border-pink-100 flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  selectedFilter === 'all'
                    ? 'bg-gradient-to-r from-[#C73859] via-[#D8436B] to-[#9E2A50] text-white shadow-md shadow-pink-900/10'
                    : 'bg-[#FAF8F5] text-stone-700 hover:bg-pink-100/60 border border-pink-200/60'
                }`}
              >
                <span>Tous les Soins</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full">
                  {q ? totalMatchesCount : laserTotalCount + injectionsTotalCount + skinCareTotalCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedFilter('laser')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  selectedFilter === 'laser'
                    ? 'bg-gradient-to-r from-[#C73859] via-[#D8436B] to-[#9E2A50] text-white shadow-md shadow-pink-900/10'
                    : 'bg-[#FAF8F5] text-stone-700 hover:bg-pink-100/60 border border-pink-200/60'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Laser</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full">
                  {q ? laserMatchCount : laserTotalCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedFilter('injections')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  selectedFilter === 'injections'
                    ? 'bg-gradient-to-r from-[#C73859] via-[#D8436B] to-[#9E2A50] text-white shadow-md shadow-pink-900/10'
                    : 'bg-[#FAF8F5] text-stone-700 hover:bg-pink-100/60 border border-pink-200/60'
                }`}
              >
                <Syringe className="w-3.5 h-3.5 text-[#C73859]" />
                <span>Injections</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full">
                  {q ? injectionsMatchCount : injectionsTotalCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedFilter('skincare')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-serif font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                  selectedFilter === 'skincare'
                    ? 'bg-gradient-to-r from-[#C73859] via-[#D8436B] to-[#9E2A50] text-white shadow-md shadow-pink-900/10'
                    : 'bg-[#FAF8F5] text-stone-700 hover:bg-pink-100/60 border border-pink-200/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C73859]" />
                <span>Skin Care</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full">
                  {q ? skinCareMatchCount : skinCareTotalCount}
                </span>
              </button>
            </div>

            {/* Expand / Collapse All Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 text-xs font-serif font-medium text-stone-700 hover:text-[#C73859] bg-[#FAF8F5] hover:bg-pink-50 border border-pink-200 rounded-lg transition-colors flex items-center gap-1"
                title="Déplier toutes les catégories"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Tout déplier</span>
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 text-xs font-serif font-medium text-stone-700 hover:text-[#C73859] bg-[#FAF8F5] hover:bg-pink-50 border border-pink-200 rounded-lg transition-colors flex items-center gap-1"
                title="Replier toutes les catégories"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Tout replier</span>
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* EMPTY SEARCH STATE                                                        */}
        {/* ========================================================================= */}
        {isFilteredEmpty && (
          <div className="bg-white rounded-3xl border border-pink-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-4 mb-10">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-[#C73859] flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-stone-900">
              Aucun soin trouvé pour « {searchQuery} »
            </h3>
            <p className="text-stone-600 text-sm font-light">
              Essayez de rechercher par mot-clé général (ex: <em>Botox, Laser, Hydrafacial, Lèvres, Visage, Corps</em>) ou parcourez nos catégories ci-dessus.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetSearch}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C73859] to-[#9E2A50] text-white text-xs font-serif font-bold uppercase tracking-wider shadow-sm hover:scale-105 transition-all"
              >
                Afficher tous les soins
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. THREE COLLAPSIBLE CATEGORIES: LASER, INJECTIONS, SKIN CARE            */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          
          {/* --------------------------------------------------------------------- */}
          {/* CATEGORY 1: LASER (ÉPILATION LASER MÉDICALE DIODE 2025)               */}
          {/* --------------------------------------------------------------------- */}
          {showLaser && (
            <div
              id="category-laser"
              className="rounded-3xl border border-pink-300/80 bg-white/95 backdrop-blur-xs shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Collapsible Header */}
              <button
                onClick={() => toggleSection('laser')}
                className="w-full p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4 text-left bg-gradient-to-r from-[#FDECEF] via-[#FFF5F7] to-[#FDE4EB] hover:from-[#fce0e5] transition-colors border-b border-pink-200/80"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C73859] to-[#9E2A50] text-white flex items-center justify-center shadow-md shrink-0">
                    <Zap className="w-6 h-6 text-pink-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-[#9E2A50] uppercase tracking-widest">
                        Catégorie Médicale
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#C73859]/15 text-[#8E2842] text-[10px] font-bold">
                        {q ? `${laserMatchCount} résultat${laserMatchCount > 1 ? 's' : ''}` : `${laserTotalCount} zones`}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-stone-900 tracking-tight mt-0.5">
                      Épilation Laser Diode 2025
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-0.5">
                      Visage, Bras, Corps complet & Jambes — Forfaits 1 séance & 3 séances
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-xs font-serif font-medium text-[#9E2A50]">
                    {openSections.laser ? 'Replier la catégorie' : 'Déplier la grille tarifaire'}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center text-[#9E2A50] shadow-xs">
                    {openSections.laser ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {openSections.laser && (
                  <motion.div
                    key="laser-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <div className="p-5 sm:p-8 lg:p-10 bg-[#FFF5F7]/40">
                      {filteredLaserGroups.length === 0 ? (
                        <div className="text-center py-8 text-stone-500 text-sm font-serif">
                          Aucune zone laser ne correspond à votre recherche.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
                          {filteredLaserGroups.map((group) => (
                            <div
                              key={group.id}
                              id={`laser-group-${group.id}`}
                              className="rounded-2xl sm:rounded-3xl border border-pink-200/90 bg-white shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                              <div className="bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-b border-pink-200 px-4 py-3 flex items-center justify-between">
                                <span className="inline-block px-3 py-1 rounded-full bg-[#E58C9D]/20 text-[#8E2842] font-serif font-bold text-xs sm:text-sm tracking-widest uppercase border border-[#C73859]/30">
                                  <HighlightedText text={group.title} query={q} />
                                </span>
                                <span className="text-[11px] font-serif italic text-stone-600 hidden sm:inline">
                                  1 séance vs 3 séances
                                </span>
                              </div>

                              <div className="hidden sm:grid grid-cols-12 items-center bg-pink-50/50 border-b border-pink-100 px-4 py-2 text-xs font-serif italic text-stone-700 font-medium">
                                <div className="col-span-6">Zone traitée</div>
                                <div className="col-span-3 text-center">1 séance</div>
                                <div className="col-span-3 text-center">Pack 3 séances</div>
                              </div>

                              <div className="divide-y divide-pink-100/70 font-serif">
                                {group.items.map((row, idx) => (
                                  <div
                                    key={idx}
                                    className="hover:bg-rose-50/70 transition-colors"
                                  >
                                    <div
                                      onClick={() => onBookTreatment(`Épilation Laser ${row.zone}`)}
                                      className="hidden sm:grid grid-cols-12 items-center px-4 py-3 cursor-pointer group"
                                      title={`Réserver pour : Épilation Laser ${row.zone}`}
                                    >
                                      <div className="col-span-6 pr-2">
                                        <span className="text-xs sm:text-sm font-semibold tracking-tight text-stone-900 group-hover:text-[#C73859] transition-colors">
                                          <HighlightedText text={row.zone} query={q} />
                                        </span>
                                      </div>
                                      <div className="col-span-3 text-center border-l border-pink-100 px-1">
                                        <span className="text-xs sm:text-sm font-bold text-stone-900">
                                          {row.singleSessionDZD.toLocaleString('fr-DZ')} DA
                                        </span>
                                      </div>
                                      <div className="col-span-3 text-center border-l border-pink-100 px-1">
                                        <div className="flex items-center justify-center gap-1.5">
                                          <span className="text-xs sm:text-sm font-bold text-[#8E2842]">
                                            {row.pack3DZD.toLocaleString('fr-DZ')} DA
                                          </span>
                                          {row.oldPrice3DZD > row.pack3DZD && (
                                            <span className="text-[11px] font-medium text-[#C73859] line-through">
                                              {row.oldPrice3DZD.toLocaleString('fr-DZ')} DA
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Mobile Stacked View */}
                                    <div className="sm:hidden p-4 space-y-2.5">
                                      <div className="flex items-center justify-between">
                                        <span className="font-serif font-bold text-sm text-stone-900 tracking-tight">
                                          <HighlightedText text={row.zone} query={q} />
                                        </span>
                                        <button
                                          onClick={() => onBookTreatment(`Épilation Laser ${row.zone}`)}
                                          className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#C73859] to-[#9E2A50] text-white text-[11px] font-serif font-semibold flex items-center gap-1 shadow-2xs"
                                        >
                                          <Calendar className="w-3 h-3 text-pink-200" />
                                          <span>RDV</span>
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
                                          <span className="text-[10px] text-[#9E2A50] font-serif italic">Pack 3 séances</span>
                                          <div className="flex items-baseline gap-1.5 flex-wrap">
                                            <span className="text-xs font-bold text-[#8E2842]">
                                              {row.pack3DZD.toLocaleString('fr-DZ')} DA
                                            </span>
                                            {row.oldPrice3DZD > row.pack3DZD && (
                                              <span className="text-[10px] font-medium text-[#C73859] line-through">
                                                {row.oldPrice3DZD.toLocaleString('fr-DZ')} DA
                                              </span>
                                            )}
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
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* CATEGORY 2: INJECTIONS (BOTOX, ACIDE HYALURONIQUE, FILLERS, BOOSTER) */}
          {/* --------------------------------------------------------------------- */}
          {showInjections && (
            <div
              id="category-injections"
              className="rounded-3xl border border-pink-300/80 bg-white/95 backdrop-blur-xs shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Collapsible Header */}
              <button
                onClick={() => toggleSection('injections')}
                className="w-full p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4 text-left bg-gradient-to-r from-[#FDECEF] via-[#FFF5F7] to-[#FDE4EB] hover:from-[#fce0e5] transition-colors border-b border-pink-200/80"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C73859] to-[#9E2A50] text-white flex items-center justify-center shadow-md shrink-0">
                    <Syringe className="w-6 h-6 text-pink-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-[#9E2A50] uppercase tracking-widest">
                        Catégorie Médicale
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#C73859]/15 text-[#8E2842] text-[10px] font-bold">
                        {q ? `${injectionsMatchCount} résultat${injectionsMatchCount > 1 ? 's' : ''}` : `${injectionsTotalCount} actes`}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-stone-900 tracking-tight mt-0.5">
                      Injections & Rajeunissement
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-0.5">
                      Botox, Acide Hyaluronique, Fillers Lèvres & Lipbooster — Produits certifiés CE & FDA
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-xs font-serif font-medium text-[#9E2A50]">
                    {openSections.injections ? 'Replier la catégorie' : 'Déplier la grille tarifaire'}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center text-[#9E2A50] shadow-xs">
                    {openSections.injections ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {openSections.injections && (
                  <motion.div
                    key="injections-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <div className="p-5 sm:p-8 lg:p-10 bg-[#FFF5F7]/40">
                      {filteredInjections.length === 0 ? (
                        <div className="text-center py-8 text-stone-500 text-sm font-serif">
                          Aucun soin d’injection ne correspond à votre recherche.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
                          {filteredInjections.map((category) => (
                            <div
                              key={category.id}
                              id={`inject-card-${category.id}`}
                              className="group rounded-2xl sm:rounded-3xl border border-pink-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
                            >
                              <div className="mb-4 pb-2 border-b border-pink-100 flex items-center justify-between">
                                <span className="font-serif font-bold text-base sm:text-lg tracking-widest text-[#C73859] uppercase inline-block">
                                  <HighlightedText text={category.title} query={q} />
                                </span>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-[#9E2A50] bg-pink-50 px-2 py-0.5 rounded-full">
                                  Acte Médical
                                </span>
                              </div>

                              <ul className="space-y-3 font-serif">
                                {category.items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    onClick={() => onBookTreatment(item.name)}
                                    className="flex items-baseline justify-between gap-2 text-stone-900 group/item cursor-pointer hover:text-[#C73859] transition-colors py-1.5 rounded-lg px-2 -mx-2 hover:bg-rose-50/60"
                                    title={`Réserver pour : ${item.name}`}
                                  >
                                    <div className="flex items-baseline gap-2 min-w-0 pr-2">
                                      <span className="text-[#C73859] font-bold text-sm shrink-0">•</span>
                                      <span className="text-sm sm:text-base font-normal tracking-tight truncate group-hover/item:font-medium">
                                        <HighlightedText text={item.name} query={q} />
                                      </span>
                                    </div>

                                    <span className="flex-1 border-b border-dotted border-stone-300 mx-1 hidden sm:block relative -top-1" />

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
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* CATEGORY 3: SKIN CARE (HYDRAFACIAL, PEELINGS, PRP, BIOSTIMULATION)    */}
          {/* --------------------------------------------------------------------- */}
          {showSkinCare && (
            <div
              id="category-skincare"
              className="rounded-3xl border border-pink-300/80 bg-white/95 backdrop-blur-xs shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Collapsible Header */}
              <button
                onClick={() => toggleSection('skincare')}
                className="w-full p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4 text-left bg-gradient-to-r from-[#FDECEF] via-[#FFF5F7] to-[#FDE4EB] hover:from-[#fce0e5] transition-colors border-b border-pink-200/80"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C73859] to-[#9E2A50] text-white flex items-center justify-center shadow-md shrink-0">
                    <Sparkles className="w-6 h-6 text-pink-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-[#9E2A50] uppercase tracking-widest">
                        Catégorie Médicale
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#C73859]/15 text-[#8E2842] text-[10px] font-bold">
                        {q ? `${skinCareMatchCount} résultat${skinCareMatchCount > 1 ? 's' : ''}` : `${skinCareTotalCount} protocoles`}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-stone-900 tracking-tight mt-0.5">
                      Skin Care & Biostimulation
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-0.5">
                      Hydrafacial MD, Peelings dermatologiques, PRP Vampire Facial & Régénération
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-block text-xs font-serif font-medium text-[#9E2A50]">
                    {openSections.skincare ? 'Replier la catégorie' : 'Déplier la grille tarifaire'}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center text-[#9E2A50] shadow-xs">
                    {openSections.skincare ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {openSections.skincare && (
                  <motion.div
                    key="skincare-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <div className="p-5 sm:p-8 lg:p-10 bg-[#FFF5F7]/40">
                      {filteredSkinCare.length === 0 ? (
                        <div className="text-center py-8 text-stone-500 text-sm font-serif">
                          Aucun soin visage ou biostimulation ne correspond à votre recherche.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
                          {filteredSkinCare.map((category) => (
                            <div
                              key={category.id}
                              id={`skincare-card-${category.id}`}
                              className="group rounded-2xl sm:rounded-3xl border border-pink-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
                            >
                              <div className="mb-4 pb-2 border-b border-pink-100 flex items-center justify-between">
                                <span className="font-serif font-bold text-base sm:text-lg tracking-widest text-[#C73859] uppercase inline-block">
                                  <HighlightedText text={category.title} query={q} />
                                </span>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-[#9E2A50] bg-pink-50 px-2 py-0.5 rounded-full">
                                  Soin Spécialisé
                                </span>
                              </div>

                              <ul className="space-y-3 font-serif">
                                {category.items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    onClick={() => onBookTreatment(item.name)}
                                    className="flex items-baseline justify-between gap-2 text-stone-900 group/item cursor-pointer hover:text-[#C73859] transition-colors py-1.5 rounded-lg px-2 -mx-2 hover:bg-rose-50/60"
                                    title={`Réserver pour : ${item.name}`}
                                  >
                                    <div className="flex items-baseline gap-2 min-w-0 pr-2">
                                      <span className="text-[#C73859] font-bold text-sm shrink-0">•</span>
                                      <span className="text-sm sm:text-base font-normal tracking-tight truncate group-hover/item:font-medium">
                                        <HighlightedText text={item.name} query={q} />
                                      </span>
                                    </div>

                                    <span className="flex-1 border-b border-dotted border-stone-300 mx-1 hidden sm:block relative -top-1" />

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
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 5. MEDICAL COMMITMENTS REASSURANCE BAR                                     */}
        {/* ========================================================================= */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-600 text-center font-serif bg-white/80 p-4 rounded-2xl border border-pink-200/80">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C73859]" />
            <span>Consultation médicale diagnostique personnalisée</span>
          </div>
          <span className="hidden sm:inline text-stone-300">•</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C73859]" />
            <span>Produits d’injection stériles certifiés CE & FDA</span>
          </div>
          <span className="hidden sm:inline text-stone-300">•</span>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#C73859]" />
            <span>Devis et explications détaillées avant chaque acte</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. APPOINTMENT CTA AT THE BOTTOM                                          */}
        {/* ========================================================================= */}
        <div className="pt-12 sm:pt-16 border-t border-pink-200/80 mt-12">
          <AppointmentCtaSection
            onOpenBooking={(name) => onBookTreatment(name || 'consultation')}
            phone="0663419994"
            locationText="Hai el salem"
            locationDetails="(à coté de Sonelgaz)"
            doctorName="Dr Ghaouat Sarra"
          />
        </div>

      </div>
    </section>
  );
};

// Backwards compatibility export
export const TreatmentsSection = TarificationSection;
export default TarificationSection;

