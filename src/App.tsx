import { useMemo, useState } from 'react';
import { FieldEditor } from '@/components/studio/FieldEditor';
import { GenerateDialog } from '@/components/studio/GenerateDialog';
import { Sidebar } from '@/components/studio/Sidebar';
import { EVENTS, getEvent, sampleValues, type Values } from '@/lib/events';
import { renderEmail } from '@/lib/render';

type Device = 'desktop' | 'mobile';

function initialValues(): Record<string, Values> {
  return Object.fromEntries(EVENTS.map((e) => [e.id, sampleValues(e)]));
}

export default function App() {
  const [activeId, setActiveId] = useState(EVENTS[0].id);
  const [allValues, setAllValues] = useState<Record<string, Values>>(initialValues);
  const [device, setDevice] = useState<Device>('desktop');
  const [dialogOpen, setDialogOpen] = useState(false);

  const event = getEvent(activeId);
  const values = allValues[activeId];

  // Render directly during the render cycle so value changes update the email without debounce or fetching.
  const rendered = useMemo(() => renderEmail(activeId, values), [activeId, values]);
  const emptyFields = event.fields.filter((f) => !values[f.key]?.trim());

  function setValue(key: string, value: string) {
    setAllValues((prev) => ({ ...prev, [activeId]: { ...prev[activeId], [key]: value } }));
  }

  function resetValues() {
    setAllValues((prev) => ({ ...prev, [activeId]: sampleValues(event) }));
  }

  return (
    <div className="app">
      <Sidebar events={EVENTS} activeId={activeId} onSelect={setActiveId} />

      <main className="main">
        <div className="topbar">
          <div className="subject">
            <span className="label">Subject</span>
            <span className="subject-line">{rendered.subject}</span>
          </div>
          <div className="controls">
            <div className="seg" role="group" aria-label="Device width">
              <button
                type="button"
                className={device === 'desktop' ? 'active' : ''}
                onClick={() => setDevice('desktop')}
              >
                Desktop · 600px
              </button>
              <button
                type="button"
                className={device === 'mobile' ? 'active' : ''}
                onClick={() => setDevice('mobile')}
              >
                Mobile · 375px
              </button>
            </div>
            <button type="button" className="primary-btn" onClick={() => setDialogOpen(true)}>
              ✉ Generate Email
            </button>
          </div>
        </div>

        <div className="stage">
          <div className={`frame-wrap${device === 'mobile' ? ' mobile' : ''}`}>
            <iframe className="preview-frame" title="Email preview" srcDoc={rendered.html} />
          </div>
        </div>

        {emptyFields.length > 0 && (
          <p className="warning-banner">
            ⚠ Empty variables: {emptyFields.map((f) => `{{${f.key}}}`).join(', ')}
          </p>
        )}
      </main>

      <FieldEditor event={event} values={values} onChange={setValue} onReset={resetValues} />

      {dialogOpen && <GenerateDialog event={event} values={values} onClose={() => setDialogOpen(false)} />}
    </div>
  );
}
