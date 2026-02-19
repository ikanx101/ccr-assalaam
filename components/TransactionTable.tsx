
import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  isAuthenticated: boolean;
  deleteTransaction: (id: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, isAuthenticated, deleteTransaction }) => {
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const { years, months } = useMemo(() => {
    const yearSet = new Set<number>();
    const monthSet = new Set<number>();
    transactions.forEach(t => {
      if (!t.tanggal) return;
      const date = new Date(t.tanggal);
      if (isNaN(date.getTime())) return;
      yearSet.add(date.getFullYear());
      monthSet.add(date.getMonth());
    });
    return {
      years: Array.from(yearSet).sort((a, b) => b - a),
      months: Array.from(monthSet).sort((a, b) => a - b),
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        if (filterYear === 'all' || !t.tanggal) return true;
        const date = new Date(t.tanggal);
        if (isNaN(date.getTime())) return false;
        return date.getFullYear().toString() === filterYear;
      })
      .filter(t => {
        if (filterMonth === 'all' || !t.tanggal) return true;
        const date = new Date(t.tanggal);
        if (isNaN(date.getTime())) return false;
        return date.getMonth().toString() === filterMonth;
      })
      .sort((a,b) => {
          if (!a.tanggal || !b.tanggal) return 0;
          return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      });
  }, [transactions, filterYear, filterMonth]);

  const handleDownload = () => {
    const dataToExport = filteredTransactions.map(t => ({
      Tanggal: t.tanggal,
      Deskripsi: t.deskripsi,
      Pemasukan: t.pemasukan > 0 ? t.pemasukan : '',
      Pengeluaran: t.pengeluaran > 0 ? t.pengeluaran : '',
    }));
    
    const worksheet = (window as any).XLSX.utils.json_to_sheet(dataToExport);
    const workbook = (window as any).XLSX.utils.book_new();
    (window as any).XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi');
    (window as any).XLSX.writeFile(workbook, 'Laporan_Keuangan_Mushalla_As_Salaam.xlsx');
  };

  const formatCurrency = (value: number) => {
    if (value === 0) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleDelete = (id: number) => {
      if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
          deleteTransaction(id);
      }
  };
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="p-2 border rounded-lg bg-gray-50 w-full sm:w-auto">
          <option value="all">Semua Tahun</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="p-2 border rounded-lg bg-gray-50 w-full sm:w-auto">
          <option value="all">Semua Bulan</option>
          {months.map(m => <option key={m} value={m}>{monthNames[m]}</option>)}
        </select>
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md flex items-center justify-center gap-2 sm:ml-auto"
        >
          <DownloadIcon />
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto max-h-[60vh]">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Deskripsi</th>
              <th scope="col" className="px-6 py-3 text-right">Pemasukan</th>
              <th scope="col" className="px-6 py-3 text-right">Pengeluaran</th>
              {isAuthenticated && <th scope="col" className="px-6 py-3 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(t => (
                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{t.tanggal}</td>
                  <td className="px-6 py-4">{t.deskripsi}</td>
                  <td className="px-6 py-4 text-right font-medium text-green-600">{formatCurrency(t.pemasukan)}</td>
                  <td className="px-6 py-4 text-right font-medium text-red-600">{formatCurrency(t.pengeluaran)}</td>
                  {isAuthenticated && (
                    <td className="px-6 py-4 text-center">
                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700 p-1" aria-label="Hapus Transaksi">
                            <TrashIcon />
                        </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan={isAuthenticated ? 5 : 4} className="text-center py-10 text-gray-500">
                        Tidak ada transaksi yang cocok dengan filter.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L10 12.001l2.293-2.294a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v8.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 12.586V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
)

export default TransactionTable;
