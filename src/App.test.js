import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders title and subtitle', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/時間の色/i);
  const subtitleElement = getByText(/what colour is time/i);
  expect(titleElement).toBeInTheDocument();
  expect(subtitleElement).toBeInTheDocument();
});
