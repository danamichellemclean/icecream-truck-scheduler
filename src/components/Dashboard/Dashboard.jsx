import { useMemo } from 'react';
import EventCard from '../Events/EventCard';
import { today, formatCurrency } from '../../utils/dateUtils';
import './Dashboard.css';

export default function Dashboard({ events, onEdit, onAdd }) {
  const { upcoming, past } = useMemo(() => {
    const todayStr = today();
    const sorted = [...events].sort((a, b) => a.eventDate.localeCompare(b.eventDate));
    return {
      upcoming: sorted.filter((e) => e.eventDate >= todayStr),
      past: sorted.filter((e) => e.eventDate < todayStr).reverse(),
    };
  }, [events]);

  const totalSales = useMemo(
    () => events.reduce((sum, e) => sum + (parseFloat(e.totalSales) || 0), 0),
    [events]
  );

  return (
    <div className="dashboard">
      {/* Summary strip */}
      <div className="dashboard-summary">
        <div className="summary-stat">
          <span className="summary-value">{upcoming.length}</span>
          <span className="summary-label">Upcoming</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-stat">
          <span className="summary-value">{events.length}</span>
          <span className="summary-label">Total Events</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-stat">
          <span className="summary-value summary-value--green">{formatCurrency(totalSales)}</span>
          <span className="summary-label">All-Time Sales</span>
        </div>
      </div>

      {/* Upcoming */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Upcoming Events</h2>
          <button className="btn-add" onClick={onAdd} aria-label="Add new event">+ Add Event</button>
        </div>
        {upcoming.length === 0 ? (
          <div className="dashboard-empty">
            <span className="dashboard-empty-icon">🍦</span>
            <p>No upcoming events yet.</p>
            <button className="btn-add-large" onClick={onAdd}>Schedule your first event</button>
          </div>
        ) : (
          <div className="event-list">
            {upcoming.map((ev) => (
              <EventCard key={ev.id} event={ev} onEdit={onEdit} />
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title section-title--muted">Past Events</h2>
          <div className="event-list">
            {past.map((ev) => (
              <EventCard key={ev.id} event={ev} onEdit={onEdit} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
