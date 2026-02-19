
import React, { useState, FormEvent, useEffect } from 'react';
import { Transaction } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAddTransaction }) => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [deskripsi, setDeskripsi] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tipe, setTipe] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setTanggal(new Date().toISOString().split('T')[0]);
      setDeskripsi('');
      setJumlah('');
      setTipe('pemasukan');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!deskripsi || !jumlah || !tanggal) {
      setError('Semua kolom harus diisi.');
      return;
    }

    const amount = parseFloat(jumlah);
    if (isNaN(amount) || amount <= 0) {
      setError('Jumlah harus berupa angka positif.');
      return;
    }

    const newTransaction: Omit<Transaction, 'id'> = {
      tanggal,
      deskripsi,
      pemasukan: tipe === 'pemasukan' ? amount : 0,
      pengeluaran: tipe === 'pengeluaran' ? amount : 0,
    };

    onAddTransaction(newTransaction);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tambah Transaksi Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input type="date" id="tanggal" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <input type="text" id="deskripsi" placeholder="Contoh: Infaq dari hamba Allah" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
              <input type="number" id="jumlah" placeholder="50000" value={jumlah} onChange={(e) => setJumlah(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">Tipe Transaksi</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipe" value="pemasukan" checked={tipe === 'pemasukan'} onChange={() => setTipe('pemasukan')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
                  <span className="text-green-600 font-semibold">Pemasukan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipe" value="pengeluaran" checked={tipe === 'pengeluaran'} onChange={() => setTipe('pengeluaran')} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"/>
                  <span className="text-red-600 font-semibold">Pengeluaran</span>
                </label>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">Simpan Transaksi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
