import {
  CalendarCheck,
  Sparkles,
  MapPin,
  User,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { JESSI_CONFIG, buildGoogleMapsUrl, type AppView } from '../data/jessiConfig';
import { AnimatedBiolinkBackground } from './AnimatedBiolinkBackground';
import { JessiLogo } from './JessiLogo';

interface BiolinkViewProps {
  onNavigate: (view: AppView) => void;
  onOpenSocialPending: (network: 'Instagram' | 'Facebook' | 'TikTok') => void;
  onOpenPrivacy: () => void;
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 8H16.5V4.5H14C11.5147 4.5 9.5 6.51472 9.5 9V11.5H7V15H9.5V20.5H13V15H15.8L16.5 11.5H13V9C13 8.44772 13.4477 8 14 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 4V14.5C14 16.433 12.433 18 10.5 18C8.567 18 7 16.433 7 14.5C7 12.567 8.567 11 10.5 11C10.85 11 11.188 11.051 11.507 11.147"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 4C14.7 6.3 16.6 8 19 8.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BiolinkView({
  onNavigate,
  onOpenSocialPending,
  onOpenPrivacy,
}: BiolinkViewProps) {
  const googleMapsHref = buildGoogleMapsUrl();
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-transparent px-4 py-8 sm:py-12">
      <AnimatedBiolinkBackground variant="hero" />
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto rounded-3xl bg-[#F5EDF8]/72 backdrop-blur-md border border-[#70048C]/15 shadow-[0_20px_55px_-18px_rgba(112,4,140,0.16)] p-6 sm:p-10 text-center">
          {/* 1. Logotipo oficial */}
          <div className="flex justify-center">
            <JessiLogo variant="hero" />
          </div>

          {/* 2. Información del profesional, marca y eslogan */}
          <div className="mt-5 space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EE0272]">
              {JESSI_CONFIG.descriptor}
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#70048C]">
              {JESSI_CONFIG.brandName}
            </h1>

            <p className="text-sm sm:text-base font-bold text-[#29212D]">
              {JESSI_CONFIG.artistName}
            </p>

            <p className="pt-1 font-display italic text-lg sm:text-xl font-semibold text-[#70048C] text-balance-wrap">
              “{JESSI_CONFIG.tagline}”
            </p>

            <p className="pt-1 text-xs font-medium text-[#29212D]/75">
              {JESSI_CONFIG.scheduleNote}
            </p>
          </div>

          {/* 3. Botones principales del Biolink (cada uno lleva a su apartado dedicado) */}
          <div className="mt-7 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('reservas')}
              className="w-full inline-flex items-center justify-between gap-3 min-h-[56px] px-5 py-3.5 rounded-2xl bg-[#EE0272] text-[#FFF9FC] text-base font-bold tracking-wide hover:bg-[#70048C] active:scale-[0.99] transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]"
            >
              <span className="inline-flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>RESERVAR UNA CITA</span>
              </span>
              <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('servicios')}
              className="w-full inline-flex items-center justify-between gap-3 min-h-[54px] px-5 py-3.5 rounded-2xl bg-[#70048C] text-[#FFF9FC] text-base font-bold tracking-wide hover:bg-[#EE0272] active:scale-[0.99] transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]"
            >
              <span className="inline-flex items-center gap-3">
                <Sparkles className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>VER SERVICIOS</span>
              </span>
              <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>

            {googleMapsHref ? (
              <a
                href={googleMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-between gap-3 min-h-[54px] px-5 py-3.5 rounded-2xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/25 text-base font-bold tracking-wide hover:border-[#EE0272] hover:text-[#EE0272] active:scale-[0.99] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]"
              >
                <span className="inline-flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#EE0272] shrink-0" aria-hidden="true" />
                  <span>CÓMO LLEGAR</span>
                </span>
                <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('ubicacion')}
                className="w-full inline-flex items-center justify-between gap-3 min-h-[54px] px-5 py-3.5 rounded-2xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/25 text-base font-bold tracking-wide hover:border-[#EE0272] hover:text-[#EE0272] active:scale-[0.99] transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]"
              >
                <span className="inline-flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#EE0272] shrink-0" aria-hidden="true" />
                  <span>CÓMO LLEGAR</span>
                </span>
                <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('sobre-jessica')}
              className="w-full inline-flex items-center justify-between gap-3 min-h-[52px] px-5 py-3 rounded-2xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/20 text-sm sm:text-base font-bold tracking-wide hover:border-[#EE0272] hover:text-[#EE0272] active:scale-[0.99] transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]"
            >
              <span className="inline-flex items-center gap-3">
                <User className="w-5 h-5 text-[#EE0272] shrink-0" aria-hidden="true" />
                <span>SOBRE JESSICA</span>
              </span>
              <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>
          </div>

          {/* 4. Redes sociales (ocultas temporalmente cuando showSocialLinks es false) */}
          {JESSI_CONFIG.showSocialLinks && (
            <div className="mt-7 pt-6 border-t border-[#70048C]/12">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#70048C]/80 mb-3">
                Redes sociales
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {JESSI_CONFIG.instagramUrl ? (
                  <a
                    href={JESSI_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/15 text-xs sm:text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors"
                  >
                    <InstagramIcon />
                    <span>Instagram</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenSocialPending('Instagram')}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/15 text-xs sm:text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer"
                  >
                    <InstagramIcon />
                    <span>Instagram</span>
                  </button>
                )}

                {JESSI_CONFIG.facebookUrl ? (
                  <a
                    href={JESSI_CONFIG.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/15 text-xs sm:text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors"
                  >
                    <FacebookIcon />
                    <span>Facebook</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenSocialPending('Facebook')}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/15 text-xs sm:text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer"
                  >
                    <FacebookIcon />
                    <span>Facebook</span>
                  </button>
                )}

                {JESSI_CONFIG.tiktokUrl ? (
                  <a
                    href={JESSI_CONFIG.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/15 text-xs sm:text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors"
                  >
                    <TikTokIcon />
                    <span>TikTok</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenSocialPending('TikTok')}
                    className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/15 text-xs sm:text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer"
                  >
                    <TikTokIcon />
                    <span>TikTok</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 mt-8 pb-14 sm:pb-0 text-center text-xs text-[#29212D]/70 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>© {currentYear} {JESSI_CONFIG.brandName}</span>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="font-semibold text-[#70048C] hover:text-[#EE0272] underline underline-offset-4 cursor-pointer"
        >
          Aviso de privacidad
        </button>
      </footer>
    </div>
  );
}
