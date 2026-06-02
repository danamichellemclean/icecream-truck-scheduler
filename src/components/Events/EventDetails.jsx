import React from 'react';
import './EventForm.css';

export default function EventDetails({ event = {}, onClose, onEdit, customers = [] }) {
  if (!event) return null;

  const customer = customers.find((c) => c.id === event.customerId) || null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <div className="modal-header">
          <h2 id="details-title">Event Details</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Contact</label>
            <div>{event.contactName || (customer ? customer.name : '—')}</div>
          </div>

          <div className="form-row form-row--2">
            <div className="form-group">
              <label>Date</label>
              <div>{event.eventDate || '—'}</div>
            </div>
            <div className="form-group">
              <label>Time</label>
              <div>{event.startTime ? `${event.startTime}${event.endTime ? ' – ' + event.endTime : ''}` : '—'}</div>
            </div>
          </div>

          <div className="form-row form-row--2">
            <div className="form-group">
              <label>Package</label>
              <div>{event.package || '—'}</div>
            </div>
            <div className="form-group">
              <label>Truck</label>
              <div>{event.truck || '—'}</div>
            </div>
          </div>

          <div className="form-group">
            <label>Employees</label>
            <div>{(event.employees && event.employees.length) ? event.employees.join(', ') : '—'}</div>
          </div>

          <div className="form-row form-row--2">
            <div className="form-group">
              <label>Sales</label>
              <div>{event.totalSales || '—'}</div>
            </div>
            <div className="form-group">
              <label>Customer</label>
              <div>{customer ? `${customer.name} ${customer.phone ? '• ' + customer.phone : ''}` : '—'}</div>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <div style={{ whiteSpace: 'pre-wrap' }}>{event.notes || '—'}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button type="button" className="btn btn--ghost" onClick={onClose}>Close</button>
            <button type="button" className="btn btn--primary" onClick={onEdit}>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
