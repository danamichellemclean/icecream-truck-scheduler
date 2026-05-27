import { useState, useEffect } from 'react';
import branding from './config/branding';
import useEvents from './hooks/useEvents';
import useSettings from './hooks/useSettings';
import useCustomers from './hooks/useCustomers';
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';
import CalendarView from './components/Calendar/CalendarView';
import Dashboard from './components/Dashboard/Dashboard';
import SalesSummary from './components/Sales/SalesSummary';
import EventForm from './components/Events/EventForm';
import SettingsView from './components/Settings/SettingsView';
import CustomerList from './components/Customers/CustomerList';
import './App.css';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [formState, setFormState] = useState(null); // null=closed, { event, defaultDate }

  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { settings, addItem, removeItem } = useSettings();
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();

  // Inject branding colors as CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const toKebab = (s) => s.replace(/([A-Z])/g, '-$1').toLowerCase();
    Object.entries(branding.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${toKebab(key)}`, value);
    });
    if (branding.backgroundImageUrl) {
      root.style.setProperty('--bg-image-url', `url("${branding.backgroundImageUrl}")`);
    }
    document.title = branding.businessName;
  }, []);

  const openAdd = (date = null) => setFormState({ event: {}, defaultDate: date });
  const openEdit = (event) => setFormState({ event, defaultDate: null });
  const closeForm = () => setFormState(null);

  const handleSave = (data) => {
    if (data.id) updateEvent(data);
    else addEvent(data);
    closeForm();
  };

  // When a customer detail row is clicked from within the CustomerList, open the event editor
  const handleEventClickFromCustomer = (event) => {
    openEdit(event);
    // stay on customers view — form overlays everything
  };

  return (
    <div className="app">
      {branding.backgroundImageUrl && <div className="app-bg-overlay" aria-hidden="true" />}
      <Header />
      <BottomNav current={view} onChange={setView} />
      <main className="app-main">
        {view === 'dashboard' && (
          <Dashboard events={events} onEdit={openEdit} onAdd={() => openAdd()} />
        )}
        {view === 'calendar' && (
          <CalendarView events={events} onEdit={openEdit} onDayClick={openAdd} />
        )}
        {view === 'customers' && (
          <CustomerList
            customers={customers}
            events={events}
            onAddCustomer={addCustomer}
            onUpdateCustomer={updateCustomer}
            onDeleteCustomer={deleteCustomer}
            onEventClick={handleEventClickFromCustomer}
          />
        )}
        {view === 'sales' && (
          <SalesSummary events={events} />
        )}
        {view === 'settings' && (
          <SettingsView
            settings={settings}
            addItem={addItem}
            removeItem={removeItem}
          />
        )}
      </main>

      {formState && (
        <EventForm
          event={formState.event}
          defaultDate={formState.defaultDate}
          onSave={handleSave}
          onDelete={deleteEvent}
          onClose={closeForm}
          settings={settings}
          customers={customers}
          onAddCustomer={addCustomer}
        />
      )}
    </div>
  );
}
