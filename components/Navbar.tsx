'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Menu,
  X,
  ShieldCheck,
  Lock,
  ChevronRight,
  Bot
} from 'lucide-react';
import { ClinicSettings } from '@/lib/clinicData';
import navbarLogoImg from '@/src/assets/images/regenerated_image_1790265760584.jpg';
import { OfficialLogo } from './OfficialLogo';

interface NavbarProps {
  settings: ClinicSettings;
  onOpenBooking: (treatmentId?: string) => void;
  onOpenAIReceptionist?: () => void;
  onOpenAI?: () => void;
  onOpenAdmin?: () => void;
  onOpenDashboard?: () => void;
  onOpenPatientDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenBooking,
  onOpenAIReceptionist,
  onOpenAI,
  onOpenAdmin,
  onOpenDashboard,
  onOpenPatientDashboard,
}) => {
  const triggerAI = onOpenAI || onOpenAIReceptionist || (() => {});
  const triggerAdmin = onOpenDashboard || onOpenAdmin || (() => {});
  const triggerPatient = onOpenPatientDashboard || (() => {});
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', href: '#hero' },
    { label: 'Tarification', href: '#tarification' },
    { label: 'Dr. Ghaouat', href: '#doctor' },
    { label: 'Avant / Après', href: '#before-after' },
    { label: 'Avis & Témoignages', href: '#testimonials' },
    { label: 'Le Cabinet', href: '#gallery' },
    { label: 'Accès & Contact', href: '#location' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div id="announcement-bar" className="bg-[#1C1917] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#C5A089]/20 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#C5A089]/20 text-[#DFBA9D] font-medium text-[11px] border border-[#C5A089]/30">
              <Sparkles className="w-3 h-3 text-[#DFBA9D]" />
              Khemis Miliana
            </span>
            <span className="text-[#E7E5E4] font-light hidden md:inline">
              {settings.announcementText}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-[#FAF8F5] hover:text-[#DFBA9D] transition-colors"
              id="topbar-phone-link"
            >
              <Phone className="w-3.5 h-3.5 text-[#DFBA9D]" />
              <span className="font-medium">{settings.phone}</span>
            </a>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <a
              href={`https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent("Bonjour Dr. Ghaouat, je souhaite me renseigner pour un rendez-vous.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#4ade80] hover:text-green-300 font-medium transition-colors"
              id="topbar-whatsapp-link"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <button
              onClick={triggerPatient}
              className="flex items-center gap-1 text-[#DFBA9D] hover:text-white transition-colors text-[11px] font-semibold"
              title="Mon Espace Patient & Historique Médical"
              id="topbar-patient-link"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#DFBA9D]" />
              <span>Espace Patiente</span>
            </button>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <button
              onClick={triggerAdmin}
              className="flex items-center gap-1 text-stone-400 hover:text-[#DFBA9D] transition-colors text-[11px]"
              title="Portail Administration Clinique"
              id="nav-admin-link"
            >
              <Lock className="w-3 h-3" />
              <span>Espace Pro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-luxury shadow-md py-3 border-b border-[#E5D4CB]/60'
            : 'bg-[#FAF8F5]/90 backdrop-blur-md py-4 border-b border-[#F0E3DC]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Doctor Title */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-3.5 group"
            id="brand-logo"
          >
            <OfficialLogo
              size="md"
              src={typeof navbarLogoImg === 'string' ? navbarLogoImg : navbarLogoImg.src}
              imageClassName="group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#1C1917] tracking-tight group-hover:text-[#9E2A50] transition-colors">
                  GH CLINIC
                </span>
                <span className="hidden sm:inline-block text-[10px] font-serif uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-pink-100 text-[#9E2A50] border border-pink-200">
                  Médical
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium tracking-wide">
                Cabinet Médico-Esthétique • Dr. Ghaouat Sarra
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" id="desktop-navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-[#292524] hover:text-[#B38867] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C5A089] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions: Patient Portal, AI Assistant & Booking Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Patient Portal Button */}
            <button
              onClick={triggerPatient}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#E5D4CB] hover:border-[#9E6B55] text-stone-800 hover:text-[#9E6B55] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              id="nav-patient-portal-button"
              title="Consulter mon dossier médical, historique et conseils post-acte"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E6B55]" />
              <span className="hidden md:inline">Espace Patient</span>
            </button>

            {/* AI Receptionist Button */}
            <button
              onClick={triggerAI}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#E5D4CB] hover:border-[#C5A089] text-[#1C1917] hover:bg-[#FDFBF7] text-xs font-semibold shadow-xs transition-all duration-200 group cursor-pointer"
              id="nav-ai-receptionist-button"
            >
              <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#F4DCD6] text-[#9E6B55]">
                <Bot className="w-3.5 h-3.5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="hidden lg:inline">Assistante IA</span>
            </button>

            {/* Book Appointment CTA */}
            <button
              onClick={() => onOpenBooking()}
              className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C73859] via-[#D8436B] to-[#9E2A50] hover:brightness-105 text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-pink-200/40 cursor-pointer"
              id="nav-book-appointment-button"
            >
              <span
                className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-gh-sweep"
                aria-hidden="true"
              />
              <Calendar className="w-4 h-4 text-pink-200" />
              <span>Prendre Rendez-vous</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={triggerPatient}
              className="p-2 rounded-full bg-white border border-[#E5D4CB] text-[#9E6B55]"
              title="Mon Espace Patient"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              onClick={triggerAI}
              className="p-2 rounded-full bg-white border border-[#E5D4CB] text-[#9E6B55]"
              title="Assistante IA"
            >
              <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white border border-[#E5D4CB] text-[#1C1917]"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="lg:hidden glass-luxury border-t border-[#E5D4CB] px-4 pt-4 pb-6 mt-3 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-2 pb-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-stone-800 hover:bg-[#F4DCD6]/40 hover:text-[#B38867] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E5D4CB]/60 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerPatient();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#9E6B55]/30 text-[#9E6B55] font-semibold text-sm shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#9E6B55]" />
                <span>Mon Espace Patiente & Suivi Post-Acte</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#A87453] text-white font-semibold shadow-md"
                id="mobile-book-button"
              >
                <Calendar className="w-4 h-4" />
                <span>Prendre Rendez-vous en Ligne</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerAI();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#E5D4CB] text-stone-800 font-medium text-sm"
              >
                <Bot className="w-4 h-4 text-[#9E6B55]" />
                <span>Poser une question à l’Assistante IA</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
