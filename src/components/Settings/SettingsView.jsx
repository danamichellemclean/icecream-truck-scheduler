import { useState, useRef } from 'react';
import './SettingsView.css';

const SECTIONS = [
  { key: 'packages',  label: 'Packages',        icon: '📦', placeholder: 'e.g. Deluxe – 4 Hours' },
  { key: 'trucks',    label: 'Trucks / Trailers', icon: '🚚', placeholder: 'e.g. Strawberry Fields' },
  { key: 'employees', label: 'Employees',         icon: '👤', placeholder: 'e.g. Jordan' },
];

function ListSection({ icon, label, placeholder, items, onAdd, onRemove }) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const submit = () => {
    const val = draft.trim();
    if (!val) return;
    onAdd(val);
    setDraft('');
    inputRef.current?.focus();
  };

  const onKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
  };

  return (
    <section className="settings-section">
      <div className="settings-section-header">
        <span className="settings-section-icon" aria-hidden="true">{icon}</span>
        <h2 className="settings-section-title">{label}</h2>
        <span className="settings-section-count">{items.length}</span>
      </div>

      <ul className="settings-list" aria-label={label}>
        {items.length === 0 && (
          <li className="settings-list-empty">No {label.toLowerCase()} yet — add one below.</li>
        )}
        {items.map((item) => (
          <li key={item} className="settings-list-item">
            <span className="settings-item-label">{item}</span>
            <button
              className="settings-item-delete"
              onClick={() => onRemove(item)}
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="settings-add-row">
        <input
          ref={inputRef}
          type="text"
          className="settings-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          aria-label={`Add new ${label.toLowerCase()}`}
        />
        <button
          className="settings-add-btn"
          onClick={submit}
          disabled={!draft.trim()}
          aria-label={`Add ${label}`}
        >
          Add
        </button>
      </div>
    </section>
  );
}

export default function SettingsView({ settings, addItem, removeItem }) {
  return (
    <div className="settings-wrap">
      <div className="settings-intro">
        <h1 className="settings-page-title">Settings</h1>
        <p className="settings-page-sub">
          Manage the options that appear in your event forms. Changes save automatically.
        </p>
      </div>

      {SECTIONS.map(({ key, label, icon, placeholder }) => (
        <ListSection
          key={key}
          icon={icon}
          label={label}
          placeholder={placeholder}
          items={settings[key] ?? []}
          onAdd={(val) => addItem(key, val)}
          onRemove={(val) => removeItem(key, val)}
        />
      ))}
    </div>
  );
}
