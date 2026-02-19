
import React from 'react';

interface QrisCardProps {
  imageUrl: string;
}

const QrisCard: React.FC<QrisCardProps> = ({ imageUrl }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center h-full flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold text-gray-700 mb-4">Infaq Digital</h3>
      <p className="text-gray-600 mb-4">
        Scan QRIS di bawah ini untuk memberikan infaq terbaik Anda demi kemakmuran Mushalla As Salaam.
      </p>
      <div className="p-2 border border-gray-200 rounded-lg bg-gray-50">
        <img src={imageUrl} alt="QRIS Mushalla As Salaam" className="w-full max-w-sm mx-auto rounded-md" />
      </div>
      <p className="text-xs text-gray-400 mt-4">
        Semoga Allah SWT membalas kebaikan Anda dengan pahala yang berlipat ganda.
      </p>
    </div>
  );
};

export default QrisCard;
