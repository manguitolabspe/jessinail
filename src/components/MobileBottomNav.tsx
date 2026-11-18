import {
  Home,
  Sparkles,
  CalendarCheck,
  User,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import type { AppView } from '../data/jessiConfig';

interface MobileBottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const MOBILE_TABS: Array<{
  view: AppView;
  label: string;
  icon: LucideIcon;
  highlight?: boolean;
}> = [
  { view: 'biolink', label: 'Inicio', icon: Home },
  { view: 'servicios', label: 'Servicios', icon: Sparkles },
  { view: 'reservas', label: 'Reservar', icon: CalendarCheck, highlight: true },
  { view: 'sobre-jessica', label: 'Jessica', icon: User },
  { view: 'ubicacion', label: 'Mapa', icon: MapPin },
];

export function MobileBottomNav({
  currentView,
  onNavigate,
}: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Navegación rápida de la app"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFF9FC]/95 backdrop-blur-md border-t border-[#70048C]/15 px-1.5 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 gap-1">
        {MOBILE_TABS.map((tab) => {
          const isActive = currentView === tab.view;
          const Icon = tab.icon;

          return (
            <button
              key={tab.view}
              type="button"
              onClick={() => onNavigate(tab.view)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-h-[50px] rounded-xl px-1 py-1 transition-colors cursor-pointer active:scale-[0.97] ${
                isActive
                  ? 'text-[#EE0272]'
                  : tab.highlight
                  ? 'text-[#70048C]'
                  : 'text-[#29212D]/60 hover:text-[#70048C]'
              }`}
            >
              <span
                className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#EE0272] text-[#FFF9FC]'
                    : tab.highlight
                    ? 'bg-[#F5EDF8] text-[#EE0272]'
                    : ''
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="text-[10px] font-bold leading-tight tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
