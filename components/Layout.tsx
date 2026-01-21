
import React from 'react';
import { PlusCircle, Package, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'cadastro' | 'estoque';
  setActiveTab: (tab: 'cadastro' | 'estoque') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white dark:bg-gray-900 shadow-xl overflow-hidden relative">
      <header className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Gestor Estoque</h1>
        <button className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 transition-colors">
          <Settings size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-around items-center py-3 px-6 safe-area-bottom z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveTab('cadastro')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 ${
            activeTab === 'cadastro' ? 'text-indigo-600 dark:text-indigo-400 scale-105' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <PlusCircle size={24} />
          <span className="text-xs font-medium">Cadastro</span>
        </button>
        <button
          onClick={() => setActiveTab('estoque')}
          className={`flex flex-col items-center gap-1 transition-all duration-200 ${
            activeTab === 'estoque' ? 'text-indigo-600 dark:text-indigo-400 scale-105' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <Package size={24} />
          <span className="text-xs font-medium">Estoque</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
