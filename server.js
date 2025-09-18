// server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Twilio = require('twilio');

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


// === MAIN CALL FLOW ENDPOINTS ===

// 1. Initial endpoint when a user calls your Twilio number
app.post('/voice', (req, res) => {
    const twiml = new Twilio.twiml.VoiceResponse();
    
    // Start the conversation
    const gather = twiml.gather({
        input: 'speech',
        action: '/gather-response?question=name', // Send the result to this endpoint
        speechTimeout: 'auto',
        speechModel: 'experimental_conversations',
    });
    gather.say('Hello, welcome to our automated service. What is your full name?');

    // If the user doesn't say anything, redirect to the beginning
    twiml.redirect('/voice');

    res.type('text/xml');
    res.send(twiml.toString());
});

// 2. Endpoint to handle user's spoken responses
app.post('/gather-response', (req, res) => {
    const twiml = new Twilio.twiml.VoiceResponse();
    const question = req.query.question;
    const speechResult = req.body.SpeechResult;
    const callSid = req.body.CallSid;

    // Log the previous answer
    logResponse(callSid, question, speechResult);

    // Ask the next question based on the previous one
    if (question === 'name') {
        const gather = twiml.gather({
            input: 'speech',
            action: '/gather-response?question=age',
            speechTimeout: 'auto',
        });
        gather.say(`Thank you, ${speechResult}. What is your age?`);
        twiml.redirect('/voice'); // Loop back if no input
    } else if (question === 'age') {
        const gather = twiml.gather({
            input: 'speech',
            action: '/route-call', // Final question, next step is routing
            speechTimeout: 'auto',
        });
        gather.say(`Got it, you are ${speechResult} years old. What is the reason for your call today?`);
        twiml.redirect('/voice'); // Loop back if no input
    } else {
        twiml.say("Sorry, I'm not sure what to do next.");
        twiml.hangup();
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

// 3. Final endpoint to simulate routing the call
app.post('/route-call', (req, res) => {
    const twiml = new Twilio.twiml.VoiceResponse();
    const speechResult = req.body.SpeechResult;
    const callSid = req.body.CallSid;

    // Log the final reason
    logResponse(callSid, 'reason', speechResult);

    twiml.say('Thank you for providing that information. Please hold while I connect you to a live agent.');
    
    // Simulate routing by dialing another number. 
    // Replace with a real number (e.g., your mobile phone) to test.
    // Ensure the number is in E.164 format (e.g., +15551234567)
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
    const logEntry = {
        callSid,
        question,
        response,
        timestamp: new Date().toISOString()
    };
    console.log('Logging response:', logEntry);
    callLogs.push(logEntry);
}


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});