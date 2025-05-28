
javascript
const { validateUserRegistration, hashPassword, verifyPassword } = require('../src/user');

describe('User Management', () => {
  describe('validateUserRegistration', () => {
    test('should validate correct user data', () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        age: 25
      };
      
      const result = validateUserRegistration(userData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject invalid email', () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'John Doe',
        age: 25
      };
      
      const result = validateUserRegistration(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    test('should reject weak password', () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
        name: 'John Doe',
        age: 25
      };
      
      const result = validateUserRegistration(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });

    test('should reject underage user', () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        age: 12
      };
      
      const result = validateUserRegistration(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('User must be at least 13 years old');
    });

    test('should reject missing required fields', () => {
      const userData = {
        email: 'test@example.com'
        // missing password, name, age
      };
      
      const result = validateUserRegistration(userData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Password Management', () => {
    test('should hash password correctly', async () => {
      const password = 'mySecretPassword';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(20);
    });

    test('should verify correct password', async () => {
      const password = 'mySecretPassword';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    test('should reject incorrect password', async () => {
      const password = 'mySecretPassword';
      const wrongPassword = 'wrongPassword';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });
});

