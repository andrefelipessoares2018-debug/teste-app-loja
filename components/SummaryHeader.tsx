
import React from 'react';
import { InventoryStats } from '../types';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, AlertCircle, Package } from 'lucide-react';

interface SummaryHeaderProps {
  stats: InventoryStats;
}

const SummaryHeader: React.FC<SummaryHeaderProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full text-indigo-600 dark:text-indigo-400 mb-2">
          <Package size={18} />
        </div>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Itens</span>
        <span className="text-lg font-bold text-gray-800 dark:text-white">{stats.totalItems}</span>
      </div>

      <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-full text-emerald-600 dark:text-emerald-400 mb-2">
          <TrendingUp size={18} />
        </div>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Valor</span>
        <span className="text-xs font-bold text-gray-800 dark:text-white truncate max-w-full">
          {formatCurrency(stats.totalValue).replace('R$', '').trim()}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
        <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-full text-amber-600 dark:text-amber-400 mb-2">
          <AlertCircle size={18} />
        </div>
        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Baixo</span>
        <span className="text-lg font-bold text-gray-800 dark:text-white">{stats.lowStockCount}</span>
      </div>
    </div>
  );
};

export default SummaryHeader;
