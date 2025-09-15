

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Table, TableStatus } from '../types';
import { useOrder } from '../contexts/OrderContext';

const statusStyles: Record<TableStatus, string> = {
  [TableStatus.Available]: 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-300',
  [TableStatus.Occupied]: 'bg-blue-100 dark:bg-blue-900/50 border-blue-500 text-blue-800 dark:text-blue-300',
  [TableStatus.NeedsCleaning]: 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-500 text-yellow-800 dark:text-yellow-300',
};

const TableCard: React.FC<{ table: Table; onClick: (table: Table) => void }> = ({ table, onClick }) => (
  <div
    onClick={() => onClick(table)}
    className={`p-4 rounded-lg border-l-4 shadow-md cursor-pointer transition-transform hover:scale-105 ${statusStyles[table.status]}`}
  >
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">{table.name}</h3>
      <span className="text-sm font-semibold px-2 py-1 rounded-full bg-black/10 dark:bg-white/10">{table.status}</span>
    </div>
    <p className="text-sm mt-2">Capacity: {table.capacity}</p>
  </div>
);

const TakeawayCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div
      onClick={onClick}
      className="p-4 rounded-lg border-l-4 shadow-md cursor-pointer transition-transform hover:scale-105 bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 text-indigo-800 dark:text-indigo-300 flex flex-col items-center justify-center text-center h-full"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <h3 className="text-xl font-bold">Takeaway</h3>
        <p className="text-sm mt-1">New Order</p>
    </div>
);


const TableView: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const { setActiveTableId } = useOrder();
  const navigate = useNavigate();
  
  const TAKEAWAY_ID = 999;
  
  useEffect(() => {
    api.fetchTables().then(setTables);
  }, []);
  
  const handleTableClick = (table: Table) => {
    setActiveTableId(table.id);
    navigate('/');
  };

  const handleTakeawayClick = () => {
    setActiveTableId(TAKEAWAY_ID);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Select Order Type</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <TakeawayCard onClick={handleTakeawayClick} />
        {tables.map(table => (
          <TableCard key={table.id} table={table} onClick={handleTableClick} />
        ))}
      </div>
    </div>
  );
};

export default TableView;
