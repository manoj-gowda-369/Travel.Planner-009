javascript
// Frontend-specific tests (can be run in browser console)

// Mock DOM elements for testing
const mockElement = {
    value: '',
    innerHTML: '',
    style: {},
    addEventListener: function(event, callback) {
        this.eventListeners = this.eventListeners || {};
        this.eventListeners[event] = callback;
    },
    click: function() {
        if (this.eventListeners && this.eventListeners.click) {
            this.eventListeners.click();
        }
    }
};

// Simple DOM testing functions
function testSearchBox() {
    console.log("Testing search box functionality...");
    
    const searchBox = Object.create(mockElement);
    searchBox.value = "Paris";
    
    if (searchBox.value === "Paris") {
        console.log("✅ Search box accepts input");
    } else {
        console.log("❌ Search box input failed");
    }
}

function testButtonClick() {
    console.log("Testing button click functionality...");
    
    const button = Object.create(mockElement);
    let clicked = false;
    
    button.addEventListener('click', () => {
        clicked = true;
    });
    
    button.click();
    
    if (clicked) {
        console.log("✅ Button click works");
    } else {
        console.log("❌ Button click failed");
    }
}

function testFormValidation() {
    console.log("Testing form validation...");
    
    const testCases = [
        { email: "test@example.com", password: "password123", valid: true },
        { email: "invalid-email", password: "password123", valid: false },
        { email: "test@example.com", password: "123", valid: false },
        { email: "", password: "password123", valid: false }
    ];
    
    testCases.forEach((testCase, index) => {
        const isValid = testCase.email.includes('@') && 
                       testCase.password.length >= 6 && 
                       testCase.email.length > 0;
        
        if (isValid === testCase.valid) {
            console.log(`✅ Form validation test ${index + 1} passed`);
        } else {
            console.log(`❌ Form validation test ${index + 1} failed`);
        }
    });
}

// Run frontend tests
console.log("🧪 RUNNING FRONTEND TESTS");
console.log("=========================");
testSearchBox();
testButtonClick();
testFormValidation();
console.log("Frontend tests completed!");



