'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Download,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Search,
} from 'lucide-react';
import {
  SERVICES,
  Service,
  ServiceVariant,
  getServiceById,
  getServiceByNameOrSlug,
  Appointment,
  ClinicSettings,
} from '@/lib/clinicData';
import { OfficialLogo } from './OfficialLogo';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  treatments?: any[];
  settings: ClinicSettings;
  preselectedTreatmentId?: string;
  preselectedTreatmentName?: string;
  onSaveAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  onOpenPatientDashboard?: (phone?: string) => void;
}

interface BookingModalInnerProps {
  onClose: () => void;
  settings: ClinicSettings;
  preselectedTreatmentId?: string;
  preselectedTreatmentName?: string;
  onSaveAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  onOpenPatientDashboard?: (phone?: string) => void;
}

const findInitialService = (treatmentId?: string, treatmentName?: string): Service => {
  if (treatmentId) {
    const byId = getServiceById(treatmentId) || getServiceByNameOrSlug(treatmentId);
    if (byId) return byId;
  }
  if (treatmentName) {
    const byName = getServiceByNameOrSlug(treatmentName);
    if (byName) return byName;
  }
  return SERVICES[0];
};

const BookingModalInner: React.FC<BookingModalInnerProps> = ({
  onClose,
  settings,
  preselectedTreatmentId,
  preselectedTreatmentName,
  onSaveAppointment,
  onOpenPatientDashboard,
}) => {
  const initialService = useMemo(
    () => findInitialService(preselectedTreatmentId, preselectedTreatmentName),
    [preselectedTreatmentId, preselectedTreatmentName]
  );

  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialService.id);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(() => {
    if (!initialService.variants || initialService.variants.length === 0) return null;
    const q = (preselectedTreatmentName || '').toLowerCase();
    const matchedVariant = initialService.variants.find((v) => q.includes(v.name.toLowerCase()));
    return matchedVariant ? matchedVariant.id : initialService.variants[0].id;
  });

  const [step, setStep] = useState<1 | 2 | 3 | 4>(() =>
    preselectedTreatmentId || preselectedTreatmentName ? 2 : 1
  );

  // Search & Category Filters for Step 1
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Date and Time State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDay() === 5) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('10:30');

  // Patient Details State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('+213 ');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientCity, setPatientCity] = useState('Khemis Miliana');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [notes, setNotes] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Current selected service & active variant
  const currentService: Service = useMemo(() => {
    return getServiceById(selectedServiceId) || SERVICES[0];
  }, [selectedServiceId]);

  const activeVariant: ServiceVariant | undefined = useMemo(() => {
    if (!currentService.variants || currentService.variants.length === 0) return undefined;
    return currentService.variants.find((v) => v.id === selectedVariantId) || currentService.variants[0];
  }, [currentService, selectedVariantId]);

  // Dynamic Price & Duration
  const effectivePriceDZD = activeVariant ? activeVariant.priceDZD : currentService.priceDZD;
  const effectiveDuration = activeVariant?.durationMinutes || currentService.durationMinutes || 45;
  const effectiveDisplayName = activeVariant ? `${currentService.name} (${activeVariant.name})` : currentService.name;

  // Categories list for filtering
  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'Tous les Soins' },
      { id: 'facial', label: 'Soins Visage' },
      { id: 'laser', label: 'Épilation Laser Diode' },
      { id: 'injectables', label: 'Injectables & Botox' },
      { id: 'regeneration', label: 'PRP & Cheveux' },
      { id: 'body', label: 'Soins Corps' },
    ];
  }, []);

  // Filtered services for Step 1
  const filteredServices = useMemo(() => {
    return SERVICES.filter((s) => {
      const matchCat = selectedCategory === 'all' || s.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        (s.subCategory && s.subCategory.toLowerCase().includes(q)) ||
        (s.variants && s.variants.some((v) => v.name.toLowerCase().includes(q)));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const availableTimeSlots = [
    '09:30',
    '10:30',
    '11:30',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  // Calendar dates generator (next 14 days excluding Fridays)
  const getNextAvailableDays = () => {
    const days: { dateStr: string; dayName: string; dayNumber: number; monthName: string; isFriday: boolean }[] = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isFriday = d.getDay() === 5;
      const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      days.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: dayNames[d.getDay()],
        dayNumber: d.getDate(),
        monthName: monthNames[d.getMonth()],
        isFriday,
      });
    }
    return days;
  };

  const availableDays = getNextAvailableDays();

  const handleSelectService = (service: Service) => {
    setSelectedServiceId(service.id);
    if (service.variants && service.variants.length > 0) {
      setSelectedVariantId(service.variants[0].id);
    } else {
      setSelectedVariantId(null);
    }
    setStep(2);
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    const created = onSaveAppointment({
      patientName,
      patientPhone,
      patientEmail,
      patientCity,
      treatmentId: currentService.id,
      treatmentName: effectiveDisplayName,
      date: selectedDate,
      timeSlot: selectedTime,
      status: 'pending',
      notes: notes + (activeVariant ? ` [Option: ${activeVariant.name}]` : ''),
      isFirstVisit,
      totalPriceDZD: effectivePriceDZD,
    });

    setConfirmedAppointment(created);
    setStep(4);
  };

  // WhatsApp Pre-filled text
  const getWhatsAppBookingUrl = () => {
    if (!confirmedAppointment) return '#';
    const message = `Bonjour Dr. Ghaouat Sarra (GH Clinic),\n\nJe confirme ma demande de rendez-vous médical :\n• Patient(e) : ${confirmedAppointment.patientName}\n• Téléphone : ${confirmedAppointment.patientPhone}\n• Soin demandé : ${confirmedAppointment.treatmentName}\n• Tarif estimé : ${confirmedAppointment.totalPriceDZD.toLocaleString('fr-DZ')} DA\n• Date : ${confirmedAppointment.date} à ${confirmedAppointment.timeSlot}\n• Ville : ${confirmedAppointment.patientCity}\n• Réf : ${confirmedAppointment.id}\n\nMerci de me confirmer la réservation.`;
    return `https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(message)}`;
  };

  // Download .ics Calendar File
  const handleDownloadICS = () => {
    if (!confirmedAppointment) return;
    const [year, month, day] = confirmedAppointment.date.split('-').map(Number);
    const [hours, minutes] = confirmedAppointment.timeSlot.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + effectiveDuration * 60000);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const formatDate = (date: Date) =>
      `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GH Clinic//Dr Ghaouat Sarra//FR
BEGIN:VEVENT
UID:${confirmedAppointment.id}@ghclinic.dz
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:RDV GH Clinic — ${confirmedAppointment.treatmentName}
DESCRIPTION:Consultation avec Dr. Ghaouat Sarra à Khemis Miliana. Tel: ${settings.phone}. Tarif: ${confirmedAppointment.totalPriceDZD} DZD
LOCATION:${settings.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `RDV-GH-Clinic-${confirmedAppointment.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#E5D4CB] my-6 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Continuous Linear Progress Track */}
      <div className="w-full bg-stone-100 h-1.5 overflow-hidden relative shrink-0">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            step === 4
              ? 'w-full bg-gradient-to-r from-emerald-500 to-emerald-400'
              : step === 3
              ? 'w-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55]'
              : step === 2
              ? 'w-2/3 bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55]'
              : 'w-1/3 bg-gradient-to-r from-[#DFBA9D] to-[#C5A089]'
          }`}
        />
      </div>

      {/* Header Bar */}
      <div className="p-5 sm:p-6 bg-[#FAF8F5] border-b border-[#E5D4CB] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5">
          <OfficialLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9E6B55]" />
              <span className="text-[11px] font-bold text-[#9E6B55] uppercase tracking-wider">
                Réservation Directe • Dr. Ghaouat Sarra
              </span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 mt-0.5">
              {step === 4 ? 'Réservation Confirmée !' : 'Prendre Rendez-vous en Ligne'}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white text-stone-600 hover:text-stone-900 border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer"
          aria-label="Fermer la fenêtre de réservation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stepper Progress Bar */}
      {step < 4 && (
        <div className="px-5 sm:px-6 py-3 bg-white border-b border-stone-100 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 font-serif">
                Étape {step} sur 3
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500 font-medium">
                {step === 1 && 'Choix du soin & variante'}
                {step === 2 && 'Choix de la date et de l’horaire'}
                {step === 3 && 'Vos coordonnées (Dossier patient)'}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4DCD6]/60 border border-[#E5D4CB] text-[#9E6B55] font-bold text-[11px]">
              <Sparkles className="w-3 h-3" />
              <span>
                {step === 1 && '33%'}
                {step === 2 && '66%'}
                {step === 3 && '100%'}
              </span>
            </div>
          </div>

          {/* Stepper nodes */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-left cursor-pointer"
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                  step > 1
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : step === 1
                    ? 'bg-[#9E6B55] text-white ring-4 ring-[#9E6B55]/15'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <div className="min-w-0">
                <div className={`text-xs font-semibold truncate ${step >= 1 ? 'text-stone-900' : 'text-stone-400'}`}>
                  Soin
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                if (step > 2) setStep(2);
              }}
              className={`flex items-center gap-2 text-left ${step > 2 ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                  step > 2
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : step === 2
                    ? 'bg-[#9E6B55] text-white ring-4 ring-[#9E6B55]/15'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <div className="min-w-0">
                <div className={`text-xs font-semibold truncate ${step >= 2 ? 'text-stone-900' : 'text-stone-400'}`}>
                  Date & Heure
                </div>
              </div>
            </button>

            <div className="flex items-center gap-2 text-left">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                  step === 3
                    ? 'bg-[#9E6B55] text-white ring-4 ring-[#9E6B55]/15'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                3
              </span>
              <div className="min-w-0">
                <div className={`text-xs font-semibold truncate ${step >= 3 ? 'text-stone-900' : 'text-stone-400'}`}>
                  Patient
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Body Content */}
      <div className="p-5 sm:p-6 overflow-y-auto flex-1">
        
        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE OR CHANGE TREATMENT FROM FULL UNIFIED CATALOG              */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h4 className="font-serif font-bold text-lg text-stone-900">
                1. Sélectionnez votre acte ou soin médical
              </h4>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Consultez notre catalogue officiel complet de soins et tarifs en Dinars Algériens (DZD).
              </p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un soin (ex: PRP, Botox, Laser Aisselles, Hydrafacial, Peeling...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#9E6B55] focus:outline-hidden text-xs text-stone-800 bg-stone-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-serif font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#9E6B55] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1 pt-1">
              {filteredServices.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-stone-500 text-xs">
                  Aucun soin ne correspond à votre recherche.
                </div>
              ) : (
                filteredServices.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#F4DCD6]/30 border-[#9E6B55] shadow-xs'
                          : 'bg-white border-stone-200 hover:border-[#C5A089] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E6B55]">
                            {service.categoryLabel}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#9E6B55]" />}
                        </div>
                        <h5 className="font-serif font-bold text-stone-900 text-sm leading-snug">
                          {service.name}
                        </h5>
                        <p className="text-xs text-stone-500 font-light mt-1 line-clamp-2">
                          {service.shortDescription}
                        </p>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-[#9E6B55]">
                          {service.priceNote ? service.priceNote : `${service.priceDZD.toLocaleString('fr-DZ')} DA`}
                        </span>
                        <span className="text-stone-400 text-[11px]">{service.durationMinutes} min</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: SERVICE VARIANTS SELECTION + DATE & TIME PICKER                   */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-5">
            
            {/* Active Service Banner & Variant Customization */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5D4CB] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#9E6B55] uppercase font-bold tracking-wider block">
                    {currentService.categoryLabel}
                  </span>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                    {currentService.name}
                  </h4>
                  <p className="text-xs text-stone-600 font-light mt-0.5">
                    {currentService.shortDescription}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#9E6B55] font-semibold hover:underline shrink-0 pt-0.5 cursor-pointer"
                >
                  Changer de soin
                </button>
              </div>

              {/* Variants Selection if applicable (e.g. Laser 1 vs 3 sessions, Botox zones, etc.) */}
              {currentService.variants && currentService.variants.length > 0 && (
                <div className="pt-2 border-t border-stone-200/80 space-y-2">
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    Option / Formule :
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentService.variants.map((variant) => {
                      const isVarSelected = activeVariant?.id === variant.id;
                      return (
                        <div
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isVarSelected
                              ? 'bg-white border-[#9E6B55] shadow-xs text-stone-900 font-semibold ring-1 ring-[#9E6B55]'
                              : 'bg-white/60 border-stone-200 text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isVarSelected ? 'border-[#9E6B55] bg-[#9E6B55]' : 'border-stone-300'
                              }`}
                            >
                              {isVarSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </span>
                            <span className="truncate">{variant.name}</span>
                          </div>

                          <div className="flex items-baseline gap-1 shrink-0">
                            <span className="font-bold text-[#8E2842]">
                              {variant.priceDZD.toLocaleString('fr-DZ')} DA
                            </span>
                            {variant.oldPriceDZD && (
                              <span className="text-[10px] text-stone-400 line-through">
                                {variant.oldPriceDZD.toLocaleString('fr-DZ')} DA
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price & Duration Badge Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200/70 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Tarif officiel :</span>
                  <span className="font-serif font-bold text-base text-[#8E2842]">
                    {effectivePriceDZD.toLocaleString('fr-DZ')} DA
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Durée estimée : ~{effectiveDuration} min</span>
                </div>
              </div>
            </div>

            {/* Date Picker (Horizontal Carousel) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                2. Choisissez votre date de rendez-vous :
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
                {availableDays.map((day) => {
                  const isSelected = selectedDate === day.dateStr;
                  return (
                    <button
                      key={day.dateStr}
                      type="button"
                      disabled={day.isFriday}
                      onClick={() => setSelectedDate(day.dateStr)}
                      className={`shrink-0 w-16 py-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                        day.isFriday
                          ? 'bg-stone-100 border-stone-200 opacity-40 cursor-not-allowed text-stone-400'
                          : isSelected
                          ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-md'
                          : 'bg-white border-stone-200 hover:border-[#9E6B55] text-stone-700'
                      }`}
                    >
                      <span className="text-[10px] font-semibold uppercase">{day.dayName}</span>
                      <span className="text-lg font-serif font-bold">{day.dayNumber}</span>
                      <span className="text-[9px] opacity-80">{day.monthName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                3. Choisissez votre créneau horaire :
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {availableTimeSlots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 rounded-xl border text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#9E6B55] text-white border-[#9E6B55] shadow-xs'
                          : 'bg-white border-stone-200 hover:border-[#9E6B55] text-stone-800'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: PATIENT INFORMATION FORM                                          */}
        {/* ========================================================================= */}
        {step === 3 && (
          <form id="booking-patient-form" onSubmit={handleCompleteBooking} className="space-y-4">
            <div>
              <h4 className="font-serif font-bold text-lg text-stone-900">
                3. Vos Coordonnées (Dossier Patient)
              </h4>
              <p className="text-xs text-stone-500 font-light">
                Ces informations permettent au Dr. Ghaouat Sarra de préparer votre protocole personnalisé.
              </p>
            </div>

            {/* Summary Mini-Card */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5D4CB] flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">Acte réservé</span>
                <span className="font-bold text-stone-800">{effectiveDisplayName}</span>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block text-[10px]">Date & Heure</span>
                <span className="font-bold text-[#8E2842]">{selectedDate} à {selectedTime}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nom & Prénom *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amina Benali"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-[#9E6B55] focus:outline-hidden text-xs text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Numéro de Téléphone (Algérie) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+213 550 12 34 56"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-[#9E6B55] focus:outline-hidden text-xs text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email (Optionnel)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="votre.email@gmail.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-[#9E6B55] focus:outline-hidden text-xs text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ville / Wilaya de Résidence
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Ex: Khemis Miliana, Blida, Aïn Defla, Alger..."
                    value={patientCity}
                    onChange={(e) => setPatientCity(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 focus:border-[#9E6B55] focus:outline-hidden text-xs text-stone-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="firstVisit"
                checked={isFirstVisit}
                onChange={(e) => setIsFirstVisit(e.target.checked)}
                className="rounded text-[#9E6B55] focus:ring-[#9E6B55] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="firstVisit" className="text-xs text-stone-700 cursor-pointer">
                Il s’agit de ma première visite chez GH Clinic avec Dr. Ghaouat Sarra
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Remarques, allergies ou questions spécifiques (Optionnel)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Peau sensible, antécédents médicaux, zones prioritaires..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 focus:border-[#9E6B55] focus:outline-hidden text-xs text-stone-800"
              />
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5D4CB] text-[11px] text-stone-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9E6B55] shrink-0" />
              <span>Vos données sont strictement confidentielles et protégées par le secret médical.</span>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: SUCCESS CONFIRMATION & WHATSAPP DISPATCH                          */}
        {/* ========================================================================= */}
        {step === 4 && confirmedAppointment && (
          <div className="text-center space-y-5 py-3 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="font-serif font-bold text-2xl text-stone-900">
                Rendez-vous Enregistré avec Succès !
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-light">
                Merci <strong className="font-semibold text-stone-900">{confirmedAppointment.patientName}</strong>. 
                Votre demande a été transmise au cabinet de Dr. Ghaouat Sarra.
              </p>
            </div>

            {/* Appointment Voucher Card */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5D4CB] max-w-md mx-auto text-left space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500 font-semibold uppercase text-[10px]">Réf. Dossier</span>
                <span className="font-mono font-bold text-[#9E6B55]">{confirmedAppointment.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="col-span-2">
                  <span className="text-stone-400 block text-[10px]">Soin & Formule</span>
                  <span className="font-bold text-stone-900 text-sm">{confirmedAppointment.treatmentName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Tarif officiel</span>
                  <span className="font-bold text-[#8E2842] text-sm">{confirmedAppointment.totalPriceDZD.toLocaleString('fr-DZ')} DA</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Date & Heure</span>
                  <span className="font-bold text-stone-900">{confirmedAppointment.date} à {confirmedAppointment.timeSlot}</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-stone-200 text-[11px] text-stone-500">
                📍 {settings.address}
              </div>
            </div>

            {/* Primary WhatsApp Direct Dispatch Action */}
            <div className="space-y-2.5 max-w-md mx-auto">
              <a
                href={getWhatsAppBookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Confirmer instantanément sur WhatsApp</span>
              </a>

              {/* Patient History and Post-Care Portal Shortcut */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenPatientDashboard) {
                    onOpenPatientDashboard(confirmedAppointment.patientPhone);
                  }
                }}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#DFBA9D]/20 via-[#C5A089]/20 to-[#9E6B55]/20 hover:from-[#DFBA9D]/30 hover:to-[#9E6B55]/30 border border-[#9E6B55]/40 text-[#9E6B55] hover:text-[#835642] font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#9E6B55]" />
                <span>Consulter mon Espace Patient & Conseils Post-Soin</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleDownloadICS}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-[#E5D4CB] text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#9E6B55]" />
                  <span>Ajouter au Calendrier (.ics)</span>
                </button>

                <button
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Terminer
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Footer Navigation Buttons */}
      {step < 4 && (
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#E5D4CB] flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="px-4 py-2 rounded-full bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] hover:from-[#d6ad8d] hover:to-[#8c5943] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Étape Suivante</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              form="booking-patient-form"
              type="submit"
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] hover:from-[#d6ad8d] hover:to-[#8c5943] text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirmer ma Réservation</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  settings,
  preselectedTreatmentId,
  preselectedTreatmentName,
  onSaveAppointment,
  onOpenPatientDashboard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <BookingModalInner
        key={`${preselectedTreatmentId || ''}-${preselectedTreatmentName || ''}`}
        onClose={onClose}
        settings={settings}
        preselectedTreatmentId={preselectedTreatmentId}
        preselectedTreatmentName={preselectedTreatmentName}
        onSaveAppointment={onSaveAppointment}
        onOpenPatientDashboard={onOpenPatientDashboard}
      />
    </div>
  );
};
