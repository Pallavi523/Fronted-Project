import React, { useState, useCallback, useEffect } from 'react';
import { RefreshCw, Copy, Settings, CheckCircle } from 'lucide-react';

const RandomStringGenerator = () => {
  const [generatedString, setGeneratedString] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(false);

  // Character sets
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Generate random string function using useCallback
  const generateRandomString = useCallback(() => {
    let charset = '';
    
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    // If no character set is selected, default to lowercase
    if (!charset) charset = lowercase;
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setGeneratedString(result);
    
    // Add to history (keep last 5)
    setHistory(prev => {
      const newHistory = [result, ...prev];
      return newHistory.slice(0, 5);
    });
    
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Auto-generate effect using useEffect
  useEffect(() => {
    if (autoGenerate) {
      const interval = setInterval(generateRandomString, 2000);
      return () => clearInterval(interval);
    }
  }, [autoGenerate, generateRandomString]);

  // Generate initial string on component mount
  useEffect(() => {
    generateRandomString();
  }, [generateRandomString]);

  // Copy to clipboard function
  const copyToClipboard = useCallback(async (text = generatedString) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [generatedString]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Random String Generator</h1>
            <p className="text-gray-600">Generate secure random strings with custom options</p>
          </div>

          {/* Generated String Display */}
          <div className="mb-8">
            <div className="relative">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-16 flex items-center justify-between">
                <div className="font-mono text-lg text-gray-800 break-all flex-1 mr-4">
                  {generatedString || 'Click generate to create a random string'}
                </div>
                <button
                  onClick={() => copyToClipboard()}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={!generatedString}
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Length Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length: {length}
              </label>
              <input
                type="range"
                min="4"
                max="50"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>50</span>
              </div>
            </div>

            {/* Character Type Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Settings size={16} />
                Character Types
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Symbols (!@#$...)</span>
                </label>
              </div>
            </div>

            {/* Auto Generate Toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Auto-generate every 2 seconds</span>
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateRandomString}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Generate New String
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Recent History</h3>
              <div className="space-y-2">
                {history.map((str, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <code className="text-sm text-gray-700 font-mono break-all flex-1 mr-3">
                      {str}
                    </code>
                    <button
                      onClick={() => copyToClipboard(str)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{generatedString.length}</div>
                <div className="text-sm text-gray-600">Characters</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{history.length}</div>
                <div className="text-sm text-gray-600">Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomStringGenerator;