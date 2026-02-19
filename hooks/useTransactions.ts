
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';

// Di lingkungan produksi, ini biasanya diatur melalui environment variable
// Misalnya: const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const API_BASE_URL = '/api'; 

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi utama untuk mengambil data dari tabel 'Transaksi' di PostgreSQL via API
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/transactions`);
      
      if (!response.ok) {
        throw new Error(`Gagal mengambil data: ${response.statusText}`);
      }
      
      const data: Transaction[] = await response.json();
      // Pastikan data yang datang adalah array
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data dari server.';
      setError(message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Menambah baris baru ke tabel 'Transaksi'
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan transaksi ke database.');
      }

      const savedTransaction: Transaction = await response.json();
      
      // Update state lokal dengan data yang sudah mendapat ID dari PostgreSQL
      setTransactions(prev => [savedTransaction, ...prev]);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal terhubung ke server.';
      setError(message);
      console.error("Add error:", err);
      return { success: false, message };
    }
  }, []);

  // Menghapus baris dari tabel 'Transaksi' berdasarkan ID
  const deleteTransaction = useCallback(async (id: number) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus transaksi dari database.');
      }
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus data.';
      setError(message);
      console.error("Delete error:", err);
      return { success: false, message };
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
