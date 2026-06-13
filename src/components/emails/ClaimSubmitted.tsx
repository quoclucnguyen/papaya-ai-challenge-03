import { EmailLayout } from './EmailLayout';
import { Badge, ClaimRef, DataCard, Heading, Paragraph, Section, Steps, SubHeading } from './shared';

export interface ClaimSubmittedProps {
  claim_number: string;
  member_name: string;
  claim_type: string;
  submitted_date: string;
}

export function ClaimSubmitted(p: ClaimSubmittedProps) {
  return (
    <EmailLayout
      title={`Your claim ${p.claim_number} has been received`}
      preheader={
        <>We&rsquo;ve received your claim {p.claim_number} and our team will start reviewing it shortly.</>
      }
    >
      <Section pad="36px 40px 8px">
        <Badge tone="info">Claim received</Badge>
        <Heading>We&rsquo;ve got your claim, {p.member_name}</Heading>
      </Section>

      <Section pad="16px 40px 8px">
        <Paragraph>
          Thanks for sending in your <strong>{p.claim_type}</strong> claim on {p.submitted_date}. It&rsquo;s
          safely in our system, and our team will begin looking at it shortly. You don&rsquo;t need to do
          anything else right now &mdash; we&rsquo;ll keep you posted at every step.
        </Paragraph>
      </Section>

      <Section>
        <DataCard
          rows={[
            { label: 'Claim number', value: <ClaimRef>{p.claim_number}</ClaimRef>, accent: true },
            { label: 'Claim type', value: p.claim_type },
            { label: 'Submitted on', value: p.submitted_date },
          ]}
        />
      </Section>

      <Section pad="28px 40px 36px">
        <SubHeading>What happens next</SubHeading>
        <Steps
          items={[
            <>We check that all your documents are in order.</>,
            <>A claims specialist reviews your claim in detail.</>,
            <>We email you the outcome &mdash; and at every step along the way.</>,
          ]}
        />
      </Section>
    </EmailLayout>
  );
}
