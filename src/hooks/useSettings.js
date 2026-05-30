import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import branding from '../config/branding';

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

export default function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load settings from Supabase on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('id', 'default')
        .single();
      
      let loadedSettings;
      if (error && error.code === 'PGRST116') {
        loadedSettings = {
          packages: [...branding.packages],
          trucks: [...branding.trucks],
          employees: [...branding.employees],
        };
        await saveSettingsToSupabase(loadedSettings);
      } else if (error) {
        throw error;
      } else if (data && isValidShape(data.value)) {
        if (data.value._brandingSig === getBrandingSig()) {
          loadedSettings = {
            packages: [...data.value.packages],
            trucks: [...data.value.trucks],
            employees: [...data.value.employees],
          };
        } else {
          loadedSettings = {
            packages: [...branding.packages],
            trucks: [...branding.trucks],
            employees: [...branding.employees],
          };
          await saveSettingsToSupabase(loadedSettings);
        }
      } else {
        loadedSettings = {
          packages: [...branding.packages],
          trucks: [...branding.trucks],
          employees: [...branding.employees],
        };
        await saveSettingsToSupabase(loadedSettings);
      }
      
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      const defaults = {
        packages: [...branding.packages],
        trucks: [...branding.trucks],
        employees: [...branding.employees],
      };
      setSettings(defaults);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettingsToSupabase = async (data) => {
    try {
      const toSave = { ...data, _brandingSig: getBrandingSig() };
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 'default', value: toSave }, { onConflict: 'id' })
        .select();
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const addItem = useCallback(async (section, value) => {
    const trimmed = value.trim();
    if (!trimmed || !settings) return;
    
    try {
      setSettings((prev) => {
        if (prev[section].includes(trimmed)) return prev;
        const updated = { ...prev, [section]: [...prev[section], trimmed] };
        saveSettingsToSupabase(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }, [settings]);

  const removeItem = useCallback(async (section, value) => {
    if (!settings) return;
    
    try {
      setSettings((prev) => {
        const updated = { ...prev, [section]: prev[section].filter((v) => v !== value) };
        saveSettingsToSupabase(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }, [settings]);

  const reorderItem = useCallback(async (section, fromIndex, toIndex) => {
    if (!settings) return;
    
    try {
      setSettings((prev) => {
        const arr = [...prev[section]];
        const [item] = arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, item);
        const updated = { ...prev, [section]: arr };
        saveSettingsToSupabase(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error reordering item:', error);
    }
  }, [settings]);

  return { settings, loading, addItem, removeItem, reorderItem };
}
