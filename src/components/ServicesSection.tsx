import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import {
  JESSI_CONFIG,
  SERVICE_CATEGORIES,
  SERVICES_CATALOG,
  type ServiceCategoryId,
  type ServiceItem,
} from '../data/jessiConfig';

interface ServicesSectionProps {
  onReserveService: (serviceName: string) => void;
}

function ServiceCard({
  service,
  onReserveService,
}: {
  service: ServiceItem;
  onReserveService: (serviceName: string) => void;
}) {
  return (
    <article className="rounded-2xl bg-[#FFF9FC] border border-[#70048C]/15 overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5">
      <div>
        <div className="aspect-[4/3] w-full overflow-hidden bg-[#F5EDF8]">
          <img
            src={service.imageUrl}
            alt={`Fotografía representativa de ${service.name} en JESSI NAIL`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#EE0272]">
            <span>{service.categoryLabel}</span>
            {service.price && (
              <span className="tabular-nums font-bold text-[#70048C]">
                {service.price}
              </span>
            )}
          </div>

          <h4 className="mt-1.5 font-display text-xl font-bold text-[#70048C] leading-snug">
            {service.name}
          </h4>

          <p className="mt-2 text-sm leading-relaxed text-[#29212D]/80">
            {service.description}
          </p>

          {service.duration && (
            <p className="mt-2 text-xs font-medium text-[#70048C]/80">
              Duración estimada · {service.duration}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-1">
        <button
          type="button"
          onClick={() => onReserveService(service.name)}
          className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F5EDF8] text-[#70048C] border border-[#70048C]/15 text-xs sm:text-sm font-bold tracking-wide hover:bg-[#EE0272] hover:text-[#FFF9FC] hover:border-[#EE0272] transition-colors duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]"
        >
          <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>RESERVAR ESTE SERVICIO</span>
        </button>
      </div>
    </article>
  );
}

export function ServicesSection({ onReserveService }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | ServiceCategoryId>('all');

  const visibleCategories =
    activeCategory === 'all'
      ? SERVICE_CATEGORIES
      : SERVICE_CATEGORIES.filter((cat) => cat.id === activeCategory);

  return (
    <section
      id="servicios"
      className="py-12 sm:py-16 bg-transparent border-b border-[#70048C]/10"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#EE0272]">
            JESSI NAIL · Catálogo de servicios
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#70048C] text-balance-wrap">
            Servicios especializados para tu belleza
          </h2>
          <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-[#29212D]/80">
            Explora cada especialidad de JESSI NAIL y selecciona el servicio de tu preferencia para enviarnos tu solicitud de cita.
          </p>
        </div>

        {/* Banner horizontal de atención personalizada */}
        <div className="mt-7 relative rounded-3xl overflow-hidden border border-[#70048C]/15 bg-[#29212D]">
          <div className="aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/9] w-full overflow-hidden">
            <img
              src={JESSI_CONFIG.workstationBannerUrl}
              alt={`${JESSI_CONFIG.artistName} realizando atención personalizada de manicura en ${JESSI_CONFIG.brandName}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_22%]"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#29212D]/88 via-[#29212D]/35 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-lg">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FFF9FC]/90">
                Atención dedicada · {JESSI_CONFIG.artistName}
              </p>
              <p className="mt-1 font-display text-lg sm:text-2xl font-bold text-[#FFF9FC] leading-snug text-balance-wrap">
                Cuidado preciso, higiene profesional y diseños pensados para ti.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onReserveService('')}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-xs sm:text-sm font-bold tracking-wide hover:bg-[#70048C] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>RESERVAR CITA</span>
            </button>
          </div>
        </div>

        {/* Barra de filtro interactivo por categoría */}
        <div
          role="tablist"
          aria-label="Filtrar servicios por categoría"
          className="mt-7 flex items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#70048C] text-[#FFF9FC]'
                : 'bg-[#F5EDF8] text-[#70048C] hover:bg-[#70048C]/12'
            }`}
          >
            Todos los servicios
          </button>

          {SERVICE_CATEGORIES.map((category) => {
            const isSelected = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(category.id)}
                className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#70048C] text-[#FFF9FC]'
                    : 'bg-[#F5EDF8] text-[#70048C] hover:bg-[#70048C]/12'
                }`}
              >
                {category.title}
              </button>
            );
          })}
        </div>

        {/* Categorías y tarjetas */}
        <div className="mt-9 space-y-12">
          {visibleCategories.map((category, categoryIdx) => {
            const items = SERVICES_CATALOG.filter(
              (service) => service.categoryId === category.id
            );

            return (
              <div key={category.id} className="space-y-5">
                <div className="border-b border-[#70048C]/12 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#70048C]">
                      {String(categoryIdx + 1).padStart(2, '0')}. {category.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#29212D]/75">
                      {category.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#EE0272] whitespace-nowrap shrink-0 tabular-nums">
                    {items.length} {items.length === 1 ? 'servicio' : 'servicios'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onReserveService={onReserveService}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
