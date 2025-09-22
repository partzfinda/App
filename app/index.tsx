import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Audio } from 'expo-av';
import base64 from 'base-64';

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
        tools: [{ google_search: {} }],
      };
      const apiKey = 'AIzaSyDvQAOgsyTuLhFkzIzOrZTbOrjubSJSicY';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-0514:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response found.';
      setResponseContent(text);
      setCurrentScreen('chat');
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setResponseContent(
        "Sorry, I'm having trouble with that request. Please try again."
      );
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
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
        model: 'gemini-1.5-flash-preview-tts',
      };
      const apiKey = 'AIzaSyDvQAOgsyTuLhFkzIzOrZTbOrjubSJSicY';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview-tts:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;

      if (audioData) {
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: `data:audio/wav;base64,${audioData}` });
        await sound.playAsync();
      } else {
        console.error('Audio data not found or invalid.');
      }
    } catch (error) {
      console.error('Error with Text-to-Speech:', error);
    }
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
          <ScrollView className="flex-1 bg-[#1F2937] p-6">
            <SafeAreaView>
              <View className="flex flex-col items-center mt-12 mb-8">
                {/* Logo and App Name */}
                <View className="flex flex-row items-center space-x-2 mb-4">
                  <Svg
                    height="40"
                    width="40"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                  >
                    <Path d="M18.92 6.01c-.8.8-1.92 1.41-3.12 1.57-.48 2.01-1.63 3.65-3.08 4.49v.01c-1.39.81-2.91 1.05-4.22.95-.56-2.18-1.57-4.14-2.81-5.63-1.07 1.34-1.78 2.89-2.09 4.54-1.89-1.9-3.03-4.52-3.03-7.44h22.9c0 2.92-1.14 5.54-3.03 7.44-.31-1.65-1.02-3.2-2.09-4.54-1.24 1.49-2.25 3.45-2.81 5.63-1.31.1-2.83-.14-4.22-.95v-.01c-1.45-.84-2.6-2.48-3.08-4.49-1.2.16-2.32-.41-3.12-1.57-1.49-1.9-2.45-4.52-2.45-7.44h22.9c0 2.92-1.14 5.54-3.03 7.44z" />
                  </Svg>
                  <Text className="text-4xl font-bold text-[#F3F4F6]">
                    Partz Finda
                  </Text>
                </View>
                <Text className="text-3xl font-bold text-[#F3F4F6] mb-2">
                  What part do you need?
                </Text>
                <Text className="text-sm text-[#D1D5DB] text-center max-w-xs">
                  Describe the car part you're looking for and I'll help you
                  find exactly what you need
                </Text>
              </View>

              {/* Main Input and Suggestions */}
              <View className="flex flex-col items-center w-full mb-8">
                <View className="flex flex-row w-full max-w-md items-center bg-[#4B5563] rounded-full px-5 py-3 shadow-lg">
                  <TextInput
                    className="flex-1 text-white bg-transparent"
                    placeholder="I need a set of front brake pads for a 2018 Toyota Camry..."
                    placeholderTextColor="#9CA3AF"
                    value={requestText}
                    onChangeText={setRequestText}
                  />
                  <TouchableOpacity
                    onPress={handleNewRequest}
                    className="text-white px-4 py-2 rounded-full font-bold ml-2 bg-[#007AFF]"
                    disabled={isLoading}
                  >
                    <Text className="text-white">
                      {isLoading ? '...' : 'Ask Gemini ✨'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex flex-row flex-wrap justify-center mt-4 max-w-md">
                  <TouchableOpacity
                    onPress={() =>
                      handleSuggestedPrompt('Brake pads for a Honda Civic')
                    }
                    className="bg-[#2B3441] rounded-full px-4 py-2 m-1"
                  >
                    <Text className="text-[#D1D5DB] text-sm font-medium">
                      Brake pads for Honda Civic
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSuggestedPrompt('Engine oil filter')}
                    className="bg-[#2B3441] rounded-full px-4 py-2 m-1"
                  >
                    <Text className="text-[#D1D5DB] text-sm font-medium">
                      Engine oil filter
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      handleSuggestedPrompt('Headlight bulb replacement')
                    }
                    className="bg-[#2B3441] rounded-full px-4 py-2 m-1"
                  >
                    <Text className="text-[#D1D5DB] text-sm font-medium">
                      Headlight bulb replacement
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSuggestedPrompt('Transmission fluid')}
                    className="bg-[#2B3441] rounded-full px-4 py-2 m-1"
                  >
                    <Text className="text-[#D1D5DB] text-sm font-medium">
                      Transmission fluid
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Feature Cards */}
              <View className="w-full max-w-2xl mx-auto">
                <TouchableOpacity
                  onPress={() =>
                    handleSuggestedPrompt(
                      'Provide expert recommendations for a car part'
                    )
                  }
                  className="bg-[#2B3441] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg mb-4"
                >
                  <Svg
                    height="48"
                    width="48"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                    className="mb-3"
                  >
                    <Path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z" />
                  </Svg>
                  <Text className="text-lg font-bold text-[#F3F4F6]">
                    Expert Recommendations
                  </Text>
                  <Text className="text-xs text-[#D1D5DB] mt-1">
                    Get professional advice on the right parts for your vehicle
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleSuggestedPrompt(
                      'Check vehicle compatibility for a car part'
                    )
                  }
                  className="bg-[#2B3441] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg mb-4"
                >
                  <Svg
                    height="48"
                    width="48"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                    className="mb-3"
                  >
                    <Path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z" />
                  </Svg>
                  <Text className="text-lg font-bold text-[#F3F4F6]">
                    Vehicle Compatibility
                  </Text>
                  <Text className="text-xs text-[#D1D5DB] mt-1">
                    Ensure perfect fit with our comprehensive vehicle database
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleSuggestedPrompt(
                      'Provide installation guide for a car part'
                    )
                  }
                  className="bg-[#2B3441] rounded-2xl p-6 flex flex-col items-center text-center shadow-lg"
                >
                  <Svg
                    height="48"
                    width="48"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                    className="mb-3"
                  >
                    <Path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z" />
                  </Svg>
                  <Text className="text-lg font-bold text-[#F3F4F6]">
                    Installation Guide
                  </Text>
                  <Text className="text-xs text-[#D1D5DB] mt-1">
                    Step-by-step instructions for safe and proper installation
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ScrollView>
        );

      case 'chat':
        return (
          <SafeAreaView className="flex-1 bg-[#1F2937] p-6">
            <View className="flex flex-row items-center space-x-4 mb-4">
              <TouchableOpacity
                onPress={() => setCurrentScreen('request')}
                className="text-white"
              >
                <Svg height="24" width="24" viewBox="0 0 24 24" fill="white">
                  <Path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
                </Svg>
              </TouchableOpacity>
              <View className="flex-1 text-center">
                <Text className="text-xl font-bold text-white">
                  Your Request
                </Text>
              </View>
            </View>

            {isLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#9CA3AF" />
                <Text className="text-lg text-[#9CA3AF] mt-4">Loading...</Text>
              </View>
            ) : (
              <ScrollView className="flex-1 p-4 bg-[#2B3441] rounded-lg">
                <Text className="text-[#D1D5DB]">{responseContent}</Text>
                <View className="mt-4 flex-row justify-end">
                  <TouchableOpacity
                    onPress={() => handleTextToSpeech(responseContent)}
                    className="bg-[#007AFF] px-4 py-2 rounded-full"
                  >
                    <Text className="text-white font-bold">
                      Listen to Response
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </SafeAreaView>
        );

      case 'dashboard':
        return (
          <View className="flex-1 justify-center items-center bg-[#1E1E1E] p-4">
            <Text className="text-xl text-[#E0E0E0]">
              Dashboard Screen (WIP)
            </Text>
            {requests.map((request) => (
              <Text key={request.id} className="text-[#E0E0E0] mt-2">
                {request.description}
              </Text>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-[#1E1E1E]">
      {renderScreen()}
    </View>
  );
};

export default App;