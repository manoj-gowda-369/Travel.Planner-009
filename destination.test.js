javascript
const { 
  searchDestinations, 
  filterByPriceRange, 
  sortByRating,
  calculateDistance 
} = require('../src/destination');

describe('Destination Management', () => {
  const mockDestinations = [
    {
      id: 1,
      name: 'Paris',
      country: 'France',
      price_range: 'expensive',
      rating: 4.8,
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    {
      id: 2,
      name: 'Bali',
      country: 'Indonesia',
      price_range: 'moderate',
      rating: 4.7,
      coordinates: { lat: -8.3405, lng: 115.0920 }
    },
    {
      id: 3,
      name: 'Bangkok',
      country: 'Thailand',
      price_range: 'budget',
      rating: 4.5,
      coordinates: { lat: 13.7563, lng: 100.5018 }
    }
  ];

  describe('searchDestinations', () => {
    test('should find destinations by name', () => {
      const results = searchDestinations(mockDestinations, 'Paris');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Paris');
    });

    test('should find destinations by country', () => {
      const results = searchDestinations(mockDestinations, 'Indonesia');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Bali');
    });

    test('should be case insensitive', () => {
      const results = searchDestinations(mockDestinations, 'THAILAND');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Bangkok');
    });

    test('should return empty array for no matches', () => {
      const results = searchDestinations(mockDestinations, 'Antarctica');
      expect(results).toHaveLength(0);
    });

    test('should handle empty search term', () => {
      const results = searchDestinations(mockDestinations, '');
      expect(results).toHaveLength(3);
    });
  });

  describe('filterByPriceRange', () => {
    test('should filter by budget price range', () => {
      const results = filterByPriceRange(mockDestinations, 'budget');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Bangkok');
    });

    test('should filter by multiple price ranges', () => {
      const results = filterByPriceRange(mockDestinations, ['budget', 'moderate']);
      expect(results).toHaveLength(2);
    });

    test('should return empty array for non-existent price range', () => {
      const results = filterByPriceRange(mockDestinations, 'luxury');
      expect(results).toHaveLength(0);
    });
  });

  describe('sortByRating', () => {
    test('should sort destinations by rating (descending)', () => {
      const sorted = sortByRating([...mockDestinations], 'desc');
      expect(sorted[0].rating).toBe(4.8);
      expect(sorted[1].rating).toBe(4.7);
      expect(sorted[2].rating).toBe(4.5);
    });

    test('should sort destinations by rating (ascending)', () => {
      const sorted = sortByRating([...mockDestinations], 'asc');
      expect(sorted[0].rating).toBe(4.5);
      expect(sorted[1].rating).toBe(4.7);
      expect(sorted[2].rating).toBe(4.8);
    });
  });

  describe('calculateDistance', () => {
    test('should calculate distance between two coordinates', () => {
      const paris = { lat: 48.8566, lng: 2.3522 };
      const london = { lat: 51.5074, lng: -0.1278 };
      
      const distance = calculateDistance(paris, london);
      expect(distance).toBeGreaterThan(300); // roughly 344 km
      expect(distance).toBeLessThan(400);
    });

    test('should return 0 for same coordinates', () => {
      const coord = { lat: 48.8566, lng: 2.3522 };
      const distance = calculateDistance(coord, coord);
      expect(distance).toBe(0);
    });
  });
});


