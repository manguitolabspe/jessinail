export type AppView =
  | 'biolink'
  | 'reservas'
  | 'servicios'
  | 'sobre-jessica'
  | 'ubicacion';

export type ServiceCategoryId =
  | 'manicure'
  | 'pedicure'
  | 'mirada-depilacion'
  | 'bienestar';

export interface ServiceItem {
  id: string;
  categoryId: ServiceCategoryId;
  categoryLabel: string;
  name: string;
  description: string;
  imageUrl: string;
  /** Campos preparados para futuras versiones */
  price?: string;
  duration?: string;
}

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  subtitle: string;
}

export const JESSI_CONFIG = {
  brandName: 'JESSI NAIL',
  descriptor: 'BEAUTY SPECIALIST',
  artistName: 'Jessica López Gascón',
  tagline: 'Tu belleza merece un momento especial.',
  heroDescription:
    'Un espacio dedicado a resaltar tu belleza y regalarte momentos de cuidado y bienestar. Descubre nuestros servicios profesionales de uñas, pedicure, cejas, pestañas, depilación y masajes relajantes.',
  commercialDescription:
    'JESSI NAIL es un espacio dedicado a realzar tu belleza y brindarte experiencias de cuidado personal y bienestar. Ofrecemos servicios profesionales de manicure, pedicure, cejas, pestañas, depilación y masajes relajantes, con atención personalizada y exclusivamente mediante citas previas.',
  highlights: [
    'Atención personalizada',
    'Experiencia profesional',
    'Servicios especializados',
    'Atención exclusivamente con cita previa',
  ],
  address: '',
  locationContext: 'Perú',
  scheduleNote: 'Atención exclusivamente con citas y reservas.',
  officialLogoUrl: '/assets/aistudio/file_000000005cec820e9bc1a2faa4e7db58_21a697e3.png',
  specialistPortraitUrl: '/assets/aistudio/file_00000000c9d4820ea2f4c63a555eede7_51bad1a0.png',
  studioBannerUrl: '/assets/aistudio/file_0000000094ec820e9bbd88d3f4e70f6a_c59bc64e.png',
  workstationBannerUrl: '/assets/aistudio/file_000000005234820e828763fad7c66efb_7c69a4f7.png',
  aboutHorizontalUrl: '/assets/aistudio/file_000000008928820ea74f36a639c2a167_ec75bdea.png',
  whatsappNumber: '51937284182',
  whatsappDisplay: '937284182',
  whatsappDisplayIntl: '+51 937 284 182',
  whatsappFloatingMessage: [
    '✨ ¡Hola Jessica! Visité la web de *JESSI NAIL* 💅',
    '',
    'Quisiera recibir información sobre sus servicios, precios y disponibilidad para agendar una cita. 🌸',
    '',
    '¡Muchas gracias! 💖',
  ].join('\n'),
  whatsappLocationMessage: [
    '📍 ¡Hola Jessica! Te escribo desde la sección de *Ubicación y Contacto* de *JESSI NAIL* 💅',
    '',
    'Quisiera consultar por tu ubicación exacta y horarios disponibles para reservar una cita. 🗓️✨',
    '',
    '¡Muchas gracias! 💖',
  ].join('\n'),
  /** Mostrar u ocultar los enlaces de redes sociales en toda la web */
  showSocialLinks: false,
  instagramUrl: '',
  instagramHandle: '@jessinail',
  facebookUrl: '',
  facebookHandle: 'JESSI NAIL',
  tiktokUrl: '',
  tiktokHandle: '@jessinail',
  /** Coordenadas de Google Maps (ej. "-4.5772,-81.2719") o enlace directo de Google Maps */
  googleMapsCoordinates: '-4.585526810694026,-81.26988610509976',
  googleMapsUrl: '',
} as const;

