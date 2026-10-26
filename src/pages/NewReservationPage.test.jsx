import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NewReservationPage from './NewReservationPage';
import { reservationsApi } from '../api/reservations';

vi.mock('../api/reservations', () => ({
  reservationsApi: {
    createReservation: vi.fn(),
    createDeposit: vi.fn(),
    confirmDepositWebhook: vi.fn(),
  },
}));

const mockLocationState = {
  court: {
    id: 1,
    name: 'Cancha de Pádel Cristal',
    surface_type: 'Cristal',
    base_price: 2000.0,
    sport: { id: 2, name: 'Pádel' },
    sports_complex: { id: 1, name: 'Complejo Belgrano', address: 'Juramento 2000' },
  },
  slot: {
    id: 10,
    start_time: '19:00',
    end_time: '20:00',
    duration_in_hours: 1.0,
    pricing: { final_price: 2000.0, multiplier: 1.0 },
  },
  date: '2026-10-30',
};

const renderWithRouter = (initialState = mockLocationState) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/reservations/new', state: initialState }]}>
      <Routes>
        <Route path="/reservations/new" element={<NewReservationPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('NewReservationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el resumen de la reserva con los valores del turno', () => {
    renderWithRouter();

    expect(screen.getByText('Cancha de Pádel Cristal')).toBeInTheDocument();
    expect(screen.getByText(/19:00 a 20:00 hs/i)).toBeInTheDocument();
    expect(screen.getByText('$2.000')).toBeInTheDocument(); // total
    expect(screen.getByText('$600')).toBeInTheDocument(); // seña 30%
  });

  it('permite confirmar la reserva y simular el pago de seña completo', async () => {
    reservationsApi.createReservation.mockResolvedValueOnce({
      id: 99,
      status: 'pending',
      total_price: 2000.0,
    });

    reservationsApi.createDeposit.mockResolvedValueOnce({
      reservation_id: 99,
      deposit_amount: 600.0,
      total_price: 2000.0,
      init_point: 'https://mock.payment',
    });

    reservationsApi.confirmDepositWebhook.mockResolvedValueOnce({
      status: 'ok',
      reservation_id: 99,
    });

    renderWithRouter();

    // Paso 1: Confirmar
    const confirmButton = screen.getByRole('button', { name: /confirmar y proceder al pago de seña/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(reservationsApi.createReservation).toHaveBeenCalledWith({
        court_id: 1,
        reservation_date: '2026-10-30',
        start_time: '2026-10-30 19:00:00',
        end_time: '2026-10-30 20:00:00',
      });
      expect(reservationsApi.createDeposit).toHaveBeenCalledWith(99);
    });

    // Paso 2: Pantalla de Pago
    expect(await screen.findByText('Abonar Seña de Reserva')).toBeInTheDocument();
    expect(screen.getByText('#99')).toBeInTheDocument();

    const payButton = screen.getByRole('button', { name: /simular pago exitoso/i });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(reservationsApi.confirmDepositWebhook).toHaveBeenCalledWith(99);
    });

    // Paso 3: Confirmación
    expect(await screen.findByText('¡Operación Exitosa!')).toBeInTheDocument();
    expect(screen.getByText('Reserva Confirmada')).toBeInTheDocument();
  });
});

