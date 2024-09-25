import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppContext } from './services/StoreContext'; 
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminRoute from './Routes/AdminRoute';
import BasicExample from './components/Navbar/Navbar';
import Car from './pages/Car/Car';
import Cars from './components/Cars/Cars';
import Calendar from './components/Calendar/Calendar';
import Admin from './components/Admin/Admin';
import Statistical from './components/Statistical/Statistical';

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
          }>
              <Route path='calender' element={<Calendar />} /> 
              <Route path='admin' element={<Admin />} /> 
            <Route index element={<Cars />} /> 
            <Route path="car/:id" element={<Car />} />
            <Route path='statistical' element={<Statistical />} /> 
          </Route>

        </Routes>
      </Router>
    </AppContext>
  );
}

export default App;
