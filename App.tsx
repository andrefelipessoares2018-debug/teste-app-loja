
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Registration from './pages/Registration';
import Inventory from './pages/Inventory';
import { Product } from './types';
import { storageService } from './services/storageService';
import { X, Check } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cadastro' | 'estoque'>('estoque');
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Auto detect theme
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    storageService.updateProduct(editingProduct);
    setEditingProduct(null);
    triggerRefresh();
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'cadastro' ? (
        <Registration key={refreshKey} onDataChange={triggerRefresh} onEdit={handleEdit} />
      ) : (
        <Inventory key={refreshKey} onDataChange={triggerRefresh} onEdit={handleEdit} />
      )}

      {/* Edit Modal Overlay */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white">Editar Item</h3>
              <button onClick={() => setEditingProduct(null)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none dark:text-white"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none dark:text-white"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qtd</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none dark:text-white"
                    value={editingProduct.quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none dark:text-white"
                    value={editingProduct.unitPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
