🤖 AI Voice Form Assistant
<p align="center"> <b>Voice-powered smart form built with React.js and Web Speech API</b> </p> <p align="center"> <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /> <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" /> <img src="https://img.shields.io/badge/Web_Speech_API-Voice-8A2BE2?style=for-the-badge" alt="Web Speech API" /> </p> <p align="center"> <img src="https://img.shields.io/badge/Status-Completed-success?style=flat-square" alt="Status" /> <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" /> </p>
📌 Overview

AI Voice Form Assistant is a smart and interactive form application built with React.js that allows users to complete forms using either traditional text input or an AI-powered voice interaction system.

In AI Mode, the application automatically:

Asks the user a question using Text-to-Speech.
Starts the microphone after the question is completed.
Converts the user's voice into text using Speech Recognition.
Fills the corresponding form field automatically.
Moves to the next empty field.
Repeats the process until the form is completed.

The project demonstrates practical usage of React Hooks, asynchronous browser APIs, speech recognition, speech synthesis, refs, state management, and event-driven UI interactions.

✨ Features
🤖 AI Voice Mode
🎙️ Speech-to-Text
🔊 Text-to-Speech
📝 Manual Form Filling
🔄 Automatic Question & Answer Flow
⏭️ Automatically Finds Next Empty Field
🎯 Highlights Active Field
🔁 Automatic Retry on No Speech
🛑 Start / Stop AI Mode
🎤 Manual Microphone Fallback
🌐 English India (en-IN) Voice Support
⚡ React Hooks Based Architecture
🧠 Prevents Stale State Using React Refs
📱 Responsive User Interface
🎥 Demo

Add your deployed application link here.

<p align="center"> <a href="YOUR_LIVE_DEMO_URL"> <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Application-00C853?style=for-the-badge" alt="Live Demo" /> </a> </p>
📸 Screenshots

Add your screenshots inside the screenshots folder and update the paths below.

📝 Normal Form

🤖 AI Voice Mode

🎙️ Listening State

🛠️ Tech Stack
Technology	Purpose
⚛️ React.js	Frontend UI
🟨 JavaScript ES6+	Application Logic
🎨 CSS3	Styling & Responsive UI
🔊 Web Speech API	Text-to-Speech
🎙️ Speech Recognition API	Voice-to-Text
⚡ React Hooks	State & Lifecycle Management
🔗 Git & GitHub	Version Control
🏗️ Project Structure
ai-voice-form/
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── assets/
│
├── screenshots/
│   ├── normal-form.png
│   ├── ai-mode.png
│   └── listening.png
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

🔄 Application Flow
                    ┌─────────────────────┐
                    │    Start AI Mode    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Find First Empty    │
                    │       Field         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  AI Asks Question   │
                    │   Text-to-Speech    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Start Listening   │
                    │  Speech Recognition │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Convert Speech to  │
                    │        Text         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Update Form Data  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Find Next Empty     │
                    │       Field        │
                    └──────────┬──────────┘
                               │
                         More Fields?
                         /          \
                       YES           NO
                        │             │
                        ▼             ▼
                 Ask Next Question  Complete

🚀 Getting Started
Prerequisites

Make sure you have the following installed:

Node.js 18+
npm 9+
A modern browser with Web Speech API support

Check your versions:

node -v
npm -v

📥 Installation
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

2. Navigate to the Project
cd YOUR_REPOSITORY

3. Install Dependencies
npm install

4. Start Development Server
npm run dev


The application will be available at:

http://localhost:5173

🎙️ How AI Mode Works

Click the:

🤖 Start AI Mode


button.

The application searches for the first empty field and asks the corresponding question.

For example:

AI:
"What is your full name?"

User:
"Rahul Kumar"

↓
Name field gets populated

AI:
"What is your email address?"

User:
"rahul@example.com"

↓
Email field gets populated


The process continues automatically until all fields are completed.

🧠 React Architecture

The application uses React hooks to manage asynchronous voice interactions.

useState

Used for managing:

formData
aiMode
currentIndex
listening
message

useRef

Refs are used to maintain the latest values inside asynchronous callbacks:

const recognitionRef = useRef(null);
const currentIndexRef = useRef(0);
const aiModeRef = useRef(false);


This helps avoid stale state issues inside Speech Recognition callbacks.

🔊 Text-to-Speech

The project uses the browser's native Speech Synthesis API:

window.speechSynthesis


Questions are converted into speech using:

const utterance = new SpeechSynthesisUtterance(text);

utterance.lang = "en-IN";
utterance.rate = 0.95;
utterance.pitch = 1;

window.speechSynthesis.speak(utterance);

🎙️ Speech Recognition

The application detects browser support using:

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


Recognition is configured as:

recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-IN";

🛡️ Error Handling

The application handles common voice recognition errors.

No Speech

If the user doesn't speak:

"I didn't hear you. Listening again..."


The application retries automatically without moving to another field.

Microphone Permission Denied

If microphone access is blocked:

"Microphone permission was denied."

Unsupported Browser

If Speech Recognition isn't available:

"Speech recognition is not supported in this browser."

🌐 Browser Compatibility

The Web Speech API is browser-dependent.

For the best experience, use a modern browser such as:

Google Chrome
Microsoft Edge

Make sure microphone permissions are enabled.

⚠️ Speech Recognition behavior may vary between browsers and operating systems.

📋 Current Form Fields

The application currently supports:

Field	Input
Full Name	Text
Email	Text
Phone Number	Text
Address	Text

New fields can be added easily through the fields configuration.

Example:

{
  key: "name",
  label: "Full Name",
  question: "What is your full name?",
  placeholder: "Enter your name",
}

🔮 Future Improvements
 Backend API integration
 MongoDB / PostgreSQL database integration
 AI-powered answer validation
 Natural language field detection
 Hindi & Hinglish voice support
 Multi-language support
 Email and phone validation
 Voice-based form correction
 AI confirmation before submission
 User authentication
 Form history
 Docker deployment
 Production deployment
 Accessibility improvements
💡 What I Learned

Through this project, I worked with:

React state management
React lifecycle and effects
useRef for asynchronous callbacks
Browser Speech Recognition API
Browser Speech Synthesis API
Event-driven programming
Handling asynchronous operations
Managing microphone states
Error handling for browser APIs
Dynamic form navigation
Building voice-driven user experiences
🚀 Future Vision

The goal of this project is to evolve it into a complete AI-powered form assistant where users can fill complex forms naturally through conversation.

For example:

AI: What's your name?

User: Rahul Kumar

AI: What's your email?

User: rahul@example.com

AI: What's your phone number?

User: 9876543210

AI: Great! I've filled everything.
    Would you like to submit the form?

👨‍💻 Author
Your Name

Full Stack Developer | React.js | Node.js | MERN Stack

<p> <a href="YOUR_LINKEDIN_URL"> <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /> </a> <a href="YOUR_GITHUB_URL"> <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /> </a> </p>
📄 License

This project is licensed under the MIT License.

See the LICENSE file for more information.

<p align="center"> ⭐ If you found this project useful, consider giving it a star! </p> <p align="center"> Built with ❤️ using React.js and Web Speech API </p>
