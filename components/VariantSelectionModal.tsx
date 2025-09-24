
import React from 'react';
import { MenuItem, Variant } from '../types';

interface VariantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onSelectVariant: (variant: Variant) => void;
}

const VariantSelectionModal: React.FC<VariantSelectionModalProps> = ({ isOpen, onClose, item, onSelectVariant }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="variant-modal-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 id="variant-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
            Select option for {item.name}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="space-y-3">
          {item.variants.map((variant) => (
            <button
              key={variant.name}
              onClick={() => onSelectVariant(variant)}
              className="w-full flex justify-between items-center text-left p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <span className="font-semibold text-gray-800 dark:text-gray-200">{variant.name}</span>
              <span className="text-gray-600 dark:text-gray-300">Rs {variant.price.toFixed(0)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VariantSelectionModal;
