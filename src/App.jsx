import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CourtsPage from './pages/CourtsPage';
import CourtDetailPage from './pages/CourtDetailPage';
import NewReservationPage from './pages/NewReservationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courts" element={<CourtsPage />} />
              <Route path="/courts/:id" element={<CourtDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/reservations/new"
                element={
                  <ProtectedRoute>
                    <NewReservationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reservations"
                element={
                  <ProtectedRoute>
                    <div className="max-w-7xl mx-auto px-4 py-8">
                      <h1 className="text-2xl font-bold">Mis Reservas</h1>
                      <p className="text-gray-500 mt-2">Próximamente disponible en la siguiente fase.</p>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
            <p>Sports Hub © 2026 </p>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

