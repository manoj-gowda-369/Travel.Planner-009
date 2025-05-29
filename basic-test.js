javascript
// Simple automated tests for beginners
const assert = require('assert');

// Test helper function
function runTest(testName, testFunction) {
    try {
        testFunction();
        console.log(`✅ ${testName} - PASSED`);
    } catch (error) {
        console.log(`❌ ${testName} - FAILED: ${error.message}`);
    }
}

// Mock data for testing
const mockDestinations = [
    {
        id: 1,
        name: "Paris, France",
        country: "France",
        price_range: "expensive",
        rating: 4.8
    },
    {
        id: 2,
        name: "Bali, Indonesia", 
        country: "Indonesia",
        price_range: "moderate",
        rating: 4.7
    }
];

const mockUsers = [
    {
        id: 1,
        email: "john@example.com",
        password: "hashed_password_123",
        name: "John Doe"
    }
];

// Simple search function to test
function searchDestinations(destinations, searchTerm) {
    return destinations.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

// Simple validation function to test
function validateTrip(trip) {
    const errors = [];
    
    if (!trip.destination_id) {
        errors.push("Destination is required");
    }
    
    if (!trip.start_date) {
        errors.push("Start date is required");
    }
    
    if (!trip.end_date) {
        errors.push("End date is required");
    }
    
    if (trip.start_date && trip.end_date) {
        if (new Date(trip.start_date) >= new Date(trip.end_date)) {
            errors.push("Start date must be before end date");
        }
    }
    
    if (trip.budget && trip.budget < 0) {
        errors.push("Budget cannot be negative");
    }
    
    return errors;
}

// User validation function
function validateUser(user) {
    const errors = [];
    
    if (!user.email) {
        errors.push("Email is required");
    } else if (!user.email.includes('@')) {
        errors.push("Email must be valid");
    }
    
    if (!user.password) {
        errors.push("Password is required");
    } else if (user.password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }
    
    if (!user.name) {
        errors.push("Name is required");
    }
    
    return errors;
}

// Price calculation function
function calculateTripCost(destination, days, travelers) {
    const baseCosts = {
        'budget': 50,
        'moderate': 100,
        'expensive': 200
    };
    
    const baseCost = baseCosts[destination.price_range] || 100;
    return baseCost * days * travelers;
}

// TEST SUITE 1: Search Function Tests
console.log("\n🧪 RUNNING SEARCH TESTS");
console.log("======================");

runTest("Search by country name", () => {
    const results = searchDestinations(mockDestinations, "France");
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].name, "Paris, France");
});

runTest("Search by destination name", () => {
    const results = searchDestinations(mockDestinations, "Bali");
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].country, "Indonesia");
});

runTest("Search case insensitive", () => {
    const results = searchDestinations(mockDestinations, "PARIS");
    assert.strictEqual(results.length, 1);
});

runTest("Search returns empty for no matches", () => {
    const results = searchDestinations(mockDestinations, "Antarctica");
    assert.strictEqual(results.length, 0);
});

runTest("Search with empty string returns all", () => {
    const results = searchDestinations(mockDestinations, "");
    assert.strictEqual(results.length, 2);
});

// TEST SUITE 2: Trip Validation Tests
console.log("\n🧪 RUNNING TRIP VALIDATION TESTS");
console.log("================================");

runTest("Valid trip passes validation", () => {
    const trip = {
        destination_id: 1,
        start_date: "2024-06-01",
        end_date: "2024-06-07",
        budget: 1000
    };
    const errors = validateTrip(trip);
    assert.strictEqual(errors.length, 0);
});

runTest("Missing destination fails validation", () => {
    const trip = {
        start_date: "2024-06-01",
        end_date: "2024-06-07"
    };
    const errors = validateTrip(trip);
    assert.ok(errors.includes("Destination is required"));
});

runTest("End date before start date fails", () => {
    const trip = {
        destination_id: 1,
        start_date: "2024-06-07",
        end_date: "2024-06-01"
    };
    const errors = validateTrip(trip);
    assert.ok(errors.includes("Start date must be before end date"));
});

runTest("Negative budget fails validation", () => {
    const trip = {
        destination_id: 1,
        start_date: "2024-06-01",
        end_date: "2024-06-07",
        budget: -100
    };
    const errors = validateTrip(trip);
    assert.ok(errors.includes("Budget cannot be negative"));
});

// TEST SUITE 3: User Validation Tests
console.log("\n🧪 RUNNING USER VALIDATION TESTS");
console.log("===============================");

runTest("Valid user passes validation", () => {
    const user = {
        email: "test@example.com",
        password: "password123",
        name: "Test User"
    };
    const errors = validateUser(user);
    assert.strictEqual(errors.length, 0);
});

runTest("Invalid email fails validation", () => {
    const user = {
        email: "email not valid",
        password: "password123",
        name: "Test User"
    };
    const errors = validateUser(user);
    assert.ok(errors.includes("Email must be valid"));
});

runTest("Short password fails validation", () => {
    const user = {
        email: "test@example.com",
        password: "123",
        name: "Test User"
    };
    const errors = validateUser(user);
    assert.ok(errors.includes("Password must be at least 6 characters"));
});

// TEST SUITE 4: Price Calculation Tests
console.log("\n🧪 RUNNING PRICE CALCULATION TESTS");
console.log("=================================");

runTest("Budget destination cost calculation", () => {
    const destination = { price_range: "budget" };
    const cost = calculateTripCost(destination, 5, 2);
    assert.strictEqual(cost, 500); // 50 * 5 days * 2 travelers
});

runTest("Expensive destination cost calculation", () => {
    const destination = { price_range: "expensive" };
    const cost = calculateTripCost(destination, 3, 1);
    assert.strictEqual(cost, 600); // 200 * 3 days * 1 traveler
});

runTest("Unknown price range defaults to moderate", () => {
    const destination = { price_range: "unknown" };
    const cost = calculateTripCost(destination, 2, 1);
    assert.strictEqual(cost, 200); // 100 * 2 days * 1 traveler
});

console.log("\n🎉 ALL TESTS COMPLETED!");
console.log("Check results above for any failures.");



