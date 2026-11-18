import { MapPin, MessageCircle, Clock, Navigation, CalendarCheck, User, Sparkles, ExternalLink } from 'lucide-react';
import { JESSI_CONFIG, buildWhatsAppUrl, buildGoogleMapsUrl } from '../data/jessiConfig';

export function LocationContactSection() {
  const whatsappUrl = buildWhatsAppUrl(JESSI_CONFIG.whatsappLocationMessage);
  const googleMapsHref = buildGoogleMapsUrl();

  return (
    <section
      id="ubicacion"
      className="py-12 sm:py-16 bg-[#F5EDF8]/45 border-b border-[#70048C]/10"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#EE0272]">
            Ubicación y contacto
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#70048C] text-balance-wrap">
            JESSI NAIL, un espacio para ti.
          </h2>
          <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-[#29212D]/80">
            Te esperamos previa reserva de cita para brindarte una atención dedicada y tranquila.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Información comercial */}
          <div className="lg:col-span-6 rounded-3xl bg-[#FFF9FC] border border-[#70048C]/15 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <dl className="space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#EE0272] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                    Nombre comercial
                  </dt>
                  <dd className="text-base font-bold text-[#70048C]">
                    {JESSI_CONFIG.brandName} · {JESSI_CONFIG.descriptor}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#EE0272] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                    Profesional
                  </dt>
                  <dd className="text-base font-bold text-[#29212D]">
                    {JESSI_CONFIG.artistName}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#EE0272] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                    WhatsApp
                  </dt>
                  <dd className="text-base font-bold text-[#29212D] tabular-nums">
                    {JESSI_CONFIG.whatsappDisplay} ({JESSI_CONFIG.whatsappDisplayIntl})
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#EE0272] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                    Horario
                  </dt>
                  <dd className="text-sm font-semibold text-[#29212D]/90">
                    {JESSI_CONFIG.scheduleNote}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="pt-4 border-t border-[#70048C]/12 space-y-3">
              <div className="rounded-xl bg-[#F5EDF8] p-3.5 flex items-start gap-2.5">
                <CalendarCheck className="w-4 h-4 text-[#EE0272] mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-[#29212D]/85">
                  <strong>Importante:</strong> Recuerda reservar tu cita previamente antes de acudir para asegurar tu horario de atención.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 min-h-[50px] px-6 py-3 rounded-2xl bg-[#EE0272] text-[#FFF9FC] text-sm sm:text-base font-bold tracking-wide hover:bg-[#70048C] transition-colors duration-150"
              >
                <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>CONTACTAR POR WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Botón de Google Maps e indicaciones para llegar */}
          <div className="lg:col-span-6 rounded-3xl bg-[#FFF9FC] border border-[#70048C]/15 p-6 sm:p-8 flex flex-col justify-between gap-5">
            {googleMapsHref ? (
              <div className="w-full flex-1 min-h-[220px] rounded-2xl bg-[#F5EDF8] border border-[#70048C]/12 p-6 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF9FC] border border-[#70048C]/15 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#EE0272]" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-[#70048C]">
                    Ubicación en Google Maps
                  </p>
                  <p className="mt-1 text-sm text-[#29212D]/80">
                    Abre el mapa directamente para ver la ruta hasta {JESSI_CONFIG.brandName}.
                  </p>
                </div>
                <a
                  href={googleMapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-[#70048C] text-[#FFF9FC] text-sm font-bold hover:bg-[#EE0272] transition-colors"
                >
                  <span>CÓMO LLEGAR EN GOOGLE MAPS</span>
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
              </div>
            ) : (
              <div className="w-full flex-1 min-h-[220px] rounded-2xl bg-[#F5EDF8] border border-[#70048C]/12 p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF9FC] border border-[#70048C]/15 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#EE0272]" aria-hidden="true" />
                </div>
                <p className="font-display text-xl font-bold text-[#70048C]">
                  Botón de llegada por Google Maps
                </p>
                <p className="text-sm leading-relaxed text-[#29212D]/80 max-w-sm">
                  Espacio preparado para abrir directamente la ubicación en Google Maps apenas se agreguen las coordenadas de {JESSI_CONFIG.brandName}.
                </p>
              </div>
            )}

            <div className="rounded-2xl bg-[#F5EDF8] border border-[#70048C]/12 p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#70048C]">
                <Navigation className="w-4 h-4 text-[#EE0272] shrink-0" aria-hidden="true" />
                <span>Indicaciones para llegar</span>
              </div>
              <p className="text-sm leading-relaxed text-[#29212D]/85">
                Al confirmar tu cita por WhatsApp, Jessica te enviará las indicaciones y el punto de llegada exacto para facilitar tu visita.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
