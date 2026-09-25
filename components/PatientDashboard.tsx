'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  Heart,
  AlertTriangle,
  CheckCircle2,
  X,
  Phone,
  MessageCircle,
  Download,
  Lock,
  User,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
  Printer,
  Info,
  BadgeCheck,
  Star,
  Activity,
  Flame,
  Sun,
  Shield,
  HelpCircle,
  Share2
} from 'lucide-react';
import {
  PatientTreatmentHistoryItem,
  PostProcedureCareProtocol,
  PatientProfile,
  POST_PROCEDURE_CARE_PROTOCOLS,
  getCareProtocolForTreatment
} from '@/lib/patientData';
import { Appointment, ClinicSettings, Treatment } from '@/lib/clinicData';
import { OfficialLogo } from './OfficialLogo';

interface PatientDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
  settings: ClinicSettings;
  patientProfiles: PatientProfile[];
  treatmentHistory: PatientTreatmentHistoryItem[];
  appointments: Appointment[];
  treatments: Treatment[];
  onOpenBooking: (treatmentId?: string) => void;
  onUpdateTreatmentHistoryItem?: (id: string, updates: Partial<PatientTreatmentHistoryItem>) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  isOpen,
  onClose,
  initialPhone,
  settings,
  patientProfiles,
  treatmentHistory,
  appointments,
  treatments,
  onOpenBooking,
  onUpdateTreatmentHistoryItem,
}) => {
  // Authentication State with lazy initialization
  const [authenticatedPhone, setAuthenticatedPhone] = useState<string | null>(() => {
    if (!initialPhone) return null;
    const cleanInit = initialPhone.replace(/[^0-9]/g, '');
    const match = patientProfiles.find((p) => {
      const cleanP = p.phone.replace(/[^0-9]/g, '');
      return cleanP.endsWith(cleanInit) || cleanInit.endsWith(cleanP);
    });
    return match ? match.phone : null;
  });
  const [inputPhone, setInputPhone] = useState(initialPhone || '');
  const [inputPin, setInputPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Active navigation tab inside patient dashboard
  const [activeTab, setActiveTab] = useState<'history' | 'upcoming' | 'postcare' | 'profile'>('history');

  // Filter for treatment history
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('all');

  // Selected post-care protocol override by user
  const [userSelectedCareProtocolKey, setUserSelectedCareProtocolKey] = useState<string | null>(null);

  // Modal for printable treatment receipt / medical voucher
  const [selectedReceiptItem, setSelectedReceiptItem] = useState<PatientTreatmentHistoryItem | null>(null);

  // Interactive Checklist states for today (persisted in local state)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Clean phone numbers helper
  const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, '');

  // Current logged in patient profile
  const currentPatient: PatientProfile | undefined = useMemo(() => {
    if (!authenticatedPhone) return undefined;
    const cleanAuth = normalizePhone(authenticatedPhone);
    const found = patientProfiles.find((p) => {
      const cleanP = normalizePhone(p.phone);
      return cleanP.endsWith(cleanAuth) || cleanAuth.endsWith(cleanP);
    });

    if (found) return found;

    // Fallback profile if patient booked but profile object wasn't in demo array
    const aptMatch = appointments.find((a) => {
      const cleanApt = normalizePhone(a.patientPhone);
      return cleanApt.endsWith(cleanAuth) || cleanAuth.endsWith(cleanApt);
    });

    return {
      id: `pat-dynamic-${cleanAuth}`,
      pinCode: '1234',
      name: aptMatch ? aptMatch.patientName : 'Patiente GH Clinic',
      phone: authenticatedPhone,
      email: aptMatch ? aptMatch.patientEmail : '',
      city: aptMatch ? aptMatch.patientCity : settings.city,
      memberSince: '2026',
      status: 'Régulier',
      doctorNotes: 'Dossier patiente ouvert via le portail en ligne.',
    };
  }, [authenticatedPhone, patientProfiles, appointments, settings.city]);

  // Filtered treatment history for the active patient
  const patientHistory: PatientTreatmentHistoryItem[] = useMemo(() => {
    if (!authenticatedPhone) return [];
    const cleanAuth = normalizePhone(authenticatedPhone);
    return treatmentHistory.filter((th) => {
      const cleanTh = normalizePhone(th.patientPhone);
      return cleanTh.endsWith(cleanAuth) || cleanAuth.endsWith(cleanTh);
    });
  }, [authenticatedPhone, treatmentHistory]);

  // Upcoming appointments for the active patient
  const patientAppointments: Appointment[] = useMemo(() => {
    if (!authenticatedPhone) return [];
    const cleanAuth = normalizePhone(authenticatedPhone);
    return appointments
      .filter((apt) => {
        const cleanApt = normalizePhone(apt.patientPhone);
        return cleanApt.endsWith(cleanAuth) || cleanAuth.endsWith(cleanApt);
      })
      .sort((a, b) => new Date(`${a.date}T${a.timeSlot}`).getTime() - new Date(`${b.date}T${b.timeSlot}`).getTime());
  }, [authenticatedPhone, appointments]);

  // Determine which post-care protocols are most relevant to this patient
  const relevantProtocols = useMemo(() => {
    const keys = new Set<string>();
    patientHistory.forEach((h) => {
      const name = h.treatmentName.toLowerCase();
      if (name.includes('botox')) keys.add('botox');
      if (name.includes('filler') || name.includes('acide') || name.includes('levre')) keys.add('fillers');
      if (name.includes('laser')) keys.add('laser');
      if (name.includes('hydrafacial')) keys.add('hydrafacial');
      if (name.includes('prp')) keys.add('prp');
      if (name.includes('peeling')) keys.add('peeling');
    });

    patientAppointments.forEach((apt) => {
      const name = apt.treatmentName.toLowerCase();
      if (name.includes('botox')) keys.add('botox');
      if (name.includes('filler') || name.includes('acide') || name.includes('levre')) keys.add('fillers');
      if (name.includes('laser')) keys.add('laser');
      if (name.includes('hydrafacial')) keys.add('hydrafacial');
      if (name.includes('prp')) keys.add('prp');
      if (name.includes('peeling')) keys.add('peeling');
    });

    // Default if none found
    if (keys.size === 0) {
      keys.add('botox');
      keys.add('fillers');
      keys.add('laser');
    }
    return Array.from(keys);
  }, [patientHistory, patientAppointments]);

  // When patient logs in, default active protocol to their most recent treatment
  const selectedCareProtocolKey = useMemo(() => {
    if (userSelectedCareProtocolKey) return userSelectedCareProtocolKey;
    if (patientHistory.length > 0) {
      const latest = patientHistory[0].treatmentName.toLowerCase();
      if (latest.includes('botox')) return 'botox';
      if (latest.includes('filler') || latest.includes('acide') || latest.includes('levre')) return 'fillers';
      if (latest.includes('laser')) return 'laser';
      if (latest.includes('hydrafacial')) return 'hydrafacial';
      if (latest.includes('prp')) return 'prp';
      if (latest.includes('peeling')) return 'peeling';
    }
    return relevantProtocols[0] || 'botox';
  }, [userSelectedCareProtocolKey, patientHistory, relevantProtocols]);

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsVerifying(true);

    const cleanInput = normalizePhone(inputPhone);
    if (!cleanInput || cleanInput.length < 8) {
      setAuthError('Veuillez entrer un numéro de téléphone valide.');
      setIsVerifying(false);
      return;
    }

    // Check registered profiles or appointments
    const matchedProfile = patientProfiles.find((p) => {
      const cleanP = normalizePhone(p.phone);
      return cleanP.endsWith(cleanInput) || cleanInput.endsWith(cleanP);
    });

    const matchedApt = appointments.find((a) => {
      const cleanA = normalizePhone(a.patientPhone);
      return cleanA.endsWith(cleanInput) || cleanInput.endsWith(cleanA);
    });

    if (!matchedProfile && !matchedApt) {
      setAuthError('Aucun dossier trouvé avec ce numéro. Si vous êtes nouvelle patiente, vous pouvez tester un profil démo ci-dessous.');
      setIsVerifying(false);
      return;
    }

    // Verify PIN if entered, or default to 1234
    const validPin = matchedProfile?.pinCode || '1234';
    if (inputPin && inputPin.trim() !== validPin && inputPin.trim() !== '1234') {
      setAuthError(`Code PIN incorrect. (Astuce démo : le code par défaut est ${validPin}).`);
      setIsVerifying(false);
      return;
    }

    // Success
    setTimeout(() => {
      setAuthenticatedPhone(matchedProfile ? matchedProfile.phone : (matchedApt?.patientPhone || inputPhone));
      setIsVerifying(false);
      setAuthError(null);
    }, 300);
  };

  // Quick 1-click test patient login
  const handleQuickDemoLogin = (demoProfile: PatientProfile) => {
    setInputPhone(demoProfile.phone);
    setInputPin(demoProfile.pinCode);
    setAuthenticatedPhone(demoProfile.phone);
    setAuthError(null);
  };

  // Handle Logout
  const handleLogout = () => {
    setAuthenticatedPhone(null);
    setInputPin('');
  };

  // Toggle checklist item
  const toggleChecklistItem = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filtered treatment history by category
  const filteredTreatmentHistory = useMemo(() => {
    if (historyCategoryFilter === 'all') return patientHistory;
    return patientHistory.filter((item) => item.category === historyCategoryFilter);
  }, [patientHistory, historyCategoryFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden border border-[#E5D4CB] my-auto max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================= */}
        {/* CASE A: PATIENT NOT AUTHENTICATED -> SECURE VERIFICATION GATE     */}
        {/* ================================================================= */}
        {!authenticatedPhone ? (
          <div className="p-6 sm:p-10 flex flex-col justify-center items-center text-center overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Official Medical Seal */}
            <div className="mb-4">
              <OfficialLogo size="lg" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E6B55]/10 text-[#9E6B55] text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Espace Patient Sécurisé & Dossier Médical</span>
            </div>

            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 max-w-lg">
              Consultez Votre Historique Médical & Soins Post-Acte
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light mt-2 max-w-md">
              Accédez en toute confidentialité à vos traitements réalisés chez Dr. Ghaouat Sarra, vos prochains rendez-vous et vos protocoles de soins personnalisés.
            </p>

            {/* Security disclaimer */}
            <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-2 bg-white/70 py-1 px-3 rounded-full border border-stone-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secret médical respecté • Cryptage des données de santé</span>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleLogin} className="w-full max-w-md mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Numéro de Téléphone (utilisé lors de vos réservations) :
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="Ex: 0551 22 33 44 ou +213 551 22 33 44"
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5D4CB] text-sm text-stone-900 focus:outline-hidden focus:border-[#9E6B55] focus:ring-1 focus:ring-[#9E6B55]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Code d’Accès Patient / PIN :
                  </label>
                  <span className="text-[10px] text-[#9E6B55] font-medium">
                    (Par défaut : 1234 pour les comptes démo)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Code PIN à 4 chiffres"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#E5D4CB] text-sm text-stone-900 focus:outline-hidden focus:border-[#9E6B55] focus:ring-1 focus:ring-[#9E6B55]"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] hover:from-[#d6ad8d] hover:to-[#8c5943] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isVerifying ? 'Vérification en cours...' : 'Accéder à Mon Dossier Sécurisé'}</span>
              </button>
            </form>

            {/* Quick Demo Access for reviewers/clients */}
            <div className="w-full max-w-md mt-6 pt-6 border-t border-[#E5D4CB]/70">
              <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2.5">
                Connexion Rapide Démo (Cliquez pour tester) :
              </span>
              <div className="grid grid-cols-2 gap-2 text-left">
                {patientProfiles.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(p)}
                    className="p-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs text-stone-800 transition-all hover:border-[#9E6B55] flex flex-col cursor-pointer shadow-2xs"
                  >
                    <span className="font-bold text-stone-900 truncate flex items-center gap-1">
                      <User className="w-3 h-3 text-[#9E6B55]" />
                      {p.name}
                    </span>
                    <span className="text-[10px] text-stone-500">{p.phone}</span>
                    <span className="text-[9px] text-[#9E6B55] mt-0.5 font-medium truncate">
                      {p.name.includes('Rania') ? '💉 Botox & Soins' : p.name.includes('Nadia') ? '⚡ Laser Diode' : p.name.includes('Fatima') ? '💋 Russian Lips' : '✨ Hydrafacial'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* CASE B: PATIENT AUTHENTICATED -> FULL PATIENT DASHBOARD INTERFACE */
          /* ================================================================= */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Top Luxury Banner */}
            <div className="p-5 sm:p-6 bg-white border-b border-[#E5D4CB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3.5">
                <OfficialLogo size="md" />
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#9E6B55] to-[#DFBA9D] text-white flex items-center justify-center font-serif font-bold text-lg shadow-md shrink-0">
                  {currentPatient?.name ? currentPatient.name.charAt(0) : 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                      Bonjour, {currentPatient?.name}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#9E6B55]/10 text-[#9E6B55] text-[10px] font-bold uppercase tracking-wider border border-[#9E6B55]/20">
                      <BadgeCheck className="w-3 h-3" />
                      {currentPatient?.status || 'Patiente Privilège'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-light mt-0.5">
                    <span>Dossier N° : <strong className="font-mono text-stone-700">{currentPatient?.id || 'GH-2026'}</strong></span>
                    <span>•</span>
                    <span>{currentPatient?.phone}</span>
                    <span>•</span>
                    <span>Cabinet Dr. Ghaouat Sarra</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <a
                  href={`https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(`Bonjour Dr. Ghaouat, je suis ${currentPatient?.name}. J'ai une question concernant mon suivi post-soin.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Contacter le médecin sur WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp SOS Cabinet</span>
                </a>

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Verrouiller et fermer la session"
                >
                  <Lock className="w-3 h-3" />
                  <span>Déconnexion</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#E5D4CB]/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
              <div className="p-2.5 rounded-xl bg-white border border-[#E5D4CB]/80 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#9E6B55]/10 text-[#9E6B55] flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">{patientHistory.length}</div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider">Actes Réalisés</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#E5D4CB]/80 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-700 text-sm">
                    {patientAppointments.length > 0 ? patientAppointments[0].date : 'Aucun'}
                  </div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider">Prochain RDV</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#E5D4CB]/80 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">{relevantProtocols.length} Actif(s)</div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider">Protocoles Post-Soin</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#E5D4CB]/80 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#DFBA9D]/20 text-[#9E6B55] flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-[#9E6B55] fill-[#9E6B55]" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm">{currentPatient?.phototype ? 'Photo. Validé' : 'Dossier Conforme'}</div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider">Traçabilité Médicale</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-2.5 bg-white border-b border-[#E5D4CB] flex items-center gap-3 overflow-x-auto text-xs font-semibold shrink-0">
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-3 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Historique des Soins ({patientHistory.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-2 px-3 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Rendez-vous à Venir ({patientAppointments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('postcare')}
                className={`py-2 px-3 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'postcare'
                    ? 'bg-[#9E6B55] text-white shadow-xs'
                    : 'text-[#9E6B55] bg-[#9E6B55]/10 hover:bg-[#9E6B55]/20'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Conseils Post-Procédure & Soins</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-3 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Mon Profil & Santé</span>
              </button>
            </div>

            {/* TAB CONTENTS (Scrollable Area) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

              {/* ============================================================= */}
              {/* TAB 1: HISTORIQUE MÉDICAL & SOINS RÉALISÉS                     */}
              {/* ============================================================= */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  {/* Category Filter & Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5D4CB] shadow-2xs">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">
                        Historique de Vos Traitements Médicaux
                      </h3>
                      <p className="text-xs text-stone-500 font-light">
                        Traçabilité complète des actes réalisés au cabinet par Dr. Ghaouat Sarra.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                      {[
                        { id: 'all', label: 'Tous' },
                        { id: 'injectables', label: 'Botox & Fillers' },
                        { id: 'laser', label: 'Laser' },
                        { id: 'facial', label: 'Visage' },
                        { id: 'regeneration', label: 'PRP' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setHistoryCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            historyCategoryFilter === cat.id
                              ? 'bg-[#9E6B55] text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* History Cards / Timeline */}
                  {filteredTreatmentHistory.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-[#E5D4CB] text-center space-y-3">
                      <FileText className="w-10 h-10 text-stone-300 mx-auto" />
                      <h4 className="font-semibold text-stone-800 text-sm">Aucun traitement répertorié dans cette catégorie</h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Vos futurs actes médicaux réalisés au cabinet apparaîtront automatiquement ici avec leur compte-rendu.
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenBooking();
                        }}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] text-white text-xs font-semibold shadow-xs"
                      >
                        Planifier un Rendez-vous
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTreatmentHistory.map((item, idx) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-[#E5D4CB] p-5 shadow-2xs hover:border-[#9E6B55]/50 transition-all space-y-4"
                        >
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#9E6B55]/10 text-[#9E6B55] font-semibold text-[11px]">
                                  {item.categoryLabel}
                                </span>
                                <span className="text-xs text-stone-400">•</span>
                                <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                  {item.date} {item.timeSlot ? `à ${item.timeSlot}` : ''}
                                </span>
                              </div>
                              <h4 className="font-serif font-bold text-lg text-stone-900">
                                {item.treatmentName}
                              </h4>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="font-serif font-bold text-[#8E2842] text-base block">
                                {item.totalPriceDZD.toLocaleString('fr-DZ')} DA
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" /> Honoré au cabinet
                              </span>
                            </div>
                          </div>

                          {/* Medical Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5D4CB]/60">
                            <div>
                              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Praticienne</span>
                              <span className="font-bold text-stone-800">{item.doctorName}</span>
                            </div>
                            <div>
                              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Zone Ciblée</span>
                              <span className="font-medium text-stone-700">{item.zoneTreated}</span>
                            </div>
                            <div>
                              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Dispositif & Lot Médical</span>
                              <span className="font-mono text-stone-700 font-semibold">{item.productOrDevice} {item.batchNumber ? `(${item.batchNumber})` : ''}</span>
                            </div>
                          </div>

                          {/* Doctor Notes & Healing */}
                          <div className="space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                              <span className="text-[#9E6B55] font-bold shrink-0">Compte-rendu médical :</span>
                              <span className="text-stone-600 italic">« {item.clinicalNotes} »</span>
                            </div>

                            {item.doctorObservations && (
                              <div className="flex items-start gap-2 text-[11px] text-stone-500">
                                <span className="font-semibold text-stone-700 shrink-0">Observations de suivi :</span>
                                <span>{item.doctorObservations}</span>
                              </div>
                            )}
                          </div>

                          {/* Quick Post-Care Tags & Action Buttons */}
                          <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {item.postCareSummary?.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 text-[11px] flex items-center gap-1"
                                >
                                  <Shield className="w-3 h-3 text-[#9E6B55]" />
                                  <span>{tag}</span>
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  const name = item.treatmentName.toLowerCase();
                                  if (name.includes('botox')) setUserSelectedCareProtocolKey('botox');
                                  else if (name.includes('filler') || name.includes('acide') || name.includes('levre')) setUserSelectedCareProtocolKey('fillers');
                                  else if (name.includes('laser')) setUserSelectedCareProtocolKey('laser');
                                  else if (name.includes('hydrafacial')) setUserSelectedCareProtocolKey('hydrafacial');
                                  else if (name.includes('prp')) setUserSelectedCareProtocolKey('prp');
                                  else if (name.includes('peeling')) setUserSelectedCareProtocolKey('peeling');
                                  setActiveTab('postcare');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#9E6B55]/10 hover:bg-[#9E6B55]/20 text-[#9E6B55] font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Heart className="w-3.5 h-3.5" />
                                <span>Conseils Post-Acte</span>
                              </button>

                              <button
                                onClick={() => setSelectedReceiptItem(item)}
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-stone-400" />
                                <span>Reçu & Fiche</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 2: RENDEZ-VOUS À VENIR & PRÉPARATION                      */}
              {/* ============================================================= */}
              {activeTab === 'upcoming' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#E5D4CB] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">
                        Vos Séances & Rendez-vous Planifiés
                      </h3>
                      <p className="text-xs text-stone-500 font-light">
                        Vérifiez vos dates de passage et prenez connaissance des consignes de préparation avant votre venue.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenBooking();
                      }}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] hover:from-[#d6ad8d] hover:to-[#8c5943] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Réserver une Autre Séance</span>
                    </button>
                  </div>

                  {patientAppointments.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-[#E5D4CB] text-center space-y-3">
                      <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
                      <h4 className="font-semibold text-stone-800 text-sm">Vous n’avez aucun rendez-vous à venir</h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Besoin d’une séance d’entretien, d’un bilan ou d’un nouveau protocole ? Choisissez votre créneau en ligne.
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenBooking();
                        }}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] text-white text-xs font-semibold shadow-xs cursor-pointer"
                      >
                        Prendre Rendez-vous
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {patientAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="bg-white rounded-2xl border border-[#E5D4CB] p-5 shadow-2xs space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                  apt.status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {apt.status === 'confirmed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                  {apt.status === 'confirmed' ? 'Rendez-vous Confirmé' : 'En attente de validation'}
                                </span>
                                <span className="text-xs text-stone-400">•</span>
                                <span className="text-xs font-mono font-semibold text-[#9E6B55]">{apt.id}</span>
                              </div>
                              <h4 className="font-serif font-bold text-lg text-stone-900 mt-1">
                                {apt.treatmentName}
                              </h4>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="font-serif font-bold text-xl text-[#8E2842] block">
                                {apt.totalPriceDZD.toLocaleString('fr-DZ')} DA
                              </span>
                              <span className="text-[11px] text-stone-400">Tarif cabinet en vigueur</span>
                            </div>
                          </div>

                          {/* Date & Time Highlight */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5D4CB]/60 text-xs">
                            <div>
                              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Date de la séance</span>
                              <span className="font-bold text-stone-900 flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-3.5 h-3.5 text-[#9E6B55]" />
                                {apt.date}
                              </span>
                            </div>
                            <div>
                              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Créneau horaire</span>
                              <span className="font-bold text-[#9E6B55] flex items-center gap-1.5 mt-0.5">
                                <Clock className="w-3.5 h-3.5" />
                                {apt.timeSlot}
                              </span>
                            </div>
                            <div>
                              <span className="text-stone-400 block text-[10px] uppercase font-semibold">Lieu de consultation</span>
                              <span className="font-medium text-stone-700 mt-0.5 block truncate">
                                📍 {settings.address}
                              </span>
                            </div>
                          </div>

                          {/* Pre-Appointment Guidelines */}
                          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-amber-900">
                              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                              <span>Consignes de Préparation Avant Votre Arrivée :</span>
                            </div>
                            <ul className="text-amber-800 list-disc list-inside space-y-0.5 text-[11px]">
                              {apt.treatmentName.toLowerCase().includes('laser') ? (
                                <>
                                  <li>Raser la zone à traiter 24 heures avant la séance (ne pas épiler à la cire)</li>
                                  <li>Ne pas vous exposer au soleil ni appliquer d’autobronzant durant les 15 jours précédents</li>
                                  <li>Venir la peau propre sans crème, déodorant ni huile</li>
                                </>
                              ) : apt.treatmentName.toLowerCase().includes('botox') || apt.treatmentName.toLowerCase().includes('filler') ? (
                                <>
                                  <li>Éviter la prise d’aspirine ou d’anti-inflammatoires dans les 48h précédant l’acte</li>
                                  <li>Venir sans maquillage épais ou prévoir de vous démaquiller sur place</li>
                                  <li>Bien vous hydrater avant votre consultation</li>
                                </>
                              ) : (
                                <>
                                  <li>Venir détendue, une analyse de votre peau sera réalisée avant le soin</li>
                                  <li>Signaler toute nouvelle médication ou sensibilité cutanée au médecin</li>
                                </>
                              )}
                            </ul>
                          </div>

                          {/* Actions Bar */}
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <a
                              href={`https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(`Bonjour Dr. Ghaouat, je souhaite modifier mon rendez-vous du ${apt.date} à ${apt.timeSlot} pour ${apt.treatmentName}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-600 hover:text-[#25D366] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                              <span>Modifier ou déplacer via WhatsApp</span>
                            </a>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:GH Clinic - ${apt.treatmentName}\nDESCRIPTION:Rendez-vous médical avec Dr. Ghaouat Sarra\\nAdresse: ${settings.address}\\nTél: ${settings.phone}\nLOCATION:${settings.address}\nDTSTART:${apt.date.replace(/-/g, '')}T${apt.timeSlot.replace(':', '')}00\nDTEND:${apt.date.replace(/-/g, '')}T${apt.timeSlot.replace(':', '')}00\nEND:VEVENT\nEND:VCALENDAR`;
                                  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `rdv-gh-clinic-${apt.date}.ics`;
                                  a.click();
                                }}
                                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Download className="w-3 h-3 text-stone-500" />
                                <span>Ajouter à mon agenda (.ics)</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 3: CONSEILS POST-PROCÉDURE & SUIVI À DOMICILE             */}
              {/* ============================================================= */}
              {activeTab === 'postcare' && (
                <div className="space-y-6">
                  {/* Top Advisory Banner */}
                  <div className="bg-gradient-to-r from-[#DFBA9D]/15 via-[#C5A089]/20 to-[#9E6B55]/15 p-5 rounded-2xl border border-[#9E6B55]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E6B55]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Protocoles Cliniques Officiels — Dr. Ghaouat Sarra</span>
                      </div>
                      <h3 className="font-serif font-bold text-xl text-stone-900">
                        Guide Post-Acte & Recommandations de Récupération
                      </h3>
                      <p className="text-xs text-stone-600 font-light max-w-xl">
                        Une procédure réussie dépend à 50% de la précision du geste médical et à 50% de vos soins à domicile. Sélectionnez un soin ci-dessous pour consulter son protocole détaillé.
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(`Bonjour Dr. Ghaouat, j'ai une question urgente concernant mon suivi post-soin pour ${currentPatient?.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Ligne Urgence Médicale WhatsApp</span>
                    </a>
                  </div>

                  {/* Protocol Selector Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {[
                      { key: 'botox', label: 'Toxine Botulique (Botox)' },
                      { key: 'fillers', label: 'Acide Hyaluronique / Lèvres' },
                      { key: 'laser', label: 'Épilation Laser Médicale' },
                      { key: 'hydrafacial', label: 'Hydrafacial MD' },
                      { key: 'prp', label: 'PRP Cheveux & Visage' },
                      { key: 'peeling', label: 'Peelings & Mésothérapie' },
                    ].map((p) => {
                      const isSelected = selectedCareProtocolKey === p.key;
                      const isPatientRelevant = relevantProtocols.includes(p.key);
                      return (
                        <button
                          key={p.key}
                          onClick={() => setUserSelectedCareProtocolKey(p.key)}
                          className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#9E6B55] text-white shadow-xs'
                              : 'bg-white hover:bg-stone-50 border border-stone-200 text-stone-700'
                          }`}
                        >
                          {isPatientRelevant && <Sparkles className="w-3 h-3 text-amber-400" />}
                          <span>{p.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Care Protocol Content */}
                  {POST_PROCEDURE_CARE_PROTOCOLS[selectedCareProtocolKey] && (() => {
                    const protocol = POST_PROCEDURE_CARE_PROTOCOLS[selectedCareProtocolKey];
                    return (
                      <div className="space-y-6">
                        {/* Protocol Header Card */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E5D4CB] shadow-2xs space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E6B55] bg-[#9E6B55]/10 px-2.5 py-0.5 rounded-full">
                            Protocole Dermo-Esthétique
                          </span>
                          <h4 className="font-serif font-bold text-xl text-stone-900">
                            {protocol.title}
                          </h4>
                          <p className="text-xs text-[#9E6B55] font-medium">
                            {protocol.subtitle}
                          </p>
                          <p className="text-xs text-stone-600 font-light leading-relaxed pt-1">
                            {protocol.description}
                          </p>
                        </div>

                        {/* Timeline of Care: Immediate vs Short-Term */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 0 to 6 Hours */}
                          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base border-b border-stone-100 pb-2">
                              <Clock className="w-4 h-4 text-[#9E6B55]" />
                              <span>{protocol.immediateCare.hours}</span>
                            </div>
                            <ul className="space-y-2 text-xs text-stone-700">
                              {protocol.immediateCare.instructions.map((inst, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{inst}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 24 to 48 Hours */}
                          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                            <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base border-b border-stone-100 pb-2">
                              <Calendar className="w-4 h-4 text-[#9E6B55]" />
                              <span>{protocol.shortTermCare.days}</span>
                            </div>
                            <ul className="space-y-2 text-xs text-stone-700">
                              {protocol.shortTermCare.instructions.map((inst, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{inst}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* STRICT FORBIDDEN ACTIONS (RED ALERT BANNER) */}
                        <div className="bg-rose-50/80 border border-rose-200 p-5 rounded-2xl space-y-3 text-xs">
                          <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Ce Qu’il Faut Absolument ÉVITER (Contre-indications Strictes) :</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-rose-800">
                            {protocol.forbiddenActions.map((act, i) => (
                              <div key={i} className="flex items-start gap-2 bg-white/60 p-2.5 rounded-xl border border-rose-100">
                                <span className="font-bold text-rose-600 shrink-0">✕</span>
                                <span>{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RECOMMENDED DERMO-COSMETIC PRODUCTS */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E5D4CB] shadow-2xs space-y-3">
                          <h5 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#9E6B55]" />
                            <span>Trousse de Soins Dermo-Cosmétiques Conseillée :</span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            {protocol.recommendedProducts.map((prod, i) => (
                              <div key={i} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5D4CB]/80 space-y-1">
                                <span className="text-[10px] font-bold uppercase text-[#9E6B55] block">{prod.category}</span>
                                <span className="font-bold text-stone-900 block">{prod.name}</span>
                                <span className="text-stone-500 text-[11px] block">{prod.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* INTERACTIVE DAILY CARE CHECKLIST */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E5D4CB] shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Ma Check-List de Récupération du Jour :</span>
                            </h5>
                            <span className="text-[11px] text-stone-400">Cochez vos gestes accomplis</span>
                          </div>

                          <div className="space-y-2">
                            {protocol.checklistItems.map((chk, i) => {
                              const checkKey = `${selectedCareProtocolKey}-${i}`;
                              const isChecked = !!checkedItems[checkKey];
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => toggleChecklistItem(checkKey)}
                                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${
                                    isChecked
                                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 line-through opacity-85'
                                      : 'bg-[#FAF8F5] hover:bg-stone-50 border-stone-200 text-stone-800'
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                                  }`}>
                                    {isChecked && <Check className="w-3.5 h-3.5" />}
                                  </div>
                                  <span className="flex-1">{chk}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* WARNING SIGNS / WHEN TO CONTACT THE DOCTOR */}
                        <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-2xl space-y-2 text-xs">
                          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                            <Info className="w-4 h-4 text-amber-700" />
                            <span>Quand Contacter le Cabinet en Priorité ?</span>
                          </div>
                          <p className="text-amber-800 text-[11px]">
                            Si vous présentez l’un des symptômes suivants, n’hésitez pas à contacter Dr. Ghaouat Sarra directement :
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-amber-900 text-[11px]">
                            {protocol.warningSigns.map((sign, i) => (
                              <li key={i}>{sign}</li>
                            ))}
                          </ul>
                        </div>

                        {/* DOCTOR ADVICE QUOTE */}
                        <div className="p-4 rounded-xl bg-stone-900 text-white text-xs space-y-1 shadow-xs">
                          <p className="font-serif italic text-stone-200 leading-relaxed">
                            {protocol.doctorAdviceQuote}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ============================================================= */}
              {/* TAB 4: MON PROFIL & SANTÉ                                     */}
              {/* ============================================================= */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-2xl border border-[#E5D4CB] shadow-2xs space-y-5">
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">
                        Informations du Dossier Médical Partagé
                      </h3>
                      <p className="text-xs text-stone-500 font-light">
                        Ces informations sont confidentielles et utilisées exclusivement pour votre sécurité lors des soins chez Dr. Ghaouat.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Nom Complet</span>
                        <span className="font-bold text-stone-900 text-sm">{currentPatient?.name}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Téléphone</span>
                        <span className="font-bold text-stone-900 text-sm">{currentPatient?.phone}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Email</span>
                        <span className="font-medium text-stone-700">{currentPatient?.email || 'Non renseigné'}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Ville de Résidence</span>
                        <span className="font-bold text-stone-800">{currentPatient?.city || settings.city}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Phototype Cutané</span>
                        <span className="font-bold text-[#9E6B55]">{currentPatient?.phototype || 'Phototype Méditerranéen standard'}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Allergies Déclarées</span>
                        <span className="font-medium text-stone-700">
                          {currentPatient?.knownAllergies && currentPatient.knownAllergies.length > 0
                            ? currentPatient.knownAllergies.join(', ')
                            : 'Aucune allergie cutanée signalée'}
                        </span>
                      </div>

                      <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-1">
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Remarques Praticienne</span>
                        <p className="text-stone-700 leading-relaxed italic">
                          « {currentPatient?.doctorNotes || 'Suivi médical standard sans incident.'} »
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Dossier actif depuis le {currentPatient?.memberSince || '2026'}</span>
                      </span>

                      <button
                        onClick={handleLogout}
                        className="text-rose-600 hover:underline font-semibold"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAL: MEDICAL RECEIPT / ATTESTATION DE SOIN POUR HISTORIQUE          */}
      {/* ===================================================================== */}
      {selectedReceiptItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setSelectedReceiptItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Receipt Header */}
            <div className="text-center space-y-1 border-b border-stone-100 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9E6B55]">
                GH Clinic • Fiche de Traçabilité Médicale
              </span>
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Attestation d’Acte Réalisé
              </h3>
              <p className="text-xs text-stone-500">
                Dr. Ghaouat Sarra — Médecine Esthétique & Laseriste • Khemis Miliana
              </p>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-stone-100 py-1.5">
                <span className="text-stone-400">Patiente :</span>
                <span className="font-bold text-stone-900">{currentPatient?.name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 py-1.5">
                <span className="text-stone-400">Date & Heure :</span>
                <span className="font-bold text-stone-900">{selectedReceiptItem.date} {selectedReceiptItem.timeSlot || ''}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 py-1.5">
                <span className="text-stone-400">Acte Médical :</span>
                <span className="font-bold text-stone-900">{selectedReceiptItem.treatmentName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 py-1.5">
                <span className="text-stone-400">Zone Traitée :</span>
                <span className="font-medium text-stone-800">{selectedReceiptItem.zoneTreated}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 py-1.5">
                <span className="text-stone-400">Produit / Dispositif :</span>
                <span className="font-mono text-stone-800 font-semibold">{selectedReceiptItem.productOrDevice}</span>
              </div>
              {selectedReceiptItem.batchNumber && (
                <div className="flex justify-between border-b border-stone-100 py-1.5">
                  <span className="text-stone-400">Numéro de Lot :</span>
                  <span className="font-mono text-[#9E6B55] font-bold">{selectedReceiptItem.batchNumber}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-stone-100 py-1.5">
                <span className="text-stone-400">Tarif Honoré :</span>
                <span className="font-serif font-bold text-base text-[#8E2842]">
                  {selectedReceiptItem.totalPriceDZD.toLocaleString('fr-DZ')} DA
                </span>
              </div>
            </div>

            {/* Medical Seal */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 text-[11px] text-stone-600 italic text-center">
              « Fiche certifiée conforme par le cabinet médical GH Clinic. Tous les produits injectés et appareils utilisés répondent aux normes de traçabilité CE Médical. »
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-800 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer l’Attestation</span>
              </button>

              <button
                onClick={() => setSelectedReceiptItem(null)}
                className="py-2.5 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
