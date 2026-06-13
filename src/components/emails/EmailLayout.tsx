import type { ReactNode } from 'react';
import { BRAND, FONT, SUPPORT } from './theme';

/**
 * The legacy `bgcolor` HTML attribute provides a fallback for older email clients.
 * React's JSX types omit it, so an object spread keeps the remaining markup type-safe.
 */
const bg = (color: string) => ({ bgcolor: color }) as Record<string, string>;

/**
 * Shared email frame: a logo header on the primary blue background,
 * a single-column 600px container, and a support contact footer.
 * Children are <tr> elements created with <Section> from shared.tsx.
 *
 * accent="positive" adds a 4px green bar below the header for Approved and Payment Sent.
 */
export function EmailLayout({
  title,
  preheader,
  accent,
  footerLead = 'Questions about your claim? We’re happy to help.',
  children,
}: {
  title: string;
  preheader: ReactNode;
  accent?: 'positive';
  footerLead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-apple-disable-message-reformatting" />
        <title>{title}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; }
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .amount { font-size: 30px !important; line-height: 38px !important; }
  }`,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: BRAND.pageBg, WebkitTextSizeAdjust: '100%' }}>
        {/* Hidden preview text displayed next to the subject in supported inboxes. */}
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>{preheader}</div>

        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} {...bg(BRAND.pageBg)}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: '24px 12px' }}>
                <table
                  role="presentation"
                  className="container"
                  width={600}
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    width: 600,
                    maxWidth: 600,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: `1px solid ${BRAND.line}`,
                  }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td className="px" {...bg(BRAND.primary)} style={{ padding: '22px 40px' }}>
                        <span
                          style={{
                            fontFamily: FONT,
                            fontSize: 20,
                            fontWeight: 800,
                            letterSpacing: '0.3px',
                            color: '#FFFFFF',
                          }}
                        >
                          Papaya&nbsp;Insurance
                        </span>
                      </td>
                    </tr>
                    {accent === 'positive' ? (
                      <tr>
                        <td {...bg(BRAND.positive)} style={{ height: 4, lineHeight: '4px', fontSize: 0 }}>
                          &nbsp;
                        </td>
                      </tr>
                    ) : null}

                    {/* Event-specific content */}
                    {children}

                    {/* Footer */}
                    <tr>
                      <td
                        className="px"
                        style={{
                          padding: '26px 40px',
                          backgroundColor: BRAND.cardBg,
                          borderTop: `1px solid ${BRAND.line}`,
                        }}
                      >
                        <p
                          style={{
                            margin: '0 0 8px',
                            fontFamily: FONT,
                            fontSize: 13,
                            lineHeight: '20px',
                            color: BRAND.muted,
                          }}
                        >
                          {footerLead}
                          <br />
                          <a
                            href={`mailto:${SUPPORT.email}`}
                            style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 600 }}
                          >
                            {SUPPORT.email}
                          </a>
                          {' · '}
                          <a
                            href={SUPPORT.phoneHref}
                            style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 600 }}
                          >
                            {SUPPORT.phone}
                          </a>{' '}
                          ({SUPPORT.hours})
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: FONT,
                            fontSize: 12,
                            lineHeight: '18px',
                            color: BRAND.faint,
                          }}
                        >
                          Papaya Insurance &middot; You&rsquo;re receiving this email because you have an active
                          claim with us.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
