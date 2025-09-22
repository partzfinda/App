import React, { useState } from 'react';

// Define the shape of a request object for type safety
interface Request {
  id: string;
  description: string;
  status: string;
  date: string;
}

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('request');
  const [requestText, setRequestText] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseContent, setResponseContent] = useState('');

  // Function to handle the Gemini API call
  const fetchGeminiResponse = async (prompt: string) => {
    setIsLoading(true);
    setResponseContent('');
    try {
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ "google_search": {} }],
      };
      const apiKey = "AIzaSyDvQAOgsyTuLhFkzIzOrZTbOrjubSJSicY";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response found.";
      setResponseContent(text);
      setCurrentScreen('chat');

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setResponseContent("Sorry, I'm having trouble with that request. Please try again.");
      setCurrentScreen('chat');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle Text-to-Speech
  const handleTextToSpeech = async (textToSpeak: string) => {
    try {
      const payload = {
        contents: [{ parts: [{ text: textToSpeak }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" }
            }
          }
        },
        model: "gemini-2.5-flash-preview-tts"
      };
      const apiKey = "AIzaSyDvQAOgsyTuLhFkzIzOrZTbOrjubSJSicY";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/")) {
        const sampleRateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 16000;
        const pcmData = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmData);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error("Audio data not found or invalid.");
      }
    } catch (error) {
      console.error("Error with Text-to-Speech:", error);
    }
  };

  // Helper functions for TTS
  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const pcmToWav = (pcm16: Int16Array, sampleRate: number) => {
    const numChannels = 1;
    const bytesPerSample = 2;
    const byteRate = sampleRate * numChannels * bytesPerSample;
    const blockAlign = numChannels * bytesPerSample;
    const buffer = new ArrayBuffer(44 + pcm16.length * bytesPerSample);
    const view = new DataView(buffer);

    let offset = 0;

    // RIFF identifier
    view.setUint32(offset, 0x52494646, false); offset += 4;
    // file size minus 8
    view.setUint32(offset, 36 + pcm16.length * bytesPerSample, true); offset += 4;
    // 'WAVE' format
    view.setUint32(offset, 0x57415645, false); offset += 4;
    // 'fmt ' chunk
    view.setUint32(offset, 0x666d7420, false); offset += 4;
    // chunk size
    view.setUint32(offset, 16, true); offset += 4;
    // compression code (1 for PCM)
    view.setUint16(offset, 1, true); offset += 2;
    // number of channels
    view.setUint16(offset, numChannels, true); offset += 2;
    // sample rate
    view.setUint32(offset, sampleRate, true); offset += 4;
    // byte rate
    view.setUint32(offset, byteRate, true); offset += 4;
    // block align
    view.setUint16(offset, blockAlign, true); offset += 2;
    // bits per sample
    view.setUint16(offset, 16, true); offset += 2;
    // 'data' chunk
    view.setUint32(offset, 0x64617461, false); offset += 4;
    // chunk size
    view.setUint32(offset, pcm16.length * bytesPerSample, true); offset += 4;

    // Write the PCM data
    for (let i = 0; i < pcm16.length; i++) {
      view.setInt16(offset, pcm16[i], true);
      offset += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  // Function to handle moving to the next screen (dashboard)
  const handleNewRequest = () => {
    if (requestText.trim()) {
      const newRequest: Request = {
        id: `REQ-${Date.now()}`,
        description: requestText,
        status: 'Pending',
        date: new Date().toLocaleDateString(),
      };
      setRequests([...requests, newRequest]);
      fetchGeminiResponse(requestText);
    }
  };

  // Function to handle suggested prompts from cards
  const handleSuggestedPrompt = (prompt: string) => {
    setRequestText(prompt);
    fetchGeminiResponse(prompt);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'request':
        return (
          <div className="flex flex-col h-screen w-screen bg-[#1F2937] text-white p-6">
            <div className="flex flex-col items-center mt-12 mb-8">
              {/* Logo and App Name */}
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-[#9CA3AF]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.92 6.01c-.8.8-1.92 1.41-3.12 1.57-.48 2.01-1.63 3.65-3.08 4.49v.01c-1.39.81-2.91 1.05-4.22.95-.56-2.18-1.57-4.14-2.81-5.63-1.07 1.34-1.78 2.89-2.09 4.54-1.89-1.9-3.03-4.52-3.03-7.44h22.9c0 2.92-1.14 5.54-3.03 7.44-.31-1.65-1.02-3.2-2.09-4.54-1.24 1.49-2.25 3.45-2.81 5.63-1.31.1-2.83-.14-4.22-.95v-.01c-1.45-.84-2.6-2.48-3.08-4.49-1.2.16-2.32-.41-3.12-1.57-1.49-1.9-2.45-4.52-2.45-7.44h22.9c0 2.92-1.14 5.54-3.03 7.44z"/>
                </svg>
                <span className="text-4xl font-bold text-[#F3F4F6]">Partz Finda</span>
              </div>
              <p className="text-3xl font-bold text-[#F3F4F6] mb-2">What part do you need?</p>
              <p className="text-sm text-[#D1D5DB] text-center max-w-xs">Describe the car part you're looking for and I'll help you find exactly what you need</p>
            </div>

            {/* Main Input and Suggestions */}
            <div className="flex flex-col items-center w-full mb-8">
              <div className="flex w-full max-w-md items-center bg-[#4B5563] rounded-full px-5 py-3 shadow-lg">
                <input
                  className="flex-1 text-white bg-transparent focus:outline-none"
                  placeholder="I need a set of front brake pads for a 2018 Toyota Camry..."
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                />
                <button
                  onClick={handleNewRequest}
                  className="text-white px-4 py-2 rounded-full font-bold ml-2 bg-[#007AFF] hover:bg-[#005bb5] transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'Ask Gemini ✨'}
                </button>
              </div>

              <div className="flex flex-wrap justify-center mt-4 max-w-md">
                <button
                  onClick={() => handleSuggestedPrompt("Brake pads for a Honda Civic")}
                  className="bg-[#2B3441] text-[#D1D5DB] rounded-full px-4 py-2 m-1 text-sm font-medium hover:bg-[#4B5563] transition-colors"
                >
                  Brake pads for Honda Civic
                </button>
                <button
                  onClick={() => handleSuggestedPrompt("Engine oil filter")}
                  className="bg-[#2B3441] text-[#D1D5DB] rounded-full px-4 py-2 m-1 text-sm font-medium hover:bg-[#4B5563] transition-colors"
                >
                  Engine oil filter
                </button>
                <button
                  onClick={() => handleSuggestedPrompt("Headlight bulb replacement")}
                  className="bg-[#2B3441] text-[#D1D5DB] rounded-full px-4 py-2 m-1 text-sm font-medium hover:bg-[#4B5563] transition-colors"
                >
                  Headlight bulb replacement
                </button>
                <button
                  onClick={() => handleSuggestedPrompt("Transmission fluid")}
                  className="bg-[#2B3441] text-[#D1D5DB] rounded-full px-4 py-2 m-1 text-sm font-medium hover:bg-[#4B5563] transition-colors"
                >
                  Transmission fluid
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
              <button
                onClick={() => handleSuggestedPrompt("Provide expert recommendations for a car part")}
                className="bg-[#2B3441] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:bg-[#4B5563] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#9CA3AF] mb-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z"/>
                </svg>
                <p className="text-lg font-bold text-[#F3F4F6]">Expert Recommendations</p>
                <p className="text-xs text-[#D1D5DB] mt-1">Get professional advice on the right parts for your vehicle</p>
              </button>
              <button
                onClick={() => handleSuggestedPrompt("Check vehicle compatibility for a car part")}
                className="bg-[#2B3441] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:bg-[#4B5563] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#9CA3AF] mb-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z"/>
                </svg>
                <p className="text-lg font-bold text-[#F3F4F6]">Vehicle Compatibility</p>
                <p className="text-xs text-[#D1D5DB] mt-1">Ensure perfect fit with our comprehensive vehicle database</p>
              </button>
              <button
                onClick={() => handleSuggestedPrompt("Provide installation guide for a car part")}
                className="bg-[#2B3441] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:bg-[#4B5563] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#9CA3AF] mb-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z"/>
                </svg>
                <p className="text-lg font-bold text-[#F3F4F6]">Installation Guide</p>
                <p className="text-xs text-[#D1D5DB] mt-1">Step-by-step instructions for safe and proper installation</p>
              </button>
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="flex flex-col flex-1 h-screen w-screen bg-[#1F2937] text-white p-6">
            <div className="flex items-center space-x-4 mb-4">
              <button onClick={() => setCurrentScreen('request')} className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
                </svg>
              </button>
              <div className="flex-1 text-center">
                <h1 className="text-xl font-bold">Your Request</h1>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-lg text-[#9CA3AF]">Loading...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 bg-[#2B3441] rounded-lg">
                <p className="text-[#D1D5DB] whitespace-pre-line">{responseContent}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleTextToSpeech(responseContent)}
                    className="bg-[#007AFF] text-white px-4 py-2 rounded-full font-bold hover:bg-[#005bb5] transition-colors"
                  >
                    Listen to Response
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'dashboard':
        return (
          <div className="flex flex-col flex-1 justify-center items-center bg-[#1E1E1E] p-4">
            <p className="text-xl text-[#E0E0E0]">Dashboard Screen (WIP)</p>
            {requests.map((request) => (
              <p key={request.id} className="text-[#E0E0E0] mt-2">{request.description}</p>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1E1E1E]">
      <script src="https://cdn.tailwindcss.com"></script>
      {renderScreen()}
    </div>
  );
};

export default App;
