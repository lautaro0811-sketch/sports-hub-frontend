import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourtsPage from './CourtsPage';
import { courtsApi } from '../api/courts';
import { complexesApi } from '../api/complexes';

vi.mock('../api/courts', () => ({
  courtsApi: {
    getSports: vi.fn(),
    getCourts: vi.fn(),
  },
}));

vi.mock('../api/complexes', () => ({
  complexesApi: {
    getComplexes: vi.fn(),
    getComplex: vi.fn(),
  },
}));

describe('CourtsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    complexesApi.getComplexes.mockResolvedValue([
      { id: 1, name: 'Complejo Palermo', address: 'Av. Libertador 1000', city: 'CABA', total_courts: 2 },
      { id: 2, name: 'Polideportivo Norte', address: 'Camino 505', city: 'Gonnet', total_courts: 1 },
    ]);
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
    expect(screen.getAllByText(/Complejo Palermo/i).length).toBeGreaterThanOrEqual(1);
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

  it('filtra canchas reactivamente mediante el buscador de texto', async () => {
    courtsApi.getSports.mockResolvedValueOnce([]);
    courtsApi.getCourts.mockResolvedValueOnce({
      date: '2026-10-26',
      courts: [
        {
          id: 1,
          name: 'Cancha Rápida de Tenis',
          surface_type: 'Cemento',
          sport: { id: 1, name: 'Tenis' },
          sports_complex: { id: 1, name: 'Club Tenis', address: 'Calle 10', city: 'La Plata' },
          time_slots: [],
        },
        {
          id: 2,
          name: 'Cancha Sintética Pádel',
          surface_type: 'Blindex',
          sport: { id: 2, name: 'Pádel' },
          sports_complex: { id: 1, name: 'Club Tenis', address: 'Calle 10', city: 'La Plata' },
          time_slots: [],
        },
      ],
    });

    render(
      <BrowserRouter>
        <CourtsPage />
      </BrowserRouter>
    );

    expect(await screen.findByText('Cancha Rápida de Tenis')).toBeInTheDocument();
    expect(screen.getByText('Cancha Sintética Pádel')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/buscar por nombre, complejo/i);
    fireEvent.change(searchInput, { target: { value: 'Pádel' } });

    expect(screen.queryByText('Cancha Rápida de Tenis')).not.toBeInTheDocument();
    expect(screen.getByText('Cancha Sintética Pádel')).toBeInTheDocument();
  });

  it('permite filtrar por complejo seleccionado y muestra el banner correspondiente', async () => {
    courtsApi.getSports.mockResolvedValueOnce([]);
    courtsApi.getCourts.mockResolvedValue({
      date: '2026-10-26',
      courts: [],
    });

    render(
      <BrowserRouter>
        <CourtsPage externalComplexId={1} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Filtrando por complejo/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Complejo Palermo/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});
