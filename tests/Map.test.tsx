import { render, screen } from '@testing-library/react';
import Map from '@/components/Map';

// Mock the Google Maps Loader
jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    importLibrary: jest.fn().mockResolvedValue({
      Map: jest.fn().mockImplementation(() => ({})),
    }),
  })),
}));

describe('Map', () => {
  it('renders the map container', async () => {
    render(<Map />);
    
    // Wait for the loading state to resolve
    const mapContainer = await screen.findByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });
});
