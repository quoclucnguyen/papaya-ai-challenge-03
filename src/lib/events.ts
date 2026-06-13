import type { Tone } from '@/components/emails/theme';

export type FieldType = 'text' | 'long' | 'list';

export interface FieldDef {
  key: string;
  label: string;
  type?: FieldType;
  sample: string;
}

export interface EmailEvent {
  id: string;
  name: string;
  /** Subject line from the challenge's Events table, using {{...}} variables. */
  subject: string;
  tone: Tone;
  fields: FieldDef[];
}

/** Current variable values for an event. */
export type Values = Record<string, string>;

export const EVENTS: EmailEvent[] = [
  {
    id: 'claim-submitted',
    name: 'Claim Submitted',
    subject: 'Your claim {{claim_number}} has been received',
    tone: 'info',
    fields: [
      { key: 'claim_number', label: 'Claim number', sample: 'CLM-00482' },
      { key: 'member_name', label: 'Member name', sample: 'Linh Tran' },
      { key: 'claim_type', label: 'Claim type', sample: 'Outpatient' },
      { key: 'submitted_date', label: 'Submitted date', sample: '12 June 2026' },
    ],
  },
  {
    id: 'documents-received',
    name: 'Documents Received',
    subject: 'Documents received for claim {{claim_number}}',
    tone: 'info',
    fields: [
      { key: 'claim_number', label: 'Claim number', sample: 'CLM-00482' },
      { key: 'member_name', label: 'Member name', sample: 'Linh Tran' },
      { key: 'document_count', label: 'Document count', sample: '3' },
      {
        key: 'documents_list',
        label: 'Documents list (one item per line)',
        type: 'list',
        sample:
          'Medical receipt — City General Hospital.pdf\nDoctor referral letter.pdf\nPrescription — 12 June 2026.jpg',
      },
    ],
  },
  {
    id: 'under-review',
    name: 'Under Review',
    subject: 'Your claim {{claim_number}} is being reviewed',
    tone: 'info',
    fields: [
      { key: 'claim_number', label: 'Claim number', sample: 'CLM-00482' },
      { key: 'member_name', label: 'Member name', sample: 'Linh Tran' },
      { key: 'assessor_name', label: 'Assessor name', sample: 'Minh Pham' },
      { key: 'estimated_days', label: 'Estimated days', sample: '5' },
    ],
  },
  {
    id: 'approved',
    name: 'Approved',
    subject: 'Good news! Claim {{claim_number}} has been approved',
    tone: 'positive',
    fields: [
      { key: 'claim_number', label: 'Claim number', sample: 'CLM-00482' },
      { key: 'member_name', label: 'Member name', sample: 'Linh Tran' },
      { key: 'approved_amount', label: 'Approved amount', sample: '4,500,000 ₫' },
      { key: 'original_amount', label: 'Original amount', sample: '5,000,000 ₫' },
      { key: 'payment_method', label: 'Payment method', sample: 'Bank transfer •••• 1234' },
    ],
  },
  {
    id: 'rejected',
    name: 'Rejected',
    subject: 'Update on claim {{claim_number}}',
    tone: 'warning',
    fields: [
      { key: 'claim_number', label: 'Claim number', sample: 'CLM-00482' },
      { key: 'member_name', label: 'Member name', sample: 'Linh Tran' },
      {
        key: 'rejection_reason',
        label: 'Rejection reason',
        type: 'long',
        sample:
          'The treatment you received on 12 June 2026 took place after your policy’s coverage period ended on 31 May 2026. This means the visit isn’t covered under your current plan.',
      },
      { key: 'appeal_deadline', label: 'Appeal deadline', sample: '11 July 2026' },
    ],
  },
  {
    id: 'payment-sent',
    name: 'Payment Sent',
    subject: 'Payment for claim {{claim_number}} has been processed',
    tone: 'positive',
    fields: [
      { key: 'claim_number', label: 'Claim number', sample: 'CLM-00482' },
      { key: 'member_name', label: 'Member name', sample: 'Linh Tran' },
      { key: 'payment_amount', label: 'Payment amount', sample: '4,500,000 ₫' },
      { key: 'payment_date', label: 'Payment date', sample: '18 June 2026' },
      { key: 'reference_number', label: 'Reference number', sample: 'PAY-2026-018452' },
    ],
  },
];

export function getEvent(id: string): EmailEvent {
  const event = EVENTS.find((e) => e.id === id);
  if (!event) throw new Error(`Unknown event: ${id}`);
  return event;
}

export function sampleValues(event: EmailEvent): Values {
  return Object.fromEntries(event.fields.map((f) => [f.key, f.sample]));
}

/** {{key}} placeholder values used to export a Mustache-compatible raw template. */
export function placeholderValues(event: EmailEvent): Values {
  return Object.fromEntries(event.fields.map((f) => [f.key, `{{${f.key}}}`]));
}

export function interpolateSubject(subject: string, values: Values): string {
  return subject.replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (m, key) => values[key] ?? m);
}
