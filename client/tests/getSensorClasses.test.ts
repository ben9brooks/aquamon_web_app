import { getSensorClasses } from '../src/App';

describe('getSensorClasses', () => {
  it('returns "circle black" for a value of -1', () => {
    expect(getSensorClasses(-1, 50, 80, 40, 90)).toBe('circle black');
  });

  it('returns "circle red" for out-of-range values', () => {
    expect(getSensorClasses(35, 50, 80, 40, 90)).toBe('circle red');
    expect(getSensorClasses(95, 50, 80, 40, 90)).toBe('circle red');
  });

  it('returns "circle yellow" for warning range values', () => {
    expect(getSensorClasses(45, 50, 80, 40, 90)).toBe('circle yellow');
    expect(getSensorClasses(85, 50, 80, 40, 90)).toBe('circle yellow');
  });

  it('returns "circle green" for safe range values', () => {
    expect(getSensorClasses(65, 50, 80, 40, 90)).toBe('circle green');
  });
});