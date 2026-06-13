import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Approved } from '@/components/emails/Approved';
import { ClaimSubmitted } from '@/components/emails/ClaimSubmitted';
import { DocumentsReceived } from '@/components/emails/DocumentsReceived';
import { PaymentSent } from '@/components/emails/PaymentSent';
import { Rejected } from '@/components/emails/Rejected';
import { UnderReview } from '@/components/emails/UnderReview';
import { getEvent, interpolateSubject, placeholderValues, type Values } from './events';

/** Convert a multiline list field into an array of items. */
function toList(value: string): string[] {
  const items = value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? items : [''];
}

/** Map each event ID to a React element whose props match the challenge variable names. */
const TEMPLATES: Record<string, (v: Values) => ReactElement> = {
  'claim-submitted': (v) => (
    <ClaimSubmitted
      claim_number={v.claim_number}
      member_name={v.member_name}
      claim_type={v.claim_type}
      submitted_date={v.submitted_date}
    />
  ),
  'documents-received': (v) => (
    <DocumentsReceived
      claim_number={v.claim_number}
      member_name={v.member_name}
      document_count={v.document_count}
      documents_list={toList(v.documents_list)}
    />
  ),
  'under-review': (v) => (
    <UnderReview
      claim_number={v.claim_number}
      member_name={v.member_name}
      assessor_name={v.assessor_name}
      estimated_days={v.estimated_days}
    />
  ),
  approved: (v) => (
    <Approved
      claim_number={v.claim_number}
      member_name={v.member_name}
      approved_amount={v.approved_amount}
      original_amount={v.original_amount}
      payment_method={v.payment_method}
    />
  ),
  rejected: (v) => (
    <Rejected
      claim_number={v.claim_number}
      member_name={v.member_name}
      rejection_reason={v.rejection_reason}
      appeal_deadline={v.appeal_deadline}
    />
  ),
  'payment-sent': (v) => (
    <PaymentSent
      claim_number={v.claim_number}
      member_name={v.member_name}
      payment_amount={v.payment_amount}
      payment_date={v.payment_date}
      reference_number={v.reference_number}
    />
  ),
};

export interface RenderedEmail {
  subject: string;
  html: string;
}

/**
 * Render a complete email using actual values, which React escapes automatically.
 * This engine powers both the preview and the Generate Email feature.
 */
export function renderEmail(eventId: string, values: Values): RenderedEmail {
  const event = getEvent(eventId);
  const element = TEMPLATES[eventId](values);
  return {
    subject: interpolateSubject(event.subject, values),
    html: '<!DOCTYPE html>' + renderToStaticMarkup(element),
  };
}

/**
 * Render a raw template with {{key}} placeholders. The exported HTML is compatible
 * with Mustache/Handlebars and can be used directly by an email delivery system.
 */
export function renderTemplate(eventId: string): RenderedEmail {
  const event = getEvent(eventId);
  return {
    subject: event.subject,
    html: renderEmail(eventId, placeholderValues(event)).html,
  };
}
