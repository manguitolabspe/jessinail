import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { BOOKING_POLICIES } from '../data/jessiConfig';

export interface TimeSlotOption {
  value: string; // "HH:mm" 24h
  label: string; // "9:00 AM"
  period: 'Mañana' | 'Tarde' | 'Noche';
}

export const SALON_TIME_SLOTS: TimeSlotOption[] = [
  { value: '09:00', label: '9:00 AM', period: 'Mañana' },
  { value: '09:30', label: '9:30 AM', period: 'Mañana' },
  { value: '10:00', label: '10:00 AM', period: 'Mañana' },
  { value: '10:30', label: '10:30 AM', period: 'Mañana' },
  { value: '11:00', label: '11:00 AM', period: 'Mañana' },
  { value: '11:30', label: '11:30 AM', period: 'Mañana' },
  { value: '12:00', label: '12:00 PM', period: 'Mañana' },
  { value: '12:30', label: '12:30 PM', period: 'Mañana' },
  { value: '13:00', label: '1:00 PM', period: 'Tarde' },
  { value: '13:30', label: '1:30 PM', period: 'Tarde' },
  { value: '14:00', label: '2:00 PM', period: 'Tarde' },
  { value: '14:30', label: '2:30 PM', period: 'Tarde' },
  { value: '15:00', label: '3:00 PM', period: 'Tarde' },
  { value: '15:30', label: '3:30 PM', period: 'Tarde' },
  { value: '16:00', label: '4:00 PM', period: 'Tarde' },
  { value: '16:30', label: '4:30 PM', period: 'Tarde' },
  { value: '17:00', label: '5:00 PM', period: 'Tarde' },
  { value: '17:30', label: '5:30 PM', period: 'Tarde' },
  { value: '18:00', label: '6:00 PM', period: 'Noche' },
  { value: '18:30', label: '6:30 PM', period: 'Noche' },
  { value: '19:00', label: '7:00 PM', period: 'Noche' },
  { value: '19:30', label: '7:30 PM', period: 'Noche' },
  { value: '20:00', label: '8:00 PM', period: 'Noche' },
];

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const TIME_PERIODS: Array<TimeSlotOption['period']> = ['Mañana', 'Tarde', 'Noche'];

export function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLocalIsoDate(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return toLocalIsoDate(date);
}

