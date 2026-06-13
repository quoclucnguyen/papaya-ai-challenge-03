/** Brand guidelines from AI_Challenge_03.md, shared by every email component. */
export const BRAND = {
  primary: '#2563EB', // blue
  primaryDeep: '#1E40AF',
  primarySoft: '#EFF6FF',
  primaryBorder: '#BFDBFE',
  positive: '#10B981', // green — positive outcomes
  positiveDeep: '#047857',
  positiveSoft: '#ECFDF5',
  positiveBorder: '#A7F3D0',
  warning: '#EF4444', // red — rejection/urgent
  warningDeep: '#B91C1C',
  warningSoft: '#FEF2F2',
  ink: '#111827',
  body: '#374151',
  muted: '#6B7280',
  faint: '#9CA3AF',
  line: '#E5E7EB',
  cardBg: '#F9FAFB',
  pageBg: '#F3F4F6',
} as const;

/** Brand-compliant system sans-serif stack with broad email-client support. */
export const FONT = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export type Tone = 'info' | 'positive' | 'warning';

export const TONE_BADGE: Record<Tone, { bg: string; color: string }> = {
  info: { bg: BRAND.primarySoft, color: BRAND.primary },
  positive: { bg: BRAND.positiveSoft, color: BRAND.positiveDeep },
  warning: { bg: BRAND.warningSoft, color: BRAND.warningDeep },
};

export const SUPPORT = {
  email: 'support@papayainsurance.example',
  phone: '+84 28 7123 4567',
  phoneHref: 'tel:+842871234567',
  hours: 'Mon–Fri, 8:30–17:30',
};
