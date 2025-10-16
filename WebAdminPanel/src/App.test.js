import { render, screen } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  const { container } = render(<App />);
  // The app should render without errors
  expect(container).toBeInTheDocument();
});
