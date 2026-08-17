import { useEffect, useRef, useState } from "react";
import "./App.css";

const fields = [
  {
    key: "name",
    label: "Full Name",
    question: "What is your full name?",
    placeholder: "Enter your name",
  },
  {
    key: "email",
    label: "Email",
    question: "What is your email address?",
    placeholder: "Enter your email",
  },
  {
    key: "phone",
    label: "Phone Number",
    question: "What is your phone number?",
    placeholder: "Enter your phone number",
  },
  {
    key: "address",
    label: "Address",
    question: "What is your address?",
    placeholder: "Enter your address",
  },
];

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [aiMode, setAiMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");

  const recognitionRef = useRef(null);

  // Refs help us avoid old/stale state inside speech callbacks
  const currentIndexRef = useRef(0);
  const aiModeRef = useRef(false);

  // --------------------------------------------------
  // Keep refs updated
  // --------------------------------------------------

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    aiModeRef.current = aiMode;
  }, [aiMode]);

  // --------------------------------------------------
  // Speech Recognition Setup
  // --------------------------------------------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setListening(true);
      setMessage("");
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript.trim();

      setListening(false);

      handleVoiceAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.log("Speech error:", event.error);

      setListening(false);

      // User didn't say anything.
      // Stay on the SAME field.
      if (event.error === "no-speech") {
        setMessage("I didn't hear you. Listening again...");

        if (aiModeRef.current) {
          setTimeout(() => {
            startListening();
          }, 700);
        }

        return;
      }

      if (event.error === "not-allowed") {
        setMessage(
          "Microphone permission was denied."
        );
        return;
      }

      setMessage("I couldn't hear you. Please try again.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  // --------------------------------------------------
  // Text To Speech
  // --------------------------------------------------

  const speak = (text, onComplete) => {
    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => {
      if (onComplete) {
        onComplete();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // --------------------------------------------------
  // Start listening automatically
  // --------------------------------------------------

  const startListening = () => {
    if (!recognitionRef.current) {
      setMessage(
        "Speech recognition is not supported."
      );
      return;
    }

    if (!aiModeRef.current) {
      return;
    }

    if (listening) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      // Browser throws an error if recognition
      // is already running.
      console.log("Recognition:", error);
    }
  };

  // --------------------------------------------------
  // Ask current question
  // --------------------------------------------------

  const askCurrentQuestion = (index) => {
    const field = fields[index];

    speak(field.question, () => {
      // Once AI finishes speaking,
      // automatically start microphone.
      if (aiModeRef.current) {
        setTimeout(() => {
          startListening();
        }, 250);
      }
    });
  };

  // --------------------------------------------------
  // Handle voice answer
  // --------------------------------------------------

  const handleVoiceAnswer = (transcript) => {
    const index = currentIndexRef.current;
    const field = fields[index];

    // Put answer into form
    setFormData((prev) => ({
      ...prev,
      [field.key]: transcript,
    }));

    setMessage(`Got it: "${transcript}"`);

    // Wait a little so user can see
    // the value appear in the form.
    setTimeout(() => {
      if (!aiModeRef.current) {
        return;
      }

      moveToNextField(index);
    }, 600);
  };

  // --------------------------------------------------
  // Move to next EMPTY field
  // --------------------------------------------------

  const moveToNextField = (answeredIndex) => {
    // We need latest form data.
    setFormData((latestData) => {
      // Find next empty field after current field
      let nextIndex = -1;

      for (
        let i = answeredIndex + 1;
        i < fields.length;
        i++
      ) {
        if (!latestData[fields[i].key]) {
          nextIndex = i;
          break;
        }
      }

      // If nothing after current field,
      // check if any field before it is empty.
      if (nextIndex === -1) {
        for (let i = 0; i < fields.length; i++) {
          if (!latestData[fields[i].key]) {
            nextIndex = i;
            break;
          }
        }
      }

      // All fields completed
      if (nextIndex === -1) {
        setMessage("Form completed!");

        speak(
          "Your form is complete. Please check it before submitting."
        );

        setTimeout(() => {
          setAiMode(false);
        }, 1000);

        return latestData;
      }

      // Move to next empty field
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;

      setMessage("");

      // Ask next question
      setTimeout(() => {
        if (aiModeRef.current) {
          askCurrentQuestion(nextIndex);
        }
      }, 200);

      return latestData;
    });
  };

  // --------------------------------------------------
  // Start AI Mode
  // --------------------------------------------------

  const startAIMode = () => {
    // Find FIRST EMPTY field
    const firstEmptyIndex = fields.findIndex(
      (field) => !formData[field.key]
    );

    // If everything is already filled
    if (firstEmptyIndex === -1) {
      setAiMode(true);

      speak(
        "Your form is already filled. Please check it before submitting."
      );

      return;
    }

    setAiMode(true);
    aiModeRef.current = true;

    setCurrentIndex(firstEmptyIndex);
    currentIndexRef.current = firstEmptyIndex;

    setMessage("");

    // Ask from first EMPTY field
    askCurrentQuestion(firstEmptyIndex);
  };

  // --------------------------------------------------
  // Stop AI Mode
  // --------------------------------------------------

  const stopAIMode = () => {
    recognitionRef.current?.stop();

    window.speechSynthesis.cancel();

    setAiMode(false);
    aiModeRef.current = false;

    setListening(false);
    setMessage("");
  };

  // --------------------------------------------------
  // Normal input change
  // --------------------------------------------------

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    alert("Form submitted!");
  };

  // --------------------------------------------------
  // Current field
  // --------------------------------------------------

  const currentField = fields[currentIndex];

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="app">
      <div className="form-card">

        <div className="header">
          <h1>Simple Form</h1>

          <p>
            Fill the form normally or use AI Mode.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {fields.map((field, index) => (
            <div
              className={`field ${
                aiMode && index === currentIndex
                  ? "active-field"
                  : ""
              }`}
              key={field.key}
            >
              <label>{field.label}</label>

              <input
                type="text"
                name={field.key}
                value={formData[field.key]}
                onChange={handleChange}
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <button
            className="submit-btn"
            type="submit"
          >
            Submit Form
          </button>
        </form>

        {/* AI SECTION */}

        <div className="ai-section">

          {!aiMode ? (

            <button
              className="ai-btn"
              type="button"
              onClick={startAIMode}
            >
              🤖 Start AI Mode
            </button>

          ) : (

            <>
              <div className="ai-box">

                <div className="ai-icon">
                  🤖
                </div>

                <div>
                  <strong>
                    AI Assistant
                  </strong>

                  <p>
                    {currentField
                      ? currentField.question
                      : "Form completed!"}
                  </p>
                </div>

              </div>

              {/* This button is now only a manual
                  fallback. Normally AI starts listening
                  automatically. */}

              <button
                type="button"
                className={`mic-btn ${
                  listening ? "listening" : ""
                }`}
                onClick={startListening}
                disabled={listening}
              >
                {listening
                  ? "🎙️ Listening..."
                  : "🎙️ Speak Answer"}
              </button>

              <button
                type="button"
                className="stop-btn"
                onClick={stopAIMode}
              >
                Stop AI Mode
              </button>

              {message && (
                <p className="status">
                  {message}
                </p>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
