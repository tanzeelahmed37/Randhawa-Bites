import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MenuItem, OrderItem, Category } from '../types';
// FIX: Changed to a named import to match the export from PaymentModal.tsx
import { PaymentModal } from './PaymentModal';
import { useOrder } from '../contexts/OrderContext';
import MenuEditModal from './MenuEditModal';

const TAKEAWAY_ID = 999;

const MenuItemCard: React.FC<{
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (itemId: number) => void;
  isEditMode: boolean;
}> = ({ item, onAdd, onEdit, onDelete, isEditMode }) => (
  <div
    onClick={() => !isEditMode && onAdd(item)}
    className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group ${isEditMode ? 'cursor-default' : 'cursor-pointer'}`}
  >
     {isEditMode && (
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(item); }}
          className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          aria-label={`Edit ${item.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
          aria-label={`Delete ${item.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    )}
    <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" crossOrigin="anonymous" />
    <div className="p-4 flex-grow flex flex-col justify-between">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</h3>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Rs {item.price.toFixed(0)}</p>
    </div>
  </div>
);

const OrderPanel: React.FC<{
  orderItems: OrderItem[];
  onQuantityChange: (itemId: number, newQuantity: number) => void;
  onRemove: (itemId: number) => void;
  onPay: () => void;
  subtotal: number;
  tax: number;
  total: number;
  activeTableId: number | null;
  onSelectTable: () => void;
}> = ({ orderItems, onQuantityChange, onRemove, onPay, subtotal, tax, total, activeTableId, onSelectTable }) => (
  <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col p-6 h-full">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {activeTableId === TAKEAWAY_ID ? 'Takeaway Order' : activeTableId ? `Table ${activeTableId}` : 'Current Order'}
      </h2>
      <button onClick={onSelectTable} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
        {activeTableId ? 'Change' : 'Select Table'}
      </button>
    </div>

    <div className="flex-grow overflow-y-auto -mr-3 pr-3">
      {!activeTableId ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-center">Please select a table or takeaway to start an order.</p>
        </div>
      ) : orderItems.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No items in order</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {orderItems.map(item => (
            <li key={item.id} className="flex items-center space-x-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" crossOrigin="anonymous"/>
              <div className="flex-grow">
                <p className="font-semibold text-gray-700 dark:text-gray-300">{item.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rs {item.price.toFixed(0)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => onQuantityChange(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onQuantityChange(item.id, item.quantity + 1)} className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">+</button>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.ww3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
      <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>Rs {subtotal.toFixed(0)}</span></div>
      <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Tax (10%)</span><span>Rs {tax.toFixed(0)}</span></div>
      <div className="flex justify-between font-bold text-xl text-gray-800 dark:text-gray-100"><span>Total</span><span>Rs {total.toFixed(0)}</span></div>
    </div>
    <button
      onClick={onPay}
      disabled={orderItems.length === 0 || !activeTableId}
      className="w-full mt-6 bg-indigo-600 text-white font-bold py-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
    >
      Proceed to Payment
    </button>
  </div>
);

const POSView: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filteredMenu, setFilteredMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isMenuModalOpen, setMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  
  const navigate = useNavigate();
  const { 
    activeTableId,
    addItemToOrder,
    updateItemQuantity,
    removeItemFromOrder,
    completeActiveOrder,
    getActiveOrderItems
  } = useOrder();
  
  const orderItems = getActiveOrderItems();

  const fetchMenuData = useCallback(() => {
    api.fetchMenu().then(data => {
      setMenu(data);
      const uniqueCategories = [...new Set(data.map(item => item.category))] as Category[];
      setCategories(uniqueCategories);
    });
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);


  useEffect(() => {
    let items = menu;

    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }

    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMenu(items);
  }, [menu, activeCategory, searchTerm]);


  const handleAddItem = (itemToAdd: MenuItem) => {
    if (isEditMode) return;
    if (!activeTableId) {
        alert("Please select a table or 'Takeaway' from the 'Tables' view first.");
        navigate('/tables');
        return;
    }
    addItemToOrder(itemToAdd);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingMenuItem(null);
    setMenuModalOpen(true);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      await api.deleteMenuItem(itemId);
      fetchMenuData(); // Refetch menu to reflect deletion
    }
  };

  const handleSaveMenuItem = async (itemData: MenuItem | Omit<MenuItem, 'id'>) => {
    if ('id' in itemData) {
      await api.updateMenuItem(itemData as MenuItem);
    } else {
      await api.addMenuItem(itemData);
    }
    setMenuModalOpen(false);
    fetchMenuData(); // Refetch menu to reflect changes
  };


  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [orderItems]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-3rem)]">
      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="flex-shrink-0 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Menu</h1>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isEditMode
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isEditMode ? 'Exit Edit Mode' : 'Manage Menu'}
              </button>
            </div>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
                <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === 'All' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>All</button>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>{cat}</button>
                ))}
            </div>
        </div>
        <div className="relative flex-grow overflow-y-auto -mr-3 pr-3">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.map(item => <MenuItemCard key={item.id} item={item} onAdd={handleAddItem} onEdit={handleOpenEditModal} onDelete={handleDeleteItem} isEditMode={isEditMode} />)}
          </div>
          {isEditMode && (
            <button
                onClick={handleOpenAddModal}
                title="Add New Item"
                className="fixed bottom-10 right-10 lg:right-[35%] w-16 h-16 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-label="Add New Menu Item"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </button>
          )}
        </div>
      </div>
      <OrderPanel 
        orderItems={orderItems} 
        onQuantityChange={updateItemQuantity}
        onRemove={removeItemFromOrder}
        onPay={() => setPaymentModalOpen(true)}
        subtotal={subtotal}
        tax={tax}
        total={total}
        activeTableId={activeTableId}
        onSelectTable={() => navigate('/tables')}
      />
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderItems={orderItems}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onPaymentSuccess={completeActiveOrder}
      />
      <MenuEditModal
        isOpen={isMenuModalOpen}
        onClose={() => setMenuModalOpen(false)}
        onSave={handleSaveMenuItem}
        item={editingMenuItem}
      />
    </div>
  );
};

export default POSView;