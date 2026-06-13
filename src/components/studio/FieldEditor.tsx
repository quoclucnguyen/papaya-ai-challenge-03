import type { EmailEvent, Values } from '@/lib/events';

export function FieldEditor({
  event,
  values,
  onChange,
  onReset,
}: {
  event: EmailEvent;
  values: Values;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}) {
  return (
    <aside className="editor">
      <h2>Sample data</h2>
      <p className="hint">
        Edit any value to re-render the template instantly. All dynamic values are passed as props
        and are not hardcoded. Click <b>Generate Email</b> to export complete HTML using the current values.
        <br />
        <button type="button" className="ghost-btn" style={{ marginTop: 8 }} onClick={onReset}>
          ↺ Reset sample data
        </button>
      </p>
      <div>
        {event.fields.map((field) => {
          const isMultiline = field.type === 'list' || field.type === 'long';
          return (
            <label key={field.key} className="field-row">
              <span className="field-key">{`{{${field.key}}}`}</span>
              {isMultiline ? (
                <textarea
                  className="field-input"
                  rows={field.type === 'list' ? 4 : 3}
                  value={values[field.key]}
                  onChange={(e) => onChange(field.key, e.target.value)}
                />
              ) : (
                <input
                  className="field-input"
                  value={values[field.key]}
                  onChange={(e) => onChange(field.key, e.target.value)}
                />
              )}
            </label>
          );
        })}
      </div>
    </aside>
  );
}
