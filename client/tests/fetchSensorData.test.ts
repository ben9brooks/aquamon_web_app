import { fetchSensorData } from '../src/App';

describe('fetchSensorData', () => {
  it('fetches from mock API in debug mode', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve([{ temp: 25, ph: 7, tds: 300 }]),
      })
    ) as jest.Mock;

    const data = await fetchSensorData(true);
    expect(data).toEqual({ temp: 25, ph: 7, tds: 300 });
  });

  it('fetches from real API in non-debug mode', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ temp: 26, ph: 8, tds: 250 }),
      })
    ) as jest.Mock;

    const data = await fetchSensorData(false);
    expect(data).toEqual({ temp: 26, ph: 8, tds: 250 });
  });
});