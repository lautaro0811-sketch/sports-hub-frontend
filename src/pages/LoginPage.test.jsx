import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { authApi } from '../api/auth';

// Mockeamos authApi para simular las respuestas del backend
vi.mock('../api/auth', () => ({
  authApi: {
    login: vi.fn(),
    getMe: vi.fn(),
  },
}));

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('muestra validaciones de campos si se envía el formulario vacío', async () => {
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /ingresar a mi cuenta/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/el correo electrónico es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('inicia sesión correctamente con credenciales válidas', async () => {
    authApi.login.mockResolvedValueOnce({
      token: 'fake-jwt-token',
      user: {
        id: 1,
        name: 'Cliente Prueba',
        email: 'cliente@sportshub.com',
        role: 'client',
      },
    });

    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'cliente@sportshub.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });

    const submitButton = screen.getByRole('button', { name: /ingresar a mi cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('cliente@sportshub.com', 'password123');
    });

    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
  });

  it('muestra mensaje de error cuando la API rechaza las credenciales', async () => {
    authApi.login.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { error: 'Credenciales inválidas' },
      },
    });

    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'cliente@sportshub.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password-erroneo' },
    });

    const submitButton = screen.getByRole('button', { name: /ingresar a mi cuenta/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });
});

