import { useEffect, useState } from 'react';
import type { EmailEvent, Values } from '@/lib/events';
import { renderEmail, renderTemplate } from '@/lib/render';

type Tab = 'final' | 'template';

/**
 * Generates complete HTML using the current values, with actions to copy it,
 * download an .html file, or open it in a new tab. The second tab exports a raw
 * template with Mustache/Handlebars-compatible {{...}} placeholders.
 */
export function GenerateDialog({
  event,
  values,
  onClose,
}: {
  event: EmailEvent;
  values: Values;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>('final');
  const [copied, setCopied] = useState<string | null>(null);

  const rendered = tab === 'final' ? renderEmail(event.id, values) : renderTemplate(event.id);
  const emptyFields = event.fields.filter((f) => !values[f.key]?.trim()).map((f) => f.key);
  const fileName =
    tab === 'final'
      ? `${event.id}_${(values.claim_number || 'email').replace(/[^\w-]+/g, '-')}.html`
      : `template_${event.id}.html`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function copy(text: string, what: string) {
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 1600);
  }

  function download() {
    const blob = new Blob([rendered.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openInTab() {
    const blob = new Blob([rendered.html], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank');
  }

  return (
    <div className="dialog-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={`Generate Email — ${event.name}`}>
        <div className="dialog-head">
          <h3>✉ Generate Email — {event.name}</h3>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="dialog-tabs">
          <button
            type="button"
            className={`dialog-tab${tab === 'final' ? ' active' : ''}`}
            onClick={() => setTab('final')}
          >
            Complete Email (current values)
          </button>
          <button
            type="button"
            className={`dialog-tab${tab === 'template' ? ' active' : ''}`}
            onClick={() => setTab('template')}
          >
            Raw Template {'{{...}}'}
          </button>
        </div>

        <div className="dialog-body" style={{ paddingTop: 14 }}>
          {tab === 'final' && emptyFields.length > 0 && (
            <p className="dialog-warn">
              ⚠ Empty variables: {emptyFields.map((k) => `{{${k}}}`).join(', ')}. The email will be
              incomplete where these values are used.
            </p>
          )}

          <div className="dialog-subject">
            <span style={{ color: 'var(--muted)' }}>Subject:</span> <b>{rendered.subject}</b>{' '}
            <button
              type="button"
              className="ghost-btn"
              style={{ marginLeft: 8, padding: '3px 9px' }}
              onClick={() => copy(rendered.subject, 'subject')}
            >
              Copy
            </button>
          </div>

          <textarea className="dialog-code" readOnly value={rendered.html} spellCheck={false} />

          <div className="dialog-actions">
            <button type="button" className="primary-btn" onClick={() => copy(rendered.html, 'html')}>
              📋 Copy HTML
            </button>
            <button type="button" className="ghost-btn" onClick={download}>
              ⬇ Download {fileName}
            </button>
            <button type="button" className="ghost-btn" onClick={openInTab}>
              ↗ Open in New Tab
            </button>
            {copied && <span className="copied">✓ Copied {copied === 'html' ? 'HTML' : 'subject'}</span>}
          </div>

          <p className="dialog-note">
            {tab === 'final'
              ? 'This HTML contains the current values and can be pasted directly into an email service such as SendGrid or SES, or used for a test send.'
              : 'This template preserves the {{...}} placeholders for Mustache/Handlebars-compatible server-side rendering.'}
          </p>
        </div>
      </div>
    </div>
  );
}
