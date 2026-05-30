import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../utils/supabase';

function generateId() {
  return `cust-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load customers from Supabase on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCustomer = useCallback(async (data) => {
    try {
      const customer = { ...data, id: generateId(), createdAt: new Date().toISOString() };
      const { error } = await supabase
        .from('customers')
        .insert([customer]);
      
      if (error) throw error;
      setCustomers((prev) => [customer, ...prev]);
      return customer;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  }, []);

  const updateCustomer = useCallback(async (data) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update(data)
        .eq('id', data.id);
      
      if (error) throw error;
      setCustomers((prev) => prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }, []);

  const deleteCustomer = useCallback(async (id) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }, []);

  return { customers, loading, addCustomer, updateCustomer, deleteCustomer };
}
