javascript
const { test, expect } = require('@playwright/test');

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform search and display results', async ({ page }) => {
    const searchBox = page.locator('[data-testid="search-input"]');
    const searchButton = page.locator('[data-testid="search-button"]');
    
    await searchBox.fill('Paris');
    await searchButton.click();
    
    await expect(page).toHaveURL(/.*search.*Paris/);
    
    // Wait for results to load
    await page.waitForSelector('[data-testid="search-results"]');
    
    const results = page.locator('[data-testid="destination-card"]');
    await expect(results.first()).toBeVisible();
    
    const firstResult = results.first();
    await expect(firstResult).toContainText('Paris');
  });

  test('should handle no search results', async ({ page }) => {
    const searchBox = page.locator('[data-testid="search-input"]');
    const searchButton = page.locator('[data-testid="search-button"]');
    
    await searchBox.fill('Antarctica123NotFound');
    await searchButton.click();
    
    await page.waitForSelector('[data-testid="no-results-message"]');
    const noResultsMessage = page.locator('[data-testid="no-results-message"]');
    await expect(noResultsMessage).toBeVisible();
    await expect(noResultsMessage).toContainText('No destinations found');
  });

  test('should filter search results by price range', async ({ page }) => {
    await page.goto('/search?q=destination');
    
    // Wait for initial results
    await page.waitForSelector('[data-testid="search-results"]');
    
    const budgetFilter = page.locator('[data-testid="filter-budget"]');
    await budgetFilter.check();
    
    // Wait for filtered results
    await page.waitForTimeout(1000);
    
    const results = page.locator('[data-testid="destination-card"]');
    const count = await results.count();
    
    for (let i = 0; i < count; i++) {
      const card = results.nth(i);
      await expect(card).toContainText('Budget');
    }
  });

  test('should sort search results by rating', async ({ page }) => {
    await page.goto('/search?q=destination');
    
    await page.waitForSelector('[data-testid="search-results"]');
    
    const sortDropdown = page.locator('[data-testid="sort-dropdown"]');
    await sortDropdown.selectOption('rating-desc');
    
    await page.waitForTimeout(1000);
    
    const ratingElements = page.locator('[data-testid="destination-rating"]');
    const firstRating = await ratingElements.first().textContent();
    const lastRating = await ratingElements.last().textContent();
    
    const firstScore = parseFloat(firstRating.match(/[\d.]+/)[0]);
    const lastScore = parseFloat(lastRating.match(/[\d.]+/)[0]);
    
    expect(firstScore).toBeGreaterThanOrEqual(lastScore);
  });

  test('should allow clearing search filters', async ({ page }) => {
    await page.goto('/search?q=destination');
    
    await page.waitForSelector('[data-testid="search-results"]');
    
    // Apply some filters
    await page.locator('[data-testid="filter-budget"]').check();
    await page.locator('[data-testid="filter-moderate"]').check();
    
    const initialCount = await page.locator('[data-testid="destination-card"]').count();
    
    // Clear filters
    const clearButton = page.locator('[data-testid="clear-filters"]');
    await clearButton.click();
    
    await page.waitForTimeout(1000);
    
    const finalCount = await page.locator('[data-testid="destination-card"]').count();
    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
  });
});

