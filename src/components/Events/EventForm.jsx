import { useState, useEffect, useRef } from 'react';
import { today } from '../../utils/dateUtils';
import './EventForm.css';

const EMPTY = {
  contactName: '',
  eventDate: '',
  startTime: '',
  endTime: '',
  package: '',
  employees: [],
  truck: '',
  totalSales: '',
  notes: '',
  customerId: null,
};

// ── Inline customer picker ─────────────────────────────────────────────────
function CustomerPicker({ customers, selectedId, onSelect, onAddNew }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const selected = customers.find((c) => c.id === selectedId) ?? null;

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  }).slice(0, 8);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (selected) {
    return (
      <div className="customer-selected">
        <div className="customer-selected-avatar" aria-hidden="true">
          {selected.name.charAt(0).toUpperCase()}
        </div>
        <div className="customer-selected-info">
          <span className="customer-selected-name">{selected.name}</span>
          {selected.phone && <span className="customer-selected-meta">{selected.phone}</span>}
          {selected.email && <span className="customer-selected-meta">{selected.email}</span>}
        </div>
        <button
          type="button"
          className="customer-selected-clear"
          onClick={() => onSelect(null)}
          aria-label="Clear customer selection"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="customer-picker" ref={wrapRef}>
      <input
        type="text"
        className="customer-picker-input"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search existing customers…"
        aria-label="Search customers"
        aria-expanded={open}
        aria-haspopup="listbox"
      />
      {open && (
        <div className="customer-picker-dropdown" role="listbox">
          {filtered.length === 0 && query && (
            <div className="picker-no-results">No matches for "{query}"</div>
          )}
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              role="option"
              className="picker-option"
              onMouseDown={(e) => { e.preventDefault(); onSelect(c); setOpen(false); setQuery(''); }}
            >
              <span className="picker-option-avatar">{c.name.charAt(0).toUpperCase()}</span>
              <span className="picker-option-info">
                <span className="picker-option-name">{c.name}</span>
                {(c.phone || c.email) && (
                  <span className="picker-option-meta">{c.phone || c.email}</span>
                )}
              </span>
            </button>
          ))}
          <button
            type="button"
            className="picker-add-new"
            onMouseDown={(e) => { e.preventDefault(); onAddNew(query); setOpen(false); setQuery(''); }}
          >
            + Add new customer{query ? ` "${query}"` : ''}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Quick-add customer inline form ─────────────────────────────────────────
function QuickAddCustomer({ initialName, onSave, onCancel }) {
  const [name, setName] = useState(initialName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div className="quick-add-customer">
      <div className="quick-add-title">New Customer</div>
      <div className="form-group">
        <label htmlFor="qc-name">Name <span className="required">*</span></label>
        <input ref={ref} id="qc-name" type="text" value={name}
          onChange={(e) => setName(e.target.value)} placeholder="Full name" />
      </div>
      <div className="form-row form-row--2">
        <div className="form-group">
          <label htmlFor="qc-phone">Phone</label>
          <input id="qc-phone" type="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)} placeholder="(555) 000-0000" />
        </div>
        <div className="form-group">
          <label htmlFor="qc-email">Email</label>
          <input id="qc-email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="qc-address">Address</label>
        <input id="qc-address" type="text" value={address}
          onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" />
      </div>
      <div className="quick-add-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!name.trim()}
          onClick={() => onSave({ name: name.trim(), phone, email, address })}
        >
          Create & Select
        </button>
      </div>
    </div>
  );
}

// ── Main EventForm ─────────────────────────────────────────────────────────
export default function EventForm({
  event, defaultDate, onSave, onDelete, onClose,
  settings, customers, onAddCustomer,
}) {
  const isNew = !event?.id;
  const [form, setForm] = useState(() => {
    const { setupTime, ...rest } = event || {};
    // Parse employees from JSON string if needed
    const employeesData = rest.employees ? (typeof rest.employees === 'string' ? JSON.parse(rest.employees) : rest.employees) : [];
    return {
      ...EMPTY,
      ...rest,
      endTime: rest.endTime ?? setupTime ?? '',
      eventDate: rest.eventDate || defaultDate || today(),
      employees: employeesData,
      customerId: rest.customerId ?? null,
    };
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddName, setQuickAddName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const firstInputRef = useRef(null);

  useEffect(() => { firstInputRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !showQuickAdd) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, showQuickAdd]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleEmployee = (name) => {
    setForm((f) => {
      const has = f.employees.includes(name);
      return { ...f, employees: has ? f.employees.filter((e) => e !== name) : [...f.employees, name] };
    });
  };

  const handleSelectCustomer = (customer) => {
    if (!customer) {
      setForm((f) => ({ ...f, customerId: null }));
    } else {
      setForm((f) => ({
        ...f,
        customerId: customer.id,
        contactName: f.contactName || customer.name,
      }));
    }
  };

  const handleQuickAdd = async (data) => {
    try {
      const newCustomer = await onAddCustomer(data);
      handleSelectCustomer(newCustomer);
      setShowQuickAdd(false);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contactName.trim() || !form.eventDate) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const eventData = {
        ...form,
        id: event?.id,
        employees: form.employees,
      };
      console.log('Submitting event with data:', eventData);
      await onSave(eventData);
      console.log('Event saved successfully');
    } catch (err) {
      console.error('Error submitting event:', err);
      setError(err?.message || 'Failed to save event. Please try again.');
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (confirmDelete) { onDelete(event.id); onClose(); }
    else setConfirmDelete(true);
  };

  const packages = settings?.packages ?? [];
  const trucks = settings?.trucks ?? [];
  const employees = settings?.employees ?? [];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">{isNew ? 'Add Event' : 'Edit Event'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          {error && (
            <div style={{ 
              padding: '12px', 
              marginBottom: '16px', 
              backgroundColor: '#fee', 
              color: '#c33', 
              borderRadius: '4px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          {/* ── Customer picker ──────────────────────────────────────────── */}
          <div className="form-group">
            <label>Customer</label>
            {showQuickAdd ? (
              <QuickAddCustomer
                initialName={quickAddName}
                onSave={handleQuickAdd}
                onCancel={() => setShowQuickAdd(false)}
              />
            ) : (
              <CustomerPicker
                customers={customers ?? []}
                selectedId={form.customerId}
                onSelect={handleSelectCustomer}
                onAddNew={(name) => { setQuickAddName(name); setShowQuickAdd(true); }}
              />
            )}
          </div>

          {/* ── Contact Name ─────────────────────────────────────────────── */}
          <div className="form-group">
            <label htmlFor="contactName">Contact Name <span className="required">*</span></label>
            <input
              ref={firstInputRef}
              id="contactName"
              type="text"
              value={form.contactName}
              onChange={(e) => set('contactName', e.target.value)}
              placeholder="e.g. Jane Smith"
              required
            />
          </div>

          {/* ── Date + Times ─────────────────────────────────────────────── */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Event Date <span className="required">*</span></label>
              <input
                id="eventDate"
                type="date"
                value={form.eventDate}
                onChange={(e) => set('eventDate', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input id="startTime" type="time" value={form.startTime}
                onChange={(e) => set('startTime', e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input id="endTime" type="time" value={form.endTime}
                onChange={(e) => set('endTime', e.target.value)} />
            </div>
          </div>

          {/* ── Package ──────────────────────────────────────────────────── */}
          <div className="form-group">
            <label htmlFor="package">Package Purchased</label>
            <select id="package" value={form.package}
              onChange={(e) => set('package', e.target.value)}>
              <option value="">— Select a package —</option>
              {packages.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* ── Truck ────────────────────────────────────────────────────── */}
          <div className="form-group">
            <label htmlFor="truck">Truck / Trailer</label>
            <select id="truck" value={form.truck}
              onChange={(e) => set('truck', e.target.value)}>
              <option value="">— Select a truck —</option>
              {trucks.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* ── Employees ────────────────────────────────────────────────── */}
          {employees.length > 0 && (
            <div className="form-group">
              <label>Assigned Employee(s)</label>
              <div className="chip-group" role="group" aria-label="Select employees">
                {employees.map((emp) => (
                  <button
                    key={emp}
                    type="button"
                    className={`chip ${form.employees.includes(emp) ? 'chip--on' : ''}`}
                    onClick={() => toggleEmployee(emp)}
                    aria-pressed={form.employees.includes(emp)}
                  >
                    {emp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Total Sales ──────────────────────────────────────────────── */}
          <div className="form-group">
            <label htmlFor="totalSales">Total Sales ($)</label>
            <input
              id="totalSales"
              type="number"
              min="0"
              step="0.01"
              value={form.totalSales}
              onChange={(e) => set('totalSales', e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* ── Notes ────────────────────────────────────────────────────── */}
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Address, special requests, deposit info…"
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
              <button type="button" className="btn btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={!form.contactName.trim() || !form.eventDate || saving}
              >
                {saving ? 'Saving...' : isNew ? 'Add Event' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
