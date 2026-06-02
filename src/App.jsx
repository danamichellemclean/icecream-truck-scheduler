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
import EventDetails from './components/Events/EventDetails';
import SettingsView from './components/Settings/SettingsView';
import CustomerList from './components/Customers/CustomerList';
import { initializeSupabaseTables } from './utils/supabaseInit';
import './App.css';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [formState, setFormState] = useState(null); // null=closed, { event, defaultDate, mode }
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);
  const requiredPassword = import.meta.env.VITE_APP_PASSWORD || 'sunshine';
  const [isInitializing, setIsInitializing] = useState(true);

  const { events, loading: eventsLoading, addEvent, updateEvent, deleteEvent } = useEvents();
  const { settings, loading: settingsLoading, addItem, removeItem } = useSettings();
  const { customers, loading: customersLoading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();

  // Initialize Supabase tables on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeSupabaseTables();
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

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

  const isLoading = isInitializing || eventsLoading || settingsLoading || customersLoading;

  const openAdd = (date = null) => setFormState({ event: {}, defaultDate: date, mode: 'add' });
  const openDetails = (event) => setFormState({ event, defaultDate: null, mode: 'details' });
  const openEdit = (event) => setFormState({ event, defaultDate: null, mode: 'edit' });
  const closeForm = () => setFormState(null);

  const handleSave = async (data) => {
    try {
      console.log('App.handleSave: Saving event with id:', data.id);
      if (data.id) {
        console.log('Updating existing event:', data.id);
        await updateEvent(data);
      } else {
        console.log('Creating new event');
        await addEvent(data);
      }
      console.log('Event saved successfully');
      closeForm();
    } catch (error) {
      console.error('App.handleSave: Error saving event:', error);
      console.error('Error details:', { message: error?.message, code: error?.code, status: error?.status });
      throw error; // Re-throw so EventForm can catch and display it
    }
  };

  // When a customer detail row is clicked from within the CustomerList, open the event editor
  const handleEventClickFromCustomer = (event) => {
    openDetails(event);
    // stay on customers view — modal overlays everything
  };

  if (!passwordUnlocked) {
    return (
      <div className="app">
        <Header />
        <main className="app-main">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Please enter password to continue</h2>
            <PasswordPrompt onUnlock={() => setPasswordUnlocked(true)} requiredPassword={requiredPassword} />
          </div>
        </main>
      </div>
    );
  }

  if (isLoading && !settings) {
    return (
      <div className="app">
        <Header />
        <main className="app-main">
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Loading your data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      {branding.backgroundImageUrl && <div className="app-bg-overlay" aria-hidden="true" />}
      <Header />
      <BottomNav current={view} onChange={setView} />
      <main className="app-main">
        {view === 'dashboard' && (
          <Dashboard events={events} onEdit={openDetails} onAdd={() => openAdd()} />
        )}
        {view === 'calendar' && (
          <CalendarView events={events} onEdit={openDetails} onDayClick={openAdd} />
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

      {formState && formState.mode === 'details' && (
        <EventDetails
          event={formState.event}
          onClose={closeForm}
          onEdit={() => openEdit(formState.event)}
          customers={customers}
        />
      )}

      {formState && formState.mode !== 'details' && (
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


function PasswordPrompt({ onUnlock, requiredPassword }) {
  const [val, setVal] = useState('');
  const [err, setErr] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    if (val === requiredPassword) {
      onUnlock();
    } else {
      setErr('Incorrect password');
    }
  };
  return (
    <form onSubmit={submit} style={{ maxWidth: 360, margin: '0 auto' }}>
      <input
        autoFocus
        type="password"
        placeholder="Enter password"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        style={{ width: '100%', padding: '8px', fontSize: 16 }}
      />
      <div style={{ marginTop: 12 }}>
        <button className="btn btn--primary" type="submit">Unlock</button>
      </div>
      {err && <div style={{ color: 'var(--color-danger)', marginTop: 8 }}>{err}</div>}
    </form>
  );
}
