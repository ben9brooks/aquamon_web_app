import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleDebug } from '../src/App';
import '@testing-library/jest-dom';

describe('ToggleDebug Component', () => {
  it('shows "Debug Off" initially', () => {
    const toggleDebug = jest.fn();
    render(<ToggleDebug isDebug={false} toggleDebug={toggleDebug} />);
    expect(screen.getByText(/Debug Off/i)).toBeInTheDocument();
  });

  it('toggles debug mode text when clicked', () => {
    const toggleDebug = jest.fn();
    render(<ToggleDebug isDebug={false} toggleDebug={toggleDebug} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(toggleDebug).toHaveBeenCalled();
  });
});