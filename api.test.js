javascript
const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  describe('GET /api/destinations', () => {
    test('should return list of destinations', async () => {
      const response = await request(app)
        .get('/api/destinations')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should filter destinations by search query', async () => {
      const response = await request(app)
        .get('/api/destinations?search=Paris')
        .expect(200);
      
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toContain('Paris');
    });

    test('should filter destinations by price range', async () => {
      const response = await request(app)
        .get('/api/destinations?price_range=budget')
        .expect(200);
      
      response.body.forEach(dest => {
        expect(dest.price_range).toBe('budget');
      });
    });
  });

  describe('POST /api/users/register', () => {
    test('should register new user with valid data', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        age: 25
      };
      
      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined(); // password should not be returned
    });

    test('should reject duplicate email registration', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        age: 25
      };
      
      // First registration
      await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);
      
      // Second registration with same email
      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);
      
      expect(response.body.error).toContain('Email already exists');
    });

    test('should reject invalid user data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123', // too short
        name: '',
        age: 12 // too young
      };
      
      const response = await request(app)
        .post('/api/users/register')
        .send(invalidData)
        .expect(400);
      
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Register test user
      await request(app)
        .post('/api/users/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          age: 25
        });
    });

    test('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    test('should reject incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body.error).toContain('Invalid credentials');
    });

    test('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);
      
      expect(response.body.error).toContain('Invalid credentials');
    });
  });

  describe('POST /api/trips', () => {
    let authToken;
    
    beforeEach(async () => {
      // Register and login to get auth token
      await request(app)
        .post('/api/users/register')
        .send({
          email: 'tripuser@example.com',
          password: 'password123',
          name: 'Trip User',
          age: 25
        });
      
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: 'tripuser@example.com',
          password: 'password123'
        });
      
      authToken = loginResponse.body.token;
    });

    test('should create trip with valid data', async () => {
      const tripData = {
        destinationId: 1,
        startDate: '2024-06-01',
        endDate: '2024-06-07',
        travelers: 2,
        budget: 2000
      };
      
      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${authToken}`)
        .send(tripData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.trip.destinationId).toBe(1);
      expect(response.body.trip.status).toBe('planned');
    });

    test('should reject unauthorized trip creation', async () => {
      const tripData = {
        destinationId: 1,
        startDate: '2024-06-01',
        endDate: '2024-06-07',
        travelers: 2,
        budget: 2000
      };
      
      await request(app)
        .post('/api/trips')
        .send(tripData)
        .expect(401);
    });

    test('should reject invalid trip dates', async () => {
      const tripData = {
        destinationId: 1,
        startDate: '2024-06-07',
        endDate: '2024-06-01', // end before start
        travelers: 2,
        budget: 2000
      };
      
      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${authToken}`)
        .send(tripData)
        .expect(400);
      
      expect(response.body.errors).toBeDefined();
    });
  });
});


