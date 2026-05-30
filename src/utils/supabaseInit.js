import { supabase } from './supabase';

function loadFromLocalStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function toDbCustomer(customer) {
  const out = {
    full_name: customer.name || null,
    phone: customer.phone || null,
    email: customer.email || null,
    address: customer.address || null,
    notes: customer.notes || null,
  };
  if (customer.createdAt) out.created_at = customer.createdAt;
  if (customer.updatedAt) out.updated_at = customer.updatedAt;
  return out;
}

function toDbEvent(event) {
  const employeesValue = event.employees;
  const employeesArray = typeof employeesValue === 'string'
    ? (() => {
        try { return JSON.parse(employeesValue); } catch { return []; }
      })()
    : Array.isArray(employeesValue)
      ? employeesValue
      : [];

  return {
    // let Supabase generate `id`
    event_date: event.eventDate || event.date || null,
    start_time: event.startTime || null,
    end_time: event.endTime || null,
    setup_time: event.setupTime || null,
    contact_name: event.contactName || null,
    package: event.package || null,
    total_sales: event.totalSales != null ? parseFloat(event.totalSales) : null,
    employees: JSON.stringify(employeesArray),
    notes: event.notes || null,
    // don't set created_at/updated_at unless provided
    ...(event.createdAt ? { created_at: event.createdAt } : {}),
    ...(event.updatedAt ? { updated_at: event.updatedAt } : {}),
  };
}

function toDbSettings(settings) {
  return {
    value: settings,
  };
}

export async function initializeSupabaseTables() {
  try {
    const events = loadFromLocalStorage('ics_events');
    const customers = loadFromLocalStorage('ics_customers');
    const settings = loadFromLocalStorage('ics_settings');

    if (events && events.length > 0) {
      console.log('Migrating events to Supabase...');
      for (const event of events) {
        try {
          await supabase
            .from('events')
            .insert([toDbEvent(event)])
            .select();
        } catch (err) {
          console.error('Failed migrating event:', err, event);
        }
      }
    }

    if (customers && customers.length > 0) {
      console.log('Migrating customers to Supabase...');
      for (const customer of customers) {
        try {
          await supabase
            .from('customers')
            .insert([toDbCustomer(customer)])
            .select();
        } catch (err) {
          console.error('Failed migrating customer:', err, customer);
        }
      }
    }

    if (settings) {
      console.log('Migrating settings to Supabase...');
      // If a settings row already exists, update it; otherwise insert a new row.
      const { data: existing, error: fetchErr } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (existing && existing.id) {
        await supabase
          .from('settings')
          .update({ value: settings })
          .eq('id', existing.id)
          .select();
      } else {
        await supabase
          .from('settings')
          .insert(toDbSettings(settings))
          .select();
      }
    }

    console.log('Supabase migration complete');
  } catch (error) {
    console.error('Supabase initialization error:', error);
  }
}
