import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CafesPage from './pages/CafesPage';
import EmployeesPage from './pages/EmployeesPage';
import CafeFormPage from './pages/CafeFormPage';
import EmployeeFormPage from './pages/EmployeeFormPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/cafes" />} />
      <Route path="/cafes" element={<CafesPage />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/cafes/new" element={<CafeFormPage />} />
      <Route path="/cafes/edit/:id" element={<CafeFormPage />} />
      <Route path="/employees/new" element={<EmployeeFormPage />} />
      <Route path="/employees/edit/:id" element={<EmployeeFormPage />} />
    </Routes>
  </BrowserRouter>
);
