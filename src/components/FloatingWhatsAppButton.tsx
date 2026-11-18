import { MessageCircle } from 'lucide-react';
import {
  JESSI_CONFIG,
  buildWhatsAppUrl,
  type AppView,
} from '../data/jessiConfig';

interface FloatingWhatsAppButtonProps {
  currentView: AppView;
}

export function FloatingWhatsAppButton({
  currentView,
}: FloatingWhatsAppButtonProps) {
  const whatsappUrl = buildWhatsAppUrl(JESSI_CONFIG.whatsappFloatingMessage);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a JESSI NAIL por WhatsApp"
      className={`${
        currentView === 'biolink' ? 'inline-flex' : 'hidden md:inline-flex'
      } fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 items-center gap-2.5 min-h-[48px] px-4 sm:px-5 py-3 rounded-full bg-[#EE0272] text-[#FFF9FC] text-sm font-bold border-2 border-[#FFF9FC] hover:bg-[#70048C] active:scale-[0.98] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]`}
    >
      <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap">WhatsApp</span>
    </a>
  );
}
