import { EmailLayout } from './EmailLayout';
import { Badge, ClaimRef, DocumentList, Heading, Paragraph, Section } from './shared';

export interface DocumentsReceivedProps {
  claim_number: string;
  member_name: string;
  document_count: string;
  /** Each item represents one document and is rendered as a bullet. */
  documents_list: string[];
}

export function DocumentsReceived(p: DocumentsReceivedProps) {
  return (
    <EmailLayout
      title={`Documents received for claim ${p.claim_number}`}
      preheader={
        <>We&rsquo;ve received {p.document_count} document(s) for claim {p.claim_number} &mdash; thank you!</>
      }
    >
      <Section pad="36px 40px 8px">
        <Badge tone="info">Documents received</Badge>
        <Heading>Thanks, {p.member_name} &mdash; your documents are in</Heading>
      </Section>

      <Section pad="16px 40px 8px">
        <Paragraph>
          We&rsquo;ve received <strong>{p.document_count}</strong> document(s) for claim{' '}
          <ClaimRef>{p.claim_number}</ClaimRef>. They&rsquo;ve been added to your file, and our team will
          check them as part of the review.
        </Paragraph>
      </Section>

      <Section>
        <DocumentList title="What we received" items={p.documents_list} />
      </Section>

      <Section pad="24px 40px 36px">
        <Paragraph size={14}>
          If anything is missing or unclear, we&rsquo;ll reach out to you directly &mdash; otherwise your
          claim simply moves on to review. Nothing else is needed from you right now.
        </Paragraph>
      </Section>
    </EmailLayout>
  );
}
