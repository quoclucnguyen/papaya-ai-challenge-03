import { EmailLayout } from './EmailLayout';
import { Badge, ClaimRef, Heading, HighlightBox, Paragraph, Section } from './shared';

export interface UnderReviewProps {
  claim_number: string;
  member_name: string;
  assessor_name: string;
  estimated_days: string;
}

export function UnderReview(p: UnderReviewProps) {
  return (
    <EmailLayout
      title={`Your claim ${p.claim_number} is being reviewed`}
      preheader={
        <>
          {p.assessor_name} is reviewing your claim {p.claim_number} &mdash; we expect to have an answer
          within {p.estimated_days} business days.
        </>
      }
    >
      <Section pad="36px 40px 8px">
        <Badge tone="info">Under review</Badge>
        <Heading>Your claim is in good hands, {p.member_name}</Heading>
      </Section>

      <Section pad="16px 40px 8px">
        <Paragraph>
          Claim <ClaimRef>{p.claim_number}</ClaimRef> is now being reviewed by{' '}
          <strong>{p.assessor_name}</strong>, one of our claims specialists. They&rsquo;ll go through
          everything carefully and make sure your claim gets the attention it deserves.
        </Paragraph>
      </Section>

      <Section>
        <HighlightBox
          tone="info"
          big={false}
          label="Estimated time to a decision"
          value={<>{p.estimated_days} business days</>}
        />
      </Section>

      <Section pad="24px 40px 36px">
        <Paragraph size={14}>
          There&rsquo;s nothing you need to do while we review. If we need any extra information,{' '}
          {p.assessor_name} will contact you directly &mdash; and the moment there&rsquo;s a decision,
          you&rsquo;ll hear from us by email.
        </Paragraph>
      </Section>
    </EmailLayout>
  );
}
