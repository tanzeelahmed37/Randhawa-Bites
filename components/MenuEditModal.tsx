
import React, { useState, useEffect, FormEvent } from 'react';
import { MenuItem, Category } from '../types';

interface MenuEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem | Omit<MenuItem, 'id'>) => void;
  item: MenuItem | null;
}

const MenuEditModal: React.FC<MenuEditModalProps> = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    price: 0,
    category: Category.Appetizers,
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        if (item) {
        setFormData({
            name: item.name,
            price: item.price,
            category: item.category,
            imageUrl: item.imageUrl,
        });
        setImagePreview(item.imageUrl);
        } else {
        setFormData({
            name: '',
            price: 0,
            category: Category.Appetizers,
            imageUrl: '',
        });
        setImagePreview(null);
        }
    }
  }, [item, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseInt(value, 10) || 0 : value }));
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (item) {
      onSave({ ...item, ...formData });
    } else {
      onSave(formData);
    }
  };

  const handleImageError = () => {
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {item ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
            <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          {imagePreview && (
            <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image Preview</span>
                <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md bg-gray-200 dark:bg-gray-700" crossOrigin="anonymous" onError={handleImageError}/>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuEditModal;
