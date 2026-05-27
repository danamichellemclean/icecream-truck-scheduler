import { useMemo } from 'react';
import { formatDate, formatCurrency, today } from '../../utils/dateUtils';
import './SalesSummary.css';

export default function SalesSummary({ events }) {
  const { sorted, totalSales, totalEvents, avgSales, eventsWithSales, byMonth } = useMemo(() => {
    const withSales = events.filter((e) => parseFloat(e.totalSales) > 0);
    const sorted = [...events]
      .sort((a, b) => b.eventDate.localeCompare(a.eventDate));

    const totalSales = events.reduce((s, e) => s + (parseFloat(e.totalSales) || 0), 0);
    const avgSales = withSales.length ? totalSales / withSales.length : 0;

    // Group by month
    const monthMap = {};
    events.forEach((e) => {
      const key = e.eventDate.slice(0, 7); // "YYYY-MM"
      if (!monthMap[key]) monthMap[key] = { events: 0, sales: 0 };
      monthMap[key].events++;
      monthMap[key].sales += parseFloat(e.totalSales) || 0;
    });

    const byMonth = Object.entries(monthMap)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, data]) => {
        const [y, m] = key.split('-').map(Number);
        const label = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
        return { key, label, ...data };
      });

    return {
      sorted,
      totalSales,
      totalEvents: events.length,
      avgSales,
      eventsWithSales: withSales.length,
      byMonth,
    };
  }, [events]);

  const todayStr = today();

  if (events.length === 0) {
    return (
      <div className="sales-empty">
        <span className="sales-empty-icon">💰</span>
        <p>No events yet. Sales data will appear here once you add events.</p>
      </div>
    );
  }

  return (
    <div className="sales-wrap">
      {/* Top-line stats */}
      <div className="sales-stats">
        <div className="sales-stat sales-stat--big">
          <span className="stat-value stat-value--big">{formatCurrency(totalSales)}</span>
          <span className="stat-label">Total Sales</span>
        </div>
        <div className="sales-stat-grid">
          <div className="sales-stat">
            <span className="stat-value">{totalEvents}</span>
            <span className="stat-label">Events</span>
          </div>
          <div className="sales-stat">
            <span className="stat-value">{eventsWithSales}</span>
            <span className="stat-label">With Sales</span>
          </div>
          <div className="sales-stat">
            <span className="stat-value">{formatCurrency(avgSales)}</span>
            <span className="stat-label">Avg / Event</span>
          </div>
        </div>
      </div>

      {/* Monthly breakdown */}
      {byMonth.length > 0 && (
        <section className="sales-section">
          <h2 className="sales-section-title">By Month</h2>
          <div className="month-list">
            {byMonth.map((m) => (
              <div key={m.key} className="month-row">
                <div className="month-info">
                  <span className="month-name">{m.label}</span>
                  <span className="month-meta">{m.events} event{m.events !== 1 ? 's' : ''}</span>
                </div>
                <span className="month-sales">{formatCurrency(m.sales)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Per-event table */}
      <section className="sales-section">
        <h2 className="sales-section-title">All Events</h2>
        <div className="sales-table-wrap">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Contact</th>
                <th>Package</th>
                <th>Truck</th>
                <th className="sales-col-right">Sales</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((ev) => (
                <tr key={ev.id} className={ev.eventDate > todayStr ? '' : 'sales-row--past'}>
                  <td className="sales-date">{formatDate(ev.eventDate)}</td>
                  <td>{ev.contactName || '—'}</td>
                  <td className="sales-meta">{ev.package || '—'}</td>
                  <td className="sales-meta">{ev.truck || '—'}</td>
                  <td className="sales-col-right sales-amount">
                    {ev.totalSales ? formatCurrency(ev.totalSales) : <span className="no-sales">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="sales-total-label">Total</td>
                <td className="sales-col-right sales-total-value">{formatCurrency(totalSales)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
