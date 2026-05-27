import { useState, useCallback } from 'react';
import { loadEvents, saveEvents } from '../utils/storage';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function useEvents() {
  const [events, setEvents] = useState(() => loadEvents());

  const persist = useCallback((next) => {
    setEvents(next);
    saveEvents(next);
  }, []);

  const addEvent = useCallback((data) => {
    const event = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    persist((prev) => [...prev, event]);
    return event;
  }, [persist]);

  const updateEvent = useCallback((data) => {
    persist((prev) => prev.map((e) => (e.id === data.id ? { ...e, ...data } : e)));
  }, [persist]);

  const deleteEvent = useCallback((id) => {
    persist((prev) => prev.filter((e) => e.id !== id));
  }, [persist]);

  return { events, addEvent, updateEvent, deleteEvent };
}
