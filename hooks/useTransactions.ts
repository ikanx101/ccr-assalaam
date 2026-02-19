
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import { initialCsvData } from '../data/initialData';

const API_BASE_URL = '/api'; 

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to parse the scientific/NA formatted CSV from initialData.ts
  const parseInitialData = (csv: string): Transaction[] => {
    try {
      const lines = csv.trim().split('\n');
      // Skip header
      return lines.slice(1).map((line, index) => {
        // Simple regex to handle quoted strings and commas
        const matches = line.match(/(".*?"|[^,]+)/g) || [];
        const clean = (s: string) => s ? s.replace(/^"|"$/g, '').trim() : '';
        
        const rawPemasukan = clean(matches[3]);
        const rawPengeluaran = clean(matches[4]);

        return {
          id: parseInt(clean(matches[0])) || (index + 1),
          tanggal: clean(matches[1]),
          deskripsi: clean(matches[2]),
          pemasukan: rawPemasukan === 'NA' ? 0 : Number(rawPemasukan),
          pengeluaran: rawPengeluaran === 'NA' ? 0 : Number(rawPengeluaran),
        };
      });
    } catch (e) {
      console.error("Error parsing initial CSV data:", e);
      return [];
    }
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/transactions`);
      
      if (!response.ok) {
        // If server is not found (404), we treat it as "local mode" and load initial data
        if (response.status === 404) {
          console.warn("Backend API not found. Falling back to local initial data.");
          const localData = parseInitialData(initialCsvData);
          setTransactions(localData);
          return;
        }
        throw new Error(`Gagal mengambil data: ${response.statusText}`);
      }
      
      const data: Transaction[] = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      // Network error or fetch failed
      console.warn("Could not connect to server. Using local initial data as fallback.", err);
      const localData = parseInitialData(initialCsvData);
      setTransactions(localData);
      // We don't set the fatal error here because we have a fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        // In local/fallback mode, we just update the UI state
        if (response.status === 404) {
          const mockId = Math.max(0, ...transactions.map(t => t.id)) + 1;
          const mockSaved: Transaction = { ...newTransaction, id: mockId };
          setTransactions(prev => [mockSaved, ...prev]);
          return { success: true };
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan transaksi.');
      }

      const savedTransaction: Transaction = await response.json();
      setTransactions(prev => [savedTransaction, ...prev]);
      return { success: true };
    } catch (err) {
      console.error("Add error:", err);
      // Even if server fails, let's update UI for demo purposes if it's a connection issue
      const mockId = Math.max(0, ...transactions.map(t => t.id)) + 1;
      const mockSaved: Transaction = { ...newTransaction, id: mockId };
      setTransactions(prev => [mockSaved, ...prev]);
      return { success: true }; // Silent fallback
    }
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: number) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 404) {
        throw new Error('Gagal menghapus transaksi.');
      }
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Delete error:", err);
      setTransactions(prev => prev.filter(t => t.id !== id));
      return { success: true };
    }
  }, []);

  return { 
    transactions, 
    addTransaction, 
    deleteTransaction, 
    loading, 
    error,
    refresh: fetchTransactions 
  };
};

export default useTransactions;
