
import React, { useState, useEffect, FormEvent } from 'react';
import { MenuItem, Category, Variant } from '../types';

interface MenuEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem | Omit<MenuItem, 'id'>) => void;
  item: MenuItem | null;
}

const MenuEditModal: React.FC<MenuEditModalProps> = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: Category.MainCourse,
    imageUrl: '',
  });
  const [variants, setVariants] = useState<Variant[]>([{ name: 'Standard', price: 0 }]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        if (item) {
            setFormData({
                name: item.name,
                category: item.category,
                imageUrl: item.imageUrl,
            });
            setVariants(item.variants.length > 0 ? [...item.variants.map(v => ({...v}))] : [{ name: 'Standard', price: 0 }]);
            setImagePreview(item.imageUrl);
        } else {
            setFormData({
                name: '',
                category: Category.MainCourse,
                imageUrl: '',
            });
            setVariants([{ name: 'Standard', price: 0 }]);
            setImagePreview(null);
        }
    }
  }, [item, isOpen]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    const variant = newVariants[index];
    if (field === 'price') {
      variant.price = parseInt(value, 10) || 0;
    } else {
      variant.name = value;
    }
    setVariants(newVariants);
  };
  
  const addVariant = () => {
    setVariants([...variants, { name: '', price: 0 }]);
  };
  
  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    } else {
      alert("An item must have at least one variant.");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalVariants = variants.filter(v => v.name.trim() !== '');
    if (finalVariants.length === 0) {
      alert("Please define at least one valid variant.");
      return;
    }

    const newItemData = { ...formData, variants: finalVariants };
    
    if (item) {
      onSave({ ...item, ...newItemData });
    } else {
      onSave(newItemData);
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
            <input type="text" name="name" id="name" value={formData.name} onChange={handleFormChange} required
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variants (Sizes/Options)</label>
            <div className="mt-2 space-y-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Variant Name (e.g., 1kg)"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    required
                    min="0"
                    className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50" disabled={variants.length <= 1}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              <button type="button" onClick={addVariant} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mt-2">
                + Add Another Variant
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select name="category" id="category" value={formData.category} onChange={handleFormChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
            <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleFormChange} required
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
