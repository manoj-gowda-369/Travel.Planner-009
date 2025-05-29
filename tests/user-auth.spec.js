javascript
const { test, expect } = require('@playwright/test');

test.describe('User Authentication', () => {
  test('should register new user successfully', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.locator('[data-testid="name-input"]').fill('John Doe');
    await page.locator('[data-testid="email-input"]').fill('john.doe@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="age-input"]').fill('25');
    
    // Submit form
    await page.locator('[data-testid="register-button"]').click();
    
    // Check for success message or redirect
    await expect(page).toHaveURL(/.*profile|dashboard/);
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome, John');
  });

  test('should show validation errors for invalid registration', async ({ page }) => {
    await page.goto('/register');
    
    // Fill form with invalid data
    await page.locator('[data-testid="name-input"]').fill('');
    await page.locator('[data-testid="email-input"]').fill('invalid-email');
    await page.locator('[data-testid="password-input"]').fill('123');
    await page.locator('[data-testid="age-input"]').fill('12');
    
    await page.locator('[data-testid="register-button"]').click();
    
    // Check for error messages
    await expect(page.locator('[data-testid="error-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-age"]')).toBeVisible();
  });

  test('should login existing user', async ({ page }) => {
    // First register a user
    await page.goto('/register');
    await page.locator('[data-testid="name-input"]').fill('Test User');
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="age-input"]').fill('25');
    await page.locator('[data-testid="register-button"]').click();
    
    // Logout
    await page.locator('[data-testid="logout-button"]').click();
    
    // Now login
    await page.goto('/login');
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="login-button"]').click();
    
    await expect(page).toHaveURL(/.*profile|dashboard/);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('[data-testid="email-input"]').fill('nonexistent@example.com');
    await page.locator('[data-testid="password-input"]').fill('wrongpassword');
    await page.locator('[data-testid="login-button"]').click();
    
    const errorMessage = page.locator('[data-testid="login-error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid credentials');
  });

  test('should logout user successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.locator('[data-testid="email-input"]').fill('test@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="login-button"]').click();
    
    // Logout
    await page.locator('[data-testid="user-menu"]').click();
    await page.locator('[data-testid="logout-button"]').click();
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="login-link"]')).toBeVisible();
  });

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access protected route without login
    await page.goto('/profile');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });
});
