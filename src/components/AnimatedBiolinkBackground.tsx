import type { CSSProperties } from 'react';

interface ShimmerAccent {
  id: string;
  top: string;
  left: string;
  size: number;
  color: string;
  duration: string;
  delay: string;
  kind: 'star' | 'petal';
}

interface AnimatedBiolinkBackgroundProps {
  variant?: 'hero' | 'subtle';
}

const SHIMMER_ACCENTS: ShimmerAccent[] = [
  { id: 's1', top: '4%', left: '8%', size: 18, color: '#EE0272', duration: '3.8s', delay: '0s', kind: 'star' },
  { id: 's2', top: '6%', left: '86%', size: 16, color: '#70048C', duration: '4.4s', delay: '-1.2s', kind: 'star' },
  { id: 's3', top: '16%', left: '4%', size: 12, color: '#70048C', duration: '4.1s', delay: '-2.1s', kind: 'petal' },
  { id: 's4', top: '26%', left: '92%', size: 19, color: '#EE0272', duration: '4.8s', delay: '-0.8s', kind: 'star' },
  { id: 's5', top: '52%', left: '3%', size: 15, color: '#EE0272', duration: '3.9s', delay: '-1.9s', kind: 'star' },
  { id: 's6', top: '64%', left: '93%', size: 13, color: '#70048C', duration: '4.6s', delay: '-2.8s', kind: 'petal' },
  { id: 's7', top: '84%', left: '8%', size: 18, color: '#70048C', duration: '5.1s', delay: '-1.4s', kind: 'star' },
  { id: 's8', top: '89%', left: '84%', size: 17, color: '#EE0272', duration: '4.0s', delay: '-0.6s', kind: 'star' },
  { id: 's9', top: '11%', left: '52%', size: 11, color: '#EE0272', duration: '4.3s', delay: '-2.4s', kind: 'petal' },
  { id: 's10', top: '92%', left: '46%', size: 14, color: '#70048C', duration: '4.7s', delay: '-3.1s', kind: 'star' },
];

export function AnimatedBiolinkBackground({
  variant = 'hero',
}: AnimatedBiolinkBackgroundProps) {
  const isSubtle = variant === 'subtle';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Lienzo base nacarado con degradado en movimiento continuo */}
      <div
        className="animate-mesh-shift absolute inset-0"
        style={{
          backgroundImage: isSubtle
            ? 'linear-gradient(135deg, #FFF9FC 0%, #FDF0F6 35%, #F5EAFA 68%, #FFF9FC 100%)'
            : 'linear-gradient(135deg, #FFF9FC 0%, #FCE5F1 35%, #F0DCF9 68%, #FFF9FC 100%)',
        }}
      />

      {/* Ondas de luz orgánica (visibles en bordes y tras las tarjetas) */}
      <div
        className={`animate-aura-1 absolute -top-24 -left-24 h-[26rem] w-[26rem] sm:h-[38rem] sm:w-[38rem] rounded-full blur-3xl ${
          isSubtle ? 'opacity-55' : 'opacity-90'
        }`}
        style={{
          background:
            'radial-gradient(circle at center, rgba(238, 2, 114, 0.34) 0%, rgba(238, 2, 114, 0.14) 45%, rgba(255, 249, 252, 0) 72%)',
        }}
      />

      <div
        className={`animate-aura-2 absolute -bottom-28 -right-24 h-[28rem] w-[28rem] sm:h-[42rem] sm:w-[42rem] rounded-full blur-3xl ${
          isSubtle ? 'opacity-55' : 'opacity-90'
        }`}
        style={{
          background:
            'radial-gradient(circle at center, rgba(112, 4, 140, 0.32) 0%, rgba(112, 4, 140, 0.13) 48%, rgba(255, 249, 252, 0) 74%)',
        }}
      />

      <div
        className={`animate-aura-3 absolute top-1/4 left-1/2 h-[22rem] w-[22rem] sm:h-[32rem] sm:w-[32rem] rounded-full blur-3xl ${
          isSubtle ? 'opacity-45' : 'opacity-85'
        }`}
        style={{
          background:
            'radial-gradient(circle at center, rgba(238, 2, 114, 0.24) 0%, rgba(112, 4, 140, 0.18) 48%, rgba(255, 249, 252, 0) 75%)',
        }}
      />

      {/* Destello satinado diagonal barriendo suavemente */}
      <div
        className={`animate-silk-sheen absolute -inset-x-1/2 top-1/4 h-72 sm:h-96 blur-2xl ${
          isSubtle ? 'opacity-45' : 'opacity-85'
        }`}
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* Trazos finos curvos inspirados en nail art y seda */}
      <svg
        className={`animate-ribbon-sway absolute inset-0 h-full w-full ${
          isSubtle ? 'opacity-40' : 'opacity-80'
        }`}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          d="M-80 210 C 260 90, 560 330, 920 190 C 1180 90, 1360 180, 1540 120"
          stroke="url(#jessiRibbonFuchsia)"
          strokeWidth="2"
        />
        <path
          d="M-100 680 C 240 540, 620 790, 1020 630 C 1240 540, 1410 610, 1560 560"
          stroke="url(#jessiRibbonPurple)"
          strokeWidth="2"
        />
        <path
          d="M-60 440 C 310 560, 640 310, 1040 460 C 1280 550, 1420 410, 1540 430"
          stroke="url(#jessiRibbonSoft)"
          strokeWidth="1.25"
          strokeDasharray="7 10"
        />
        <defs>
          <linearGradient id="jessiRibbonFuchsia" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EE0272" stopOpacity="0" />
            <stop offset="30%" stopColor="#EE0272" stopOpacity="0.34" />
            <stop offset="70%" stopColor="#70048C" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#EE0272" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="jessiRibbonPurple" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#70048C" stopOpacity="0" />
            <stop offset="35%" stopColor="#70048C" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#EE0272" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#70048C" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="jessiRibbonSoft" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#70048C" stopOpacity="0" />
            <stop offset="50%" stopColor="#EE0272" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#70048C" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Destellos nacarados flotantes (visibles en márgenes móviles y escritorio) */}
      {!isSubtle &&
        SHIMMER_ACCENTS.map((item) => {
          const style: CSSProperties & {
            '--shimmer-duration': string;
            '--shimmer-delay': string;
          } = {
            top: item.top,
            left: item.left,
            color: item.color,
            '--shimmer-duration': item.duration,
            '--shimmer-delay': item.delay,
          };

          return (
            <span
              key={item.id}
              className="animate-shimmer-float absolute"
              style={style}
            >
              {item.kind === 'star' ? (
                <svg
                  width={item.size}
                  height={item.size}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
                </svg>
              ) : (
                <span
                  className="block rounded-full bg-current opacity-65"
                  style={{ width: item.size, height: item.size }}
                />
              )}
            </span>
          );
        })}
    </div>
  );
}
