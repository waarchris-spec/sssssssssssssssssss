'use client';

import { useState, useEffect } from 'react';
import {
  Treatment,
  PricingCategory,
  BeforeAfterCase,
  Testimonial,
  GalleryItem,
  FAQItem,
  Appointment,
  Patient,
  ClinicSettings,
  TREATMENTS,
  PRICING_CATEGORIES,
  BEFORE_AFTER_CASES,
  TESTIMONIALS,
  GALLERY_ITEMS,
  FAQ_ITEMS,
  INITIAL_APPOINTMENTS,
  INITIAL_PATIENTS,
  INITIAL_CLINIC_SETTINGS
} from './clinicData';
import {
  PatientTreatmentHistoryItem,
  PatientProfile,
  DEMO_PATIENTS_DATABASE,
  INITIAL_TREATMENT_HISTORY
} from './patientData';

const STORAGE_KEYS = {
  TREATMENTS: 'gh_clinic_treatments_v1',
  PRICING: 'gh_clinic_pricing_v1',
  BEFORE_AFTER: 'gh_clinic_before_after_v1',
  TESTIMONIALS: 'gh_clinic_testimonials_v1',
  GALLERY: 'gh_clinic_gallery_v1',
  FAQ: 'gh_clinic_faq_v1',
  APPOINTMENTS: 'gh_clinic_appointments_v1',
  PATIENTS: 'gh_clinic_patients_v1',
  SETTINGS: 'gh_clinic_settings_v1',
  TREATMENT_HISTORY: 'gh_clinic_treatment_history_v1',
  PATIENT_PROFILES: 'gh_clinic_patient_profiles_v1',
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function useClinicStore() {
  const [treatments, setTreatments] = useState<Treatment[]>(() =>
    getStored(STORAGE_KEYS.TREATMENTS, TREATMENTS)
  );
  const [pricingCategories, setPricingCategories] = useState<PricingCategory[]>(() =>
    getStored(STORAGE_KEYS.PRICING, PRICING_CATEGORIES)
  );
  const [beforeAfterCases, setBeforeAfterCases] = useState<BeforeAfterCase[]>(() =>
    getStored(STORAGE_KEYS.BEFORE_AFTER, BEFORE_AFTER_CASES)
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    getStored(STORAGE_KEYS.TESTIMONIALS, TESTIMONIALS)
  );
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() =>
    getStored(STORAGE_KEYS.GALLERY, GALLERY_ITEMS)
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(() =>
    getStored(STORAGE_KEYS.FAQ, FAQ_ITEMS)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS)
  );
  const [patients, setPatients] = useState<Patient[]>(() =>
    getStored(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS)
  );
  const [treatmentHistory, setTreatmentHistory] = useState<PatientTreatmentHistoryItem[]>(() =>
    getStored(STORAGE_KEYS.TREATMENT_HISTORY, INITIAL_TREATMENT_HISTORY)
  );
  const [patientProfiles, setPatientProfiles] = useState<PatientProfile[]>(() =>
    getStored(STORAGE_KEYS.PATIENT_PROFILES, DEMO_PATIENTS_DATABASE)
  );
  const [settings, setSettings] = useState<ClinicSettings>(() =>
    getStored(STORAGE_KEYS.SETTINGS, INITIAL_CLINIC_SETTINGS)
  );

  const saveTreatmentHistory = (newHistory: PatientTreatmentHistoryItem[]) => {
    setTreatmentHistory(newHistory);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TREATMENT_HISTORY, JSON.stringify(newHistory));
    }
  };

  const savePatientProfiles = (newProfiles: PatientProfile[]) => {
    setPatientProfiles(newProfiles);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILES, JSON.stringify(newProfiles));
    }
  };

  const saveTreatments = (newTreatments: Treatment[]) => {
    setTreatments(newTreatments);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(newTreatments));
    }
  };

  const updateTreatmentPrice = (id: string, newPrice: number) => {
    const updated = treatments.map((t) => (t.id === id ? { ...t, priceDZD: newPrice } : t));
    saveTreatments(updated);
  };

  const savePricingCategories = (newPricing: PricingCategory[]) => {
    setPricingCategories(newPricing);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(newPricing));
    }
  };

  const saveBeforeAfter = (newBA: BeforeAfterCase[]) => {
    setBeforeAfterCases(newBA);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BEFORE_AFTER, JSON.stringify(newBA));
    }
  };

  const saveTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(newTestimonials));
    }
  };

  const saveGallery = (newGallery: GalleryItem[]) => {
    setGalleryItems(newGallery);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(newGallery));
    }
  };

  const saveFaqs = (newFaqs: FAQItem[]) => {
    setFaqs(newFaqs);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FAQ, JSON.stringify(newFaqs));
    }
  };

  const saveSettings = (newSettings: ClinicSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    }
  };

  const updateSettings = (partial: Partial<ClinicSettings>) => {
    const merged = { ...settings, ...partial };
    saveSettings(merged);
  };

  const addAppointment = (newApt: Omit<Appointment, 'id' | 'createdAt'>) => {
    const appointmentId = `apt-${Date.now()}`;
    const fullAppointment: Appointment = {
      ...newApt,
      id: appointmentId,
      createdAt: new Date().toISOString(),
    };

    const updatedApts = [fullAppointment, ...appointments];
    setAppointments(updatedApts);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedApts));
    }

    // Update patients list
    const cleanPhone = newApt.patientPhone.replace(/\s+/g, '');
    const existingPatientIndex = patients.findIndex(
      (p) => p.phone.replace(/\s+/g, '') === cleanPhone
    );

    let updatedPatients = [...patients];
    if (existingPatientIndex >= 0) {
      const existing = updatedPatients[existingPatientIndex];
      updatedPatients[existingPatientIndex] = {
        ...existing,
        totalVisits: existing.totalVisits + 1,
        totalSpentDZD: existing.totalSpentDZD + newApt.totalPriceDZD,
        lastTreatment: newApt.treatmentName,
      };
    } else {
      const newPatient: Patient = {
        id: `pat-${Date.now()}`,
        name: newApt.patientName,
        phone: newApt.patientPhone,
        email: newApt.patientEmail || '',
        city: newApt.patientCity || 'Khemis Miliana',
        firstVisitDate: newApt.date,
        totalVisits: 1,
        totalSpentDZD: newApt.totalPriceDZD,
        lastTreatment: newApt.treatmentName,
        medicalNotes: newApt.notes || 'Nouveau patient via le site web.',
      };
      updatedPatients = [newPatient, ...updatedPatients];
    }

    setPatients(updatedPatients);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updatedPatients));
    }

    // Ensure Patient Profile exists for portal login
    const existingProfile = patientProfiles.find(
      (p) => p.phone.replace(/\s+/g, '') === cleanPhone
    );
    if (!existingProfile) {
      const newProfile: PatientProfile = {
        id: `prof-${Date.now()}`,
        pinCode: '1234',
        name: newApt.patientName,
        phone: newApt.patientPhone,
        email: newApt.patientEmail || '',
        city: newApt.patientCity || 'Khemis Miliana',
        memberSince: new Date().toISOString().split('T')[0],
        status: 'Régulier',
        doctorNotes: newApt.notes || 'Patient enregistré suite à une réservation en ligne.',
      };
      const updatedProfiles = [newProfile, ...patientProfiles];
      savePatientProfiles(updatedProfiles);
    }

    return fullAppointment;
  };

  const addTreatmentRecord = (record: Omit<PatientTreatmentHistoryItem, 'id'>) => {
    const newRecord: PatientTreatmentHistoryItem = {
      ...record,
      id: `th-${Date.now()}`,
    };
    const updated = [newRecord, ...treatmentHistory];
    saveTreatmentHistory(updated);
    return newRecord;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const targetApt = appointments.find((a) => a.id === id);
    const updated = appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt));
    setAppointments(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    }

    // If marked as completed, automatically add to Treatment History if not already created
    if (status === 'completed' && targetApt) {
      const alreadyHasHistory = treatmentHistory.some(
        (th) =>
          th.patientPhone.replace(/\s+/g, '') === targetApt.patientPhone.replace(/\s+/g, '') &&
          th.date === targetApt.date &&
          th.treatmentName === targetApt.treatmentName
      );

      if (!alreadyHasHistory) {
        let cat: PatientTreatmentHistoryItem['category'] = 'facial';
        const tLower = targetApt.treatmentName.toLowerCase();
        if (tLower.includes('laser') || tLower.includes('epilation')) cat = 'laser';
        else if (tLower.includes('botox') || tLower.includes('filler') || tLower.includes('hyaluronique')) cat = 'injectables';
        else if (tLower.includes('prp') || tLower.includes('cheveux')) cat = 'regeneration';

        addTreatmentRecord({
          patientPhone: targetApt.patientPhone,
          treatmentId: targetApt.treatmentId,
          treatmentName: targetApt.treatmentName,
          category: cat,
          categoryLabel: cat === 'laser' ? 'Épilation Laser' : cat === 'injectables' ? 'Injectables & Botox' : cat === 'regeneration' ? 'PRP & Cheveux' : 'Soins Visage',
          date: targetApt.date,
          timeSlot: targetApt.timeSlot,
          doctorName: 'Dr. Ghaouat Sarra',
          zoneTreated: 'Zone sélectionnée au cabinet',
          productOrDevice: 'Dispositif médical certifié CE',
          totalPriceDZD: targetApt.totalPriceDZD,
          status: 'completed',
          clinicalNotes: targetApt.notes || 'Séance réalisée avec succès par Dr. Ghaouat Sarra.',
          doctorObservations: 'Excellente tolérance cutanée observée.',
          postCareSummary: [
            'Fiche de conseils post-procédure remise et expliquée',
            'Prochaine séance recommandée selon le plan personnalisé'
          ],
          patientSatisfactionRating: 5,
          healingStatus: 'healed'
        });
      }
    }
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((apt) => apt.id !== id);
    setAppointments(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    }
  };

  const getPatientHistory = (phone: string): PatientTreatmentHistoryItem[] => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return treatmentHistory.filter((th) => {
      const thPhone = th.patientPhone.replace(/[^0-9]/g, '');
      return thPhone.endsWith(cleanPhone) || cleanPhone.endsWith(thPhone);
    });
  };

  const getPatientUpcomingAppointments = (phone: string): Appointment[] => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return appointments.filter((apt) => {
      const aptPhone = apt.patientPhone.replace(/[^0-9]/g, '');
      return aptPhone.endsWith(cleanPhone) || cleanPhone.endsWith(aptPhone);
    });
  };

  const getPatientProfile = (phone: string): PatientProfile | undefined => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return patientProfiles.find((p) => {
      const pPhone = p.phone.replace(/[^0-9]/g, '');
      return pPhone.endsWith(cleanPhone) || cleanPhone.endsWith(pPhone);
    });
  };

  const resetToDefault = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    setTreatments(TREATMENTS);
    setPricingCategories(PRICING_CATEGORIES);
    setBeforeAfterCases(BEFORE_AFTER_CASES);
    setTestimonials(TESTIMONIALS);
    setGalleryItems(GALLERY_ITEMS);
    setFaqs(FAQ_ITEMS);
    setAppointments(INITIAL_APPOINTMENTS);
    setPatients(INITIAL_PATIENTS);
    setTreatmentHistory(INITIAL_TREATMENT_HISTORY);
    setPatientProfiles(DEMO_PATIENTS_DATABASE);
    setSettings(INITIAL_CLINIC_SETTINGS);
  };

  return {
    treatments,
    pricingCategories,
    beforeAfterCases,
    testimonials,
    galleryItems,
    faqs,
    appointments,
    patients,
    treatmentHistory,
    patientProfiles,
    settings,
    saveTreatments,
    updateTreatmentPrice,
    savePricingCategories,
    saveBeforeAfter,
    saveTestimonials,
    saveGallery,
    saveFaqs,
    saveSettings,
    updateSettings,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    addTreatmentRecord,
    saveTreatmentHistory,
    savePatientProfiles,
    getPatientHistory,
    getPatientUpcomingAppointments,
    getPatientProfile,
    resetToDefault,
  };
}
