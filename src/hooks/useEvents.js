import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../utils/supabase';

function safeParse(value) {
  if (!value) return [];
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return []; }
  }
  return Array.isArray(value) ? value : [];
}

function toDbEvent(data) {
  const employeesValue = data.employees;
  const employeesArray = typeof employeesValue === 'string'
    ? (() => {
        try { return JSON.parse(employeesValue); } catch { return []; }
      })()
    : Array.isArray(employeesValue)
      ? employeesValue
      : [];

  const out = {
    event_date: data.eventDate || data.date || null,
    start_time: data.startTime || null,
    end_time: data.endTime || null,
    setup_time: data.setupTime || null,
    contact_name: data.contactName || null,
    package: data.package || null,
    truck: data.truck || null,
    total_sales: data.totalSales != null ? parseFloat(data.totalSales) : null,
    employees: JSON.stringify(employeesArray),
    notes: data.notes || null,
  };
  if (data.createdAt) out.created_at = data.createdAt;
  return out;
}

function fromDbEvent(row) {
  return {
    id: row.id,
    eventDate: row.event_date || '',
    date: row.event_date || '',
    startTime: row.start_time || '',
    endTime: row.end_time || '',
    setupTime: row.setup_time || '',
    contactName: row.contact_name || '',
    package: row.package || '',
    truck: row.truck || '',
    totalSales: row.total_sales != null ? String(row.total_sales) : '',
    employees: safeParse(row.employees),
    notes: row.notes || '',
    createdAt: row.created_at || null,
  };
}

export default function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      setEvents((data || []).map(fromDbEvent));
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(async (data) => {
    try {
      const event = { ...data };
      const dbEvent = toDbEvent(event);
      const { data: result, error } = await supabase
        .from('events')
        .insert([dbEvent])
        .select();
      
      if (error) {
        console.error('useEvents.addEvent: Supabase error:', error);
        throw new Error(error.message || 'Failed to insert event into database');
      }

      const savedEvent = fromDbEvent(result?.[0] || {});
      setEvents((prev) => [...prev, savedEvent]);
      return savedEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }, []);

  const updateEvent = useCallback(async (data) => {
    try {
      const id = data.id;
      const payload = toDbEvent(data);
      delete payload.created_at;
      const { data: result, error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('useEvents.updateEvent: Supabase error:', error);
        throw new Error(error.message || 'Failed to update event in database');
      }
      const updatedEvent = fromDbEvent(result?.[0] || { id, ...payload, created_at: data.createdAt });
      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)));
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }, []);

  const deleteEvent = useCallback(async (id) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }, []);

  return { events, loading, addEvent, updateEvent, deleteEvent };
}
