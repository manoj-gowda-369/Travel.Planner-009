javascript
const { test, expect } = require('@playwright/test');

test.describe('Performance Tests', () => {
  test('should load homepage within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for main content to load
    await page.waitForSelector('[data-testid="main-content"]');
    const endTime = Date.now();
    
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds max
  });

  test('should handle search results pagination efficiently', async ({ page }) => {
    await page.goto('/search?q=destination');
    
    // Wait for initial results
    await page.waitForSelector('[data-testid="search-results"]');
    
    const startTime = Date.now();
    
    // Click next page
    await page.locator('[data-testid="next-page-button"]').click();
    await page.waitForSelector('[data-testid="search-results"]');
    
    const endTime = Date.now();
    const paginationTime = endTime - startTime;
    
    expect(paginationTime).toBeLessThan(2000); // 2 seconds max for pagination
  });

  test('should optimize image loading', async ({ page }) => {
    await page.goto('/destinations/1');
    
    // Check that images have proper loading attributes
    const images = page.locator('img[data-testid="destination-image"]');
    const firstImage = images.first();
    
    const loading = await firstImage.getAttribute('loading');
    expect(loading).toBe('lazy');
    
    // Check that images load within reasonable time
    await expect(firstImage).toBeVisible({ timeout: 5000 });
  });

  test('should handle concurrent user actions', async ({ browser }) => {
    // Create multiple pages to simulate concurrent users
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Simulate concurrent searches
    const [response1, response2] = await Promise.all([
      page1.goto('/search?q=Paris'),
      page2.goto('/search?q=Tokyo')
    ]);
    
    expect(response1.status()).toBe(200);
    expect(response2.status()).toBe(200);
    
    await context1.close();
    await context2.close();
  });
});


