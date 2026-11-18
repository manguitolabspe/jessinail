import { JESSI_CONFIG } from '../data/jessiConfig';

interface JessiLogoProps {
  variant?: 'compact' | 'hero';
}

export function JessiLogo({ variant = 'hero' }: JessiLogoProps) {
  if (JESSI_CONFIG.officialLogoUrl) {
    if (variant === 'compact') {
      return (
        <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <span className="w-10 h-10 rounded-full bg-white p-0.5 border border-[#70048C]/15 flex items-center justify-center shrink-0">
            <img
              src={JESSI_CONFIG.officialLogoUrl}
              alt="Logotipo oficial de JESSI NAIL"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-full"
            />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-[#70048C]">JESSI</span>{' '}
            <span className="italic font-semibold text-[#EE0272]">NAIL</span>
          </span>
        </span>
      );
    }

    return (
      <div className="inline-flex items-center gap-4 shrink-0">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white p-1.5 border border-[#70048C]/15 flex items-center justify-center shrink-0">
          <img
            src={JESSI_CONFIG.officialLogoUrl}
            alt="Logotipo oficial de JESSI NAIL"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
        <svg
          width="32"
          height="32"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="32" cy="32" r="30" fill="#F5EDF8" stroke="#70048C" strokeWidth="2.5" />
          <path
            d="M32 14C25.5 22 22 28.5 22 36C22 42.6 26.5 48 32 48C37.5 48 42 42.6 42 36C42 28.5 38.5 22 32 14Z"
            fill="#70048C"
          />
          <path
            d="M32 19C28.2 24.4 26 29.5 26 35.2C26 39.8 28.7 43.5 32 43.5C35.3 43.5 38 39.8 38 35.2C38 29.5 35.8 24.4 32 19Z"
            fill="#EE0272"
          />
          <path
            d="M32 23.5C30.4 27 29.5 30.2 29.5 33.8C29.5 36.2 30.6 38.2 32 38.2"
            stroke="#FFF9FC"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-lg font-bold tracking-tight">
          <span className="text-[#70048C]">JESSI</span>{' '}
          <span className="italic font-semibold text-[#EE0272]">NAIL</span>
        </span>
      </span>
    );
  }

  return (
    <div
      className="inline-flex flex-col items-center sm:items-start gap-3 select-none"
      aria-label="Logotipo oficial de JESSI NAIL"
    >
      <div className="inline-flex items-center gap-4">
        <svg
          width="68"
          height="68"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="40" cy="40" r="37" fill="#F5EDF8" stroke="#70048C" strokeWidth="2.5" />
          <circle cx="40" cy="40" r="31" stroke="#EE0272" strokeWidth="1.2" strokeDasharray="3 3" />
          <path
            d="M40 16C31.5 26.5 27 35 27 44.5C27 53 32.8 60 40 60C47.2 60 53 53 53 44.5C53 35 48.5 26.5 40 16Z"
            fill="#70048C"
          />
          <path
            d="M40 22.5C35 29.5 32 36.2 32 43.5C32 49.5 35.6 54.2 40 54.2C44.4 54.2 48 49.5 48 43.5C48 36.2 45 29.5 40 22.5Z"
            fill="#EE0272"
          />
          <path
            d="M40 28C37.8 32.5 36.6 36.8 36.6 41.5C36.6 44.8 38.1 47.4 40 47.4"
            stroke="#FFF9FC"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="56" cy="24" r="3" fill="#EE0272" />
          <circle cx="24" cy="24" r="2.2" fill="#70048C" />
        </svg>

        <div className="flex flex-col text-left">
          <span className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-none text-[#70048C]">
            JESSI <span className="italic font-semibold text-[#EE0272]">NAIL</span>
          </span>
          <span className="mt-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-[#70048C]">
            {JESSI_CONFIG.descriptor}
          </span>
        </div>
      </div>
    </div>
  );
}
