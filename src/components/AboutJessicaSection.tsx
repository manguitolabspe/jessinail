import { Check, CalendarCheck, Sparkles } from 'lucide-react';
import { JESSI_CONFIG, type AppView } from '../data/jessiConfig';

interface AboutJessicaSectionProps {
  onNavigate: (view: AppView) => void;
}

export function AboutJessicaSection({ onNavigate }: AboutJessicaSectionProps) {
  return (
    <section
      id="sobre-jessica"
      className="py-12 sm:py-16 bg-[#F5EDF8]/45 border-b border-[#70048C]/10"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Banner horizontal del estudio JESSI NAIL */}
        <div className="relative rounded-3xl overflow-hidden border border-[#70048C]/15 bg-[#29212D]">
          <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[2/1] w-full overflow-hidden">
            <img
              src={JESSI_CONFIG.studioBannerUrl}
              alt={`${JESSI_CONFIG.artistName} en el estudio ${JESSI_CONFIG.brandName}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_12%]"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#29212D]/85 via-[#29212D]/25 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFF9FC]/90">
                {JESSI_CONFIG.brandName} · Estudio de belleza
              </p>
              <h2 className="mt-1 font-display text-xl sm:text-3xl font-bold text-[#FFF9FC] text-balance-wrap leading-tight">
                Un espacio pensado para tu cuidado y bienestar.
              </h2>
            </div>
            <p className="text-xs font-semibold text-[#FFF9FC]/85 whitespace-nowrap shrink-0">
              Atención con cita previa
            </p>
          </div>
        </div>

        {/* Presentación comercial de JESSI NAIL */}
        <div className="rounded-2xl bg-[#FFF9FC] border border-[#70048C]/12 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center">
            <div className="md:col-span-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                Sobre la marca
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#70048C]">
                {JESSI_CONFIG.brandName}
              </h2>
              <ul className="pt-1 space-y-1.5">
                {JESSI_CONFIG.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-xs font-semibold text-[#29212D]"
                  >
                    <Check className="w-3.5 h-3.5 text-[#EE0272] shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-8">
              <p className="text-[15px] sm:text-base leading-relaxed text-[#29212D]/90">
                {JESSI_CONFIG.commercialDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Sobre Jessica López Gascón */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-5 order-2 lg:order-1 flex">
            <div className="w-full rounded-3xl overflow-hidden border border-[#70048C]/15 bg-[#FFF9FC] flex flex-col">
              <div className="aspect-[3/4] lg:flex-1 w-full overflow-hidden">
                <img
                  src={JESSI_CONFIG.specialistPortraitUrl}
                  alt={`${JESSI_CONFIG.artistName}, ${JESSI_CONFIG.descriptor} en ${JESSI_CONFIG.brandName}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-5 bg-[#FFF9FC] border-t border-[#70048C]/12">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#EE0272]">
                  {JESSI_CONFIG.brandName} · {JESSI_CONFIG.descriptor}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-[#70048C]">
                  {JESSI_CONFIG.artistName}
                </p>
                <p className="mt-0.5 text-xs text-[#29212D]/75">
                  Especialista venezolana radicada en Perú · Atención con cita previa
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                Conoce a Jessica López Gascón
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#70048C] text-balance-wrap leading-tight">
                Detrás de JESSI NAIL hay una pasión por la belleza.
              </h2>

              <div className="mt-5 space-y-4 text-[15px] sm:text-base leading-relaxed text-[#29212D]/85">
                <p>
                  Jessica López Gascón es una profesional del mundo de la belleza y el cuidado personal, de origen venezolano y actualmente radicada en Perú. Cuenta con amplia experiencia en el sector de la estética, acompañada de preparación profesional en las diferentes técnicas y especialidades que ofrece.
                </p>
                <p>
                  Su trabajo está enfocado en realzar la belleza de cada mujer mediante servicios personalizados, técnicas profesionales y una atención dedicada a cada detalle. Jessica considera que cada mujer merece un momento para sí misma, un espacio donde pueda sentirse cuidada, hermosa, segura y especial.
                </p>
                <p>
                  A través de <strong>{JESSI_CONFIG.brandName}</strong> busca ofrecer mucho más que un servicio estético: una experiencia de confianza, dedicación y bienestar.
                </p>
              </div>
            </div>

            <blockquote className="mt-7 pt-6 border-t border-[#70048C]/15">
              <p className="font-display italic text-lg sm:text-xl font-semibold text-[#70048C] leading-snug">
                “Mi compromiso es cuidar cada detalle para que cada visita se convierta en un momento especial para ti.”
              </p>
              <footer className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#EE0272]">
                {JESSI_CONFIG.artistName} · {JESSI_CONFIG.brandName}
              </footer>
            </blockquote>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onNavigate('reservas')}
                className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold hover:bg-[#70048C] transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>RESERVAR UNA CITA</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('servicios')}
                className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/20 text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>VER SERVICIOS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Foto horizontal de Jessica en su mesa de trabajo */}
        <div className="relative rounded-3xl overflow-hidden border border-[#70048C]/15 bg-[#29212D]">
          <div className="aspect-[3/2] sm:aspect-[16/9] w-full overflow-hidden">
            <img
              src={JESSI_CONFIG.aboutHorizontalUrl}
              alt={`${JESSI_CONFIG.artistName} sonriendo en su mesa de manicure en ${JESSI_CONFIG.brandName}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_18%]"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#29212D]/80 via-[#29212D]/15 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFF9FC]/90">
                {JESSI_CONFIG.artistName} · {JESSI_CONFIG.brandName}
              </p>
              <p className="mt-1 font-display text-lg sm:text-2xl font-bold text-[#FFF9FC] leading-snug">
                Cercanía, higiene y dedicación en cada sesión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
