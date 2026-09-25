'use client';

import React, { useState, useEffect } from 'react';
import { useClinicStore } from '@/lib/useClinicStore';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Statistics } from '@/components/Statistics';
import { TarificationSection } from '@/components/TreatmentsSection';
import { TreatmentModal } from '@/components/TreatmentModal';
import { WhyGHClinic } from '@/components/WhyGHClinic';
import { DoctorProfile } from '@/components/DoctorProfile';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { Testimonials } from '@/components/Testimonials';
import { GallerySection } from '@/components/GallerySection';
import { InstagramSection } from '@/components/InstagramSection';
import { FAQSection } from '@/components/FAQSection';
import { LocationSection } from '@/components/LocationSection';
import { Footer } from '@/components/Footer';
import { FloatingActions } from '@/components/FloatingActions';
import { BookingModal } from '@/components/BookingModal';
import { AIReceptionistModal } from '@/components/AIReceptionistModal';
import { DoctorDashboard } from '@/components/DoctorDashboard';
import { PatientDashboard } from '@/components/PatientDashboard';
import { Treatment } from '@/lib/clinicData';

export default function HomePage() {
  const {
    settings,
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
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    addTreatmentRecord,
    updateTreatmentPrice,
    updateSettings,
    resetToDefault,
  } = useClinicStore();

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTreatmentId, setBookingTreatmentId] = useState<string | undefined>(undefined);
  const [bookingTreatmentName, setBookingTreatmentName] = useState<string | undefined>(undefined);

  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Patient Dashboard state
  const [isPatientDashboardOpen, setIsPatientDashboardOpen] = useState(false);
  const [patientDashboardPhone, setPatientDashboardPhone] = useState<string | undefined>(undefined);

  // Modal Handlers
  const handleOpenBooking = React.useCallback((treatmentIdentifier?: string) => {
    if (treatmentIdentifier) {
      setBookingTreatmentId(treatmentIdentifier);
      setBookingTreatmentName(treatmentIdentifier);
    } else {
      setBookingTreatmentId(undefined);
      setBookingTreatmentName(undefined);
    }
    setIsBookingOpen(true);
  }, []);

  const handleOpenPatientDashboard = React.useCallback((phone?: string) => {
    if (phone) {
      setPatientDashboardPhone(phone);
    }
    setIsPatientDashboardOpen(true);
  }, []);

  // Deep-linking URL handler (e.g. ?service=prp-visage or ?patient=true or ?rdv=1)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = urlParams.get('service') || urlParams.get('treatment') || urlParams.get('soin');
      const bookingParam = urlParams.get('booking') || urlParams.get('rdv');
      const patientParam = urlParams.get('patient') || urlParams.get('history') || urlParams.get('portal') || urlParams.get('suivi');

      if (patientParam === 'true' || patientParam === '1' || patientParam === 'dossier') {
        const timer = setTimeout(() => {
          handleOpenPatientDashboard();
        }, 100);
        return () => clearTimeout(timer);
      } else if (serviceParam) {
        const timer = setTimeout(() => {
          handleOpenBooking(serviceParam);
        }, 100);
        return () => clearTimeout(timer);
      } else if (bookingParam === 'true' || bookingParam === '1') {
        const timer = setTimeout(() => {
          handleOpenBooking();
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [handleOpenBooking, handleOpenPatientDashboard]);

  const handleOpenTreatmentModal = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setIsTreatmentModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#F4DCD6] selection:text-[#9E6B55]">
      
      {/* Luxury Navigation Bar */}
      <Navbar
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenPatientDashboard={() => handleOpenPatientDashboard()}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          settings={settings}
          onOpenBooking={() => handleOpenBooking()}
          onExploreTreatments={() => scrollToSection('tarification')}
        />

        {/* 2. Statistical Highlights */}
        <Statistics />

        {/* 3. Tarification & Soins (4 Best-Sellers + Full Tariff Interface) */}
        <TarificationSection
          treatments={treatments}
          onSelectTreatment={handleOpenTreatmentModal}
          onBookTreatment={(treatmentId) => handleOpenBooking(treatmentId)}
        />

        {/* 4. The GH Standard & Excellence Pillars */}
        <WhyGHClinic />

        {/* 5. Doctor Profile & Medical Ethos */}
        <DoctorProfile
          settings={settings}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 6. Interactive Before / After Draggable Comparison */}
        <BeforeAfterSlider
          cases={beforeAfterCases}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 7. Patient Testimonials & Google Ratings */}
        <Testimonials
          testimonials={testimonials}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 9. Sanctuary Photo Gallery & Lightbox */}
        <GallerySection items={galleryItems} />

        {/* 10. Instagram Social Community */}
        <InstagramSection settings={settings} />

        {/* 11. Frequently Asked Questions */}
        <FAQSection
          faqs={faqs}
          onOpenBooking={() => handleOpenBooking()}
          onOpenAI={() => setIsAIOpen(true)}
        />

        {/* 12. Geographic Location & Access (Khemis Miliana) */}
        <LocationSection
          settings={settings}
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* Floating Action Triggers (WhatsApp, AI Receptionist, Back to Top) */}
      <FloatingActions
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Luxury Footer */}
      <Footer
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenPatientDashboard={() => handleOpenPatientDashboard()}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS & DRAWERS                                              */}
      {/* ========================================================================= */}

      {/* Booking Modal (4-step with WhatsApp dispatch) */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        treatments={treatments}
        settings={settings}
        preselectedTreatmentId={bookingTreatmentId}
        preselectedTreatmentName={bookingTreatmentName}
        onSaveAppointment={addAppointment}
        onOpenPatientDashboard={handleOpenPatientDashboard}
      />

      {/* Medical Dossier Modal for Selected Treatment */}
      <TreatmentModal
        isOpen={isTreatmentModalOpen}
        treatment={selectedTreatment}
        onClose={() => setIsTreatmentModalOpen(false)}
        onBook={(treatmentId) => handleOpenBooking(treatmentId)}
      />

      {/* AI Medical Receptionist Drawer (Gemini Powered) */}
      <AIReceptionistModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onOpenBooking={() => {
          setIsAIOpen(false);
          handleOpenBooking();
        }}
        settings={settings}
      />

      {/* Secure Patient Portal & Treatment History Dashboard */}
      <PatientDashboard
        isOpen={isPatientDashboardOpen}
        onClose={() => setIsPatientDashboardOpen(false)}
        initialPhone={patientDashboardPhone}
        settings={settings}
        patientProfiles={patientProfiles}
        treatmentHistory={treatmentHistory}
        appointments={appointments}
        treatments={treatments}
        onOpenBooking={handleOpenBooking}
      />

      {/* Doctor and Clinic Admin Portal */}
      {isDashboardOpen && (
        <DoctorDashboard
          appointments={appointments}
          treatments={treatments}
          pricingCategories={pricingCategories}
          settings={settings}
          treatmentHistory={treatmentHistory}
          patientProfiles={patientProfiles}
          onUpdateAppointmentStatus={updateAppointmentStatus}
          onDeleteAppointment={deleteAppointment}
          onUpdateTreatmentPrice={updateTreatmentPrice}
          onUpdateSettings={updateSettings}
          onAddTreatmentRecord={addTreatmentRecord}
          onResetData={resetToDefault}
          onClose={() => setIsDashboardOpen(false)}
        />
      )}

    </div>
  );
}
