import { EmailLayout } from './EmailLayout';
import { Badge, ClaimRef, Heading, HighlightBox, Paragraph, Section } from './shared';
import { BRAND, FONT } from './theme';

export interface PaymentSentProps {
  claim_number: string;
  member_name: string;
  payment_amount: string;
  payment_date: string;
  reference_number: string;
}

/** Two detail rows displayed inside the receipt card through HighlightBox.extra. */
function ReceiptRows(p: { payment_date: string; reference_number: string }) {
  const labelStyle = {
    padding: '8px 0',
    fontSize: 13,
    color: BRAND.positiveDeep,
    borderTop: `1px solid ${BRAND.positiveBorder}`,
  } as const;
  const valueStyle = {
    padding: '8px 0',
    fontSize: 14,
    fontWeight: 600,
    color: BRAND.ink,
    borderTop: `1px solid ${BRAND.positiveBorder}`,
  } as const;
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ fontFamily: FONT }}>
      <tbody>
        <tr>
          <td style={labelStyle}>Payment date</td>
          <td align="right" style={valueStyle}>
            {p.payment_date}
          </td>
        </tr>
        <tr>
          <td style={labelStyle}>Reference number</td>
          <td align="right" style={{ ...valueStyle, fontWeight: 700 }}>
            {p.reference_number}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function PaymentSent(p: PaymentSentProps) {
  return (
    <EmailLayout
      title={`Payment for claim ${p.claim_number} has been processed`}
      accent="positive"
      footerLead={<>Questions about your payment? We&rsquo;re happy to help.</>}
      preheader={
        <>
          {p.payment_amount} for claim {p.claim_number} is on its way to you, {p.member_name}.
        </>
      }
    >
      <Section pad="36px 40px 8px">
        <Badge tone="positive">Payment sent</Badge>
        <Heading>Your payment is on its way, {p.member_name}</Heading>
      </Section>

      <Section pad="16px 40px 8px">
        <Paragraph>
          We&rsquo;ve processed the payment for claim <ClaimRef>{p.claim_number}</ClaimRef>. Here&rsquo;s
          your payment summary &mdash; keep it for your records.
        </Paragraph>
      </Section>

      <Section>
        <HighlightBox
          tone="positive"
          label="Amount paid"
          value={p.payment_amount}
          extra={<ReceiptRows payment_date={p.payment_date} reference_number={p.reference_number} />}
        />
      </Section>

      <Section pad="24px 40px 36px">
        <Paragraph size={14}>
          Depending on your bank, it can take <strong>1&ndash;3 business days</strong> for the money to
          appear in your account. If it hasn&rsquo;t arrived after that, contact us and quote the reference
          number above &mdash; we&rsquo;ll track it down for you. Thank you for being with Papaya.
        </Paragraph>
      </Section>
    </EmailLayout>
  );
}
