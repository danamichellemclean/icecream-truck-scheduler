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
      console.log('useEvents.addEvent: Creating event:', data);
      const event = { ...data, id: generateId(), createdAt: new Date().toISOString() };
      console.log('useEvents.addEvent: Event object to insert:', event);
      const { data: result, error } = await supabase
        .from('events')
        .insert([event])
        .select();
      
      console.log('useEvents.addEvent: Supabase response - data:', result, 'error:', error);
      if (error) {
        console.error('useEvents.addEvent: Supabase error:', error);
        throw new Error(error.message || 'Failed to insert event into database');
      }
      console.log('useEvents.addEvent: Successfully inserted event');
      setEvents((prev) => [...prev, event]);
      return event;
    } catch (error) {
      console.error('useEvents.addEvent: Catch block error:', error);
      throw error;
    }
  }, []);

  const updateEvent = useCallback(async (data) => {
    try {
      console.log('useEvents.updateEvent: Updating event:', data.id);
      const { data: result, error } = await supabase
        .from('events')
        .update(data)
        .eq('id', data.id)
        .select();
      
      console.log('useEvents.updateEvent: Supabase response - data:', result, 'error:', error);
      if (error) {
        console.error('useEvents.updateEvent: Supabase error:', error);
        throw new Error(error.message || 'Failed to update event in database');
      }
      console.log('useEvents.updateEvent: Successfully updated event');
      setEvents((prev) => prev.map((e) => (e.id === data.id ? { ...e, ...data } : e)));
    } catch (error) {
      console.error('useEvents.updateEvent: Catch block error:', error);
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
