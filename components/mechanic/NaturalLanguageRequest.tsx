import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Send } from "lucide-react-native";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface NaturalLanguageRequestProps {
  onRequestSubmitted?: (request: string) => void;
}

const NaturalLanguageRequest: React.FC<NaturalLanguageRequestProps> = ({
  onRequestSubmitted = (request: string) => console.log("Request:", request),
}) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to Partz Finda! What part do you need? Describe it in your own words - include the vehicle make, model, year, and any specific details.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      
      // Simulate system response
      setTimeout(() => {
        const systemResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Got it! I'm processing your request and will connect you with suppliers who have this part. Let's get you signed in to continue.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemResponse]);
        
        // Call the callback after a short delay
        setTimeout(() => {
          onRequestSubmitted(inputText.trim());
        }, 2000);
      }, 1000);

      setInputText("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-100">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-600 mb-1">
              Partz Finda
            </Text>
            <Text className="text-sm text-gray-500">
              Describe what you need
            </Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView className="flex-1 px-4 py-6">
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${
                message.isUser ? "items-end" : "items-start"
              }`}
            >
              <View
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? "bg-blue-600 rounded-br-md"
                    : "bg-gray-100 rounded-bl-md"
                }`}
              >
                <Text
                  className={`text-base leading-5 ${
                    message.isUser ? "text-white" : "text-gray-800"
                  }`}
                >
                  {message.text}
                </Text>
              </View>
              <Text className="text-xs text-gray-400 mt-1 px-2">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View className="bg-white px-4 py-4 border-t border-gray-100">
          <View className="flex-row items-end space-x-3">
            <View className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 min-h-[44px] justify-center">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="I need a set of front brake pads for a 2018 Toyota Camry, VIN: ABC123DEF456..."
                placeholderTextColor="#9CA3AF"
                multiline
                className="text-base text-gray-800 max-h-24"
                textAlignVertical="center"
              />
            </View>
            <TouchableOpacity
              onPress={handleSendMessage}
              className={`w-11 h-11 rounded-full items-center justify-center ${
                inputText.trim() ? "bg-blue-600" : "bg-gray-300"
              }`}
              activeOpacity={0.8}
              disabled={!inputText.trim()}
            >
              <Send 
                size={20} 
                color="white" 
                style={{ marginLeft: 2 }} // Slight adjustment for visual centering
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NaturalLanguageRequest;