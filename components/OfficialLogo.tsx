'use client';

import React, { useState, useEffect } from 'react';

interface OfficialLogoProps {
  className?: string;
  imageClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showSubtitle?: boolean;
  alt?: string;
  onClick?: () => void;
  src?: string;
}

export const OFFICIAL_LOGO_SRC = '/image.png';
export const OFFICIAL_LOGO_FALLBACK_SRC = '/logo.png';

/**
 * Official Brand Logo Component for GH Clinic (Dr. Ghaouat Sarra)
 * 
 * Strict compliance with brand guidelines:
 * - Direct immutable source asset reference (/image.png)
 * - Exact aspect ratio preservation with object-contain
 * - Zero pixel alteration, zero AI reinterpretation, zero vectorization
 * - Responsive presentation and elegant luxury framing
 */
export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  className = '',
  imageClassName = '',
  size = 'md',
  showSubtitle = false,
  alt = 'GH Clinic — Cabinet Médico-Esthétique Dr. Ghaouat Sarra (Official Logo)',
  onClick,
  src,
}) => {
  const [storedSrc, setStoredSrc] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('gh_clinic_official_logo_data');
      } catch {
        return null;
      }
    }
    return null;
  });
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Subscribe to custom logo update events from dashboard
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLogoUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ dataUrl: string }>;
      if (customEvent.detail?.dataUrl) {
        setStoredSrc(customEvent.detail.dataUrl);
        setHasError(false);
      }
    };

    window.addEventListener('gh_clinic_logo_updated', handleLogoUpdate);
    return () => {
      window.removeEventListener('gh_clinic_logo_updated', handleLogoUpdate);
    };
  }, []);

  const currentSrc = fallbackSrc || src || storedSrc || OFFICIAL_LOGO_SRC;

  // Size preset configurations
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-32 sm:h-32',
    custom: '',
  };

  const containerDimension = size !== 'custom' ? sizeMap[size] : '';

  return (
    <div
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div
        className={`relative ${containerDimension} shrink-0 rounded-full overflow-hidden bg-[#FAF2F0] border border-[#E5D4CB]/70 shadow-xs flex items-center justify-center p-0.5 group-hover:border-[#C73859]/50 transition-all duration-300`}
      >
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-contain ${imageClassName}`}
          loading="eager"
          decoding="async"
          onError={() => {
            if (!fallbackSrc && currentSrc === OFFICIAL_LOGO_SRC) {
              setFallbackSrc(OFFICIAL_LOGO_FALLBACK_SRC);
            } else {
              setHasError(true);
            }
          }}
        />

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#DFBA9D] via-[#C5A089] to-[#9E6B55] text-white font-serif font-bold text-xs">
            GH
          </div>
        )}
      </div>

      {showSubtitle && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] tracking-tight group-hover:text-[#9E2A50] transition-colors leading-tight">
              GH CLINIC
            </span>
            <span className="hidden sm:inline-block text-[9px] font-serif uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-pink-100 text-[#9E2A50] border border-pink-200">
              Médical
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium tracking-wide">
            Dr. Ghaouat Sarra • Khemis Miliana
          </span>
        </div>
      )}
    </div>
  );
};
