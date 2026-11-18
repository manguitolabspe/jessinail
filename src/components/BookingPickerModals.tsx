import { useEffect } from 'react';
import { X, CalendarDays, Clock, ArrowRight, Check } from 'lucide-react';
import { BOOKING_POLICIES, JESSI_CONFIG } from '../data/jessiConfig';
import {
  CustomCalendarPicker,
  CustomTimePicker,
  formatReadableSpanishDate,
  formatTime12h,
} from './CustomDateTimePicker';

interface DatePickerModalProps {
  isOpen: boolean;
  selectedDate: string;
  onSelectDate: (isoDate: string) => void;
  onQuickSelectEarliest: (isoDate: string, time24: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  dateError?: string;
  now: Date;
}

export function DatePickerModal({
  isOpen,
  selectedDate,
  onSelectDate,
  onQuickSelectEarliest,
  onClose,
  onConfirm,
  confirmLabel = 'Confirmar día',
  dateError,
  now,
}: DatePickerModalProps) {
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#29212D]/60 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="date-picker-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FFF9FC] border border-[#70048C]/20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 max-h-[88dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-[#70048C]/20 mx-auto mb-3 sm:hidden shrink-0" />

        <div className="flex items-start justify-between gap-4 shrink-0 pb-3 border-b border-[#70048C]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDF8] flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-[#EE0272]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                {JESSI_CONFIG.brandName} · Calendario
              </p>
              <h2
                id="date-picker-modal-title"
                className="font-display text-xl font-bold text-[#70048C]"
              >
                Elige el día de tu cita
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar calendario"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#F5EDF8] text-[#70048C] flex items-center justify-center hover:bg-[#EE0272] hover:text-[#FFF9FC] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto pr-0.5 min-h-0 flex-1">
          <CustomCalendarPicker
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            onQuickSelectEarliest={onQuickSelectEarliest}
            dateError={dateError}
            now={now}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-[#70048C]/12 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0 text-xs">
            {selectedDate ? (
              <span className="font-bold text-[#70048C] capitalize block truncate">
                {formatReadableSpanishDate(selectedDate)}
              </span>
            ) : (
              <span className="text-[#29212D]/65">
                Selecciona un día disponible
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!selectedDate}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold hover:bg-[#70048C] disabled:bg-[#70048C]/25 disabled:text-[#29212D]/45 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{confirmLabel}</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface TimePickerModalProps {
  isOpen: boolean;
  selectedDate: string;
  selectedTime: string;
  onSelectTime: (time24: string) => void;
  onChangeDate: () => void;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  timeError?: string;
  now: Date;
}

export function TimePickerModal({
  isOpen,
  selectedDate,
  selectedTime,
  onSelectTime,
  onChangeDate,
  onClose,
  onConfirm,
  confirmLabel = 'Confirmar hora',
  timeError,
  now,
}: TimePickerModalProps) {
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#29212D]/60 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="time-picker-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FFF9FC] border border-[#70048C]/20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 max-h-[88dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-[#70048C]/20 mx-auto mb-3 sm:hidden shrink-0" />

        <div className="flex items-start justify-between gap-4 shrink-0 pb-3 border-b border-[#70048C]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDF8] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#EE0272]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                {JESSI_CONFIG.brandName} · Horarios
              </p>
              <h2
                id="time-picker-modal-title"
                className="font-display text-xl font-bold text-[#70048C]"
              >
                Elige tu hora preferida
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar selector de hora"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#F5EDF8] text-[#70048C] flex items-center justify-center hover:bg-[#EE0272] hover:text-[#FFF9FC] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto pr-0.5 min-h-0 flex-1">
          <CustomTimePicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectTime={onSelectTime}
            onChangeDate={onChangeDate}
            timeError={timeError}
            now={now}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-[#70048C]/12 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0 text-xs">
            {selectedTime ? (
              <span className="font-bold text-[#70048C] tabular-nums">
                Hora elegida: {formatTime12h(selectedTime)}
              </span>
            ) : (
              <span className="text-[#29212D]/65">
                Selecciona un horario disponible
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!selectedTime}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold hover:bg-[#70048C] disabled:bg-[#70048C]/25 disabled:text-[#29212D]/45 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{confirmLabel}</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface AdvanceNoticeModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function AdvanceNoticeModal({
  isOpen,
  onConfirm,
}: AdvanceNoticeModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#29212D]/60 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="advance-notice-modal-title"
      onClick={onConfirm}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FFF9FC] border border-[#70048C]/20 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 rounded-full bg-[#70048C]/20 mx-auto sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F5EDF8] text-[#EE0272] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                {JESSI_CONFIG.brandName} · Antes de empezar
              </p>
              <h2
                id="advance-notice-modal-title"
                className="font-display text-xl font-bold text-[#70048C] leading-snug"
              >
                {BOOKING_POLICIES.advanceNotice.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onConfirm}
            aria-label="Cerrar aviso"
            className="min-w-[40px] min-h-[40px] rounded-xl bg-[#F5EDF8] text-[#70048C] flex items-center justify-center hover:bg-[#EE0272] hover:text-[#FFF9FC] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="rounded-2xl bg-[#F5EDF8] border border-[#70048C]/12 p-4 space-y-2 text-sm leading-relaxed text-[#29212D]/90">
          <p className="font-semibold text-[#70048C]">
            {BOOKING_POLICIES.advanceNotice.shortText}
          </p>
          <p className="text-xs sm:text-sm text-[#29212D]/80">
            {BOOKING_POLICIES.advanceNotice.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-5 py-3 rounded-2xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold hover:bg-[#70048C] active:scale-[0.99] transition-all cursor-pointer"
        >
          <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Entendido, empezar mi reserva</span>
        </button>
      </div>
    </div>
  );
}
