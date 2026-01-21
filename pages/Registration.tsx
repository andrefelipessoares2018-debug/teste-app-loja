
import React, { useState } from 'react';
import { Product } from '../types';
import { storageService } from '../services/storageService';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

interface RegistrationProps {
  onDataChange: () => void;
  onEdit: (product: Product) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onDataChange, onEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unitPrice: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const recentItems = storageService.getProducts().slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.quantity || !formData.unitPrice) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    storageService.addProduct({
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
    });

    setFormData({ name: '', category: '', quantity: '', unitPrice: '' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    onDataChange();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      storageService.deleteProduct(id);
      onDataChange();
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Plus size={20} /> Novo Produto
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Nome do Produto</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
              placeholder="Ex: Teclado Mecânico"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Categoria / Código</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
              placeholder="Ex: Periféricos"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Quantidade Inicial</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Preço Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                placeholder="0,00"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Salvar Produto
          </button>
        </form>

        {showSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle2 size={18} /> Cadastrado com sucesso!
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Cadastrados Recentemente</h3>
        <div className="space-y-3">
          {recentItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400 italic">Nenhum item recente</div>
          ) : (
            recentItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center group">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-gray-100">{item.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.category} • {formatDate(item.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(item)} className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
