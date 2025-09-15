
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import POSLayout from './components/POSLayout';
import POSView from './components/POSView';
import DashboardView from './components/DashboardView';
import TableView from './components/TableView';
import { OrderProvider } from './contexts/OrderContext';
import LoginPage from './components/LoginPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <OrderProvider>
      <HashRouter>
        <Routes>
          {isAuthenticated ? (
            <Route path="/" element={<POSLayout onLogout={handleLogout} />}>
              <Route index element={<POSView />} />
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="tables" element={<TableView />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          ) : (
            <>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </HashRouter>
    </OrderProvider>
  );
};

export default App;