javascript
const { test, expect } = require('@playwright/test');

test.describe('Trip Planning', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Register and login user
    await page.goto('/register');
    await page.locator('[data-testid="name-input"]').fill('Trip Planner');
    await page.locator('[data-testid="email-input"]').fill('planner@example.com');
    await page.locator('[data-testid="password-input"]').fill('password123');
    await page.locator('[data-testid="age-input"]').fill('30');
    await page.locator('[data-testid="register-button"]').click();
  });

  test('should create new trip successfully', async ({ page }) => {
    // Navigate to destination and start planning
    await page.goto('/destinations/1'); // Assuming destination with ID 1 exists
    
    await page.locator('[data-testid="plan-trip-button"]').click();
    
    // Fill trip planning form
    await page.locator('[data-testid="start-date-input"]').fill('2024-06-01');
    await page.locator('[data-testid="end-date-input"]').fill('2024-06-07');
    await page.locator('[data-testid="travelers-input"]').fill('2');
    await page.locator('[data-testid="budget-input"]').fill('2000');
    
    await page.locator('[data-testid="create-trip-button"]').click();
    
    // Verify trip creation
    await expect(page).toHaveURL(/.*trips\/\d+/);
    await expect(page.locator('[data-testid="trip-details"]')).toBeVisible();
    await expect(page.locator('[data-testid="trip-status"]')).toContainText('Planned');
  });

  test('should validate trip dates', async ({ page }) => {
    await page.goto('/destinations/1');
    await page.locator('[data-testid="plan-trip-button"]').click();
    
    // Set end date before start date
    await page.locator('[data-testid="start-date-input"]').fill('2024-06-07');
    await page.locator('[data-testid="end-date-input"]').fill('2024-06-01');
    await page.locator('[data-testid="travelers-input"]').fill('2');
    
    await page.locator('[data-testid="create-trip-button"]').click();
    
    const errorMessage = page.locator('[data-testid="date-error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('End date must be after start date');
  });

  test('should display cost estimate', async ({ page }) => {
    await page.goto('/destinations/1');
    await page.locator('[data-testid="plan-trip-button"]').click();
    
    await page.locator('[data-testid="start-date-input"]').fill('2024-06-01');
    await page.locator('[data-testid="end-date-input"]').fill('2024-06-07');
    await page.locator('[data-testid="travelers-input"]').fill('2');
    
    // Cost estimate should update
    const costEstimate = page.locator('[data-testid="cost-estimate"]');
    await expect(costEstimate).toBeVisible();
    await expect(costEstimate).toContainText(');
  });

  test('should add activities to trip', async ({ page }) => {
    // Create a trip first
    await page.goto('/destinations/1');
    await page.locator('[data-testid="plan-trip-button"]').click();
    
    await page.locator('[data-testid="start-date-input"]').fill('2024-06-01');
    await page.locator('[data-testid="end-date-input"]').fill('2024-06-07');
    await page.locator('[data-testid="travelers-input"]').fill('2');
    await page.locator('[data-testid="create-trip-button"]').click();
    
    // Add activities
    await page.locator('[data-testid="add-activity-button"]').click();
    
    const activityModal = page.locator('[data-testid="activity-modal"]');
    await expect(activityModal).toBeVisible();
    
    await page.locator('[data-testid="activity-name"]').fill('Visit Eiffel Tower');
    await page.locator('[data-testid="activity-date"]').fill('2024-06-02');
    await page.locator('[data-testid="activity-time"]').fill('10:00');
    
    await page.locator('[data-testid="save-activity-button"]').click();
    
    // Verify activity was added
    const activityList = page.locator('[data-testid="activity-list"]');
    await expect(activityList).toContainText('Visit Eiffel Tower');
  });

  test('should manage trip itinerary', async ({ page }) => {
    // Navigate to existing trip
    await page.goto('/trips/1'); // Assuming trip exists
    
    const itinerary = page.locator('[data-testid="trip-itinerary"]');
    await expect(itinerary).toBeVisible();
    
    // Test day navigation
    const dayTabs = page.locator('[data-testid="day-tab"]');
    await expect(dayTabs.first()).toBeVisible();
    
    await dayTabs.nth(1).click();
    const dayTwoContent = page.locator('[data-testid="day-2-content"]');
    await expect(dayTwoContent).toBeVisible();
  });

  test('should share trip with others', async ({ page }) => {
    await page.goto('/trips/1');
    
    await page.locator('[data-testid="share-trip-button"]').click();
    
    const shareModal = page.locator('[data-testid="share-modal"]');
    await expect(shareModal).toBeVisible();
    
    // Test email sharing
    await page.locator('[data-testid="share-email-input"]').fill('friend@example.com');
    await page.locator('[data-testid="send-invite-button"]').click();
    
    const successMessage = page.locator('[data-testid="share-success"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('Invitation sent');
  });
});


