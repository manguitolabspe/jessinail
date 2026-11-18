import { useEffect, useState } from 'react';
import { X, Plus, Check, Sparkles, ArrowRight } from 'lucide-react';
import {
  JESSI_CONFIG,
  SERVICE_CATEGORIES,
  SERVICES_CATALOG,
} from '../data/jessiConfig';

interface AddMoreServicesModalProps {
  isOpen: boolean;
  initialShowList?: boolean;
  lastAddedService: string;
  selectedServices: string[];
  onToggleService: (serviceName: string) => void;
  onClose: () => void;
  onProceed: () => void;
  proceedLabel?: string;
  listConfirmLabel?: string;
  showSecondaryCloseInList?: boolean;
}

export function AddMoreServicesModal({
  isOpen,
  initialShowList = false,
  lastAddedService,
  selectedServices,
  onToggleService,
  onClose,
  onProceed,
  proceedLabel = 'No, continuar al siguiente paso',
  listConfirmLabel,
  showSecondaryCloseInList = true,
}: AddMoreServicesModalProps) {
  const [showOtherServices, setShowOtherServices] = useState(initialShowList);

  useEffect(() => {
    if (isOpen) {
      setShowOtherServices(initialShowList);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, initialShowList, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#29212D]/60 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-more-services-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FFF9FC] border border-[#70048C]/20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-7 max-h-[88dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-[#70048C]/20 mx-auto mb-3 sm:hidden shrink-0" />

        <div className="flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDF8] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#EE0272]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                {JESSI_CONFIG.brandName} · Servicios
              </p>
              <h2
                id="add-more-services-title"
                className="font-display text-lg sm:text-xl font-bold text-[#70048C] leading-tight"
              >
                {showOtherServices
                  ? selectedServices.length === 0
                    ? 'Elige tu servicio'
                    : 'Servicios de tu cita'
                  : '¿Deseas agregar otro servicio?'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#F5EDF8] text-[#70048C] flex items-center justify-center hover:bg-[#EE0272] hover:text-[#FFF9FC] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {!showOtherServices ? (
          <div className="mt-5 space-y-5">
            <div className="rounded-2xl bg-[#F5EDF8] border border-[#70048C]/12 p-4 space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#70048C]/75">
                Servicio seleccionado
              </p>
              <p className="text-base font-bold text-[#70048C]">
                {lastAddedService || selectedServices[0]}
              </p>
              <p className="text-xs leading-relaxed text-[#29212D]/80">
                Puedes aprovechar la misma visita para sumar otros servicios como cejas, pestañas, pedicure o masajes.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setShowOtherServices(true)}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-[#F5EDF8] text-[#70048C] border border-[#70048C]/25 text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Sí, ver los demás servicios</span>
              </button>

              <button
                type="button"
                onClick={onProceed}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-5 py-3 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold hover:bg-[#70048C] transition-colors cursor-pointer"
              >
                <span>{proceedLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col min-h-0 flex-1 space-y-3">
            <div className="overflow-y-auto pr-1 space-y-4 min-h-0 flex-1">
              {SERVICE_CATEGORIES.map((category) => {
                const items = SERVICES_CATALOG.filter(
                  (item) => item.categoryId === category.id
                );

                return (
                  <div key={category.id} className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#70048C]/80">
                      {category.title}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {items.map((service) => {
                        const isSelected = selectedServices.includes(service.name);
                        return (
                          <button
                            key={service.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => onToggleService(service.name)}
                            className={`text-left px-3.5 py-3 rounded-xl border transition-colors cursor-pointer min-h-[48px] flex items-center justify-between gap-2 active:scale-[0.99] ${
                              isSelected
                                ? 'bg-[#EE0272] text-[#FFF9FC] border-[#EE0272]'
                                : 'bg-[#F5EDF8]/70 text-[#29212D] border-[#70048C]/12 hover:border-[#EE0272]'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold leading-snug">
                              {service.name}
                            </span>
                            {isSelected ? (
                              <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                            ) : (
                              <Plus
                                className="w-4 h-4 text-[#70048C]/60 shrink-0"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#70048C]/12 space-y-2.5 shrink-0">
              {selectedServices.length === 1 && (
                <p className="text-[11px] font-medium text-[#70048C] bg-[#F5EDF8] rounded-xl px-3 py-2 text-center">
                  ¿Deseas agregar otro servicio? Toca otro de la lista o continúa abajo.
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-2">
                {showSecondaryCloseInList && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="sm:w-auto inline-flex items-center justify-center min-h-[46px] px-4 py-2.5 rounded-xl bg-[#F5EDF8] text-[#70048C] text-xs sm:text-sm font-bold hover:bg-[#70048C]/12 transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                )}
                <button
                  type="button"
                  disabled={selectedServices.length === 0}
                  onClick={onProceed}
                  className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold hover:bg-[#70048C] disabled:bg-[#70048C]/25 disabled:text-[#29212D]/45 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <span>
                    {listConfirmLabel || 'Continuar'} ({selectedServices.length}{' '}
                    {selectedServices.length === 1 ? 'servicio' : 'servicios'})
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
