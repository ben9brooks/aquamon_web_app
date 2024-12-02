import { render, screen, waitFor } from '@testing-library/react';
import { Sensors } from '../src/App';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock useAuth if it's used in the Sensors component
jest.mock('../src/AuthContext', () => ({
  useAuth: () => ({
    logout: jest.fn(), // Mock logout function if needed
  }),
}));

// Mocking global fetch to simulate a failure or empty data return
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 500, // Simulating a failed response (non-2xx status)
    ok: false,   // Indicate the fetch was unsuccessful
    statusText: 'Internal Server Error',
    json: () => Promise.resolve([]), // Mock empty data response
    text: () => Promise.resolve(''), // Mock text response
    headers: new Headers(), // Mock headers
    redirected: false,      // Mock redirected property
  }) as any
);  // Type assertion to bypass TypeScript error

describe('Sensors Component', () => {
  it('renders sensor titles when data is fetched successfully', async () => {
    // Mocking a successful fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve([
          { temp: 75, ph: 7.0, tds: 50 } // Mock valid data
        ]),
      }) as any
    );

    render(
      <MemoryRouter>
        <Sensors isDebug={true} />
      </MemoryRouter>
    );

    // Verify if sensor titles are displayed when data is fetched successfully
    expect(await screen.findByText(/Temperature/i)).toBeInTheDocument();
    expect(await screen.findByText(/pH/i)).toBeInTheDocument();
    expect(await screen.findByText(/TDS/i)).toBeInTheDocument();
  });

  it('displays "Cannot fetch sensor data..." when no data is available', async () => {
    render(
      <MemoryRouter>
        <Sensors isDebug={false} />
      </MemoryRouter>
    );

    // Wait for the message to appear after the fetch failure
    await waitFor(() =>
      expect(screen.getByText(/Cannot fetch sensor data.../i)).toBeInTheDocument()
    );
  });
});