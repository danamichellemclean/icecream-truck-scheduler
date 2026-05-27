import { useState, useCallback } from 'react';
import branding from '../config/branding';

const KEY = 'ics_settings';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fall through */ }
  // First run: seed from branding defaults
  return {
    packages: [...branding.packages],
    trucks: [...branding.trucks],
    employees: [...branding.employees],
  };
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

export default function useSettings() {
  const [settings, setSettings] = useState(load);

  const persist = useCallback((nextOrUpdater) => {
    setSettings((prev) => {
      const next = typeof nextOrUpdater === 'function' ? nextOrUpdater(prev) : nextOrUpdater;
      save(next);
      return next;
    });
  }, []);

  const addItem = useCallback((section, value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    persist((prev) => {
      if (prev[section].includes(trimmed)) return prev;
      return { ...prev, [section]: [...prev[section], trimmed] };
    });
  }, [persist]);

  const removeItem = useCallback((section, value) => {
    persist((prev) => ({ ...prev, [section]: prev[section].filter((v) => v !== value) }));
  }, [persist]);

  const reorderItem = useCallback((section, fromIndex, toIndex) => {
    persist((prev) => {
      const arr = [...prev[section]];
      const [item] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, item);
      return { ...prev, [section]: arr };
    });
  }, [persist]);

  return { settings, addItem, removeItem, reorderItem };
}