export function buildGoogleMapsUrl(): string | null {
  if (JESSI_CONFIG.googleMapsUrl) {
    return JESSI_CONFIG.googleMapsUrl;
  }
  if (JESSI_CONFIG.googleMapsCoordinates.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      JESSI_CONFIG.googleMapsCoordinates.trim()
    )}`;
  }
  return null;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'manicure',
    title: 'Manicure Profesional',
    subtitle: 'Construcción, brillo duradero y acabados personalizados para tus manos.',
  },
  {
    id: 'pedicure',
    title: 'Pedicure',
    subtitle: 'Cuidado estético integral, higiene y embellecimiento para tus pies.',
  },
  {
    id: 'mirada-depilacion',
    title: 'Mirada y Depilación',
    subtitle: 'Definición de cejas, curvatura de pestañas y suavidad para tu piel.',
  },
  {
    id: 'bienestar',
    title: 'Bienestar y Relajación',
    subtitle: 'Momentos dedicados a liberar tensiones y renovar tu energía.',
  },
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'unas-acrilicas',
    categoryId: 'manicure',
    categoryLabel: 'Manicure Profesional',
    name: 'Uñas acrílicas',
    description:
      'Técnica de construcción y extensión de uñas que permite conseguir longitud, resistencia y diseños personalizados. Ideal para quienes desean unas manos elegantes y una apariencia sofisticada.',
    imageUrl: '/src/assets/images/service_manicure_1794927865912.jpg',
  },
  {
    id: 'unas-en-gel',
    categoryId: 'manicure',
    categoryLabel: 'Manicure Profesional',
    name: 'Uñas en gel',
    description:
      'Servicio que proporciona un acabado brillante, delicado y natural. Ideal para quienes buscan unas uñas cuidadas, con una apariencia moderna y elegante.',
    imageUrl: '/src/assets/images/service_manicure_1794927865912.jpg',
  },
  {
    id: 'unas-de-poligel',
    categoryId: 'manicure',
    categoryLabel: 'Manicure Profesional',
    name: 'Uñas de poligel',
    description:
      'Técnica que combina características del acrílico y el gel, permitiendo conseguir uñas resistentes, ligeras y con acabados personalizados.',
    imageUrl: '/src/assets/images/service_manicure_1794927865912.jpg',
  },
  {
    id: 'pedicure-profesional',
    categoryId: 'pedicure',
    categoryLabel: 'Pedicure',
    name: 'Pedicure profesional',
    description:
      'Tratamiento dedicado al cuidado estético de los pies y las uñas. Incluye limpieza, arreglo, cuidado de cutículas y embellecimiento para conseguir unos pies bien cuidados.',
    imageUrl: '/src/assets/images/service_pedicure_1794927867520.jpg',
  },
  {
    id: 'depilacion-de-cejas',
    categoryId: 'mirada-depilacion',
    categoryLabel: 'Mirada y Depilación',
    name: 'Depilación de cejas',
    description:
      'Diseño y definición de cejas según las facciones del rostro, buscando una apariencia armoniosa y natural que resalte la expresión.',
    imageUrl: '/src/assets/images/service_lashes_brows_1794927867828.jpg',
  },
  {
    id: 'depilacion-con-cera',
    categoryId: 'mirada-depilacion',
    categoryLabel: 'Mirada y Depilación',
    name: 'Depilación con cera',
    description:
      'Técnica de eliminación del vello desde la raíz para conseguir una piel suave y una apariencia limpia y cuidada.',
    imageUrl: '/src/assets/images/service_lashes_brows_1794927867828.jpg',
  },
  {
    id: 'rizado-de-pestanas',
    categoryId: 'mirada-depilacion',
    categoryLabel: 'Mirada y Depilación',
    name: 'Rizado de pestañas',
    description:
      'Tratamiento que proporciona curvatura y definición a las pestañas naturales, ayudando a conseguir una mirada más abierta y expresiva.',
    imageUrl: '/src/assets/images/service_lashes_brows_1794927867828.jpg',
  },
  {
    id: 'pigmentacion-de-pestanas',
    categoryId: 'mirada-depilacion',
    categoryLabel: 'Mirada y Depilación',
    name: 'Pigmentación de pestañas',
    description:
      'Servicio que aporta intensidad y definición al color de las pestañas, logrando que luzcan visualmente más oscuras y destacadas.',
    imageUrl: '/src/assets/images/service_lashes_brows_1794927867828.jpg',
  },
  {
    id: 'colocacion-pestanas-postizas',
    categoryId: 'mirada-depilacion',
    categoryLabel: 'Mirada y Depilación',
    name: 'Colocación de pestañas postizas',
    description:
      'Aplicación de pestañas para aportar volumen, longitud y definición a la mirada. Se pueden adaptar diferentes estilos según las preferencias de cada clienta.',
    imageUrl: '/src/assets/images/service_lashes_brows_1794927867828.jpg',
  },
  {
    id: 'masajes-relajantes',
    categoryId: 'bienestar',
    categoryLabel: 'Bienestar y Relajación',
    name: 'Masajes relajantes',
    description:
      'Experiencia dedicada a favorecer la relajación muscular, aliviar tensiones y proporcionar una sensación de tranquilidad y bienestar mediante técnicas manuales.',
    imageUrl: '/src/assets/images/service_massage_1794927867899.jpg',
  },
];

export const BOOKING_POLICIES = {
  minAdvanceHours: 24,
  cancellationNoticeHours: 6,
  depositPercentage: 50,
  advanceNotice: {
    id: 'advance-24h',
    title: 'Reserva con mínimo 24 h de anticipación',
    shortText:
      'Toda solicitud de cita debe realizarse con al menos 24 horas de anticipación.',
    description:
      'Para organizar nuestra agenda y brindarte una atención dedicada, el calendario te mostrará únicamente los días y horarios disponibles desde 24 horas en adelante.',
  },
  rules: [
    {
      id: 'deposit-50',
      title: 'Pago del 50% para separar tu fecha',
      shortText:
        'Al confirmarse la cita por WhatsApp, debes realizar el pago del 50% del monto asignado para dar por separada tu fecha y horario.',
      description:
        'Una vez que Jessica confirme tu disponibilidad por WhatsApp y te indique el monto asignado, debes realizar el pago del 50% para dejar oficialmente separada tu fecha y hora.',
    },
    {
      id: 'cancel-6h',
      title: 'Cambios o cancelaciones (mín. 6 h)',
      shortText:
        'Si necesitas cambiar o cancelar, avisa con mínimo 6 horas de anticipación; de lo contrario, se pierde el 50% abonado.',
      description:
        'Si ya separaste tu cita con el 50% y no podrás asistir, debes avisar con al menos 6 horas de anticipación para reprogramarla. Si no asistes sin aviso previo, se pierde el monto abonado.',
    },
  ],
} as const;

export function buildWhatsAppUrl(customMessage?: string): string {
  const digits = JESSI_CONFIG.whatsappNumber.replace(/\D/g, '');
  const text = encodeURIComponent(
    customMessage || JESSI_CONFIG.whatsappFloatingMessage
  );
  return `https://wa.me/${digits}?text=${text}`;
}

