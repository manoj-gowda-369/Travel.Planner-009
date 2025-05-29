avascript
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Travel Planner/);
    await expect(page.locator('h1')).toContainText('Discover Your Next Adventure');
  });

  test('should display search functionality', async ({ page }) => {
    const searchBox = page.locator('[data-testid="search-input"]');
    const searchButton = page.locator('[data-testid="search-button"]');
    
    await expect(searchBox).toBeVisible();
    await expect(searchButton).toBeVisible();
    
    // Test search input
    await searchBox.fill('Paris');
    await expect(searchBox).toHaveValue('Paris');
  });

  test('should navigate to search results', async ({ page }) => {
    const searchBox = page.locator('[data-testid="search-input"]');
    const searchButton = page.locator('[data-testid="search-button"]');
    
    await searchBox.fill('Paris');
    await searchButton.click();
    
    await expect(page).toHaveURL(/.*search.*Paris/);
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  });

  test('should display featured destinations', async ({ page }) => {
    const featuredSection = page.locator('[data-testid="featured-destinations"]');
    await expect(featuredSection).toBeVisible();
    
    const destinationCards = page.locator('[data-testid="destination-card"]');
    await expect(destinationCards).toHaveCount(3); // Assuming 3 featured destinations
  });

  test('should have working navigation menu', async ({ page }) => {
    const navMenu = page.locator('[data-testid="main-navigation"]');
    await expect(navMenu).toBeVisible();
    
    // Test navigation links
    await page.locator('nav a[href="/destinations"]').click();
    await expect(page).toHaveURL(/.*destinations/);
    
    await page.goBack();
    await page.locator('nav a[href="/about"]').click();
    await expect(page).toHaveURL(/.*about/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    
    const mobileMenu = page.locator('[data-testid="mobile-menu-button"]');
    await expect(mobileMenu).toBeVisible();
    
    await mobileMenu.click();
    const mobileNav = page.locator('[data-testid="mobile-navigation"]');
    await expect(mobileNav).toBeVisible();
  });
});

