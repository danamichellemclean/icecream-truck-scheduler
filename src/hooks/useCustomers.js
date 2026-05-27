import { useState, useCallback } from 'react';

const KEY = 'ics_customers';

function generateId() {
  return `cust-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

export default function useCustomers() {
  const [customers, setCustomers] = useState(load);

  const persist = useCallback((nextOrUpdater) => {
    setCustomers((prev) => {
      const next = typeof nextOrUpdater === 'function' ? nextOrUpdater(prev) : nextOrUpdater;
      save(next);
      return next;
    });
  }, []);

  const addCustomer = useCallback((data) => {
    const customer = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    persist((prev) => [...prev, customer]);
    return customer;
  }, [persist]);

  const updateCustomer = useCallback((data) => {
    persist((prev) => prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
  }, [persist]);

  const deleteCustomer = useCallback((id) => {
    persist((prev) => prev.filter((c) => c.id !== id));
  }, [persist]);

  return { customers, addCustomer, updateCustomer, deleteCustomer };
}