export function buildReservationWhatsAppMessage(params: {
  fullName: string;
  clientWhatsapp: string;
  serviceName?: string;
  serviceNames?: string[];
  preferredDate: string;
  preferredTime: string;
  comments: string;
}): string {
  const trimmedComments = params.comments.trim();
  const normalizedName = params.fullName.trim().replace(/\s+/g, ' ');
  const servicesList =
    params.serviceNames && params.serviceNames.length > 0
      ? params.serviceNames
      : params.serviceName
      ? [params.serviceName]
      : [];

  const serviceSection =
    servicesList.length > 1
      ? ['💖 *SERVICIOS SOLICITADOS:*', ...servicesList.map((s) => `• ${s}`)]
      : ['💖 *SERVICIO SOLICITADO:*', `• ${servicesList[0] || 'Por definir'}`];

  const lines = [
    '💅✨ *NUEVA SOLICITUD DE CITA — JESSI NAIL* ✨💅',
    '',
    '👤 *DATOS DEL CLIENTE:*',
    `• Nombre: ${normalizedName}`,
    `• WhatsApp: ${params.clientWhatsapp.trim()}`,
    '',
    ...serviceSection,
    '',
    '📅 *FECHA Y HORA PREFERIDA:*',
    `• Fecha: ${params.preferredDate}`,
    `• Hora: ${params.preferredTime}`,
  ];

  if (trimmedComments) {
    lines.push('', '📝 *COMENTARIOS:*', trimmedComments);
  }

  lines.push(
    '',
    '🌸 Quedo pendiente de tu confirmación de disponibilidad. ¡Muchas gracias!'
  );

  return lines.join('\n');
}
