import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../src/App';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../src/AuthContext';
import '@testing-library/jest-dom';

jest.mock('../src/AuthContext', () => ({
  useAuth: () => ({ logout: jest.fn() }),
}));

describe('App Component', () => {
  it('renders background image and title', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/AquaMon Dashboard/i)).toBeInTheDocument();
    const backgroundImage = screen.getByRole('img');
    expect(backgroundImage).toBeInTheDocument();
  });

  it('toggles debug mode', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const toggleText = screen.getByText(/Debug Off/i);
    expect(toggleText).toBeInTheDocument();

    const toggleButton = screen.getByRole('checkbox');
    fireEvent.click(toggleButton);

    expect(screen.getByText(/Debug On/i)).toBeInTheDocument();
  });
});