import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  MessageCircle,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  AlertCircle,
  CalendarDays,
  User,
  Sparkles,
  ClipboardCheck,
  RotateCcw,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import {
  BOOKING_POLICIES,
  JESSI_CONFIG,
  buildReservationWhatsAppMessage,
  buildWhatsAppUrl,
} from '../data/jessiConfig';
import {
  formatReadableSpanishDate,
  formatTime12h,
  getEarliestAvailableSlot,
  getLocalIsoDate,
  hasAnyValidSlotForDate,
  isDateTimeAtLeast24hAhead,
} from './CustomDateTimePicker';
import { AddMoreServicesModal } from './AddMoreServicesModal';
import {
  AdvanceNoticeModal,
  DatePickerModal,
  TimePickerModal,
} from './BookingPickerModals';

interface BookingFormSectionProps {
  preselectedService: string;
}

type BookingSectionKey =
  | 'servicios'
  | 'fecha'
  | 'hora'
  | 'datos'
  | 'confirmacion';

interface FormErrors {
  fullName?: string;
  clientWhatsapp?: string;
  selectedServices?: string;
  preferredDate?: string;
  preferredTime?: string;
  acceptedPolicies?: string;
}

const SECTION_TABS: Array<{
  key: BookingSectionKey;
  label: string;
  icon: LucideIcon;
}> = [
  { key: 'servicios', label: 'Servicios', icon: Sparkles },
  { key: 'fecha', label: 'Día', icon: CalendarDays },
  { key: 'hora', label: 'Hora', icon: Clock },
  { key: 'datos', label: 'Datos', icon: User },
  { key: 'confirmacion', label: 'Resumen', icon: ClipboardCheck },
];

