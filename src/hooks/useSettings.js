import { useState, useCallback } from 'react';
import branding from '../config/branding';

const KEY = 'ics_settings';

function getBrandingSig() {
  return JSON.stringify({
    packages: branding.packages,
    trucks: branding.trucks,
    employees: branding.employees,
  });
}

function isValidShape(obj) {
  return obj && Array.isArray(obj.packages) && Array.isArray(obj.trucks) && Array.isArray(obj.employees);
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If the saved data matches the current branding signature, keep it.
      if (isValidShape(parsed) && parsed._brandingSig === getBrandingSig()) {
        return {
          packages: [...parsed.packages],
          trucks: [...parsed.trucks],
          employees: [...parsed.employees],
        };
      }
      // Otherwise fall through and reset to branding defaults.
    }
  } catch { /* fall through */ }

  // Seed from branding defaults and persist the new signature
  const defaults = {
    packages: [...branding.packages],
    trucks: [...branding.trucks],
    employees: [...branding.employees],
  };
  save(defaults);
  return defaults;
}

function save(data) {
  try {
    const toSave = { ...data, _brandingSig: getBrandingSig() };
    localStorage.setItem(KEY, JSON.stringify(toSave));
  } catch { /* ignore */ }
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
