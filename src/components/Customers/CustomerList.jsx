import { useState, useMemo } from 'react';
import { formatDate, formatCurrency } from '../../utils/dateUtils';
import CustomerForm from './CustomerForm';
import './CustomerList.css';

function CustomerCard({ customer, events, onClick }) {
  const eventCount = events.filter((e) => e.customerId === customer.id).length;
  return (
    <button className="customer-card" onClick={onClick}>
      <div className="customer-card-avatar" aria-hidden="true">
        {customer.name.charAt(0).toUpperCase()}
      </div>
      <div className="customer-card-info">
        <span className="customer-card-name">{customer.name}</span>
        {customer.phone && <span className="customer-card-meta">{customer.phone}</span>}
        {customer.email && <span className="customer-card-meta">{customer.email}</span>}
      </div>
      {eventCount > 0 && (
        <span className="customer-card-events" aria-label={`${eventCount} events`}>
          {eventCount} event{eventCount !== 1 ? 's' : ''}
        </span>
      )}
    </button>
  );
}

function CustomerDetail({ customer, events, onEdit, onClose, onEventClick }) {
  const custEvents = useMemo(
    () => events.filter((e) => e.customerId === customer.id).sort((a, b) => b.eventDate.localeCompare(a.eventDate)),
    [events, customer.id]
  );
  const totalSales = custEvents.reduce((s, e) => s + (parseFloat(e.totalSales) || 0), 0);

  return (
    <div className="customer-detail">
      <div className="customer-detail-header">
        <button className="back-btn" onClick={onClose} aria-label="Back to customers">
          ← Back
        </button>
        <button className="btn btn--ghost btn--sm" onClick={onEdit}>Edit</button>
      </div>

      <div className="customer-profile">
        <div className="customer-profile-avatar">{customer.name.charAt(0).toUpperCase()}</div>
        <h2 className="customer-profile-name">{customer.name}</h2>
        <div className="customer-profile-fields">
          {customer.phone && (
            <a href={`tel:${customer.phone}`} className="customer-field-link">
              📞 {customer.phone}
            </a>
          )}
          {customer.email && (
            <a href={`mailto:${customer.email}`} className="customer-field-link">
              ✉️ {customer.email}
            </a>
          )}
          {customer.address && (
            <span className="customer-field">📍 {customer.address}</span>
          )}
          {customer.notes && (
            <span className="customer-field customer-field--notes">💬 {customer.notes}</span>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="customer-stats">
        <div className="customer-stat">
          <span className="customer-stat-value">{custEvents.length}</span>
          <span className="customer-stat-label">Events Booked</span>
        </div>
        <div className="customer-stat-divider" />
        <div className="customer-stat">
          <span className="customer-stat-value customer-stat-value--green">
            {formatCurrency(totalSales)}
          </span>
          <span className="customer-stat-label">Total Spent</span>
        </div>
      </div>

      <section className="customer-events-section">
        <div className="customer-events-header">
          <h3 className="customer-events-title">Event History</h3>
        </div>

        {custEvents.length === 0 ? (
          <p className="customer-events-empty">No events booked yet.</p>
        ) : (
          <ul className="customer-event-list">
            {custEvents.map((ev) => (
              <li key={ev.id}>
                <button className="customer-event-row" onClick={() => onEventClick(ev)}>
                  <div className="customer-event-info">
                    <span className="customer-event-date">{formatDate(ev.eventDate)}</span>
                    {ev.package && <span className="customer-event-meta">{ev.package}</span>}
                  </div>
                  {ev.totalSales ? (
                    <span className="customer-event-sales">{formatCurrency(ev.totalSales)}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function CustomerList({ customers, events, onAddCustomer, onUpdateCustomer, onDeleteCustomer, onEventClick }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null); // customer being viewed
  const [formTarget, setFormTarget] = useState(null); // null=closed, {}=add, customer=edit

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return [...customers]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
  }, [customers, search]);

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await onUpdateCustomer(data);
        setSelected(data); // keep detail view open with fresh data
      } else {
        const created = await onAddCustomer(data);
        setSelected(created);
      }
      setFormTarget(null);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await onDeleteCustomer(id);
      setSelected(null);
      setFormTarget(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // ── Detail view ────────────────────────────────────────────────────────────
  if (selected) {
    // Refresh from live customers array (in case of updates)
    const live = customers.find((c) => c.id === selected.id) ?? selected;
    return (
      <>
        <CustomerDetail
          customer={live}
          events={events}
          onEdit={() => setFormTarget(live)}
          onClose={() => setSelected(null)}
          onEventClick={onEventClick}
        />
        {formTarget && (
          <CustomerForm
            customer={formTarget}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={() => setFormTarget(null)}
          />
        )}
      </>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="customer-list-wrap">
      <div className="customer-list-toolbar">
        <input
          type="search"
          className="customer-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or email…"
          aria-label="Search customers"
        />
        <button className="btn btn--primary btn--sm" onClick={() => setFormTarget({})}>
          + Add
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="customer-list-empty">
          <span className="customer-list-empty-icon">👥</span>
          {search ? (
            <p>No customers match "<strong>{search}</strong>".</p>
          ) : (
            <>
              <p>No customers yet.</p>
              <button className="btn btn--primary" onClick={() => setFormTarget({})}>
                Add your first customer
              </button>
            </>
          )}
        </div>
      ) : (
        <ul className="customer-list" aria-label="Customers">
          {filtered.map((c) => (
            <li key={c.id}>
              <CustomerCard
                customer={c}
                events={events}
                onClick={() => setSelected(c)}
              />
            </li>
          ))}
        </ul>
      )}

      {formTarget !== null && (
        <CustomerForm
          customer={formTarget}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setFormTarget(null)}
        />
      )}
    </div>
  );
}
