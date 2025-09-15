import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MenuItem, OrderItem, Category } from '../types';
// FIX: Changed to a named import to match the export from PaymentModal.tsx
import { PaymentModal } from './PaymentModal';
import { useOrder } from '../contexts/OrderContext';

const TAKEAWAY_ID = 999;

const MenuItemCard: React.FC<{ item: MenuItem; onAdd: (item: MenuItem) => void }> = ({ item, onAdd }) => (
  <div
    onClick={() => onAdd(item)}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col"
  >
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

  useEffect(() => {
    api.fetchMenu().then(data => {
      setMenu(data);
      const uniqueCategories = [...new Set(data.map(item => item.category))] as Category[];
      setCategories(uniqueCategories);
    });
  }, []);

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
    if (!activeTableId) {
        alert("Please select a table or 'Takeaway' from the 'Tables' view first.");
        navigate('/tables');
        return;
    }
    addItemToOrder(itemToAdd);
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Menu</h1>
            
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
        <div className="flex-grow overflow-y-auto -mr-3 pr-3">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.map(item => <MenuItemCard key={item.id} item={item} onAdd={handleAddItem} />)}
          </div>
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
    </div>
  );
};

export default POSView;
