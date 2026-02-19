
import React, { useState, FormEvent, useEffect } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const CORRECT_PASSWORD = "Suntea101";

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      onLoginSuccess();
    } else {
      setError('Kata sandi salah. Silakan coba lagi.');
      setPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-sm transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login Bendahara</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

          <div className="mt-8 flex flex-col gap-3">
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">Login</button>
            <button type="button" onClick={onClose} className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
