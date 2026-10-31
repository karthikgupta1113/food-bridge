import { render, screen } from '@testing-library/react';

jest.mock('react-leaflet', () => {
  const React = require('react');
  return {
    MapContainer: ({ children }) => <div>{children}</div>,
    TileLayer: () => null,
    Marker: ({ children }) => <div>{children}</div>,
    Popup: ({ children }) => <div>{children}</div>,
    useMap: () => ({ setView: () => {} }),
  };
});

jest.mock('leaflet', () => ({
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: undefined,
      },
      mergeOptions: jest.fn(),
    },
  },
}));

import App from './App';

test('renders the Food Bridge landing page', () => {
  render(<App />);
  const matches = screen.getAllByText(/Food Bridge/i);
  expect(matches.length).toBeGreaterThan(0);
});
