// test_api.js
const axios = require('axios');

// The base URL for your locally running server
const BASE_URL = 'http://localhost:3000';

// A unique Call SID for this test run to track logs
const MOCK_CALL_SID = `CA_TEST_${Date.now()}`;

/**
 * Helper function to simulate Twilio's webhook request.
 * Twilio sends data as 'application/x-www-form-urlencoded', so we must mimic that.
 * @param {string} url - The full URL to post to.
 * @param {object} payload - The data to send.
 * @returns {Promise<axios.AxiosResponse>}
 */
async function postTwilioWebhook(url, payload) {
    // Convert the JS object to a URL-encoded string
    const urlEncodedData = new URLSearchParams(payload);

    return axios.post(url, urlEncodedData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
}

/**
 * Checks if a TwiML response contains the expected text.
 * @param {string} responseData - The XML string from the server.
 * @param {string} expectedText - The text to search for.
 */
function checkResponse(responseData, expectedText) {
    if (typeof responseData !== 'string' || !responseData.includes(expectedText)) {
        throw new Error(`Test Failed! Expected response to contain "${expectedText}"`);
    }
}


// Main async function to run the test suite
async function runApiTest() {
    console.log('--- Starting API Endpoint Test Suite ---');
    console.log(`Using mock CallSid: ${MOCK_CALL_SID}\n`);

    try {
        // === Test 1: Simulate an incoming call to /voice ===
        console.log('▶️  Test 1: Simulating incoming call to POST /voice...');
        const voiceResponse = await postTwilioWebhook(`${BASE_URL}/voice`, { CallSid: MOCK_CALL_SID });
        checkResponse(voiceResponse.data, 'What is your full name?');
        console.log('✅  PASSED: Server correctly asked for the name.\n');

        // === Test 2: Simulate user providing their name ===
        console.log('▶️  Test 2: Simulating user saying their name to POST /gather-response...');
        const nameResponse = await postTwilioWebhook(`${BASE_URL}/gather-response?question=name`, {
            CallSid: MOCK_CALL_SID,
            SpeechResult: 'Mukesh Kumar',
        });
        checkResponse(nameResponse.data, 'What is your age?');
        console.log('✅  PASSED: Server correctly asked for the age.\n');

        // === Test 3: Simulate user providing their age ===
        console.log('▶️  Test 3: Simulating user saying their age to POST /gather-response...');
        const ageResponse = await postTwilioWebhook(`${BASE_URL}/gather-response?question=age`, {
            CallSid: MOCK_CALL_SID,
            SpeechResult: '21',
        });
        checkResponse(ageResponse.data, 'What is the reason for your call today?');
        console.log('✅  PASSED: Server correctly asked for the reason.\n');

        // === Test 4: Simulate user providing the reason for the call ===
        console.log('▶️  Test 4: Simulating user stating their reason to POST /route-call...');
        const routeResponse = await postTwilioWebhook(`${BASE_URL}/route-call`, {
            CallSid: MOCK_CALL_SID,
            SpeechResult: 'I need help with my account.',
        });
        checkResponse(routeResponse.data, '<Dial>');
        console.log('✅  PASSED: Server correctly attempted to dial an agent.\n');

        // === Test 5: Verify the logs were captured ===
        console.log('▶️  Test 5: Verifying data capture via GET /logs...');
        const logsResponse = await axios.get(`${BASE_URL}/logs`);
        const allLogs = logsResponse.data;
        
        // Filter logs for this specific test run
        const testLogs = allLogs.filter(log => log.callSid === MOCK_CALL_SID);
        
        if (testLogs.length !== 3) {
            throw new Error(`Log Test Failed! Expected 3 log entries for this call, but found ${testLogs.length}.`);
        }

        const loggedName = testLogs.find(log => log.question === 'name').response;
        const loggedAge = testLogs.find(log => log.question === 'age').response;
        const loggedReason = testLogs.find(log => log.question === 'reason').response;

        if (loggedName !== 'Mukesh Kumar' || loggedAge !== '21' || loggedReason !== 'I need help with my account.') {
            throw new Error('Log Test Failed! Logged data does not match the simulated input.');
        }
        console.log('✅  PASSED: All user responses were correctly logged.');
        console.log('   - Name:', loggedName);
        console.log('   - Age:', loggedAge);
        console.log('   - Reason:', loggedReason);

        console.log('\n--- 🎉 All API tests completed successfully! ---');

    } catch (error) {
        console.error('\n--- ❌ A test failed! ---');
        if (error.response) {
            // Error from the server (e.g., 404, 500)
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            // Request was made but no response was received (server is not running)
            console.error('Error: No response from server. Is it running on ' + BASE_URL + '?');
        } else {
            // Other errors (e.g., logic errors in our checkResponse function)
            console.error('Error Message:', error.message);
        }
    }
}

// Run the test
runApiTest();