import { formatDate, formatTime, formatCurrency, isToday, isPast } from '../../utils/dateUtils';
import './EventCard.css';

export default function EventCard({ event, onEdit, compact = false }) {
  const past = isPast(event.eventDate);
  const today = isToday(event.eventDate);
  const timeText = event.startTime && event.endTime
    ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
    : event.startTime
      ? formatTime(event.startTime)
      : event.endTime
        ? formatTime(event.endTime)
        : null;

  return (
    <button
      className={`event-card ${past ? 'event-card--past' : ''} ${today ? 'event-card--today' : ''} ${compact ? 'event-card--compact' : ''}`}
      onClick={() => onEdit(event)}
      aria-label={`Edit event: ${event.contactName} on ${formatDate(event.eventDate)}`}
    >
      <div className="event-card-header">
        <span className="event-card-name">{event.contactName || 'Unnamed Event'}</span>
        {today && <span className="event-badge event-badge--today">Today</span>}
        {past && !today && <span className="event-badge event-badge--past">Past</span>}
      </div>

      <div className="event-card-date">
        <span className="event-card-icon" aria-hidden="true">📅</span>
        {formatDate(event.eventDate)}
        {timeText && (
          <span className="event-card-time"> · {timeText}</span>
        )}
      </div>

      {!compact && (
        <>
          {event.package && (
            <div className="event-card-row">
              <span className="event-card-icon" aria-hidden="true">📦</span>
              {event.package}
            </div>
          )}
          {event.truck && (
            <div className="event-card-row">
              <span className="event-card-icon" aria-hidden="true">🚚</span>
              {event.truck}
            </div>
          )}
          {event.employees?.length > 0 && (
            <div className="event-card-row">
              <span className="event-card-icon" aria-hidden="true">👤</span>
              {event.employees.join(', ')}
            </div>
          )}
          {event.totalSales != null && event.totalSales !== '' && (
            <div className="event-card-sales">
              {formatCurrency(event.totalSales)}
            </div>
          )}
        </>
      )}
    </button>
  );
}
