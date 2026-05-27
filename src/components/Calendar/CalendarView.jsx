import { useState } from 'react';
import {
  monthName, daysInMonth, firstDayOfMonth,
  toDateString, isToday, formatTime,
} from '../../utils/dateUtils';
import './CalendarView.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ events, onEdit, onDayClick }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const prevMonth = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  };

  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Map "YYYY-MM-DD" → events[]
  const byDate = {};
  events.forEach((ev) => {
    if (!byDate[ev.eventDate]) byDate[ev.eventDate] = [];
    byDate[ev.eventDate].push(ev);
  });

  const cells = [];
  // Empty cells before the 1st
  for (let i = 0; i < startDay; i++) cells.push(null);
  // Day cells
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <div className="calendar-wrap">
      {/* Month nav */}
      <div className="calendar-nav">
        <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">‹</button>
        <div className="calendar-title-group">
          <h2 className="calendar-title">{monthName(year, month)}</h2>
          <button className="cal-today-btn" onClick={goToday}>Today</button>
        </div>
        <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">›</button>
      </div>

      {/* Day-of-week headers */}
      <div className="calendar-grid">
        {DAYS.map((d) => (
          <div key={d} className="cal-day-header">{d}</div>
        ))}

        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="cal-cell cal-cell--empty" />;

          const dateStr = toDateString(new Date(year, month, day));
          const dayEvents = byDate[dateStr] || [];
          const isTodays = isToday(dateStr);

          return (
            <button
              key={dateStr}
              className={`cal-cell ${isTodays ? 'cal-cell--today' : ''} ${dayEvents.length ? 'cal-cell--has-events' : ''}`}
              onClick={() => onDayClick(dateStr)}
              aria-label={`${dateStr}${dayEvents.length ? `, ${dayEvents.length} event(s)` : ''}`}
            >
              <span className="cal-day-num">{day}</span>
              <div className="cal-events">
                {dayEvents.slice(0, 3).map((ev) => {
                  const timeText = ev.startTime && ev.endTime
                    ? `${formatTime(ev.startTime)} - ${formatTime(ev.endTime)}`
                    : ev.startTime
                      ? formatTime(ev.startTime)
                      : ev.endTime
                        ? formatTime(ev.endTime)
                        : '';
                  return (
                    <button
                      key={ev.id}
                      className="cal-event-chip"
                      onClick={(e) => { e.stopPropagation(); onEdit(ev); }}
                      title={`${ev.contactName}${timeText ? ' · ' + timeText : ''}`}
                      aria-label={`Edit: ${ev.contactName}`}
                    >
                      {ev.contactName || 'Event'}
                    </button>
                  );
                })}
                {dayEvents.length > 3 && (
                  <span className="cal-more">+{dayEvents.length - 3} more</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
