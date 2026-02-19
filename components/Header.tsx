
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </div>
            <div>
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Dashboard Keuangan
                </h1>
                <p className="text-md text-gray-500">Mushalla As Salaam</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
