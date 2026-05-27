import './Layout.css';

const TABS = [
  { id: 'dashboard', label: 'Events',     icon: '📋' },
  { id: 'calendar',  label: 'Calendar',   icon: '📅' },
  { id: 'customers', label: 'Customers',  icon: '👥' },
  { id: 'sales',     label: 'Sales',      icon: '💰' },
  { id: 'settings',  label: 'Settings',   icon: '⚙️' },
];

export default function BottomNav({ current, onChange }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${current === tab.id ? 'nav-tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
          aria-current={current === tab.id ? 'page' : undefined}
        >
          <span className="nav-icon" aria-hidden="true">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
