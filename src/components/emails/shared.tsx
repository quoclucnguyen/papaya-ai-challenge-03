import type { CSSProperties, ReactNode } from 'react';
import { BRAND, FONT, TONE_BADGE, type Tone } from './theme';

/**
 * Shared building blocks for all 6 email templates.
 * Email HTML uses table-based layouts and inline styles. Each component here returns
 * either a <tr> row for the 600px container or a smaller element within a row.
 */

/** A content row with standard padding; the "px" class reduces it on mobile. */
export function Section({
  pad = '24px 40px 8px',
  children,
}: {
  pad?: string;
  children: ReactNode;
}) {
  return (
    <tr>
      <td className="px" style={{ padding: pad }}>
        {children}
      </td>
    </tr>
  );
}

/** Status badge displayed near the top of an email. */
export function Badge({ tone, children }: { tone: Tone; children: ReactNode }) {
  const c = TONE_BADGE[tone];
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: c.bg,
        color: c.color,
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        padding: '6px 12px',
        borderRadius: 999,
      }}
    >
      {children}
    </span>
  );
}

export function Heading({ children }: { children: ReactNode }) {
  return (
    <h1
      style={{
        margin: '18px 0 0',
        fontFamily: FONT,
        fontSize: 24,
        lineHeight: '32px',
        fontWeight: 700,
        color: BRAND.ink,
      }}
    >
      {children}
    </h1>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        margin: '0 0 14px',
        fontFamily: FONT,
        fontSize: 16,
        lineHeight: '24px',
        fontWeight: 700,
        color: BRAND.ink,
      }}
    >
      {children}
    </h2>
  );
}

export function Paragraph({
  children,
  size = 15,
}: {
  children: ReactNode;
  size?: 14 | 15;
}) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: FONT,
        fontSize: size,
        lineHeight: size === 15 ? '24px' : '22px',
        color: BRAND.body,
      }}
    >
      {children}
    </p>
  );
}

/** Highlight a claim reference using the primary brand color. */
export function ClaimRef({ children }: { children: ReactNode }) {
  return <strong style={{ color: BRAND.primary }}>{children}</strong>;
}

export interface DataRow {
  label: ReactNode;
  value: ReactNode;
  /** Highlight the value using the primary color, such as a claim number. */
  accent?: boolean;
}

/** A gray card containing label-value pairs for claim or payment details. */
export function DataCard({ rows }: { rows: DataRow[] }) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{
        backgroundColor: BRAND.cardBg,
        border: `1px solid ${BRAND.line}`,
        borderRadius: 8,
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '20px 24px' }}>
            <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ fontFamily: FONT }}>
              <tbody>
                {rows.map((row, i) => {
                  const borderTop = i > 0 ? `1px solid ${BRAND.line}` : undefined;
                  return (
                    <tr key={i}>
                      <td style={{ padding: '6px 0', fontSize: 13, color: BRAND.muted, borderTop }}>
                        {row.label}
                      </td>
                      <td
                        align="right"
                        style={{
                          padding: '6px 0',
                          fontSize: 14,
                          fontWeight: row.accent ? 700 : 600,
                          color: row.accent ? BRAND.primary : BRAND.ink,
                          borderTop,
                        }}
                      >
                        {row.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** A list of steps with blue circular numbers. */
export function Steps({ items }: { items: ReactNode[] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ fontFamily: FONT }}>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td width={32} valign="top" style={{ padding: '6px 0' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 22,
                  height: 22,
                  lineHeight: '22px',
                  textAlign: 'center',
                  backgroundColor: BRAND.primarySoft,
                  color: BRAND.primary,
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: 999,
                }}
              >
                {i + 1}
              </span>
            </td>
            <td style={{ padding: '6px 0', fontSize: 14, lineHeight: '22px', color: BRAND.body }}>{item}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * A prominent amount or value block. "positive" uses green for approvals and payments,
 * while "info" uses blue for review estimates.
 */
export function HighlightBox({
  label,
  value,
  tone,
  big = true,
  extra,
}: {
  label: ReactNode;
  value: ReactNode;
  tone: 'positive' | 'info';
  big?: boolean;
  extra?: ReactNode;
}) {
  const positive = tone === 'positive';
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{
        backgroundColor: positive ? BRAND.positiveSoft : BRAND.primarySoft,
        border: positive ? `2px solid ${BRAND.positive}` : `1px solid ${BRAND.primaryBorder}`,
        borderRadius: 10,
      }}
    >
      <tbody>
        <tr>
          <td align="center" style={{ padding: extra ? '26px 24px 18px' : '26px 24px' }}>
            <p
              style={{
                margin: '0 0 6px',
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                color: positive ? BRAND.positiveDeep : BRAND.primary,
              }}
            >
              {label}
            </p>
            <p
              className="amount"
              style={{
                margin: 0,
                fontFamily: FONT,
                fontSize: big ? 38 : 26,
                lineHeight: big ? '46px' : '34px',
                fontWeight: 800,
                color: positive ? BRAND.positive : BRAND.primaryDeep,
              }}
            >
              {value}
            </p>
          </td>
        </tr>
        {extra ? (
          <tr>
            <td style={{ padding: '0 24px 22px' }}>{extra}</td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

/** Explanation block with a red left border, used for rejection reasons. */
export function ExplanationBox({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{
        backgroundColor: BRAND.warningSoft,
        borderLeft: `4px solid ${BRAND.warning}`,
        borderRadius: '0 8px 8px 0',
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '20px 24px' }}>
            <p
              style={{
                margin: '0 0 8px',
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                color: BRAND.warningDeep,
              }}
            >
              {title}
            </p>
            <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, lineHeight: '23px', color: BRAND.body }}>
              {children}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** Light orange deadline banner with red emphasis, used for appeal deadlines. */
export function DeadlineBanner({ children }: { children: ReactNode }) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{ backgroundColor: '#FFF7ED', border: '1px solid #FDBA74', borderRadius: 8 }}
    >
      <tbody>
        <tr>
          <td align="center" style={{ padding: '16px 24px' }}>
            <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, lineHeight: '22px', color: BRAND.body }}>
              {children}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** Gray card containing a bulleted list of document names. */
export function DocumentList({ title, items }: { title: ReactNode; items: string[] }) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      style={{ backgroundColor: BRAND.cardBg, border: `1px solid ${BRAND.line}`, borderRadius: 8 }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '20px 24px' }}>
            <p
              style={{
                margin: '0 0 10px',
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                color: BRAND.muted,
              }}
            >
              {title}
            </p>
            <ul
              style={{
                margin: 0,
                padding: '0 0 0 18px',
                fontFamily: FONT,
                fontSize: 14,
                lineHeight: '26px',
                color: BRAND.ink,
              }}
            >
              {items.map((item, i) => (
                <li key={i} style={{ margin: '0 0 4px' }}>
                  {item}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** Shared warning emphasis for deadline text. */
export const warningStrong: CSSProperties = { color: BRAND.warning };
