import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ComplexCard from './ComplexCard';

describe('ComplexCard', () => {
  const mockComplex = {
    id: 11,
    name: 'Complejo Deportivo Central',
    address: 'Calle 12 y 60',
    city: 'La Plata',
    cover_photo_url: null,
    total_courts: 5,
  };

  it('renderiza la información del complejo correctamente', () => {
    render(<ComplexCard complex={mockComplex} isSelected={false} onSelect={() => {}} />);

    expect(screen.getByText('Complejo Deportivo Central')).toBeInTheDocument();
    expect(screen.getByText('Calle 12 y 60')).toBeInTheDocument();
    expect(screen.getByText('La Plata')).toBeInTheDocument();
    expect(screen.getByText('5 canchas')).toBeInTheDocument();
    expect(screen.getByText('Ver canchas')).toBeInTheDocument();
  });

  it('indica visualmente cuando el complejo está seleccionado', () => {
    render(<ComplexCard complex={mockComplex} isSelected={true} onSelect={() => {}} />);

    expect(screen.getByText('Complejo seleccionado')).toBeInTheDocument();
  });

  it('ejecuta la función onSelect con el id del complejo al hacer clic', () => {
    const handleSelect = vi.fn();
    render(<ComplexCard complex={mockComplex} isSelected={false} onSelect={handleSelect} />);

    fireEvent.click(screen.getByText('Complejo Deportivo Central'));
    expect(handleSelect).toHaveBeenCalledWith(11);
  });
});
