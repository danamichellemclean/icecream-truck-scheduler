import { supabase } from './supabase';

// Migrate localStorage data to Supabase on first load
export async function initializeSupabaseTables() {
  try {
    // Get existing localStorage data before tables are initialized
    const events = loadFromLocalStorage('ics_events');
    const customers = loadFromLocalStorage('ics_customers');
    const settings = loadFromLocalStorage('ics_settings');

    // Create or ensure tables exist by checking if we can query them
    // If they don't exist, Supabase will handle the error gracefully
    
    // Migrate events if they exist in localStorage
    if (events && events.length > 0) {
      console.log('Migrating events to Supabase...');
      for (const event of events) {
        await supabase
          .from('events')
          .upsert({ id: event.id, ...event })
          .select();
      }
    }

    // Migrate customers if they exist in localStorage
    if (customers && customers.length > 0) {
      console.log('Migrating customers to Supabase...');
      for (const customer of customers) {
        await supabase
          .from('customers')
          .upsert({ id: customer.id, ...customer })
          .select();
      }
    }

    // Migrate settings if they exist in localStorage
    if (settings) {
      console.log('Migrating settings to Supabase...');
      await supabase
        .from('settings')
        .upsert({ id: 'default', data: settings })
        .select();
    }

    console.log('Supabase migration complete');
  } catch (error) {
    console.error('Supabase initialization error:', error);
  }
}

function loadFromLocalStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