export function parseLocalDateTime(isoDate: string, time24: string): Date | null {
  if (!isoDate || !time24) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  const [hours, minutes] = time24.split(':').map(Number);
  if (
    !year ||
    !month ||
    !day ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function formatReadableSpanishDate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatTime12h(time24: string): string {
  const matched = SALON_TIME_SLOTS.find((slot) => slot.value === time24);
  if (matched) return matched.label;
  const [hStr, mStr] = time24.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function getMinAllowedTimestamp(referenceNow: Date = new Date()): number {
  return (
    referenceNow.getTime() +
    BOOKING_POLICIES.minAdvanceHours * 60 * 60 * 1000
  );
}

export function isDateTimeAtLeast24hAhead(
  isoDate: string,
  time24: string,
  referenceNow: Date = new Date()
): boolean {
  const target = parseLocalDateTime(isoDate, time24);
  if (!target) return false;
  return target.getTime() >= getMinAllowedTimestamp(referenceNow);
}

export function hasAnyValidSlotForDate(
  isoDate: string,
  referenceNow: Date = new Date()
): boolean {
  const lastSlot = SALON_TIME_SLOTS[SALON_TIME_SLOTS.length - 1];
  return isDateTimeAtLeast24hAhead(isoDate, lastSlot.value, referenceNow);
}

export function getEarliestAvailableSlot(referenceNow: Date = new Date()): {
  date: string;
  time: string;
} | null {
  for (let offset = 0; offset <= 90; offset++) {
    const candidateDate = getLocalIsoDate(offset);
    for (const slot of SALON_TIME_SLOTS) {
      if (isDateTimeAtLeast24hAhead(candidateDate, slot.value, referenceNow)) {
        return { date: candidateDate, time: slot.value };
      }
    }
  }
  return null;
}

interface CustomCalendarPickerProps {
  selectedDate: string;
  onSelectDate: (isoDate: string) => void;
  onQuickSelectEarliest?: (isoDate: string, time24: string) => void;
  dateError?: string;
  now: Date;
}

export function CustomCalendarPicker({
  selectedDate,
  onSelectDate,
  onQuickSelectEarliest,
  dateError,
  now,
}: CustomCalendarPickerProps) {
  const todayIso = toLocalIsoDate(now);
  const maxDateIso = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() + 90);
    return toLocalIsoDate(d);
  }, [now]);

  const earliest = useMemo(() => getEarliestAvailableSlot(now), [now]);

  const initialMonthDate = useMemo(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split('-').map(Number);
      if (y && m) return new Date(y, m - 1, 1);
    }
    if (earliest) {
      const [y, m] = earliest.date.split('-').map(Number);
      if (y && m) return new Date(y, m - 1, 1);
    }
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);

  const [viewMonth, setViewMonth] = useState<Date>(initialMonthDate);

  const minMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const maxDateObj = new Date(now);
  maxDateObj.setDate(maxDateObj.getDate() + 90);
  const maxMonthStart = new Date(maxDateObj.getFullYear(), maxDateObj.getMonth(), 1);

  const canGoPrevMonth =
    viewMonth.getFullYear() > minMonthStart.getFullYear() ||
    (viewMonth.getFullYear() === minMonthStart.getFullYear() &&
      viewMonth.getMonth() > minMonthStart.getMonth());

  const canGoNextMonth =
    viewMonth.getFullYear() < maxMonthStart.getFullYear() ||
    (viewMonth.getFullYear() === maxMonthStart.getFullYear() &&
      viewMonth.getMonth() < maxMonthStart.getMonth());

  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

    const cells: Array<{
      isoDate: string;
      dayNumber: number;
      isToday: boolean;
      isDisabled: boolean;
    } | null> = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const isoDate = toLocalIsoDate(cellDate);
      const isToday = isoDate === todayIso;
      const outOfRange = isoDate < todayIso || isoDate > maxDateIso;
      const meets24h = !outOfRange && hasAnyValidSlotForDate(isoDate, now);

      cells.push({
        isoDate,
        dayNumber: day,
        isToday,
        isDisabled: outOfRange || !meets24h,
      });
    }

    return cells;
  }, [viewMonth, todayIso, maxDateIso, now]);

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    if (!canGoNextMonth) return;
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleJumpToEarliest = () => {
    if (!earliest) return;
    const [y, m] = earliest.date.split('-').map(Number);
    if (y && m) {
      setViewMonth(new Date(y, m - 1, 1));
    }
    if (onQuickSelectEarliest) {
      onQuickSelectEarliest(earliest.date, earliest.time);
    } else {
      onSelectDate(earliest.date);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-[#FFF9FC] border border-[#70048C]/15 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Clock
            className="w-4 h-4 text-[#EE0272] mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <p className="text-xs leading-relaxed text-[#29212D]/85">
            <span className="font-bold text-[#70048C]">Anticipación mínima 24 h:</span>{' '}
            {earliest ? (
              <span className="capitalize">
                disponible desde el{' '}
                <strong className="text-[#29212D]">
                  {formatReadableSpanishDate(earliest.date)}
                </strong>{' '}
                ({formatTime12h(earliest.time)}).
              </span>
            ) : (
              'Elige una fecha con al menos 24 horas de anticipación.'
            )}
          </p>
        </div>

        {earliest && (
          <button
            type="button"
            onClick={handleJumpToEarliest}
            className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#70048C]/8 text-[#70048C] border border-[#70048C]/20 text-xs font-bold hover:bg-[#EE0272] hover:text-[#FFF9FC] hover:border-[#EE0272] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Elegir primer disponible</span>
          </button>
        )}
      </div>

      <div
        className={`rounded-2xl bg-[#FFF9FC] border p-4 sm:p-5 ${
          dateError ? 'border-[#EE0272]' : 'border-[#70048C]/18'
        }`}
        aria-invalid={Boolean(dateError) ? 'true' : undefined}
      >
        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#70048C]/10">
          <div className="flex items-center gap-2">
            <CalendarDays
              className="w-4 h-4 text-[#EE0272] shrink-0"
              aria-hidden="true"
            />
            <span className="font-display text-lg font-bold text-[#70048C]">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrevMonth}
              aria-label="Mes anterior"
              className="w-9 h-9 rounded-xl border border-[#70048C]/20 bg-[#F5EDF8]/70 text-[#70048C] flex items-center justify-center hover:border-[#EE0272] hover:text-[#EE0272] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={!canGoNextMonth}
              aria-label="Mes siguiente"
              className="w-9 h-9 rounded-xl border border-[#70048C]/20 bg-[#F5EDF8]/70 text-[#70048C] flex items-center justify-center hover:border-[#EE0272] hover:text-[#EE0272] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-3 pb-2 text-center">
          {WEEKDAY_LABELS.map((day) => (
            <span
              key={day}
              className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/70"
            >
              {day}
            </span>
          ))}
        </div>

        <div
          role="grid"
          aria-label={`Calendario de ${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`}
          className="grid grid-cols-7 gap-1.5"
        >
          {calendarDays.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} aria-hidden="true" />;
            }

            const isSelected = selectedDate === cell.isoDate;

            return (
              <button
                key={cell.isoDate}
                type="button"
                disabled={cell.isDisabled}
                onClick={() => onSelectDate(cell.isoDate)}
                aria-label={`${formatReadableSpanishDate(cell.isoDate)}${
                  cell.isDisabled
                    ? ' (no disponible por regla de 24 horas)'
                    : ''
                }`}
                aria-pressed={isSelected}
                className={`relative min-h-[42px] sm:min-h-[44px] rounded-xl text-sm font-bold tabular-nums transition-all duration-150 flex flex-col items-center justify-center ${
                  cell.isDisabled
                    ? 'text-[#29212D]/25 bg-[#F5EDF8]/40 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#EE0272] text-[#FFF9FC] shadow-sm cursor-pointer'
                    : 'bg-[#F5EDF8]/65 text-[#29212D] border border-[#70048C]/10 hover:border-[#EE0272] hover:text-[#EE0272] hover:bg-[#FFF9FC] cursor-pointer'
                }`}
              >
                <span>{cell.dayNumber}</span>
                {cell.isToday && (
                  <span
                    className={`w-1.5 h-0.5 rounded-full mt-0.5 ${
                      isSelected ? 'bg-[#FFF9FC]' : 'bg-[#70048C]/60'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-[#70048C]/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#29212D]/70">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#EE0272]" aria-hidden="true" />
              <span>Elegido</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#F5EDF8] border border-[#70048C]/20" aria-hidden="true" />
              <span>Disponible</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#F5EDF8]/50 opacity-50" aria-hidden="true" />
              <span>Menor a 24 h</span>
            </span>
          </div>

          {selectedDate && (
            <span className="font-bold text-[#70048C] capitalize">
              {formatReadableSpanishDate(selectedDate)}
            </span>
          )}
        </div>
      </div>

      {dateError && (
        <p
          role="alert"
          className="text-xs font-semibold text-[#EE0272] flex items-center gap-1.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{dateError}</span>
        </p>
      )}
    </div>
  );
}

interface CustomTimePickerProps {
  selectedDate: string;
  selectedTime: string;
  onSelectTime: (time24: string) => void;
  onChangeDate?: () => void;
  timeError?: string;
  now: Date;
}

export function CustomTimePicker({
  selectedDate,
  selectedTime,
  onSelectTime,
  onChangeDate,
  timeError,
  now,
}: CustomTimePickerProps) {
  const hasRestrictedSlotsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return false;
    return SALON_TIME_SLOTS.some(
      (slot) => !isDateTimeAtLeast24hAhead(selectedDate, slot.value, now)
    );
  }, [selectedDate, now]);

  return (
    <div className="space-y-4">
      {/* Encabezado con el día elegido y enlace rápido para cambiarlo */}
      <div className="rounded-2xl bg-[#FFF9FC] border border-[#70048C]/15 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <CalendarDays className="w-4 h-4 text-[#EE0272] shrink-0" aria-hidden="true" />
          <span className="font-bold text-[#70048C] capitalize">
            {selectedDate
              ? formatReadableSpanishDate(selectedDate)
              : 'Selecciona un día primero'}
          </span>
        </div>
        {onChangeDate && (
          <button
            type="button"
            onClick={onChangeDate}
            className="text-xs font-bold text-[#EE0272] hover:text-[#70048C] underline underline-offset-4 cursor-pointer"
          >
            Cambiar día
          </button>
        )}
      </div>

      <div
        className={`rounded-2xl bg-[#FFF9FC] border p-4 sm:p-5 space-y-4 ${
          timeError ? 'border-[#EE0272]' : 'border-[#70048C]/18'
        }`}
        aria-invalid={Boolean(timeError) ? 'true' : undefined}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#70048C]/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#EE0272] shrink-0" aria-hidden="true" />
            <span className="font-display text-lg font-bold text-[#70048C]">
              Horarios disponibles
            </span>
          </div>
          {selectedTime ? (
            <span className="text-xs font-bold text-[#EE0272] tabular-nums">
              Elegido: {formatTime12h(selectedTime)}
            </span>
          ) : (
            <span className="text-xs font-medium text-[#29212D]/65">
              Sujeto a confirmación de Jessica
            </span>
          )}
        </div>

        {hasRestrictedSlotsOnSelectedDate && (
          <p className="text-xs leading-relaxed text-[#70048C] bg-[#F5EDF8] rounded-xl px-3.5 py-2.5 border border-[#70048C]/12">
            Los horarios tachados no cumplen aún las{' '}
            <strong>24 horas mínimas de anticipación</strong>.
          </p>
        )}

        <div className="space-y-4">
          {TIME_PERIODS.map((period) => {
            const periodSlots = SALON_TIME_SLOTS.filter(
              (slot) => slot.period === period
            );
            return (
              <div key={period} className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#70048C]/75">
                  {period}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {periodSlots.map((slot) => {
                    const allowed = isDateTimeAtLeast24hAhead(
                      selectedDate,
                      slot.value,
                      now
                    );
                    const isSelected = selectedTime === slot.value;

                    return (
                      <button
                        key={slot.value}
                        type="button"
                        disabled={!allowed}
                        onClick={() => onSelectTime(slot.value)}
                        aria-pressed={isSelected}
                        aria-label={`${slot.label}${
                          !allowed ? ' (no disponible, menor a 24 horas)' : ''
                        }`}
                        className={`min-h-[42px] px-2.5 py-2 rounded-xl text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap transition-all duration-150 ${
                          !allowed
                            ? 'bg-[#F5EDF8]/45 text-[#29212D]/30 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#EE0272] text-[#FFF9FC] shadow-sm cursor-pointer'
                            : 'bg-[#F5EDF8]/65 text-[#70048C] border border-[#70048C]/15 hover:border-[#EE0272] hover:text-[#EE0272] hover:bg-[#FFF9FC] cursor-pointer'
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {timeError && (
        <p
          role="alert"
          className="text-xs font-semibold text-[#EE0272] flex items-center gap-1.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{timeError}</span>
        </p>
      )}
    </div>
  );
}
