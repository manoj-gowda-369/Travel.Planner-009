javascript
// Global test setup
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
});

// Cleanup after all tests
afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Setup before each test
beforeEach(async () => {
  // Clear database collections before each test
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Global test utilities
global.testUtils = {
  createTestUser: async () => {
    return {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      age: 25
    };
  },
  
  createTestDestination: () => {
    return {
      id: 1,
      name: 'Test Destination',
      country: 'Test Country',
      price_range: 'moderate',
      rating: 4.5
    };
  }
};

