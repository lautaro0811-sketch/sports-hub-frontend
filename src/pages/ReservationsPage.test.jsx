import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReservationsPage from './ReservationsPage';
import { reservationsApi } from '../api/reservations';

vi.mock('../api/reservations', () => ({
  reservationsApi: {
    getReservations: vi.fn(),
    cancelReservation: vi.fn(),
    confirmDepositWebhook: vi.fn(),
  },
}));

const mockReservations = [
  {
    id: 101,
    reservation_date: '2026-11-05',
    start_time: '2026-11-05T18:00:00.000Z',
    end_time: '2026-11-05T19:00:00.000Z',
    status: 'confirmed',
    payment_status: 'partially_paid',
    total_price: '1500.0',
    deposit_amount: '450.0',
    court: {
      id: 1,
      name: 'Cancha Central Pádel',
      surface_type: 'Cristal',
      sports_complex: {
        name: 'Complejo Palermo',
        address: 'Av. Libertador 1000',
      },
    },
  },
  {
    id: 102,
    reservation_date: '2026-11-06',
    start_time: '2026-11-06T20:00:00.000Z',
    end_time: '2026-11-06T21:00:00.000Z',
    status: 'pending',
    payment_status: 'unpaid',
    total_price: '2000.0',
    deposit_amount: '0.0',
    court: {
      id: 2,
      name: 'Cancha Fútbol 5',
      surface_type: 'Sintético',
      sports_complex: {
        name: 'Complejo Belgrano',
        address: 'Juramento 2000',
      },
    },
  },
];

describe('ReservationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el listado de reservas con sus badges y detalles', async () => {
    reservationsApi.getReservations.mockResolvedValueOnce(mockReservations);

    render(
      <BrowserRouter>
        <ReservationsPage />
      </BrowserRouter>
    );

    expect(await screen.findByText('Reserva #101')).toBeInTheDocument();
    expect(screen.getByText('Cancha Central Pádel')).toBeInTheDocument();
    expect(screen.getByText('Confirmada')).toBeInTheDocument();
    expect(screen.getByText('Seña Abonada (30%)')).toBeInTheDocument();

    expect(screen.getByText('Reserva #102')).toBeInTheDocument();
    expect(screen.getByText('Cancha Fútbol 5')).toBeInTheDocument();
    expect(screen.getByText('Pendiente de Seña')).toBeInTheDocument();
  });

  it('abre el modal y ejecuta la cancelación exitosa de una reserva', async () => {
    reservationsApi.getReservations.mockResolvedValueOnce(mockReservations);
    reservationsApi.cancelReservation.mockResolvedValueOnce({
      message: 'Reserva cancelada exitosamente',
    });
    reservationsApi.getReservations.mockResolvedValueOnce([
      { ...mockReservations[0], status: 'cancelled' },
      mockReservations[1],
    ]);

    render(
      <BrowserRouter>
        <ReservationsPage />
      </BrowserRouter>
    );

    expect(await screen.findByText('Reserva #101')).toBeInTheDocument();

    // Clic en Cancelar Turno de la primera reserva
    const cancelButtons = screen.getAllByRole('button', { name: /cancelar turno/i });
    fireEvent.click(cancelButtons[0]);

    // Modal se abre
    expect(await screen.findByText('¿Cancelar Reserva #101?')).toBeInTheDocument();

    // Confirmar en el modal
    const confirmCancelBtn = screen.getByRole('button', { name: /confirmar cancelación/i });
    fireEvent.click(confirmCancelBtn);

    await waitFor(() => {
      expect(reservationsApi.cancelReservation).toHaveBeenCalledWith(101);
    });

    expect(await screen.findByText(/cancelada exitosamente/i)).toBeInTheDocument();
  });

  it('muestra mensaje informativo cuando el usuario no tiene reservas', async () => {
    reservationsApi.getReservations.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <ReservationsPage />
      </BrowserRouter>
    );

    expect(await screen.findByText(/no se encontraron reservas/i)).toBeInTheDocument();
  });
});

