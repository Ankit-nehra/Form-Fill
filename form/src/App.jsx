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

  const currentField = fields[currentIndex];

  // Browser speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setListening(true);
      setMessage("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setFormData((prev) => ({
        ...prev,
        [currentField.key]: transcript,
      }));

      setListening(false);
      setMessage(`Got it: "${transcript}"`);

      // Move to next question
      setTimeout(() => {
        if (currentIndex < fields.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          speak(fields[nextIndex].question);
        } else {
          speak("Your form is complete. Thank you!");
          setAiMode(false);
          setMessage("Form completed!");
        }
      }, 800);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setListening(false);
      setMessage("I couldn't hear you. Please try again.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [currentIndex]);

  // AI voice
  const speak = (text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // Start AI mode
  const startAIMode = () => {
    setAiMode(true);
    setCurrentIndex(0);
    setMessage("");

    speak(fields[0].question);
  };

  // Start listening
  const startListening = () => {
    if (!recognitionRef.current) {
      setMessage("Speech recognition is not supported.");
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log(error);
    }
  };

  // Stop AI mode
  const stopAIMode = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();

    setAiMode(false);
    setListening(false);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    alert("Form submitted!");
  };

  return (
    <div className="app">
      <div className="form-card">
        <div className="header">
          <h1>Simple Form</h1>
          <p>Fill the form normally or use AI Mode.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div className="field" key={field.key}>
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

          <button className="submit-btn" type="submit">
            Submit Form
          </button>
        </form>

        <div className="ai-section">
          {!aiMode ? (
            <button className="ai-btn" onClick={startAIMode}>
              🤖 Start AI Mode
            </button>
          ) : (
            <>
              <div className="ai-box">
                <div className="ai-icon">🤖</div>

                <div>
                  <strong>AI Assistant</strong>

                  <p>
                    {currentField
                      ? currentField.question
                      : "Form completed!"}
                  </p>
                </div>
              </div>

              <button
                className={`mic-btn ${listening ? "listening" : ""}`}
                onClick={startListening}
              >
                {listening ? "🎙️ Listening..." : "🎙️ Speak Answer"}
              </button>

              <button className="stop-btn" onClick={stopAIMode}>
                Stop AI Mode
              </button>

              {message && <p className="status">{message}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;