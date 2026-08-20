# 🤖 AI Voice Form Assistant

> A smart voice-powered form built with React.js and Web Speech API that allows users to fill forms using natural voice interaction.

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS3-3.x-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Web%20Speech%20API-Voice%20Enabled-8A2BE2?style=for-the-badge" alt="Web Speech API" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Completed-success?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

## 🎥 Live Demo

🚀 **Try the application live:**

<p align="center">
  <a href="https://form-fill-theta.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Open%20Application-00C853?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <a href="https://form-fill-theta.vercel.app/" target="_blank">
    https://form-fill-theta.vercel.app/
  </a>
</p>

> 🎙️ Open the live application and allow microphone permission to try the AI Voice Mode.


---

## 📌 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Usage](#-usage)
- [Browser Compatibility](#-browser-compatibility)
- [Error Handling](#-error-handling)
- [Future Improvements](#-future-improvements)
- [Learning Outcomes](#-learning-outcomes)
- [Author](#-author)
- [License](#-license)

---

## 📖 About The Project

**AI Voice Form Assistant** is an interactive form application built with **React.js** that allows users to complete a form using either traditional text input or an AI-powered voice assistant.

In **AI Mode**, the application asks questions using **Text-to-Speech**, listens to the user's answers using **Speech Recognition**, automatically fills the corresponding form fields, and moves to the next empty field.

The project demonstrates practical implementation of:

- React Hooks
- Web Speech API
- Speech Recognition
- Speech Synthesis
- Asynchronous event handling
- State management
- `useRef` for preventing stale state
- Dynamic form navigation
- Error handling

---

## ✨ Features

- 🤖 AI-powered voice form filling
- 🎙️ Speech-to-Text input
- 🔊 Text-to-Speech questions
- 📝 Manual form filling
- 🔄 Automatic question-answer workflow
- ⏭️ Automatically moves to the next empty field
- 🎯 Highlights the currently active field
- 🔁 Automatically retries when no speech is detected
- 🛑 Start / Stop AI Mode
- 🎤 Manual microphone fallback
- 🌐 English India (`en-IN`) voice support
- 🧠 Prevents stale state issues using React Refs
- ⚡ Fast and lightweight React application
- 📱 Responsive user interface

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| ⚛️ React.js | Frontend UI |
| 🟨 JavaScript ES6+ | Application Logic |
| 🎨 CSS3 | Styling and Responsive Design |
| 🔊 Web Speech API | Text-to-Speech |
| 🎙️ Speech Recognition API | Voice-to-Text |
| ⚡ React Hooks | State and Lifecycle Management |
| 🔗 Git & GitHub | Version Control |

---

## 🔄 How It Works

The application supports two ways of filling the form:

### 📝 Normal Mode

Users can manually enter:

- Full Name
- Email
- Phone Number
- Address

### 🤖 AI Voice Mode

When the user clicks **Start AI Mode**:

1. The application finds the first empty field.
2. AI asks the corresponding question.
3. Text-to-Speech converts the question into voice.
4. The microphone automatically starts.
5. User speaks the answer.
6. Speech Recognition converts the voice into text.
7. The answer is inserted into the corresponding field.
8. The application finds the next empty field.
9. AI asks the next question.
10. The process continues until all fields are completed.

---

## 🔁 Application Flow

```text
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
                    │   AI Asks Question  │
                    │   Text-to-Speech    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Start Listening   │
                    │ Speech Recognition  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Convert Speech      │
                    │     Into Text       │
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
                               ▼
                         More Fields?
                         /          \
                       YES           NO
                        │             │
                        ▼             ▼
                 Ask Next Question  Complete
