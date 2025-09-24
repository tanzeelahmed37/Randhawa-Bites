

import React, { useState } from 'react';
import { OrderItem } from '../types';
import { api } from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  onPaymentSuccess: () => void;
}

// FIX: Changed to a named export to resolve module resolution issues.
export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, orderItems, subtotal, tax, total, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [cashReceived, setCashReceived] = useState<number | string>('');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const changeDue = React.useMemo(() => {
    if (paymentMethod === 'cash' && typeof cashReceived === 'number' && cashReceived >= total) {
      return cashReceived - total;
    }
    return 0;
  }, [cashReceived, total, paymentMethod]);

  const handleProcessPayment = async () => {
    setProcessing(true);
    // Simulate API call
    const result = await api.submitOrder({ items: orderItems, total, paymentMethod });
    if (result.success) {
      setProcessing(false);
      setPaymentSuccess(true);
    } else {
      setProcessing(false);
      alert('Payment failed. Please try again.');
    }
  };

  const resetAndClose = () => {
    onPaymentSuccess();
    setPaymentSuccess(false);
    setCashReceived('');
    setPaymentMethod('card');
    onClose();
  };

  const handlePrintReceipt = () => {
    let receiptContent = `
        RANDHAWA Bites Receipt
----------------------------------------
Date: ${new Date().toLocaleString()}

Order Details:
----------------------------------------
`;

    orderItems.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(0);
        const itemName = `${item.quantity} x ${item.name}`.padEnd(28, ' ');
        receiptContent += `${itemName} Rs ${itemTotal.padStart(7, ' ')}\n`;
    });
    
    receiptContent += `
----------------------------------------
Subtotal:                Rs ${subtotal.toFixed(0).padStart(7, ' ')}
Tax (10%):               Rs ${tax.toFixed(0).padStart(7, ' ')}
----------------------------------------
Total:                   Rs ${total.toFixed(0).padStart(7, ' ')}
----------------------------------------

      Thank you for your visit!
`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Receipt</title>
                    <style>
                        body { 
                            font-family: 'Courier New', Courier, monospace; 
                            font-size: 12px; 
                            margin: 20px; 
                        }
                        pre { 
                            white-space: pre-wrap; 
                            word-wrap: break-word; 
                            margin: 0;
                        }
                    </style>
                </head>
                <body>
                    <pre>${receiptContent.trim()}</pre>
                    <script>
                        window.onload = function() {
                            window.focus();
                            window.print();
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    } else {
        alert('Could not open print window. Please disable your pop-up blocker and try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-8 m-4">
        {!paymentSuccess ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment</h2>
            <div className="text-4xl font-extrabold text-center text-indigo-600 dark:text-indigo-400 mb-6">
              Rs {total.toFixed(0)}
            </div>
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`px-6 py-3 rounded-lg font-semibold w-full ${paymentMethod === 'card' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                Card
              </button>
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`px-6 py-3 rounded-lg font-semibold w-full ${paymentMethod === 'cash' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
              >
                Cash
              </button>
            </div>
            
            {paymentMethod === 'cash' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cash Received</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                {changeDue > 0 && <p className="mt-2 text-lg text-green-600 dark:text-green-400 font-semibold">Change Due: Rs {changeDue.toFixed(0)}</p>}
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
              <button 
                onClick={handleProcessPayment} 
                disabled={processing || (paymentMethod === 'cash' && (typeof cashReceived !== 'number' || cashReceived < total))}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-green-300 dark:disabled:bg-green-800"
              >
                {processing ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Successful!</h3>
            {changeDue > 0 && <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">Change Due: <span className="font-bold">Rs {changeDue.toFixed(0)}</span></p>}
            <div className="mt-6 flex flex-col sm:flex-row-reverse gap-4">
                <button onClick={resetAndClose} className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700">
                    New Order
                </button>
                <button onClick={handlePrintReceipt} className="w-full px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-500">
                    Print Receipt
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};