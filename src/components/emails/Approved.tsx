import { EmailLayout } from './EmailLayout';
import { Badge, ClaimRef, DataCard, Heading, HighlightBox, Paragraph, Section } from './shared';

export interface ApprovedProps {
  claim_number: string;
  member_name: string;
  approved_amount: string;
  original_amount: string;
  payment_method: string;
}

export function Approved(p: ApprovedProps) {
  return (
    <EmailLayout
      title={`Good news! Claim ${p.claim_number} has been approved`}
      accent="positive"
      preheader={
        <>
          Great news, {p.member_name} &mdash; your claim {p.claim_number} has been approved for{' '}
          {p.approved_amount}.
        </>
      }
    >
      <Section pad="36px 40px 8px">
        <Badge tone="positive">Approved</Badge>
        <Heading>Good news, {p.member_name} &mdash; your claim is approved!</Heading>
      </Section>

      <Section pad="16px 40px 8px">
        <Paragraph>
          We&rsquo;ve finished reviewing claim <ClaimRef>{p.claim_number}</ClaimRef>, and we&rsquo;re happy
          to let you know it has been approved.
        </Paragraph>
      </Section>

      {/* The challenge requires the approved amount to be prominently highlighted. */}
      <Section>
        <HighlightBox tone="positive" label="Approved amount" value={p.approved_amount} />
      </Section>

      <Section pad="20px 40px 8px">
        <DataCard
          rows={[
            { label: 'Amount you submitted', value: p.original_amount },
            { label: 'How we’ll pay you', value: p.payment_method },
          ]}
        />
      </Section>

      <Section pad="24px 40px 36px">
        <Paragraph size={14}>
          Your payment is being prepared, and we&rsquo;ll send you another email the moment it&rsquo;s on its
          way. If the approved amount differs from what you submitted, your claim summary in the member
          portal explains exactly how it was calculated &mdash; or just reach out and we&rsquo;ll walk you
          through it.
        </Paragraph>
      </Section>
    </EmailLayout>
  );
}
