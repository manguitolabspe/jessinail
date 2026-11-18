import { useEffect, useState } from 'react';
import { BiolinkView } from './components/BiolinkView';
import { Navbar } from './components/Navbar';
import { PageBackBar } from './components/PageBackBar';
import { AboutJessicaSection } from './components/AboutJessicaSection';
import { ServicesSection } from './components/ServicesSection';
import { BookingFormSection } from './components/BookingFormSection';
import { LocationContactSection } from './components/LocationContactSection';
import { FooterSection } from './components/FooterSection';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AnimatedBiolinkBackground } from './components/AnimatedBiolinkBackground';
import { InfoModal, type InfoModalContent } from './components/InfoModal';
import type { AppView } from './data/jessiConfig';

const VALID_VIEWS: AppView[] = [
  'biolink',
  'reservas',
  'servicios',
  'sobre-jessica',
  'ubicacion',
];

const VIEW_LABELS: Record<Exclude<AppView, 'biolink'>, string> = {
  reservas: 'Reservar cita',
  servicios: 'Catálogo de servicios',
  'sobre-jessica': 'Sobre Jessica',
  ubicacion: 'Cómo llegar y contacto',
};

function readViewFromHash(): AppView {
  const hash = window.location.hash.replace('#', '') as AppView;
  return VALID_VIEWS.includes(hash) ? hash : 'biolink';
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(readViewFromHash);
  const [preselectedService, setPreselectedService] = useState('');
  const [infoModal, setInfoModal] = useState<InfoModalContent>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(readViewFromHash());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    const targetHash = view === 'biolink' ? '#biolink' : `#${view}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReserveService = (serviceName: string) => {
    setPreselectedService(serviceName);
    navigateTo('reservas');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9FC] text-[#29212D]">
      {currentView === 'biolink' ? (
        <BiolinkView
          onNavigate={navigateTo}
          onOpenSocialPending={(network) =>
            setInfoModal({ type: 'social', network })
          }
          onOpenPrivacy={() => setInfoModal({ type: 'privacy' })}
        />
      ) : (
        <>
          <AnimatedBiolinkBackground variant="subtle" />
          <Navbar
            currentView={currentView}
            sectionLabel={VIEW_LABELS[currentView]}
            onNavigate={navigateTo}
          />
          <PageBackBar
            sectionLabel={VIEW_LABELS[currentView]}
            onBack={() => navigateTo('biolink')}
          />

          <main className="relative z-10 flex-1">
            {currentView === 'servicios' && (
              <ServicesSection onReserveService={handleReserveService} />
            )}
            {currentView === 'reservas' && (
              <BookingFormSection preselectedService={preselectedService} />
            )}
            {currentView === 'sobre-jessica' && (
              <AboutJessicaSection onNavigate={navigateTo} />
            )}
            {currentView === 'ubicacion' && <LocationContactSection />}
          </main>

          <div
            className={`relative z-10 ${
              currentView === 'reservas' ? 'hidden md:block' : ''
            }`}
          >
            <FooterSection
              onNavigate={navigateTo}
              onOpenSocialPending={(network) =>
                setInfoModal({ type: 'social', network })
              }
              onOpenPrivacy={() => setInfoModal({ type: 'privacy' })}
            />
          </div>

          {currentView !== 'reservas' && (
            <MobileBottomNav
              currentView={currentView}
              onNavigate={navigateTo}
            />
          )}
        </>
      )}

      <FloatingWhatsAppButton currentView={currentView} />

      <InfoModal modal={infoModal} onClose={() => setInfoModal(null)} />
    </div>
  );
}
