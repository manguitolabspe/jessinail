import { useEffect } from 'react';
import { X, ShieldCheck, Share2 } from 'lucide-react';
import { JESSI_CONFIG } from '../data/jessiConfig';

export type InfoModalContent =
  | { type: 'social'; network: 'Instagram' | 'Facebook' | 'TikTok' }
  | { type: 'privacy' }
  | null;

interface InfoModalProps {
  modal: InfoModalContent;
  onClose: () => void;
}

export function InfoModal({ modal, onClose }: InfoModalProps) {
  useEffect(() => {
    if (!modal) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal, onClose]);

  if (!modal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#29212D]/60 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FFF9FC] border border-[#70048C]/20 p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-[#70048C]/20 mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDF8] flex items-center justify-center shrink-0">
              {modal.type === 'privacy' ? (
                <ShieldCheck className="w-5 h-5 text-[#EE0272]" aria-hidden="true" />
              ) : (
                <Share2 className="w-5 h-5 text-[#EE0272]" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                {JESSI_CONFIG.brandName}
              </p>
              <h2
                id="info-modal-title"
                className="font-display text-xl font-bold text-[#70048C]"
              >
                {modal.type === 'privacy'
                  ? 'Aviso de privacidad'
                  : `Perfil oficial de ${modal.network}`}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#F5EDF8] text-[#70048C] flex items-center justify-center hover:bg-[#EE0272] hover:text-[#FFF9FC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {modal.type === 'privacy' ? (
            <div className="space-y-2.5 text-sm leading-relaxed text-[#29212D]/85">
              <p>
                Los datos ingresados en el formulario de solicitudes de citas (nombre, número de WhatsApp, servicio, fecha, hora y comentarios) se utilizan únicamente para preparar tu mensaje y enviarlo directamente al WhatsApp oficial de <strong>{JESSI_CONFIG.brandName}</strong> ({JESSI_CONFIG.artistName}).
              </p>
              <p>
                Este sitio web no almacena bases de datos personales ni procesa pagos en línea.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F5EDF8] border border-[#70048C]/12">
              <p className="text-sm font-bold text-[#70048C]">
                {JESSI_CONFIG.brandName} en {modal.network}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#29212D]/85">
                Este acceso está preparado para enlazar la cuenta oficial de {modal.network} en cuanto se confirme su dirección definitiva.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#70048C] text-[#FFF9FC] text-sm font-bold hover:bg-[#EE0272] transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
