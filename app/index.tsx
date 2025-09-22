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
      setCurrentScreen('dashboard');
      setRequestText('');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'request':
        return (
          <div className="flex flex-col h-full justify-end p-4 bg-[#1E1E1E]">
            <div className="flex-1 flex justify-center items-center">
              <p className="text-2xl font-bold text-[#E0E0E0]">What part do you need?</p>
            </div>
            <div className="flex flex-row items-center mt-4">
              <input
                className="flex-1 h-12 bg-[#333333] text-[#E0E0E0] rounded-full px-5 text-base focus:outline-none"
                placeholder="I need a set of front brake pads for a 2018 Toyota Camry..."
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
              />
              <button onClick={handleNewRequest} className="ml-2 bg-[#007AFF] rounded-full p-4 font-bold text-white">
                Send
              </button>
            </div>
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

      case 'chat':
        return (
          <div className="flex flex-col flex-1 justify-center items-center bg-[#1E1E1E] p-4">
            <p className="text-xl text-[#E0E0E0]">Chat Screen (WIP)</p>
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