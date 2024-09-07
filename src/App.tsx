import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppContext } from './services/StoreContext'; // Import the context provider
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminRoute from './Routes/AdminRoute';
import BasicExample from './components/Navbar/Navbar';

function App() {
  return (
    <AppContext>
      <Router>
        <BasicExample />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
          <AdminRoute>
          <Dashboard />
          </AdminRoute>
          } />
        </Routes>
      </Router>
    </AppContext>
  );
}

export default App;
