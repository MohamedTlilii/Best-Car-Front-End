import React from 'react'
import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminRoute from './Routes/AdminRoute';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <AdminRoute>
          <Dashboard />
          </AdminRoute>
          } />
      </Routes>
    </Router>
  )
}

export default App