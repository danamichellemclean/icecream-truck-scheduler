import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../utils/supabase';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from Supabase on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(async (data) => {
    try {
      const event = { ...data, id: generateId(), createdAt: new Date().toISOString() };
      const { error } = await supabase
        .from('events')
        .insert([event]);
      
      if (error) throw error;
      setEvents((prev) => [...prev, event]);
      return event;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }, []);

  const updateEvent = useCallback(async (data) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(data)
        .eq('id', data.id);
      
      if (error) throw error;
      setEvents((prev) => prev.map((e) => (e.id === data.id ? { ...e, ...data } : e)));
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