export function BookingFormSection({
  preselectedService,
}: BookingFormSectionProps) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [activeSection, setActiveSection] =
    useState<BookingSectionKey>('servicios');
  const [returnToConfirmation, setReturnToConfirmation] = useState(false);
  const [showFullPolicies, setShowFullPolicies] = useState(false);
  const [summaryConfirmed, setSummaryConfirmed] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(true);
  const [addMoreModalOpen, setAddMoreModalOpen] = useState(false);
  const [servicesModalShowList, setServicesModalShowList] = useState(true);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [lastAddedService, setLastAddedService] = useState('');

  const [selectedServices, setSelectedServices] = useState<string[]>(() =>
    preselectedService ? [preselectedService] : []
  );
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [fullName, setFullName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [comments, setComments] = useState('');
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedPayload, setSubmittedPayload] = useState<{
    message: string;
    whatsappUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const hiddenLinkRef = useRef<HTMLAnchorElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const navTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (preselectedService) {
      setSelectedServices((prev) =>
        prev.includes(preselectedService) ? prev : [...prev, preselectedService]
      );
      setActiveSection('servicios');
      setReturnToConfirmation(false);
      setSummaryConfirmed(false);
      setErrors((prev) => ({ ...prev, selectedServices: undefined }));
      setSubmittedPayload(null);
    }
  }, [preselectedService]);

  const todayIso = getLocalIsoDate(0);
  const maxDateIso = getLocalIsoDate(90);

  const validateField = (
    field: keyof FormErrors,
    values: {
      fullName: string;
      clientWhatsapp: string;
      selectedServices: string[];
      preferredDate: string;
      preferredTime: string;
      acceptedPolicies: boolean;
    },
    referenceNow: Date = now
  ): string | undefined => {
    switch (field) {
      case 'selectedServices':
        if (values.selectedServices.length === 0) {
          return 'Elige al menos un servicio para continuar.';
        }
        return undefined;

      case 'preferredDate':
        if (!values.preferredDate) {
          return 'Elige un día disponible en el calendario.';
        }
        if (values.preferredDate < todayIso) {
          return 'La fecha no puede ser anterior a hoy.';
        }
        if (values.preferredDate > maxDateIso) {
          return 'Elige una fecha dentro de los próximos 90 días.';
        }
        if (!hasAnyValidSlotForDate(values.preferredDate, referenceNow)) {
          return 'Este día ya no cuenta con horarios que cumplan las 24 horas mínimas de anticipación.';
        }
        return undefined;

      case 'preferredTime':
        if (!values.preferredTime) {
          return 'Elige una hora disponible para tu cita.';
        }
        if (
          values.preferredDate &&
          !isDateTimeAtLeast24hAhead(
            values.preferredDate,
            values.preferredTime,
            referenceNow
          )
        ) {
          return 'Las reservas deben hacerse con un mínimo de 24 horas de anticipación.';
        }
        return undefined;

      case 'fullName': {
        const trimmed = values.fullName.trim().replace(/\s+/g, ' ');
        if (!trimmed || trimmed.length < 3) {
          return 'Ingresa tu nombre y apellido (mínimo 3 caracteres).';
        }
        if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1' -]+$/.test(trimmed)) {
          return 'Ingresa un nombre válido usando solo letras.';
        }
        const words = trimmed.split(' ').filter(Boolean);
        if (words.length < 2) {
          return 'Por favor incluye tu nombre y apellido.';
        }
        return undefined;
      }

      case 'clientWhatsapp': {
        const trimmedWa = values.clientWhatsapp.trim();
        const digits = trimmedWa.replace(/\D/g, '');
        if (!digits) {
          return 'Ingresa tu número de WhatsApp para confirmarte.';
        }
        if (!/^[+\d\s()-]+$/.test(trimmedWa)) {
          return 'Ingresa solo números válidos para tu WhatsApp.';
        }
        if (digits.length < 8 || digits.length > 15) {
          return 'El número debe tener entre 8 y 15 dígitos.';
        }
        if (
          /^(\d)\1+$/.test(digits) ||
          ['12345678', '123456789', '987654321', '012345678'].includes(digits)
        ) {
          return 'Ingresa un número de WhatsApp real.';
        }
        return undefined;
      }

      case 'acceptedPolicies':
        if (!values.acceptedPolicies) {
          return 'Confirma que leíste y aceptas las políticas de reserva para enviar tu solicitud.';
        }
        return undefined;
    }
  };

  const currentValues = {
    fullName,
    clientWhatsapp,
    selectedServices,
    preferredDate,
    preferredTime,
    acceptedPolicies,
  };

  const isSectionComplete = (
    section: BookingSectionKey,
    referenceNow: Date = now
  ): boolean => {
    if (section === 'servicios') {
      return !validateField('selectedServices', currentValues, referenceNow);
    }
    if (section === 'fecha') {
      return !validateField('preferredDate', currentValues, referenceNow);
    }
    if (section === 'hora') {
      return (
        !validateField('preferredDate', currentValues, referenceNow) &&
        !validateField('preferredTime', currentValues, referenceNow)
      );
    }
    if (section === 'datos') {
      return (
        !validateField('fullName', currentValues, referenceNow) &&
        !validateField('clientWhatsapp', currentValues, referenceNow)
      );
    }
    return !validateField('acceptedPolicies', currentValues, referenceNow);
  };

  const scrollToNavTop = () => {
    navTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validateSectionAndGetErrors = (
    section: BookingSectionKey,
    referenceNow: Date = now
  ): FormErrors => {
    const sectionErrors: FormErrors = {};
    if (section === 'servicios') {
      const err = validateField('selectedServices', currentValues, referenceNow);
      if (err) sectionErrors.selectedServices = err;
    } else if (section === 'fecha') {
      const dateErr = validateField('preferredDate', currentValues, referenceNow);
      if (dateErr) sectionErrors.preferredDate = dateErr;
    } else if (section === 'hora') {
      const dateErr = validateField('preferredDate', currentValues, referenceNow);
      const timeErr = validateField('preferredTime', currentValues, referenceNow);
      if (dateErr) sectionErrors.preferredDate = dateErr;
      if (timeErr) sectionErrors.preferredTime = timeErr;
    } else if (section === 'datos') {
      const nameErr = validateField('fullName', currentValues, referenceNow);
      const waErr = validateField('clientWhatsapp', currentValues, referenceNow);
      if (nameErr) sectionErrors.fullName = nameErr;
      if (waErr) sectionErrors.clientWhatsapp = waErr;
    } else if (section === 'confirmacion') {
      const policyErr = validateField(
        'acceptedPolicies',
        currentValues,
        referenceNow
      );
      if (policyErr) sectionErrors.acceptedPolicies = policyErr;
    }
    return sectionErrors;
  };

  const sectionOrder: BookingSectionKey[] = [
    'servicios',
    'fecha',
    'hora',
    'datos',
    'confirmacion',
  ];

  const handleContinue = () => {
    const freshNow = new Date();
    setNow(freshNow);

    const sectionErrors = validateSectionAndGetErrors(activeSection, freshNow);
    if (Object.keys(sectionErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...sectionErrors }));
      if (activeSection === 'datos') {
        setTouched((prev) => ({
          ...prev,
          fullName: true,
          clientWhatsapp: true,
        }));
      }
      return;
    }

    if (returnToConfirmation) {
      if (
        activeSection === 'fecha' &&
        (!preferredTime ||
          !isDateTimeAtLeast24hAhead(preferredDate, preferredTime, freshNow))
      ) {
        setActiveSection('hora');
        scrollToNavTop();
        return;
      }
      setReturnToConfirmation(false);
      setSummaryConfirmed(false);
      setActiveSection('confirmacion');
      scrollToNavTop();
      return;
    }

    const currentIdx = sectionOrder.indexOf(activeSection);
    if (currentIdx < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentIdx + 1];
      if (nextSection === 'confirmacion') {
        setSummaryConfirmed(false);
      }
      setActiveSection(nextSection);
      scrollToNavTop();
    }
  };

  const handleBack = () => {
    if (activeSection === 'confirmacion' && summaryConfirmed) {
      setSummaryConfirmed(false);
      scrollToNavTop();
      return;
    }
    setReturnToConfirmation(false);
    const currentIdx = sectionOrder.indexOf(activeSection);
    if (currentIdx > 0) {
      setActiveSection(sectionOrder[currentIdx - 1]);
      scrollToNavTop();
    }
  };

  const handleEditFromSummary = (target: BookingSectionKey) => {
    setReturnToConfirmation(true);
    setSummaryConfirmed(false);
    setActiveSection(target);
    scrollToNavTop();
  };

  const handleJumpToSection = (target: BookingSectionKey) => {
    const currentIdx = sectionOrder.indexOf(activeSection);
    const targetIdx = sectionOrder.indexOf(target);

    if (target === 'confirmacion') {
      setReturnToConfirmation(false);
    }

    if (targetIdx <= currentIdx) {
      if (target !== 'confirmacion') {
        setSummaryConfirmed(false);
      }
      setActiveSection(target);
      scrollToNavTop();
      return;
    }

    const freshNow = new Date();
    setNow(freshNow);
    for (let i = 0; i < targetIdx; i++) {
      const key = sectionOrder[i];
      const errs = validateSectionAndGetErrors(key, freshNow);
      if (Object.keys(errs).length > 0) {
        setReturnToConfirmation(false);
        setSummaryConfirmed(false);
        setActiveSection(key);
        setErrors((prev) => ({ ...prev, ...errs }));
        if (key === 'datos') {
          setTouched((prev) => ({
            ...prev,
            fullName: true,
            clientWhatsapp: true,
          }));
        }
        scrollToNavTop();
        return;
      }
    }

    setReturnToConfirmation(false);
    if (target === 'confirmacion') {
      setSummaryConfirmed(false);
    }
    setActiveSection(target);
    scrollToNavTop();
  };

  const handleToggleService = (serviceName: string) => {
    setSelectedServices((prev) => {
      const exists = prev.includes(serviceName);
      const next = exists
        ? prev.filter((item) => item !== serviceName)
        : [...prev, serviceName];
      if (next.length > 0) {
        setErrors((e) => ({ ...e, selectedServices: undefined }));
      }
      return next;
    });
    setSubmittedPayload(null);
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, currentValues);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validateAll = (referenceNow: Date = now): FormErrors => {
    const nextErrors: FormErrors = {
      selectedServices: validateField(
        'selectedServices',
        currentValues,
        referenceNow
      ),
      preferredDate: validateField(
        'preferredDate',
        currentValues,
        referenceNow
      ),
      preferredTime: validateField(
        'preferredTime',
        currentValues,
        referenceNow
      ),
      fullName: validateField('fullName', currentValues, referenceNow),
      clientWhatsapp: validateField(
        'clientWhatsapp',
        currentValues,
        referenceNow
      ),
      acceptedPolicies: validateField(
        'acceptedPolicies',
        currentValues,
        referenceNow
      ),
    };
    return Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => Boolean(value))
    ) as FormErrors;
  };

  const handleSelectDate = (isoDate: string) => {
    const freshNow = new Date();
    setNow(freshNow);
    setPreferredDate(isoDate);
    setTouched((prev) => ({ ...prev, preferredDate: true }));

    const nextDateError = validateField(
      'preferredDate',
      { ...currentValues, preferredDate: isoDate },
      freshNow
    );

    if (
      preferredTime &&
      !isDateTimeAtLeast24hAhead(isoDate, preferredTime, freshNow)
    ) {
      setPreferredTime('');
    }

    setErrors((prev) => ({
      ...prev,
      preferredDate: nextDateError,
      preferredTime: undefined,
    }));
    setSubmittedPayload(null);
  };

  const handleQuickSelectEarliest = (isoDate: string, time24: string) => {
    const freshNow = new Date();
    setNow(freshNow);
    setPreferredDate(isoDate);
    setPreferredTime(time24);
    setErrors((prev) => ({
      ...prev,
      preferredDate: undefined,
      preferredTime: undefined,
    }));
    setSubmittedPayload(null);
    setDateModalOpen(false);

    if (activeSection === 'confirmacion' || returnToConfirmation) {
      setReturnToConfirmation(false);
      setActiveSection('confirmacion');
    } else {
      setActiveSection('hora');
    }
    scrollToNavTop();
  };

  const handleConfirmDateModal = () => {
    const freshNow = new Date();
    setNow(freshNow);
    const dateErr = validateField('preferredDate', currentValues, freshNow);
    if (dateErr) {
      setErrors((prev) => ({ ...prev, preferredDate: dateErr }));
      return;
    }

    setDateModalOpen(false);

    const needsNewTime =
      !preferredTime ||
      !isDateTimeAtLeast24hAhead(preferredDate, preferredTime, freshNow);

    if (activeSection === 'confirmacion') {
      if (needsNewTime) {
        setTimeModalOpen(true);
      }
      return;
    }

    if (returnToConfirmation) {
      if (needsNewTime) {
        setActiveSection('hora');
        setTimeModalOpen(true);
        return;
      }
      setReturnToConfirmation(false);
      setActiveSection('confirmacion');
      scrollToNavTop();
      return;
    }

    setActiveSection('hora');
    if (needsNewTime) {
      setTimeModalOpen(true);
    }
    scrollToNavTop();
  };

  const handleConfirmTimeModal = () => {
    const freshNow = new Date();
    setNow(freshNow);
    const timeErr = validateField('preferredTime', currentValues, freshNow);
    if (timeErr) {
      setErrors((prev) => ({ ...prev, preferredTime: timeErr }));
      return;
    }

    setTimeModalOpen(false);

    if (activeSection === 'confirmacion') {
      return;
    }

    if (returnToConfirmation) {
      setReturnToConfirmation(false);
      setActiveSection('confirmacion');
      scrollToNavTop();
      return;
    }

    setActiveSection('datos');
    scrollToNavTop();
  };

  const handleSelectTime = (time24: string) => {
    const freshNow = new Date();
    setNow(freshNow);
    setPreferredTime(time24);
    setTouched((prev) => ({ ...prev, preferredTime: true }));

    const nextTimeError = validateField(
      'preferredTime',
      { ...currentValues, preferredTime: time24 },
      freshNow
    );
    setErrors((prev) => ({ ...prev, preferredTime: nextTimeError }));
    setSubmittedPayload(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const freshNow = new Date();
    setNow(freshNow);

    setTouched({
      selectedServices: true,
      preferredDate: true,
      preferredTime: true,
      fullName: true,
      clientWhatsapp: true,
      acceptedPolicies: true,
    });

    const validationErrors = validateAll(freshNow);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmittedPayload(null);
      if (validationErrors.selectedServices) {
        setActiveSection('servicios');
      } else if (validationErrors.preferredDate) {
        setActiveSection('fecha');
      } else if (validationErrors.preferredTime) {
        setActiveSection('hora');
      } else if (validationErrors.fullName || validationErrors.clientWhatsapp) {
        setActiveSection('datos');
      } else {
        setActiveSection('confirmacion');
      }
      scrollToNavTop();
      return;
    }

    const formattedDate = formatReadableSpanishDate(preferredDate);
    const formattedTime = `${formatTime12h(preferredTime)} (${preferredTime})`;
    const formattedMessage = buildReservationWhatsAppMessage({
      fullName,
      clientWhatsapp,
      serviceNames: selectedServices,
      preferredDate: `${formattedDate} (${preferredDate})`,
      preferredTime: formattedTime,
      comments,
    });

    const whatsappUrl = buildWhatsAppUrl(formattedMessage);
    setSubmittedPayload({
      message: formattedMessage,
      whatsappUrl,
    });
    setCopied(false);

    if (hiddenLinkRef.current) {
      hiddenLinkRef.current.href = whatsappUrl;
      hiddenLinkRef.current.click();
    }
  };

  const handleCopyMessage = async () => {
    if (!submittedPayload) return;
    try {
      await navigator.clipboard.writeText(submittedPayload.message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setSelectedServices([]);
    setPreferredDate('');
    setPreferredTime('');
    setFullName('');
    setClientWhatsapp('');
    setComments('');
    setAcceptedPolicies(false);
    setShowFullPolicies(false);
    setSummaryConfirmed(false);
    setReturnToConfirmation(false);
    setAddMoreModalOpen(false);
    setServicesModalShowList(false);
    setDateModalOpen(false);
    setTimeModalOpen(false);
    setLastAddedService('');
    setTouched({});
    setErrors({});
    setSubmittedPayload(null);
    setCopied(false);
    setActiveSection('servicios');
    scrollToNavTop();
  };

  const earliestSlot = getEarliestAvailableSlot(now);
  const liveWhatsappUrl =
    preferredDate && preferredTime && selectedServices.length > 0 && acceptedPolicies
      ? buildWhatsAppUrl(
          buildReservationWhatsAppMessage({
            fullName,
            clientWhatsapp,
            serviceNames: selectedServices,
            preferredDate: `${formatReadableSpanishDate(preferredDate)} (${preferredDate})`,
            preferredTime: `${formatTime12h(preferredTime)} (${preferredTime})`,
            comments,
          })
        )
      : '#';

  const currentStepIndex = Math.max(0, sectionOrder.indexOf(activeSection));
  const progressPercent = ((currentStepIndex + 1) / sectionOrder.length) * 100;

  return (
    <section id="reservas" className="pt-3 pb-36 md:py-10 bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
        <div className="hidden md:block max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#EE0272]">
            {JESSI_CONFIG.brandName} · Solicitud de cita
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-[#70048C] text-balance-wrap">
            Reserva tu momento de belleza.
          </h1>
        </div>

        {/* Barra segmentada estilo app + indicador de progreso */}
        <div ref={navTopRef} className="space-y-2 scroll-mt-16 md:scroll-mt-20">
          <nav
            aria-label="Secciones de la reserva"
            className="grid grid-cols-5 gap-1 rounded-2xl bg-[#F5EDF8]/85 border border-[#70048C]/12 p-1.5"
          >
            {SECTION_TABS.map((tab) => {
              const isActive = activeSection === tab.key;
              const isDone = isSectionComplete(tab.key) && !isActive;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleJumpToSection(tab.key)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-h-[50px] sm:min-h-[46px] px-1 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFF9FC] text-[#EE0272] shadow-sm border border-[#EE0272]/20'
                      : isDone
                      ? 'text-[#70048C] hover:bg-[#FFF9FC]/60'
                      : 'text-[#29212D]/55 hover:text-[#70048C]'
                  }`}
                >
                  <span
                    className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#EE0272] text-[#FFF9FC]'
                        : isDone
                        ? 'bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/20'
                        : 'bg-[#FFF9FC]/60 text-[#29212D]/55'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                    {isDone && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#70048C] text-[#FFF9FC] flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold leading-tight tracking-tight sm:tracking-normal text-center whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            aria-hidden="true"
            className="h-1 w-full rounded-full bg-[#F5EDF8] overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-[#EE0272] transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          {/* Vista 1: Selección de servicios mediante modal */}
          {activeSection === 'servicios' && (
            <div
              className="max-w-3xl bg-transparent p-0 sm:rounded-3xl sm:bg-[#F5EDF8] sm:border sm:border-[#70048C]/15 sm:p-7 space-y-4 sm:space-y-5"
              aria-invalid={
                Boolean(errors.selectedServices) ? 'true' : undefined
              }
            >
              <div>
                <p className="md:hidden text-[11px] font-bold uppercase tracking-[0.14em] text-[#EE0272]">
                  Paso 1 de 5
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#70048C]">
                  ¿Qué te gustaría realizarte?
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#29212D]/75">
                  Elige uno o varios servicios para tu cita (por ejemplo, uñas y cejas).
                </p>
              </div>

              <div
                className={`rounded-2xl bg-[#FFF9FC] border p-4 sm:p-5 space-y-4 shadow-xs ${
                  errors.selectedServices
                    ? 'border-[#EE0272]'
                    : 'border-[#70048C]/18'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLastAddedService(
                      selectedServices[selectedServices.length - 1] || ''
                    );
                    setServicesModalShowList(true);
                    setAddMoreModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between gap-3 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#F5EDF8] text-[#EE0272] flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                        {selectedServices.length > 0
                          ? `Servicios elegidos (${selectedServices.length})`
                          : 'Servicio de tu cita'}
                      </p>
                      <p className="mt-0.5 text-sm sm:text-base font-bold text-[#29212D]">
                        {selectedServices.length === 0
                          ? 'Toca para elegir un servicio'
                          : 'Toca para agregar o cambiar'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className="w-5 h-5 text-[#70048C]/50 group-hover:text-[#EE0272] shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </button>

                {selectedServices.length > 0 && (
                  <div className="pt-2 border-t border-[#70048C]/10 flex flex-wrap gap-2">
                    {selectedServices.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleToggleService(name)}
                        aria-label={`Quitar ${name}`}
                        className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-xl bg-[#F5EDF8] text-[#70048C] border border-[#70048C]/18 text-xs sm:text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer"
                      >
                        <span>{name}</span>
                        <X className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setLastAddedService(
                      selectedServices[selectedServices.length - 1] || ''
                    );
                    setServicesModalShowList(true);
                    setAddMoreModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-5 py-3 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold hover:bg-[#70048C] active:scale-[0.99] transition-all cursor-pointer"
                >
                  {selectedServices.length === 0 ? (
                    <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>
                    {selectedServices.length === 0
                      ? 'Elegir servicio'
                      : 'Agregar o cambiar servicios'}
                  </span>
                </button>
              </div>

              {errors.selectedServices && (
                <p
                  role="alert"
                  className="text-xs font-semibold text-[#EE0272] flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{errors.selectedServices}</span>
                </p>
              )}

              <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FFF9FC]/95 backdrop-blur-md border-t border-[#70048C]/12 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-2.5 md:static md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:pt-1 md:justify-between">
                {selectedServices.length === 0 ? (
                  <p className="hidden md:block text-xs text-[#29212D]/65">
                    Elige al menos un servicio para continuar.
                  </p>
                ) : (
                  <span className="hidden md:block" />
                )}
                <button
                  type="button"
                  disabled={selectedServices.length === 0}
                  onClick={handleContinue}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-[#70048C] text-[#FFF9FC] text-sm font-bold hover:bg-[#EE0272] disabled:bg-[#70048C]/25 disabled:text-[#29212D]/45 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {returnToConfirmation
                      ? 'Volver al resumen'
                      : 'Siguiente paso'}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Vista 2: Selección del día mediante modal */}
          {activeSection === 'fecha' && (
            <div className="max-w-3xl bg-transparent p-0 sm:rounded-3xl sm:bg-[#F5EDF8] sm:border sm:border-[#70048C]/15 sm:p-7 space-y-4 sm:space-y-5">
              <div>
                <p className="md:hidden text-[11px] font-bold uppercase tracking-[0.14em] text-[#EE0272]">
                  Paso 2 de 5
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#70048C]">
                  ¿Qué día prefieres?
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#29212D]/75">
                  Toca para abrir el calendario (mínimo{' '}
                  {BOOKING_POLICIES.minAdvanceHours} h de anticipación).
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setDateModalOpen(true)}
                  className={`w-full rounded-2xl bg-[#FFF9FC] border p-4 sm:p-5 flex items-center justify-between gap-3 text-left shadow-xs hover:border-[#EE0272] active:scale-[0.99] transition-all cursor-pointer ${
                    errors.preferredDate
                      ? 'border-[#EE0272]'
                      : 'border-[#70048C]/18'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#F5EDF8] text-[#EE0272] flex items-center justify-center shrink-0">
                      <CalendarDays className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                        Día de tu cita
                      </p>
                      <p className="mt-0.5 text-sm sm:text-base font-bold text-[#29212D] capitalize truncate">
                        {preferredDate
                          ? formatReadableSpanishDate(preferredDate)
                          : 'Toca para abrir el calendario'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-[#EE0272]">
                      {preferredDate ? 'Cambiar' : 'Elegir'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#EE0272]" aria-hidden="true" />
                  </div>
                </button>

                {earliestSlot && (
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickSelectEarliest(
                        earliestSlot.date,
                        earliestSlot.time
                      )
                    }
                    className="w-full rounded-2xl bg-[#F5EDF8]/90 sm:bg-[#FFF9FC] border border-[#70048C]/18 p-4 flex items-center justify-between gap-3 text-left hover:border-[#EE0272] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#EE0272]/10 text-[#EE0272] flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#EE0272]">
                          Primer turno disponible
                        </p>
                        <p className="mt-0.5 text-xs sm:text-sm font-bold text-[#70048C] capitalize truncate">
                          {formatReadableSpanishDate(earliestSlot.date)} ·{' '}
                          {formatTime12h(earliestSlot.time)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 text-[#70048C] shrink-0"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>

              {errors.preferredDate && (
                <p
                  role="alert"
                  className="text-xs font-semibold text-[#EE0272] flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{errors.preferredDate}</span>
                </p>
              )}

              <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FFF9FC]/95 backdrop-blur-md border-t border-[#70048C]/12 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-2.5 md:static md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:pt-1 md:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/20 text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Volver</span>
                </button>

                <button
                  type="button"
                  disabled={!preferredDate}
                  onClick={handleContinue}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-[#70048C] text-[#FFF9FC] text-sm font-bold hover:bg-[#EE0272] disabled:bg-[#70048C]/25 disabled:text-[#29212D]/45 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {returnToConfirmation ? 'Volver al resumen' : 'Elegir hora'}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Vista 3: Selección de la hora mediante modal */}
          {activeSection === 'hora' && (
            <div className="max-w-3xl bg-transparent p-0 sm:rounded-3xl sm:bg-[#F5EDF8] sm:border sm:border-[#70048C]/15 sm:p-7 space-y-4 sm:space-y-5">
              <div>
                <p className="md:hidden text-[11px] font-bold uppercase tracking-[0.14em] text-[#EE0272]">
                  Paso 3 de 5
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#70048C]">
                  ¿A qué hora prefieres visitarnos?
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#29212D]/75">
                  Toca para ver los horarios disponibles para tu día.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDateModalOpen(true)}
                className="w-full rounded-2xl bg-[#FFF9FC] border border-[#70048C]/15 px-4 py-3.5 flex items-center justify-between gap-2 text-left hover:border-[#EE0272] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0 text-xs sm:text-sm">
                  <CalendarDays className="w-4 h-4 text-[#EE0272] shrink-0" aria-hidden="true" />
                  <span className="font-bold text-[#70048C] capitalize truncate">
                    {preferredDate
                      ? formatReadableSpanishDate(preferredDate)
                      : 'Aún no has elegido un día'}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EE0272] shrink-0">
                  <span>Cambiar</span>
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTimeModalOpen(true)}
                className={`w-full rounded-2xl bg-[#FFF9FC] border p-4 sm:p-5 flex items-center justify-between gap-3 text-left shadow-xs hover:border-[#EE0272] active:scale-[0.99] transition-all cursor-pointer ${
                  errors.preferredTime
                    ? 'border-[#EE0272]'
                    : 'border-[#70048C]/18'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-[#F5EDF8] text-[#EE0272] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                      Hora preferida
                    </p>
                    <p className="mt-0.5 text-sm sm:text-base font-bold text-[#29212D] tabular-nums">
                      {preferredTime
                        ? formatTime12h(preferredTime)
                        : 'Toca para elegir horario'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-[#EE0272]">
                    {preferredTime ? 'Cambiar' : 'Elegir'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#EE0272]" aria-hidden="true" />
                </div>
              </button>

              {errors.preferredTime && (
                <p
                  role="alert"
                  className="text-xs font-semibold text-[#EE0272] flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{errors.preferredTime}</span>
                </p>
              )}

              <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FFF9FC]/95 backdrop-blur-md border-t border-[#70048C]/12 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-2.5 md:static md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:pt-1 md:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/20 text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Volver</span>
                </button>

                <button
                  type="button"
                  disabled={!preferredTime}
                  onClick={handleContinue}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-[#70048C] text-[#FFF9FC] text-sm font-bold hover:bg-[#EE0272] disabled:bg-[#70048C]/25 disabled:text-[#29212D]/45 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {returnToConfirmation ? 'Volver al resumen' : 'Continuar'}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Vista 4: Datos del cliente */}
          {activeSection === 'datos' && (
            <div className="max-w-3xl bg-transparent p-0 sm:rounded-3xl sm:bg-[#F5EDF8] sm:border sm:border-[#70048C]/15 sm:p-7 space-y-4 sm:space-y-5">
              <div>
                <p className="md:hidden text-[11px] font-bold uppercase tracking-[0.14em] text-[#EE0272]">
                  Paso 4 de 5
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#70048C]">
                  ¿A nombre de quién agendamos?
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#29212D]/75">
                  Compártenos tu nombre y WhatsApp para confirmar la disponibilidad de tu cita.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-xs font-bold uppercase tracking-wider text-[#70048C] mb-1.5"
                  >
                    Nombre y apellido *
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    aria-invalid={Boolean(errors.fullName)}
                    onBlur={() => handleBlur('fullName')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFullName(val);
                      if (touched.fullName) {
                        setErrors((p) => ({
                          ...p,
                          fullName: validateField('fullName', {
                            ...currentValues,
                            fullName: val,
                          }),
                        }));
                      } else {
                        setErrors((p) => ({ ...p, fullName: undefined }));
                      }
                      setSubmittedPayload(null);
                    }}
                    placeholder="Ej. Camila o Carlos Pérez"
                    className="w-full min-h-[52px] px-4 py-3 rounded-xl bg-[#FFF9FC] border border-[#70048C]/20 text-base sm:text-sm text-[#29212D] placeholder:text-[#29212D]/45 focus:outline-none focus:border-[#EE0272]"
                  />
                  {errors.fullName && (
                    <p
                      role="alert"
                      className="mt-1.5 text-xs font-semibold text-[#EE0272] flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-whatsapp"
                    className="block text-xs font-bold uppercase tracking-wider text-[#70048C] mb-1.5"
                  >
                    Tu WhatsApp *
                  </label>
                  <input
                    id="booking-whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={clientWhatsapp}
                    aria-invalid={Boolean(errors.clientWhatsapp)}
                    onBlur={() => handleBlur('clientWhatsapp')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setClientWhatsapp(val);
                      if (touched.clientWhatsapp) {
                        setErrors((p) => ({
                          ...p,
                          clientWhatsapp: validateField('clientWhatsapp', {
                            ...currentValues,
                            clientWhatsapp: val,
                          }),
                        }));
                      } else {
                        setErrors((p) => ({
                          ...p,
                          clientWhatsapp: undefined,
                        }));
                      }
                      setSubmittedPayload(null);
                    }}
                    placeholder="Ej. 937 284 182"
                    className="w-full min-h-[52px] px-4 py-3 rounded-xl bg-[#FFF9FC] border border-[#70048C]/20 text-base sm:text-sm text-[#29212D] placeholder:text-[#29212D]/45 tabular-nums focus:outline-none focus:border-[#EE0272]"
                  />
                  {errors.clientWhatsapp && (
                    <p
                      role="alert"
                      className="mt-1.5 text-xs font-semibold text-[#EE0272] flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.clientWhatsapp}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="booking-comments"
                    className="block text-xs font-bold uppercase tracking-wider text-[#70048C]"
                  >
                    Comentarios adicionales (opcional)
                  </label>
                  <span className="text-[11px] font-medium text-[#70048C]/75 tabular-nums">
                    {comments.length}/300
                  </span>
                </div>
                <textarea
                  id="booking-comments"
                  rows={3}
                  maxLength={300}
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                    setSubmittedPayload(null);
                  }}
                  placeholder="Cuéntanos si tienes alguna preferencia de diseño, largo o consulta especial..."
                  className="w-full px-4 py-3 rounded-xl bg-[#FFF9FC] border border-[#70048C]/20 text-base sm:text-sm text-[#29212D] placeholder:text-[#29212D]/45 focus:outline-none focus:border-[#EE0272]"
                />
              </div>

              <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FFF9FC]/95 backdrop-blur-md border-t border-[#70048C]/12 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-2.5 md:static md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:pt-1 md:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/20 text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Volver</span>
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-[#70048C] text-[#FFF9FC] text-sm font-bold hover:bg-[#EE0272] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>
                    {returnToConfirmation ? 'Volver al resumen' : 'Ver resumen'}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Vista 5: 1) Confirmación del resumen -> 2) Condiciones y envío a WhatsApp */}
          {activeSection === 'confirmacion' && !summaryConfirmed && (
            <div className="max-w-3xl bg-transparent p-0 sm:rounded-3xl sm:bg-[#F5EDF8] sm:border sm:border-[#70048C]/15 sm:p-7 space-y-4 sm:space-y-5">
              <div>
                <p className="md:hidden text-[11px] font-bold uppercase tracking-[0.14em] text-[#EE0272]">
                  Paso 5 de 5 · Revisa tu reserva
                </p>
                <p className="hidden md:block text-xs font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                  Revisa tu reserva
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#70048C]">
                  Resumen de tu cita
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#29212D]/75">
                  Revisa que todo esté correcto. Si deseas cambiar algo, tócalo ahora; si estás conforme, confirma para ver las condiciones.
                </p>
              </div>

              <div className="rounded-2xl bg-[#FFF9FC] border border-[#70048C]/15 p-4 sm:p-6 shadow-xs">
                <dl className="divide-y divide-[#70048C]/10 text-sm">
                  <div className="py-3 first:pt-0 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <Sparkles className="w-4 h-4 text-[#EE0272] mt-0.5 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                          {selectedServices.length > 1 ? 'Servicios' : 'Servicio'}
                        </dt>
                        <dd className="font-bold text-[#29212D]">
                          <ul className="space-y-0.5">
                            {selectedServices.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLastAddedService(
                          selectedServices[selectedServices.length - 1] || ''
                        );
                        setServicesModalShowList(true);
                        setAddMoreModalOpen(true);
                      }}
                      className="min-h-[36px] px-2.5 text-xs font-bold text-[#70048C] hover:text-[#EE0272] underline underline-offset-4 shrink-0 cursor-pointer"
                    >
                      Cambiar
                    </button>
                  </div>

                  <div className="py-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <CalendarDays className="w-4 h-4 text-[#EE0272] mt-0.5 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                          Día
                        </dt>
                        <dd className="font-semibold text-[#29212D] capitalize">
                          {formatReadableSpanishDate(preferredDate)}
                        </dd>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDateModalOpen(true)}
                      className="min-h-[36px] px-2.5 text-xs font-bold text-[#70048C] hover:text-[#EE0272] underline underline-offset-4 shrink-0 cursor-pointer"
                    >
                      Cambiar
                    </button>
                  </div>

                  <div className="py-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <Clock className="w-4 h-4 text-[#EE0272] mt-0.5 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                          Hora preferida
                        </dt>
                        <dd className="font-bold text-[#29212D] tabular-nums">
                          {formatTime12h(preferredTime)}
                        </dd>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTimeModalOpen(true)}
                      className="min-h-[36px] px-2.5 text-xs font-bold text-[#70048C] hover:text-[#EE0272] underline underline-offset-4 shrink-0 cursor-pointer"
                    >
                      Cambiar
                    </button>
                  </div>

                  <div className="py-3 last:pb-0 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <User className="w-4 h-4 text-[#EE0272] mt-0.5 shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <dt className="text-[11px] font-bold uppercase tracking-wider text-[#70048C]/75">
                          Cliente
                        </dt>
                        <dd className="font-semibold text-[#29212D]">
                          {fullName.trim()}
                        </dd>
                        <dd className="text-xs text-[#29212D]/75 tabular-nums">
                          WhatsApp: {clientWhatsapp.trim()}
                        </dd>
                        {comments.trim() && (
                          <dd className="mt-1 text-xs text-[#29212D]/75 break-words">
                            Nota: {comments.trim()}
                          </dd>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEditFromSummary('datos')}
                      className="min-h-[36px] px-2.5 text-xs font-bold text-[#70048C] hover:text-[#EE0272] underline underline-offset-4 shrink-0 cursor-pointer"
                    >
                      Editar
                    </button>
                  </div>
                </dl>
              </div>

              <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FFF9FC]/95 backdrop-blur-md border-t border-[#70048C]/12 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-2.5 md:static md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:pt-1 md:justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[48px] px-4 py-2.5 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/20 text-sm font-bold hover:border-[#EE0272] hover:text-[#EE0272] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Volver</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSummaryConfirmed(true);
                    scrollToNavTop();
                  }}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold hover:bg-[#70048C] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
                >
                  <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Sí, todo está correcto</span>
                </button>
              </div>
            </div>
          )}

          {activeSection === 'confirmacion' && summaryConfirmed && (
            <div className="max-w-3xl bg-transparent p-0 sm:rounded-3xl sm:bg-[#F5EDF8] sm:border sm:border-[#70048C]/15 sm:p-7 space-y-4 sm:space-y-5">
              {/* Recordatorio compacto de resumen ya confirmado */}
              <div className="rounded-2xl bg-[#FFF9FC] border border-[#70048C]/15 px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-[#70048C] shrink-0" aria-hidden="true" />
                  <p className="text-xs sm:text-sm font-semibold text-[#29212D] truncate capitalize">
                    {formatReadableSpanishDate(preferredDate)} ·{' '}
                    {formatTime12h(preferredTime)} · {selectedServices.length}{' '}
                    {selectedServices.length === 1 ? 'servicio' : 'servicios'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSummaryConfirmed(false);
                    scrollToNavTop();
                  }}
                  className="text-xs font-bold text-[#EE0272] hover:text-[#70048C] underline underline-offset-4 shrink-0 cursor-pointer whitespace-nowrap"
                >
                  Revisar resumen
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#EE0272] shrink-0" aria-hidden="true" />
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#70048C]">
                    Condiciones de reserva
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFullPolicies((v) => !v)}
                  aria-expanded={showFullPolicies}
                  className="inline-flex items-center gap-1 min-h-[36px] px-1 text-xs font-bold text-[#70048C] hover:text-[#EE0272] cursor-pointer whitespace-nowrap"
                >
                  <span>{showFullPolicies ? 'Ocultar detalle' : 'Ver detalle'}</span>
                  {showFullPolicies ? (
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Lista de condiciones */}
              <ul className="rounded-2xl bg-[#FFF9FC] border border-[#70048C]/15 p-4 space-y-2.5 text-xs sm:text-sm leading-relaxed text-[#29212D]/85 shadow-xs">
                {BOOKING_POLICIES.rules.map((rule) => (
                  <li key={rule.id} className="flex items-start gap-2.5">
                    <span className="text-[#EE0272] font-bold shrink-0">•</span>
                    <span>
                      <strong className="text-[#70048C]">{rule.title}:</strong>{' '}
                      {showFullPolicies ? rule.description : rule.shortText}
                    </span>
                  </li>
                ))}
              </ul>

              {selectedServices.length > 1 && (
                <p className="text-xs leading-relaxed text-[#70048C] bg-[#FFF9FC] rounded-xl px-4 py-2.5 border border-[#70048C]/12">
                  Incluye <strong>{selectedServices.length} servicios</strong>; Jessica te confirmará el tiempo estimado y el monto del 50% por WhatsApp.
                </p>
              )}

              <label
                htmlFor="booking-accept-policies"
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors cursor-pointer ${
                  acceptedPolicies
                    ? 'bg-[#FFF9FC] border-[#70048C]/40 shadow-xs'
                    : errors.acceptedPolicies
                    ? 'bg-[#FFF9FC] border-[#EE0272]'
                    : 'bg-[#FFF9FC] border-[#70048C]/20 hover:border-[#EE0272]'
                }`}
              >
                <input
                  id="booking-accept-policies"
                  type="checkbox"
                  checked={acceptedPolicies}
                  aria-invalid={Boolean(errors.acceptedPolicies)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAcceptedPolicies(checked);
                    setTouched((prev) => ({
                      ...prev,
                      acceptedPolicies: true,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      acceptedPolicies: checked
                        ? undefined
                        : validateField('acceptedPolicies', {
                            ...currentValues,
                            acceptedPolicies: checked,
                          }),
                    }));
                    setSubmittedPayload(null);
                  }}
                  className="mt-0.5 h-5 w-5 rounded border-[#70048C]/35 text-[#EE0272] accent-[#EE0272] shrink-0 cursor-pointer"
                />
                <span className="text-xs sm:text-sm leading-relaxed text-[#29212D] font-medium">
                  Estoy de acuerdo: al confirmarse mi cita realizaré el pago del 50% del monto asignado para dar por separada mi fecha y horario (cambios con mínimo 6 h de aviso).
                </span>
              </label>

              {errors.acceptedPolicies && (
                <p
                  role="alert"
                  className="text-xs font-semibold text-[#EE0272] flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{errors.acceptedPolicies}</span>
                </p>
              )}

              <div className="fixed bottom-0 inset-x-0 z-30 bg-[#FFF9FC]/95 backdrop-blur-md border-t border-[#70048C]/12 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-2.5 md:static md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:pt-1 md:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSummaryConfirmed(false);
                    scrollToNavTop();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[50px] px-4 rounded-xl bg-[#FFF9FC] text-[#70048C] border border-[#70048C]/20 text-xs sm:text-sm font-bold hover:border-[#EE0272] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Volver</span>
                </button>

                <button
                  type="submit"
                  disabled={!acceptedPolicies}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 min-h-[50px] sm:min-h-[52px] px-4 sm:px-6 py-3.5 rounded-xl bg-[#EE0272] text-[#FFF9FC] text-xs sm:text-sm font-bold tracking-wide hover:bg-[#70048C] active:scale-[0.99] disabled:bg-[#70048C]/25 disabled:text-[#29212D]/45 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70048C]"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>REALIZAR RESERVA POR WHATSAPP</span>
                </button>
                <a
                  ref={hiddenLinkRef}
                  href={liveWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="sr-only"
                >
                  Enviar por WhatsApp
                </a>
              </div>
            </div>
          )}
        </form>
      </div>

      <AddMoreServicesModal
        isOpen={addMoreModalOpen}
        initialShowList={servicesModalShowList}
        lastAddedService={lastAddedService}
        selectedServices={selectedServices}
        onToggleService={handleToggleService}
        onClose={() => {
          setAddMoreModalOpen(false);
          if (selectedServices.length === 0 && activeSection === 'confirmacion') {
            setActiveSection('servicios');
            setErrors((prev) => ({
              ...prev,
              selectedServices: 'Elige al menos un servicio para continuar.',
            }));
          }
        }}
        onProceed={() => {
          setAddMoreModalOpen(false);
          if (activeSection !== 'confirmacion') {
            handleContinue();
          }
        }}
        proceedLabel={
          activeSection === 'confirmacion' || returnToConfirmation
            ? 'Volver al resumen'
            : 'No, continuar al siguiente paso'
        }
        listConfirmLabel={
          activeSection === 'confirmacion' || returnToConfirmation
            ? 'Guardar cambios'
            : 'Elegir día'
        }
        showSecondaryCloseInList={activeSection !== 'confirmacion'}
      />

      <DatePickerModal
        isOpen={dateModalOpen}
        selectedDate={preferredDate}
        onSelectDate={handleSelectDate}
        onQuickSelectEarliest={handleQuickSelectEarliest}
        onClose={() => setDateModalOpen(false)}
        onConfirm={handleConfirmDateModal}
        confirmLabel={
          activeSection === 'confirmacion' || returnToConfirmation
            ? 'Guardar día'
            : 'Confirmar día'
        }
        dateError={errors.preferredDate}
        now={now}
      />

      <TimePickerModal
        isOpen={timeModalOpen}
        selectedDate={preferredDate}
        selectedTime={preferredTime}
        onSelectTime={handleSelectTime}
        onChangeDate={() => {
          setTimeModalOpen(false);
          setDateModalOpen(true);
        }}
        onClose={() => setTimeModalOpen(false)}
        onConfirm={handleConfirmTimeModal}
        confirmLabel={
          activeSection === 'confirmacion' || returnToConfirmation
            ? 'Guardar hora'
            : 'Confirmar hora'
        }
        timeError={errors.preferredTime}
        now={now}
      />

      <AdvanceNoticeModal
        isOpen={showAdvanceModal}
        onConfirm={() => setShowAdvanceModal(false)}
      />

      {submittedPayload && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#29212D]/60 p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-ready-modal-title"
          onClick={() => setSubmittedPayload(null)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FFF9FC] border border-[#70048C]/20 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 rounded-full bg-[#70048C]/20 mx-auto sm:hidden" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F5EDF8] text-[#EE0272] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#EE0272]">
                    {JESSI_CONFIG.brandName} · Envío por WhatsApp
                  </p>
                  <h2
                    id="whatsapp-ready-modal-title"
                    className="font-display text-xl font-bold text-[#70048C]"
                  >
                    Solicitud lista para enviar
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSubmittedPayload(null)}
                aria-label="Cerrar ventana"
                className="min-w-[40px] min-h-[40px] rounded-xl bg-[#F5EDF8] text-[#70048C] flex items-center justify-center hover:bg-[#EE0272] hover:text-[#FFF9FC] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-[#29212D]/80">
              Si WhatsApp no se abrió automáticamente en tu teléfono, pulsa el botón de abajo para abrir el chat con tu mensaje ya preparado.
            </p>

            <div className="flex flex-col gap-2.5">
              <a
                href={submittedPayload.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-5 py-3 rounded-2xl bg-[#EE0272] text-[#FFF9FC] text-sm font-bold hover:bg-[#70048C] transition-colors"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Abrir WhatsApp y enviar</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-[#F5EDF8] text-[#70048C] text-xs font-bold hover:bg-[#70048C]/10 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl bg-[#F5EDF8] text-[#70048C] text-xs font-bold hover:bg-[#70048C]/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Nueva cita</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
