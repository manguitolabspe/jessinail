import { ArrowLeft, CalendarCheck, MessageCircle } from 'lucide-react';
import {
  JESSI_CONFIG,
  buildWhatsAppUrl,
  type AppView,
} from '../data/jessiConfig';
import { JessiLogo } from './JessiLogo';

interface NavbarProps {
  currentView: AppView;
  sectionLabel: string;
  onNavigate: (view: AppView) => void;
}

const NAV_ITEMS: { view: AppView; label: string }[] = [
  { view: 'biolink', label: 'Biolink' },
  { view: 'sobre-jessica', label: 'Sobre Jessica' },
  { view: 'servicios', label: 'Servicios' },
  { view: 'ubicacion', label: 'Cómo llegar' },
];

export function Navbar({
  currentView,
  sectionLabel,
  onNavigate,
}: NavbarProps) {
  const whatsappUrl = buildWhatsAppUrl(JESSI_CONFIG.whatsappFloatingMessage);

  return (
    <header className="sticky top-0 z-40 h-14 bg-[#FFF9FC]/95 backdrop-blur-md border-b border-[#70048C]/12">
      {/* Barra móvil estilo app nativa */}
      <div className="md:hidden h-full px-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onNavigate('biolink')}
          aria-label="Volver al Biolink de JESSI NAIL"
          className="min-w-[44px] min-h-[44px] rounded-xl bg-[#F5EDF8] text-[#70048C] flex items-center justify-center hover:bg-[#70048C] hover:text-[#FFF9FC] active:scale-[0.97] transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 text-center flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#EE0272] leading-none">
            {JESSI_CONFIG.brandName}
          </p>
          <p className="mt-0.5 text-sm font-bold text-[#70048C] truncate leading-tight">
            {sectionLabel}
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp a JESSI NAIL"
          className="min-w-[44px] min-h-[44px] rounded-xl bg-[#F5EDF8] text-[#EE0272] flex items-center justify-center hover:bg-[#EE0272] hover:text-[#FFF9FC] active:scale-[0.97] transition-all shrink-0"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
        </a>
      </div>

      {/* Barra escritorio */}
      <div className="hidden md:flex max-w-5xl mx-auto h-full px-6 items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => onNavigate('biolink')}
          className="whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#70048C] rounded-lg"
          aria-label="Volver al Biolink de JESSI NAIL"
        >
          <JessiLogo variant="compact" />
        </button>

        <nav
          aria-label="Navegación principal"
          className="flex items-center gap-6 text-sm font-medium text-[#29212D]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => onNavigate(item.view)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors cursor-pointer underline-offset-4 ${
                  isActive
                    ? 'font-bold text-[#EE0272] underline'
                    : 'hover:text-[#70048C] hover:underline'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('reservas')}
            className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold whitespace-nowrap shrink-0 hover:bg-[#70048C] transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]"
          >
            <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Reservar cita</span>
          </button>
        </div>
      </div>
    </header>
  );
}
