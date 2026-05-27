import { useState, useEffect, useRef } from 'react';
import './CustomerForm.css';

const EMPTY = { name: '', phone: '', email: '', address: '', notes: '' };

export default function CustomerForm({ customer, onSave, onDelete, onClose }) {
  const isNew = !customer?.id;
  const [form, setForm] = useState(() => ({ ...EMPTY, ...customer }));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => { firstInputRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, id: customer?.id });
  };

  const handleDelete = () => {
    if (confirmDelete) { onDelete(customer.id); onClose(); }
    else setConfirmDelete(true);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="cust-modal-title">
        <div className="modal-header">
          <h2 id="cust-modal-title">{isNew ? 'Add Customer' : 'Edit Customer'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="cust-name">Full Name <span className="required">*</span></label>
            <input
              ref={firstInputRef}
              id="cust-name"
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Jane Smith"
              required
            />
          </div>

          <div className="form-row form-row--2">
            <div className="form-group">
              <label htmlFor="cust-phone">Phone</label>
              <input
                id="cust-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="(555) 000-0000"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cust-email">Email</label>
              <input
                id="cust-email"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cust-address">Address</label>
            <input
              id="cust-address"
              type="text"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="123 Main St, Springfield"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cust-notes">Notes</label>
            <textarea
              id="cust-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Allergies, preferences, referral source…"
            />
          </div>

          <div className="modal-actions">
            {!isNew && (
              <button
                type="button"
                className={`btn btn--danger ${confirmDelete ? 'btn--confirm' : ''}`}
                onClick={handleDelete}
              >
                {confirmDelete ? 'Confirm Delete' : 'Delete'}
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={!form.name.trim()}
              >
                {isNew ? 'Add Customer' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
