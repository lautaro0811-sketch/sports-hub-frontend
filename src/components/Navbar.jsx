import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, CalendarDays, User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Nombre */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-emerald-600 text-white p-2 rounded-xl group-hover:bg-emerald-700 transition">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-gray-900 tracking-tight leading-tight">
                Sports<span className="text-emerald-600">Hub</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                Reserva de Canchas
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition py-1 border-b-2 ${
                isActive('/')
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Explorar Canchas
            </Link>

            {isAuthenticated && (
              <Link
                to="/reservations"
                className={`text-sm font-semibold flex items-center gap-1.5 transition py-1 border-b-2 ${
                  isActive('/reservations')
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Mis Reservas
              </Link>
            )}
          </nav>

          {/* Acciones de usuario Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 py-1.5 px-3 rounded-full text-xs font-medium text-gray-700">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user?.name}</span>
                  {user?.role === 'admin' && (
                    <span className="bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 py-1.5 px-3 rounded-lg transition"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-lg transition"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón Menú Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Mobile desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 pt-3 pb-4 space-y-2 bg-white">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gray-800 py-2 hover:text-emerald-600"
          >
            Explorar Canchas
          </Link>
          {isAuthenticated && (
            <Link
              to="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-gray-800 py-2 hover:text-emerald-600"
            >
              Mis Reservas
            </Link>
          )}

          <div className="pt-3 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="text-xs text-gray-500">
                  Conectado como <strong className="text-gray-800">{user?.name}</strong>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 border border-red-200 py-2 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold text-gray-700 border border-gray-200 py-2 rounded-lg"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold text-white bg-emerald-600 py-2 rounded-lg"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
