
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { storageService } from '../services/storageService';
import { formatCurrency, exportToCSV } from '../utils/formatters';
import SummaryHeader from '../components/SummaryHeader';
import { Search, Filter, Plus, Minus, Download, Edit3, Trash } from 'lucide-react';

interface InventoryProps {
  onDataChange: () => void;
  onEdit: (product: Product) => void;
}

const Inventory: React.FC<InventoryProps> = ({ onDataChange, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const products = storageService.getProducts();

  const stats = useMemo(() => {
    return {
      totalItems: products.reduce((acc, p) => acc + p.quantity, 0),
      totalValue: products.reduce((acc, p) => acc + p.quantity * p.unitPrice, 0),
      lowStockCount: products.filter(p => p.quantity > 0 && p.quantity < 10).length,
    };
  }, [products]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['Todas', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, searchTerm, selectedCategory]);

  const handleStockAction = (product: Product, amount: number) => {
    const newQty = Math.max(0, product.quantity + amount);
    storageService.updateProduct({
      ...product,
      quantity: newQty,
      lastMovement: new Date().toISOString()
    });
    onDataChange();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover permanentemente este item do estoque?')) {
      storageService.deleteProduct(id);
      onDataChange();
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <SummaryHeader stats={stats} />

      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
            placeholder="Buscar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Listagem Geral</h3>
        <button 
          onClick={() => exportToCSV(products)}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Nenhum produto encontrado.</div>
        ) : (
          filteredProducts.map(product => {
            const isLow = product.quantity > 0 && product.quantity < 10;
            const isZero = product.quantity === 0;

            return (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{product.name}</h4>
                      {isZero ? (
                        <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Esgotado</span>
                      ) : isLow ? (
                        <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Baixo</span>
                      ) : null}
                    </div>
                    <p className="text-xs text-gray-400">{product.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(product)} className="p-2 text-gray-400 hover:text-indigo-500 transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Quantidade</p>
                    <p className={`text-xl font-black ${isZero ? 'text-rose-600' : isLow ? 'text-amber-500' : 'text-indigo-600'}`}>
                      {product.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Preço Unit.</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatCurrency(product.unitPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Total</p>
                    <p className="text-sm font-bold text-emerald-600">{formatCurrency(product.quantity * product.unitPrice)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-50 dark:border-gray-700">
                  <span className="text-[9px] text-gray-400">Última movimentação: {new Date(product.lastMovement).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStockAction(product, -1)}
                      className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
                    >
                      <Minus size={14} /> Sair
                    </button>
                    <button 
                      onClick={() => handleStockAction(product, 1)}
                      className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
                    >
                      <Plus size={14} /> Entrar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Inventory;
