javascript
const { 
  createTrip, 
  validateTripDates, 
  calculateTripDuration,
  estimateTripCost 
} = require('../src/trip');

describe('Trip Management', () => {
  describe('createTrip', () => {
    test('should create trip with valid data', () => {
      const tripData = {
        userId: 1,
        destinationId: 2,
        startDate: '2024-06-01',
        endDate: '2024-06-07',
        travelers: 2,
        budget: 2000
      };
      
      const trip = createTrip(tripData);
      expect(trip.id).toBeDefined();
      expect(trip.userId).toBe(1);
      expect(trip.status).toBe('planned');
    });

    test('should throw error for invalid trip data', () => {
      const invalidTripData = {
        userId: 1,
        startDate: '2024-06-07',
        endDate: '2024-06-01' // end before start
      };
      
      expect(() => createTrip(invalidTripData)).toThrow();
    });
  });

  describe('validateTripDates', () => {
    test('should validate correct date range', () => {
      const startDate = '2024-06-01';
      const endDate = '2024-06-07';
      
      const result = validateTripDates(startDate, endDate);
      expect(result.isValid).toBe(true);
    });

    test('should reject end date before start date', () => {
      const startDate = '2024-06-07';
      const endDate = '2024-06-01';
      
      const result = validateTripDates(startDate, endDate);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('End date must be after start date');
    });

    test('should reject past dates', () => {
      const startDate = '2023-01-01';
      const endDate = '2023-01-07';
      
      const result = validateTripDates(startDate, endDate);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Trip dates cannot be in the past');
    });

    test('should reject same start and end date', () => {
      const date = '2024-06-01';
      
      const result = validateTripDates(date, date);
      expect(result.isValid).toBe(false);
    });
  });

  describe('calculateTripDuration', () => {
    test('should calculate duration in days', () => {
      const startDate = '2024-06-01';
      const endDate = '2024-06-07';
      
      const duration = calculateTripDuration(startDate, endDate);
      expect(duration).toBe(6); // 6 days
    });

    test('should handle single day trip', () => {
      const startDate = '2024-06-01';
      const endDate = '2024-06-02';
      
      const duration = calculateTripDuration(startDate, endDate);
      expect(duration).toBe(1);
    });
  });

  describe('estimateTripCost', () => {
    test('should estimate cost for budget destination', () => {
      const tripDetails = {
        priceRange: 'budget',
        duration: 5,
        travelers: 2
      };
      
      const cost = estimateTripCost(tripDetails);
      expect(cost).toBe(500); // 50 * 5 * 2
    });

    test('should estimate cost for expensive destination', () => {
      const tripDetails = {
        priceRange: 'expensive',
        duration: 3,
        travelers: 1
      };
      
      const cost = estimateTripCost(tripDetails);
      expect(cost).toBe(600); // 200 * 3 * 1
    });

    test('should apply discount for longer trips', () => {
      const tripDetails = {
        priceRange: 'moderate',
        duration: 14, // 2 weeks
        travelers: 2
      };
      
      const cost = estimateTripCost(tripDetails);
      const expectedBase = 100 * 14 * 2; // 2800
      const expectedWithDiscount = expectedBase * 0.9; // 10% discount
      expect(cost).toBe(expectedWithDiscount);
    });
  });
});

