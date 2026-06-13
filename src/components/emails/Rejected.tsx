import { EmailLayout } from './EmailLayout';
import {
  Badge,
  ClaimRef,
  DeadlineBanner,
  ExplanationBox,
  Heading,
  Paragraph,
  Section,
  Steps,
  SubHeading,
  warningStrong,
} from './shared';

export interface RejectedProps {
  claim_number: string;
  member_name: string;
  rejection_reason: string;
  appeal_deadline: string;
}

export function Rejected(p: RejectedProps) {
  return (
    <EmailLayout
      title={`Update on claim ${p.claim_number}`}
      footerLead={<>We&rsquo;re here to help you through this &mdash; don&rsquo;t hesitate to reach out.</>}
      preheader={<>An update on claim {p.claim_number} &mdash; including why, and what you can do next.</>}
    >
      <Section pad="36px 40px 8px">
        <Badge tone="warning">Claim update</Badge>
        <Heading>An update on your claim, {p.member_name}</Heading>
      </Section>

      <Section pad="16px 40px 8px">
        <Paragraph>
          We&rsquo;ve carefully reviewed claim <ClaimRef>{p.claim_number}</ClaimRef>, and we&rsquo;re sorry
          to let you know that we aren&rsquo;t able to approve it this time. We know this isn&rsquo;t the
          news you were hoping for, so we want to be completely clear about why &mdash; and what you can do
          about it.
        </Paragraph>
      </Section>

      {/* The challenge requires a clear explanation of the decision. */}
      <Section>
        <ExplanationBox title="Why this decision was made">{p.rejection_reason}</ExplanationBox>
      </Section>

      {/* The challenge requires clear next steps. */}
      <Section pad="28px 40px 8px">
        <SubHeading>What you can do next</SubHeading>
        <Steps
          items={[
            <>
              <strong>Read the explanation above.</strong> If anything is unclear, contact us and we&rsquo;ll
              gladly talk it through with you.
            </>,
            <>
              <strong>Gather any new information.</strong> If you have documents or details we haven&rsquo;t
              seen, they could change the outcome.
            </>,
            <>
              <strong>Ask us to take another look (appeal).</strong> Reply to this email or contact support,
              and we&rsquo;ll review the decision again with any new information included.
            </>,
          ]}
        />
      </Section>

      <Section pad="20px 40px 36px">
        <DeadlineBanner>
          Please send your appeal by <strong style={warningStrong}>{p.appeal_deadline}</strong> so we can
          reopen your claim in time.
        </DeadlineBanner>
      </Section>
    </EmailLayout>
  );
}
