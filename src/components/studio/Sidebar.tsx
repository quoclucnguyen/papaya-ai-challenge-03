import type { EmailEvent } from '@/lib/events';

export function Sidebar({
  events,
  activeId,
  onSelect,
}: {
  events: EmailEvent[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        🥭 Papaya Insurance
        <small>Email Template Studio</small>
      </div>
      <nav className="nav" aria-label="Claim lifecycle events">
        {events.map((event, i) => (
          <button
            key={event.id}
            type="button"
            className={`nav-item${event.id === activeId ? ' active' : ''}`}
            onClick={() => onSelect(event.id)}
          >
            <span className="nav-step">{String(i + 1).padStart(2, '0')}</span>
            <span className="nav-name">{event.name}</span>
            <span className={`nav-dot tone-${event.tone}`} />
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        6 lifecycle events · claim notifications
        <br />
        AI Challenge 03
      </div>
    </aside>
  );
}
