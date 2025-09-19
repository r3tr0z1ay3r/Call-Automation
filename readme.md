# AI-Powered Call Center Demo

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

This project is a working prototype of an AI-powered Interactive Voice Response (IVR) system for a call center, built with Node.js, Twilio, and a real-time web dashboard.

---

## 🎥 Demo Video

*(This is the section where you can insert your demo. Record a short video (using Loom, QuickTime, etc.) showing the dashboard and you making a call, then upload it to YouTube or another video service. Take a screenshot for the thumbnail.)*

**To insert your video:**
1.  Upload your video to a platform like YouTube or Loom and get the link.
2.  Take an engaging screenshot of your demo to use as a thumbnail. Upload this image somewhere (e.g., in your GitHub repo).
3.  Replace `link_to_your_thumbnail_image.png` and `link_to_your_video` in the line below.

[![Project Demo](./Submission/Dashboard-Screenshot.png)](https://youtu.be/x5BVzP6cLpY)

---

## ✨ Features

-   **Interactive Voice Response (IVR):** Greets callers and asks a series of qualifying questions.
-   **Speech-to-Text Capture:** Captures and understands the user's spoken responses in real-time.
-   **Rule-Based Conversational Flow:** Guides the user through a predefined set of questions (name, age, reason for call).
-   **Live Call Forwarding:** Simulates routing the call to a human agent by forwarding it to a number of your choice.
-   **Real-Time Dashboard:** A web-based dashboard that displays captured call logs as they happen.
-   **API Test Simulation:** A one-click button on the dashboard to simulate a full call flow, demonstrating the backend logic and real-time UI updates without making a phone call.

## 🛠️ Tech Stack

-   **Backend:** Node.js, Express.js
-   **Cloud Communications:** Twilio (Voice API, TwiML, Phone Numbers)
-   **Frontend:** HTML5, CSS3, Vanilla JavaScript
-   **Development Tools:** `ngrok` for exposing the local server, `dotenv` for environment variables.

## ⚙️ Prerequisites

Before you begin, ensure you have the following:
-   [Node.js](https://nodejs.org/) (v14 or later) and npm
-   A free [Twilio Account](https://www.twilio.com/try-twilio)
-   A Twilio Phone Number with Voice capabilities
-   [ngrok](https://ngrok.com/download) installed and authenticated

## 🚀 Setup & Installation

Follow these steps to get your project up and running.

**1. Clone the Repository**
```bash
git clone https://github.com/your-username/ai-call-center.git
cd ai-call-center