import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourtsPage from './CourtsPage';
import { courtsApi } from '../api/courts';

vi.mock('../api/courts', () => ({
  courtsApi: {
    getSports: vi.fn(),
    getCourts: vi.fn(),
  },
}));

describe('CourtsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la lista de canchas obtenida desde la API', async () => {
    courtsApi.getSports.mockResolvedValueOnce([
      { id: 1, name: 'Fútbol', courts_count: 2 },
      { id: 2, name: 'Pádel', courts_count: 1 },
    ]);

    courtsApi.getCourts.mockResolvedValueOnce({
      date: '2026-10-26',
      courts: [
        {
          id: 1,
          name: 'Cancha Central de Fútbol',
          surface_type: 'Césped Sintético',
          base_price: 1500.0,
          sport: { id: 1, name: 'Fútbol' },
          sports_complex: { id: 1, name: 'Complejo Palermo', address: 'Av. Libertador 1000', city: 'CABA' },
          time_slots: [{ id: 10, start_time: '18:00', end_time: '19:00', available: true }],
        },
      ],
    });

    render(
      <BrowserRouter>
        <CourtsPage />
      </BrowserRouter>
    );

    expect(await screen.findByText('Cancha Central de Fútbol')).toBeInTheDocument();
    expect(screen.getByText(/Complejo Palermo/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1\.500/i)).toBeInTheDocument();
    expect(screen.getByText(/1 turno libre/i)).toBeInTheDocument();
  });

  it('muestra mensaje informativo cuando no hay canchas disponibles', async () => {
    courtsApi.getSports.mockResolvedValueOnce([]);
    courtsApi.getCourts.mockResolvedValueOnce({ date: '2026-10-26', courts: [] });

    render(
      <BrowserRouter>
        <CourtsPage />
      </BrowserRouter>
    );

    expect(
      await screen.findByText(/no se encontraron canchas disponibles/i)
    ).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando la API falla', async () => {
    courtsApi.getSports.mockResolvedValueOnce([]);
    courtsApi.getCourts.mockRejectedValueOnce({
      response: { data: { error: 'Error del servidor al buscar canchas' } },
    });

    render(
      <BrowserRouter>
        <CourtsPage />
      </BrowserRouter>
    );

    expect(
      await screen.findByText('Error del servidor al buscar canchas')
    ).toBeInTheDocument();
  });
});
