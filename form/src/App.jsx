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
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const recognitionRef = useRef(null);

  // This remembers the field AI was working on
  const currentIndexRef = useRef(0);

  // If user clicks an already-filled field,
  // remember where AI should return afterwards.
  const returnIndexRef = useRef(0);

  const currentField = fields[currentIndex];

  // --------------------------------------------------
  // Keep current index ref updated
  // --------------------------------------------------

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // --------------------------------------------------
  // Text to Speech
  // --------------------------------------------------

  const speak = (text, callback) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
      setListening(false);
    };

    utterance.onend = () => {
      setSpeaking(false);

      if (callback) {
        callback();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

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

      handleSpeechAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);

      setListening(false);

      if (event.error === "no-speech") {
        setMessage("I couldn't hear you. Try again.");
      } else if (event.error === "not-allowed") {
        setMessage(
          "Microphone permission was denied."
        );
      } else {
        setMessage("Something went wrong. Try again.");
      }
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
  // Handle User's Voice Answer
  // --------------------------------------------------

  const handleSpeechAnswer = (transcript) => {
    const selectedIndex = currentIndexRef.current;
    const selectedField = fields[selectedIndex];

    // Fill the field
    setFormData((prev) => ({
      ...prev,
      [selectedField.key]: transcript,
    }));

    setMessage("");

    // Small delay so user sees the answer
    // before AI moves forward.
    setTimeout(() => {
      moveAfterAnswer(selectedIndex, transcript);
    }, 500);
  };

  // --------------------------------------------------
  // Decide what happens after answer
  // --------------------------------------------------

  const moveAfterAnswer = (answeredIndex, answer) => {
    // If this was an editing/re-correction request,
    // return to the field AI was originally working on.
    if (answeredIndex !== returnIndexRef.current) {
      const returnIndex = returnIndexRef.current;

      // If the return field is already complete,
      // find the first empty field.
      if (!formData[fields[returnIndex].key]) {
        goToField(returnIndex);
        return;
      }

      const nextEmptyIndex = fields.findIndex(
        (field) => !formData[field.key] && field.key !== fields[answeredIndex].key
      );

      if (nextEmptyIndex !== -1) {
        goToField(nextEmptyIndex);
        return;
      }

      finishForm();
      return;
    }

    // Normal flow
    if (answeredIndex < fields.length - 1) {
      const nextIndex = answeredIndex + 1;

      goToField(nextIndex);

      const nextField = fields[nextIndex];

      speak(
        `Okay ${answer}. ${nextField.question}`
      );
    } else {
      finishForm();
    }
  };

  // --------------------------------------------------
  // Move AI to a field
  // --------------------------------------------------

  const goToField = (index) => {
    setCurrentIndex(index);
    currentIndexRef.current = index;

    setCompleted(false);
    setMessage("");
  };

  // --------------------------------------------------
  // Finish Form
  // --------------------------------------------------

  const finishForm = () => {
    setCompleted(true);
    setListening(false);

    speak(
      "Your form is ready. Please check it. If everything looks correct, click Submit."
    );
  };

  // --------------------------------------------------
  // Start AI Mode
  // --------------------------------------------------

  const startAIMode = () => {
    // Find first empty field
    const firstEmptyIndex = fields.findIndex(
      (field) => !formData[field.key]
    );

    const startIndex =
      firstEmptyIndex === -1 ? 0 : firstEmptyIndex;

    setAiMode(true);
    setCompleted(false);
    setMessage("");

    goToField(startIndex);

    setTimeout(() => {
      speak(fields[startIndex].question);
    }, 300);
  };

  // --------------------------------------------------
  // Start Listening
  // --------------------------------------------------

  const startListening = () => {
    if (!recognitionRef.current) {
      setMessage(
        "Speech recognition is not supported."
      );
      return;
    }

    if (listening || speaking) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------------------------------
  // Click on a form field while AI Mode is active
  // --------------------------------------------------

  const handleFieldClick = (index) => {
    if (!aiMode) return;

    // If form is complete and user clicks a field,
    // allow correction.
    if (completed) {
      returnIndexRef.current = index;

      goToField(index);

      speak(
        `Let's update your ${fields[index].label.toLowerCase()}. ${fields[index].question}`
      );

      return;
    }

    // Don't do anything if clicking current active field
    if (index === currentIndexRef.current) {
      return;
    }

    // Only allow correction of already-filled fields
    if (formData[fields[index].key]) {
      // Remember where AI should return
      returnIndexRef.current =
        currentIndexRef.current;

      goToField(index);

      speak(
        `Let's update your ${fields[index].label.toLowerCase()}. ${fields[index].question}`
      );
    }
  };

  // --------------------------------------------------
  // Stop AI Mode
  // --------------------------------------------------

  const stopAIMode = () => {
    recognitionRef.current?.stop();

    window.speechSynthesis.cancel();

    setAiMode(false);
    setListening(false);
    setSpeaking(false);
    setMessage("");
    setCompleted(false);
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
  // Render
  // --------------------------------------------------

  return (
    <div className="app">
      <div className="form-card">

        {/* Header */}

        <div className="header">
          <h1>Simple Form</h1>

          <p>
            Fill the form normally or let AI help you.
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit}>

          {fields.map((field, index) => {
            const isActive =
              aiMode &&
              index === currentIndex &&
              !completed;

            const isFilled =
              Boolean(formData[field.key]);

            return (
              <div
                className={`field ${
                  isActive ? "active-field" : ""
                } ${
                  aiMode && isFilled
                    ? "filled-field"
                    : ""
                }`}
                key={field.key}
                onClick={() =>
                  handleFieldClick(index)
                }
              >
                <div className="field-label-row">
                  <label htmlFor={field.key}>
                    {field.label}
                  </label>

                  {aiMode && isFilled && (
                    <span className="filled-check">
                      ✓
                    </span>
                  )}
                </div>

                <input
                  id={field.key}
                  type="text"
                  name={field.key}
                  value={formData[field.key]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />

                {isActive && (
                  <div className="active-indicator">
                    <span></span>
                    AI is filling this field
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit */}

          <button
            className="submit-btn"
            type="submit"
          >
            Submit Form
          </button>
        </form>

        {/* AI Control Bar */}

        <div className="ai-section">

          {!aiMode ? (

            <button
              type="button"
              className="ai-btn"
              onClick={startAIMode}
            >
              <span>✨</span>
              Fill with AI
            </button>

          ) : (

            <div className="ai-control">

              {/* AI status */}

              <div className="ai-status">

                <div
                  className={`ai-orb ${
                    listening
                      ? "is-listening"
                      : speaking
                      ? "is-speaking"
                      : ""
                  }`}
                >
                  {listening ? "🎙️" : "✨"}
                </div>

                <div className="ai-status-text">

                  <strong>
                    {completed
                      ? "AI form assistant"
                      : listening
                      ? "Listening..."
                      : speaking
                      ? "Speaking..."
                      : "AI is ready"}
                  </strong>

                  <span>
                    {completed
                      ? "Review your form"
                      : listening
                      ? "Speak your answer"
                      : speaking
                      ? "Please listen"
                      : currentField?.label}
                  </span>

                </div>

              </div>

              {/* Listen button */}

              {!completed && (
                <button
                  type="button"
                  className={`listen-btn ${
                    listening
                      ? "listening"
                      : ""
                  }`}
                  onClick={startListening}
                  disabled={speaking}
                >
                  {listening ? (
                    <span className="dots">
                      <i></i>
                      <i></i>
                      <i></i>
                    </span>
                  ) : (
                    "🎙️"
                  )}
                </button>
              )}

              {/* Stop */}

              <button
                type="button"
                className="stop-btn"
                onClick={stopAIMode}
              >
                Stop AI
              </button>

            </div>

          )}

          {message && (
            <p className="status">
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
