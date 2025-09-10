import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("hi"); // default: Hindi
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const translateText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to translate.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Encode the text for URL
      const encodedText = encodeURIComponent(text);
      const url = `https://text-translator5.p.rapidapi.com/translate?text=${encodedText}&target_lang=${language}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "text-translator5.p.rapidapi.com",
          "x-rapidapi-key": "65c4f06b1fmsha95b553068b10acp1b94d2jsnf39173cbec66",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
     setTranslated(data.translation);
      if (data?.translatedText) {
        setTranslated(data.translation);
        console.log("Translated Text:", data.translation);
      } else if (data?.data?.translatedText) {
        setTranslated(data.data.translatedText);
      } else if (typeof data === 'string') {
        setTranslated(data);
      }
    } catch (err) {
      console.error("Translation error:", err);
      setError(err.message || "Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearTranslation = () => {
    setText("");
    setTranslated("");
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🌐 Language Translator
        </h1>

        {/* Input Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter text in English:
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
            placeholder="Type your English text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Language Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select target language:
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="hi">Hindi (हिंदी)</option>
            <option value="fr">French (Français)</option>
            <option value="es">Spanish (Español)</option>
            <option value="de">German (Deutsch)</option>
            <option value="zh">Chinese (中文)</option>
            <option value="ja">Japanese (日本語)</option>
            <option value="ko">Korean (한국어)</option>
            <option value="ar">Arabic (العربية)</option>
            <option value="pt">Portuguese (Português)</option>
            <option value="ru">Russian (Русский)</option>
            <option value="it">Italian (Italiano)</option>
            <option value="nl">Dutch (Nederlands)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={translateText}
            disabled={loading || !text.trim()}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⟳</span>
                Translating...
              </span>
            ) : (
              "Translate"
            )}
          </button>
          
          <button
            onClick={clearTranslation}
            disabled={loading}
            className="bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Translation Output */}
        {translated && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">
              Translated Text ({language.toUpperCase()}):
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">{translated}</p>
          </div>
        )}

       
      </div>
    </div>
  );
}