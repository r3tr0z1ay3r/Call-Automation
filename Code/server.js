// server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Twilio = require('twilio');
const path = require('path'); // NEW LINE: Import the path module

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// A simple in-memory store for call logs for this demo
const callLogs = [];

// Allow CORS for the dashboard to fetch logs
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


// === DASHBOARD HOSTING ===

// NEW SECTION: This route will serve your index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'G:/Work Stuff/Interview Stuff/Blink Digital/Assignment - Call Automation/Code/index.html'));
});


// === MAIN CALL FLOW ENDPOINTS ===

// 1. Initial endpoint when a user calls your Twilio number
app.post('/voice', (req, res) => {
    // ... (rest of the /voice endpoint is unchanged)
    const twiml = new Twilio.twiml.VoiceResponse();
    const gather = twiml.gather({
        input: 'speech',
        action: '/gather-response?question=name',
        speechTimeout: 'auto',
        speechModel: 'experimental_conversations',
    });
    gather.say('Hello, welcome to our automated service. What is your full name?');
    twiml.redirect('/voice');
    res.type('text/xml');
    res.send(twiml.toString());
});

// 2. Endpoint to handle user's spoken responses
app.post('/gather-response', (req, res) => {
    // ... (rest of the /gather-response endpoint is unchanged)
    const twiml = new Twilio.twiml.VoiceResponse();
    const question = req.query.question;
    const speechResult = req.body.SpeechResult;
    const callSid = req.body.CallSid;
    logResponse(callSid, question, speechResult);
    if (question === 'name') {
        const gather = twiml.gather({ input: 'speech', action: '/gather-response?question=age', speechTimeout: 'auto' });
        gather.say(`Thank you, ${speechResult}. What is your age?`);
        twiml.redirect('/voice');
    } else if (question === 'age') {
        const gather = twiml.gather({ input: 'speech', action: '/route-call', speechTimeout: 'auto' });
        gather.say(`Got it, you are ${speechResult} years old. What is the reason for your call today?`);
        twiml.redirect('/voice');
    } else {
        twiml.say("Sorry, I'm not sure what to do next.");
        twiml.hangup();
    }
    res.type('text/xml');
    res.send(twiml.toString());
});

// 3. Final endpoint to simulate routing the call
app.post('/route-call', (req, res) => {
    // ... (rest of the /route-call endpoint is unchanged)
    const twiml = new Twilio.twiml.VoiceResponse();
    const speechResult = req.body.SpeechResult;
    const callSid = req.body.CallSid;
    logResponse(callSid, 'reason', speechResult);
    twiml.say('Thank you for providing that information. Please hold while I connect you to a live agent.');
    twiml.dial('+15551234567'); 
    res.type('text/xml');
    res.send(twiml.toString());
});


// === DASHBOARD API ENDPOINT ===

// Endpoint to provide logs to the dashboard
app.get('/logs', (req, res) => {
    res.json(callLogs);
});

// Helper function to log responses
function logResponse(callSid, question, response) {
    // ... (logResponse function is unchanged)
    const logEntry = { callSid, question, response, timestamp: new Date().toISOString() };
    console.log('Logging response:', logEntry);
    callLogs.push(logEntry);
}


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}`); // NEW LINE: Helpful log
});