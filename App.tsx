
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import StatCard from './components/StatCard';
import TransactionTable from './components/TransactionTable';
import QrisCard from './components/QrisCard';
import AddTransactionModal from './components/AddTransactionModal';
import PasswordModal from './components/PasswordModal';
import useTransactions from './hooks/useTransactions';
import { Transaction } from './types';

const App: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, loading, error } = useTransactions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { totalPemasukan, totalPengeluaran, saldoKas } = useMemo(() => {
    const totalPemasukan = transactions.reduce((sum, t) => sum + t.pemasukan, 0);
    const totalPengeluaran = transactions.reduce((sum, t) => sum + t.pengeluaran, 0);
    const saldoKas = totalPemasukan - totalPengeluaran;
    return { totalPemasukan, totalPengeluaran, saldoKas };
  }, [transactions]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    addTransaction(newTransaction);
    setIsAddModalOpen(false);
  };
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsPasswordModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <StatCard title="Total Pemasukan" value={formatCurrency(totalPemasukan)} color="text-green-500" />
          <StatCard title="Total Pengeluaran" value={formatCurrency(totalPengeluaran)} color="text-red-500" />
          <StatCard title="Saldo Kas Saat Ini" value={formatCurrency(saldoKas)} color="text-blue-500" />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Table and Actions */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-gray-700">Histori Transaksi</h2>
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md flex items-center gap-2"
                    >
                      <PlusIcon />
                      Tambah Transaksi
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md"
                  >
                    Login Bendahara
                  </button>
                )}
              </div>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="animate-pulse text-lg">Menghubungkan ke database Mushalla...</p>
              </div>
            ) : (
              <TransactionTable 
                transactions={transactions}
                isAuthenticated={isAuthenticated}
                deleteTransaction={deleteTransaction}
              />
            )}
          </div>

          {/* Right Column: QRIS */}
          <div className="w-full lg:w-1/3">
            <QrisCard imageUrl="https://github.com/ikanx101/as-salaam/blob/main/Quarto%20Dash/QRIS_Musholla.jpg?raw=true" />
          </div>
        </div>
      </main>
      
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

const PlusIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);


export default App;
