import { JESSI_CONFIG, type AppView } from '../data/jessiConfig';
import { JessiLogo } from './JessiLogo';

interface FooterSectionProps {
  onNavigate: (view: AppView) => void;
  onOpenSocialPending: (network: 'Instagram' | 'Facebook' | 'TikTok') => void;
  onOpenPrivacy: () => void;
}

const FOOTER_LINKS: { view: AppView; label: string }[] = [
  { view: 'biolink', label: 'Biolink' },
  { view: 'sobre-jessica', label: 'Sobre Jessica' },
  { view: 'servicios', label: 'Servicios' },
  { view: 'reservas', label: 'Reservas' },
  { view: 'ubicacion', label: 'Cómo llegar' },
];

export function FooterSection({
  onNavigate,
  onOpenSocialPending,
  onOpenPrivacy,
}: FooterSectionProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-[#FFF9FC] border-t border-[#70048C]/10 pt-10 pb-28 md:pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#70048C]/12">
          {/* Identidad en pie de página */}
          <div className={JESSI_CONFIG.showSocialLinks ? 'md:col-span-5 space-y-3' : 'md:col-span-7 space-y-3'}>
            <JessiLogo variant="compact" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                {JESSI_CONFIG.descriptor}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#29212D]">
                {JESSI_CONFIG.artistName}
              </p>
              <p className="mt-2 font-display italic text-base text-[#70048C]">
                “{JESSI_CONFIG.tagline}”
              </p>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className={JESSI_CONFIG.showSocialLinks ? 'md:col-span-4' : 'md:col-span-5'}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#70048C] mb-3">
              Enlaces rápidos
            </p>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm font-medium text-[#29212D]/85">
              {FOOTER_LINKS.map((link) => (
                <li key={link.view}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.view)}
                    className="hover:text-[#EE0272] transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes sociales preparadas (ocultas temporalmente) */}
          {JESSI_CONFIG.showSocialLinks && (
            <div className="md:col-span-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#70048C] mb-3">
                Redes sociales
              </p>
              <div className="flex flex-col gap-2">
                {JESSI_CONFIG.instagramUrl ? (
                  <a
                    href={JESSI_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F5EDF8] text-sm font-bold text-[#70048C] hover:text-[#EE0272] transition-colors"
                  >
                    <span>Instagram</span>
                    <span>→</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenSocialPending('Instagram')}
                    className="inline-flex items-center justify-between min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F5EDF8] text-sm font-bold text-[#70048C] hover:text-[#EE0272] transition-colors cursor-pointer"
                  >
                    <span>Instagram</span>
                    <span className="text-xs font-semibold text-[#EE0272]">Próximamente</span>
                  </button>
                )}

                {JESSI_CONFIG.facebookUrl ? (
                  <a
                    href={JESSI_CONFIG.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F5EDF8] text-sm font-bold text-[#70048C] hover:text-[#EE0272] transition-colors"
                  >
                    <span>Facebook</span>
                    <span>→</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenSocialPending('Facebook')}
                    className="inline-flex items-center justify-between min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F5EDF8] text-sm font-bold text-[#70048C] hover:text-[#EE0272] transition-colors cursor-pointer"
                  >
                    <span>Facebook</span>
                    <span className="text-xs font-semibold text-[#EE0272]">Próximamente</span>
                  </button>
                )}

                {JESSI_CONFIG.tiktokUrl ? (
                  <a
                    href={JESSI_CONFIG.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F5EDF8] text-sm font-bold text-[#70048C] hover:text-[#EE0272] transition-colors"
                  >
                    <span>TikTok</span>
                    <span>→</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenSocialPending('TikTok')}
                    className="inline-flex items-center justify-between min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F5EDF8] text-sm font-bold text-[#70048C] hover:text-[#EE0272] transition-colors cursor-pointer"
                  >
                    <span>TikTok</span>
                    <span className="text-xs font-semibold text-[#EE0272]">Próximamente</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#29212D]/70">
          <p>
            © {currentYear} {JESSI_CONFIG.brandName} · Todos los derechos reservados.
          </p>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="font-semibold text-[#70048C] hover:text-[#EE0272] underline underline-offset-4 cursor-pointer py-1"
          >
            Aviso de privacidad
          </button>
        </div>
      </div>
    </footer>
  );
}
