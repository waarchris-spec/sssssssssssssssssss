'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Users,
  TrendingUp,
  Settings,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  MessageCircle,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Save,
  Search,
  ArrowRight,
  ShieldCheck,
  Building,
  RefreshCw,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';
import {
  Appointment,
  Treatment,
  PricingCategory,
  ClinicSettings,
  Patient
} from '@/lib/clinicData';
import {
  PatientTreatmentHistoryItem,
  PatientProfile
} from '@/lib/patientData';

interface DoctorDashboardProps {
  appointments: Appointment[];
  treatments: Treatment[];
  pricingCategories: PricingCategory[];
  settings: ClinicSettings;
  treatmentHistory?: PatientTreatmentHistoryItem[];
  patientProfiles?: PatientProfile[];
  onUpdateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  onDeleteAppointment: (id: string) => void;
  onUpdateTreatmentPrice: (id: string, newPrice: number) => void;
  onUpdateSettings: (newSettings: Partial<ClinicSettings>) => void;
  onAddTreatmentRecord?: (record: Omit<PatientTreatmentHistoryItem, 'id'>) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  appointments,
  treatments,
  pricingCategories,
  settings,
  treatmentHistory = [],
  patientProfiles = [],
  onUpdateAppointmentStatus,
  onDeleteAppointment,
  onUpdateTreatmentPrice,
  onUpdateSettings,
  onAddTreatmentRecord,
  onResetData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'treatments' | 'patients' | 'settings'>('appointments');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPatientPhone, setSelectedPatientPhone] = useState<string | null>(null);

  // Form for adding a new clinical treatment record
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecordSoin, setNewRecordSoin] = useState('Botox Front & Pattes d’oie');
  const [newRecordZone, setNewRecordZone] = useState('Visage');
  const [newRecordProduct, setNewRecordProduct] = useState('Bocouture Merz 50U');
  const [newRecordLot, setNewRecordLot] = useState('LOT-2026-MED');
  const [newRecordPrice, setNewRecordPrice] = useState(25000);
  const [newRecordNotes, setNewRecordNotes] = useState('Séance réalisée sans incident.');

  // Editing state for settings
  const [tempSettings, setTempSettings] = useState<ClinicSettings>(settings);
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadMsg, setLogoUploadMsg] = useState<string | null>(null);

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    setLogoUploadMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        localStorage.setItem('gh_clinic_official_logo_data', dataUrl);
        window.dispatchEvent(new CustomEvent('gh_clinic_logo_updated', { detail: { dataUrl } }));
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('logo', file);
      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setLogoUploadMsg('Logo officiel synchronisé avec succès dans public/image.png et public/logo.png !');
      } else {
        setLogoUploadMsg('Logo actif dans la session.');
      }
    } catch {
      setLogoUploadMsg('Logo actif localement.');
    } finally {
      setLogoUploading(false);
    }
  };

  // Stats calculation
  const totalBookings = appointments.length;
  const pendingBookings = appointments.filter((a) => a.status === 'pending').length;
  const confirmedBookings = appointments.filter((a) => a.status === 'confirmed').length;
  const completedBookings = appointments.filter((a) => a.status === 'completed').length;
  const totalRevenue = appointments
    .filter((a) => a.status === 'confirmed' || a.status === 'completed')
    .reduce((acc, a) => acc + (a.totalPriceDZD || 0), 0);

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.treatmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientPhone.includes(searchQuery) ||
      a.patientCity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
            <Clock className="w-3 h-3" /> En Attente
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Confirmé
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <CheckCircle2 className="w-3 h-3" /> Honoré
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            <XCircle className="w-3 h-3" /> Annulé
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-6xl bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden border border-[#E5D4CB] my-6 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Portal Header */}
        <div className="p-6 bg-white border-b border-[#E5D4CB] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <OfficialLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9E6B55]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E6B55]">
                  Espace Praticien & Administration
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-stone-900 mt-1">
                Tableau de Bord — {settings.clinicName}
              </h2>
              <p className="text-xs text-stone-500 font-light">
                Gestionnaire de rendez-vous & tarification • Dr. Ghaouat Sarra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
            >
              Fermer l’espace
            </button>
          </div>
        </div>

        {/* Dashboard Top Stats Cards */}
        <div className="p-6 bg-[#FAF8F5] border-b border-[#E5D4CB]/60 grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <div className="p-4 rounded-2xl bg-white border border-[#E5D4CB] shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-[11px] font-semibold uppercase">Total Réservations</span>
              <Calendar className="w-4 h-4 text-[#9E6B55]" />
            </div>
            <div className="font-serif font-bold text-2xl text-stone-900">{totalBookings}</div>
            <div className="text-[10px] text-stone-500 mt-1">{pendingBookings} en attente de confirmation</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E5D4CB] shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-[11px] font-semibold uppercase">RDV Confirmés</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-serif font-bold text-2xl text-emerald-700">{confirmedBookings}</div>
            <div className="text-[10px] text-stone-500 mt-1">Planifiés avec patientes</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E5D4CB] shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-[11px] font-semibold uppercase">Soins Honorés</span>
              <Sparkles className="w-4 h-4 text-[#DFBA9D]" />
            </div>
            <div className="font-serif font-bold text-2xl text-stone-900">{completedBookings}</div>
            <div className="text-[10px] text-stone-500 mt-1">Actes réalisés au cabinet</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E5D4CB] shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-[11px] font-semibold uppercase">Chiffre d’Affaires</span>
              <TrendingUp className="w-4 h-4 text-[#9E6B55]" />
            </div>
            <div className="font-serif font-bold text-xl sm:text-2xl text-[#9E6B55]">
              {totalRevenue.toLocaleString()} DZD
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Actes confirmés & réalisés</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 bg-white border-b border-[#E5D4CB] flex items-center gap-4 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-2 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'border-[#9E6B55] text-[#9E6B55]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rendez-vous Patientes ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('treatments')}
            className={`pb-2 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'treatments'
                ? 'border-[#9E6B55] text-[#9E6B55]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Gestion des Tarifs ({treatments.length} soins)</span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`pb-2 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'patients'
                ? 'border-[#9E6B55] text-[#9E6B55]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Dossiers & Historique Patientes ({patientProfiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 px-1 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-[#9E6B55] text-[#9E6B55]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres du Cabinet</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* 1. APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-stone-600">Filtrer :</span>
                  {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                        statusFilter === st
                          ? 'bg-[#1C1917] text-white'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {st === 'all' ? 'Tous' : st === 'pending' ? 'En attente' : st === 'confirmed' ? 'Confirmés' : st === 'completed' ? 'Honorés' : 'Annulés'}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher patient, soin, tel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-white border border-stone-200 text-xs text-stone-800 focus:outline-hidden focus:border-[#9E6B55]"
                  />
                </div>
              </div>

              {/* Appointments Table */}
              <div className="overflow-x-auto rounded-2xl border border-[#E5D4CB] bg-white shadow-xs">
                <table className="w-full text-left text-xs text-stone-700 border-collapse">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5D4CB] text-stone-900 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Patiente</th>
                      <th className="py-3 px-4">Soin & Tarif</th>
                      <th className="py-3 px-4">Date & Créneau</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-center">Actions & WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-stone-400">
                          Aucun rendez-vous ne correspond à vos filtres.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((app) => (
                        <tr key={app.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{app.patientName}</div>
                            <div className="text-[11px] text-stone-500">{app.patientPhone}</div>
                            <div className="text-[10px] text-stone-400">{app.patientCity} {app.isFirstVisit ? '• 1ère visite' : ''}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-stone-800">{app.treatmentName}</div>
                            <div className="font-serif font-bold text-[#9E6B55]">{app.totalPriceDZD.toLocaleString()} DZD</div>
                            {app.notes && (
                              <div className="text-[10px] text-stone-500 italic mt-0.5 max-w-xs">« {app.notes} »</div>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-bold text-stone-800">{app.date}</div>
                            <div className="text-[#9E6B55] font-semibold">{app.timeSlot}</div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            {getStatusBadge(app.status)}
                          </td>

                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* WhatsApp Direct Contact Button */}
                              <a
                                href={`https://wa.me/${app.patientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${app.patientName}, nous confirmons votre rendez-vous chez GH Clinic (Dr. Ghaouat Sarra) le ${app.date} à ${app.timeSlot} pour ${app.treatmentName}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                                title="Contacter sur WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              {/* Status changer buttons */}
                              {app.status === 'pending' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(app.id, 'confirmed')}
                                  className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700"
                                >
                                  Confirmer
                                </button>
                              )}

                              {app.status === 'confirmed' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(app.id, 'completed')}
                                  className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700"
                                >
                                  Terminé
                                </button>
                              )}

                              {app.status !== 'cancelled' && (
                                <button
                                  onClick={() => onUpdateAppointmentStatus(app.id, 'cancelled')}
                                  className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 text-[10px] font-bold"
                                >
                                  Annuler
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm('Voulez-vous supprimer ce rendez-vous ?')) {
                                    onDeleteAppointment(app.id);
                                  }
                                }}
                                className="w-7 h-7 rounded-full text-stone-300 hover:text-red-500 flex items-center justify-center transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. TREATMENTS & PRICING LIVE EDITOR */}
          {activeTab === 'treatments' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E5D4CB] shadow-xs">
                <h3 className="font-serif font-bold text-lg text-stone-900 mb-1">
                  Catalogue & Tarifs en Dinars Algériens (DZD)
                </h3>
                <p className="text-xs text-stone-500 font-light mb-4">
                  Modifiez instantanément les tarifs affichés sur le site internet pour chaque prestation médicale.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {treatments.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5D4CB] space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#9E6B55]">{t.categoryLabel}</span>
                        <h4 className="font-semibold text-stone-900 text-sm">{t.name}</h4>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-stone-600">Tarif Séance (DZD) :</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={t.priceDZD}
                            onBlur={(e) => onUpdateTreatmentPrice(t.id, Number(e.target.value))}
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-300 font-serif font-bold text-sm text-[#9E6B55] bg-white"
                          />
                          <span className="text-xs font-bold text-stone-500">DZD</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. PATIENTS DOSSIERS & MEDICAL HISTORY TAB */}
          {activeTab === 'patients' && (() => {
            const activeProfile = selectedPatientPhone
              ? patientProfiles.find(
                  (p) =>
                    p.phone.replace(/[^0-9]/g, '').endsWith(selectedPatientPhone.replace(/[^0-9]/g, '')) ||
                    selectedPatientPhone.replace(/[^0-9]/g, '').endsWith(p.phone.replace(/[^0-9]/g, ''))
                )
              : null;

            const activeHistory = selectedPatientPhone
              ? treatmentHistory.filter(
                  (th) =>
                    th.patientPhone.replace(/[^0-9]/g, '').endsWith(selectedPatientPhone.replace(/[^0-9]/g, '')) ||
                    selectedPatientPhone.replace(/[^0-9]/g, '').endsWith(th.patientPhone.replace(/[^0-9]/g, ''))
                )
              : [];

            const activeUpcoming = selectedPatientPhone
              ? appointments.filter(
                  (a) =>
                    a.patientPhone.replace(/[^0-9]/g, '').endsWith(selectedPatientPhone.replace(/[^0-9]/g, '')) ||
                    selectedPatientPhone.replace(/[^0-9]/g, '').endsWith(a.patientPhone.replace(/[^0-9]/g, ''))
                )
              : [];

            const handleSaveNewRecord = (e: React.FormEvent) => {
              e.preventDefault();
              if (!selectedPatientPhone || !onAddTreatmentRecord) return;

              let cat: PatientTreatmentHistoryItem['category'] = 'facial';
              const sLow = newRecordSoin.toLowerCase();
              if (sLow.includes('laser')) cat = 'laser';
              else if (sLow.includes('botox') || sLow.includes('filler') || sLow.includes('acide')) cat = 'injectables';
              else if (sLow.includes('prp')) cat = 'regeneration';

              onAddTreatmentRecord({
                patientPhone: selectedPatientPhone,
                treatmentId: `treat-${Date.now()}`,
                treatmentName: newRecordSoin,
                category: cat,
                categoryLabel: cat === 'laser' ? 'Épilation Laser' : cat === 'injectables' ? 'Injectables & Botox' : cat === 'regeneration' ? 'PRP & Cheveux' : 'Soins Visage',
                date: new Date().toISOString().split('T')[0],
                timeSlot: '11:00',
                doctorName: 'Dr. Ghaouat Sarra',
                zoneTreated: newRecordZone,
                productOrDevice: newRecordProduct,
                batchNumber: newRecordLot,
                totalPriceDZD: Number(newRecordPrice),
                status: 'completed',
                clinicalNotes: newRecordNotes,
                doctorObservations: 'Acte consigné par Dr. Ghaouat dans le dossier médical.',
                postCareSummary: ['Consignes post-soin expliquées', 'Protocole remis à la patiente'],
                patientSatisfactionRating: 5,
                healingStatus: 'healed',
              });

              setIsAddingRecord(false);
              alert('Acte médical enregistré avec succès dans l’historique de la patiente !');
            };

            return (
              <div className="space-y-6">
                {activeProfile ? (
                  <div className="space-y-4">
                    {/* Back to list & Patient Dossier Header */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedPatientPhone(null)}
                        className="text-xs text-[#9E6B55] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        ← Retour à la liste des patientes
                      </button>

                      <button
                        onClick={() => setIsAddingRecord(!isAddingRecord)}
                        className="px-4 py-2 rounded-full bg-[#9E6B55] hover:bg-[#835642] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAddingRecord ? 'Fermer le formulaire' : 'Ajouter un Acte Réalisé'}</span>
                      </button>
                    </div>

                    {/* Patient Dossier Details */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E5D4CB] shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9E6B55] to-[#DFBA9D] text-white flex items-center justify-center font-bold text-base">
                            {activeProfile.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-serif font-bold text-lg text-stone-900">{activeProfile.name}</h3>
                            <div className="text-xs text-stone-500">{activeProfile.phone} • {activeProfile.city}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                            {activeProfile.status}
                          </span>
                          <span className="text-xs text-stone-500">
                            Code PIN : <strong className="font-mono text-stone-800">{activeProfile.pinCode}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200">
                          <span className="text-[10px] text-stone-400 block font-semibold uppercase">Phototype Cutané</span>
                          <span className="font-bold text-stone-800">{activeProfile.phototype || 'Phototype III'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200">
                          <span className="text-[10px] text-stone-400 block font-semibold uppercase">Allergies Signalées</span>
                          <span className="font-semibold text-rose-700">{activeProfile.knownAllergies?.join(', ') || 'Aucune'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200">
                          <span className="text-[10px] text-stone-400 block font-semibold uppercase">Fréquentation</span>
                          <span className="font-bold text-[#9E6B55]">{activeHistory.length} actes réalisés</span>
                        </div>
                      </div>

                      {activeProfile.doctorNotes && (
                        <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200 italic">
                          « {activeProfile.doctorNotes} »
                        </div>
                      )}
                    </div>

                    {/* New Treatment Form Modal / Accordion */}
                    {isAddingRecord && (
                      <form onSubmit={handleSaveNewRecord} className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-4 text-xs">
                        <h4 className="font-serif font-bold text-sm text-stone-900">
                          Consigner un Nouvel Acte Médical dans l’Historique de {activeProfile.name}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold text-stone-700 mb-1">Nom du Soin / Acte :</label>
                            <input
                              type="text"
                              value={newRecordSoin}
                              onChange={(e) => setNewRecordSoin(e.target.value)}
                              required
                              className="w-full p-2 bg-white rounded-lg border border-stone-300"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-stone-700 mb-1">Zone Ciblée :</label>
                            <input
                              type="text"
                              value={newRecordZone}
                              onChange={(e) => setNewRecordZone(e.target.value)}
                              required
                              className="w-full p-2 bg-white rounded-lg border border-stone-300"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-stone-700 mb-1">Produit & Dosage :</label>
                            <input
                              type="text"
                              value={newRecordProduct}
                              onChange={(e) => setNewRecordProduct(e.target.value)}
                              required
                              className="w-full p-2 bg-white rounded-lg border border-stone-300"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-stone-700 mb-1">Numéro de Lot Médical :</label>
                            <input
                              type="text"
                              value={newRecordLot}
                              onChange={(e) => setNewRecordLot(e.target.value)}
                              className="w-full p-2 bg-white rounded-lg border border-stone-300"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-stone-700 mb-1">Tarif Honoré (DA) :</label>
                            <input
                              type="number"
                              value={newRecordPrice}
                              onChange={(e) => setNewRecordPrice(Number(e.target.value))}
                              required
                              className="w-full p-2 bg-white rounded-lg border border-stone-300"
                            />
                          </div>

                          <div className="sm:col-span-2 lg:col-span-3">
                            <label className="block font-semibold text-stone-700 mb-1">Observations & Notes Médicales :</label>
                            <textarea
                              rows={2}
                              value={newRecordNotes}
                              onChange={(e) => setNewRecordNotes(e.target.value)}
                              className="w-full p-2 bg-white rounded-lg border border-stone-300"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingRecord(false)}
                            className="px-4 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 font-semibold"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-[#9E6B55] text-white font-semibold shadow-xs"
                          >
                            Enregistrer dans le dossier
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Historical Treatments Timeline */}
                    <div className="space-y-3">
                      <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#9E6B55]" />
                        <span>Historique des Soins Antérieurs ({activeHistory.length})</span>
                      </h4>

                      {activeHistory.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl border border-stone-200 text-center text-xs text-stone-400">
                          Aucun acte médical antérieur consigné pour le moment.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {activeHistory.map((item) => (
                            <div key={item.id} className="p-4 rounded-xl bg-white border border-[#E5D4CB] text-xs space-y-2 shadow-2xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-stone-900 text-sm">{item.treatmentName}</span>
                                  <div className="text-[11px] text-stone-500">
                                    Date : {item.date} • {item.zoneTreated} • Lot : <span className="font-mono text-stone-700">{item.batchNumber || item.productOrDevice}</span>
                                  </div>
                                </div>
                                <span className="font-serif font-bold text-[#8E2842] text-sm">
                                  {item.totalPriceDZD.toLocaleString()} DA
                                </span>
                              </div>
                              <p className="text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 italic">
                                « {item.clinicalNotes} »
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Upcoming Appointments for this patient */}
                    <div className="space-y-2 pt-2">
                      <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Prochains Rendez-vous Programmés ({activeUpcoming.length})</span>
                      </h4>
                      {activeUpcoming.length === 0 ? (
                        <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs text-stone-400">
                          Aucun prochain rendez-vous planifié.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {activeUpcoming.map((apt) => (
                            <div key={apt.id} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs flex justify-between items-center">
                              <div>
                                <span className="font-bold text-stone-900">{apt.treatmentName}</span>
                                <div className="text-[11px] text-stone-600">
                                  {apt.date} à {apt.timeSlot} • Statut : <strong className="text-emerald-700">{apt.status}</strong>
                                </div>
                              </div>
                              <span className="font-bold text-[#8E2842]">{apt.totalPriceDZD.toLocaleString()} DA</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Patient Profiles Table */
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-stone-900">
                          Dossiers Médicaux Patientes & Traçabilité des Soins
                        </h3>
                        <p className="text-xs text-stone-500 font-light">
                          Sélectionnez une patiente pour consulter son historique complet, ses actes passés et lui assigner un compte-rendu post-procédure.
                        </p>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Rechercher patiente..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-full bg-white border border-stone-200 text-xs text-stone-800 focus:outline-hidden focus:border-[#9E6B55]"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-[#E5D4CB] bg-white shadow-xs">
                      <table className="w-full text-left text-xs text-stone-700 border-collapse">
                        <thead className="bg-[#FAF8F5] border-b border-[#E5D4CB] text-stone-900 uppercase font-semibold text-[10px] tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Patiente</th>
                            <th className="py-3 px-4">Ville & Phototype</th>
                            <th className="py-3 px-4">Dossier / Code PIN</th>
                            <th className="py-3 px-4 text-center">Historique Soins</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {patientProfiles
                            .filter(
                              (p) =>
                                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.phone.includes(searchQuery) ||
                                p.city.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((p) => {
                              const pHistory = treatmentHistory.filter((th) =>
                                th.patientPhone.replace(/[^0-9]/g, '').endsWith(p.phone.replace(/[^0-9]/g, ''))
                              );
                              return (
                                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                                  <td className="py-3 px-4">
                                    <div className="font-bold text-stone-900">{p.name}</div>
                                    <div className="text-[11px] text-stone-500">{p.phone}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div>{p.city}</div>
                                    <div className="text-[10px] text-[#9E6B55] font-semibold">{p.phototype || 'Phototype III'}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="font-mono text-stone-600 text-[11px]">{p.id}</span>
                                    <div className="text-[10px] text-stone-400">PIN: {p.pinCode}</div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="px-2.5 py-1 rounded-full bg-[#9E6B55]/10 text-[#9E6B55] font-bold text-[11px]">
                                      {pHistory.length} séance(s)
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <button
                                      onClick={() => setSelectedPatientPhone(p.phone)}
                                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#DFBA9D] to-[#9E6B55] text-white font-semibold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                                    >
                                      Ouvrir le dossier
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* 4. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              {/* Brand Logo Asset Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5D4CB] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#9E6B55]" />
                      <span>Identité Visuelle & Logo Officiel</span>
                    </h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Asset officiel et immuable de la marque GH Clinic • Dr. Ghaouat Sarra
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-pink-100 text-[#9E2A50] border border-pink-200">
                    Source Certifiée
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5D4CB] flex flex-col sm:flex-row items-center gap-5">
                  <div className="shrink-0 p-2 bg-white rounded-2xl border border-stone-200 shadow-xs">
                    <OfficialLogo size="xl" />
                  </div>
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="text-xs font-semibold text-stone-900">
                      Fichier source actif : <code className="px-1.5 py-0.5 bg-stone-100 rounded text-[#9E6B55] font-mono">/image.png</code>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                      Conformité stricte : aucun filtre IA, proportions et typographies originales préservées à 100%. Référencé sur la barre de navigation, le profil du médecin, le pied de page et les portails patients.
                    </p>

                    <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9E6B55] hover:bg-[#855743] text-white text-xs font-medium transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{logoUploading ? 'Synchronisation...' : 'Synchroniser / Mettre à jour le fichier'}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={handleLogoFileChange}
                          disabled={logoUploading}
                        />
                      </label>
                    </div>

                    {logoUploadMsg && (
                      <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {logoUploadMsg}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 bg-white p-6 rounded-2xl border border-[#E5D4CB] shadow-xs">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Coordonnées & Informations du Cabinet
                </h3>

              {isSavedAlert && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Modifications enregistrées avec succès !</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nom du Médecin :</label>
                  <input
                    type="text"
                    value={tempSettings.doctorName}
                    onChange={(e) => setTempSettings({ ...tempSettings, doctorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Téléphone Appel :</label>
                  <input
                    type="text"
                    value={tempSettings.phone}
                    onChange={(e) => setTempSettings({ ...tempSettings, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Numéro WhatsApp (sans +) :</label>
                  <input
                    type="text"
                    value={tempSettings.whatsappPhone}
                    onChange={(e) => setTempSettings({ ...tempSettings, whatsappPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Ville :</label>
                  <input
                    type="text"
                    value={tempSettings.city}
                    onChange={(e) => setTempSettings({ ...tempSettings, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Adresse Complète :</label>
                  <input
                    type="text"
                    value={tempSettings.address}
                    onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">Bandeau d’Annonce Haut de Page :</label>
                  <input
                    type="text"
                    value={tempSettings.announcementText}
                    onChange={(e) => setTempSettings({ ...tempSettings, announcementText: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Réinitialiser toutes les données par défaut ?')) {
                      onResetData();
                      alert('Données réinitialisées !');
                    }
                  }}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Réinitialiser les données démo</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] text-white font-semibold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer les Modifications</span>
                </button>
              </div>
            </form>
          </div>
          )}

        </div>
      </div>
    </div>
  );
};
