
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
};

export default StatCard;
