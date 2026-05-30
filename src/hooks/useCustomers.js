import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../utils/supabase';

function generateId() {
  return `cust-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function fromDbCustomer(row) {
  return {
    id: row.id,
    name: row.full_name || '',
    phone: row.phone || '',
    email: row.email || '',
    address: row.address || '',
    notes: row.notes || '',
    createdAt: row.created_at || null,
  };
}

function toDbCustomer(data) {
  return {
    id: data.id,
    full_name: data.name || null,
    phone: data.phone || null,
    email: data.email || null,
    address: data.address || null,
    notes: data.notes || null,
    created_at: data.createdAt || new Date().toISOString(),
  };
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
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCustomers((data || []).map(fromDbCustomer));
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
      const dbCustomer = toDbCustomer(customer);
      const { data: result, error } = await supabase
        .from('customers')
        .insert([dbCustomer])
        .select();
      
      if (error) {
        console.error('useCustomers.addCustomer Supabase error:', error);
        throw error;
      }

      const savedCustomer = fromDbCustomer(result?.[0] || dbCustomer);
      setCustomers((prev) => [savedCustomer, ...prev]);
      return savedCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  }, []);

  const updateCustomer = useCallback(async (data) => {
    try {
      const dbCustomer = toDbCustomer(data);
      const { id, ...payload } = dbCustomer;
      delete payload.created_at;
      const { data: result, error } = await supabase
        .from('customers')
        .update(payload)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('useCustomers.updateCustomer Supabase error:', error);
        throw error;
      }
      const updatedCustomer = fromDbCustomer(result?.[0] || { id, ...payload, created_at: data.createdAt });
      setCustomers((prev) => prev.map((c) => (c.id === id ? updatedCustomer : c)));
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
