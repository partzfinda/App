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
import { Send, User, Building2 } from "lucide-react-native";

interface Message {
  id: string;
  text: string;
  sender: "mechanic" | "supplier";
  timestamp: Date;
}

interface SupplierChatProps {
  supplierName?: string;
  partRequest?: string;
}

const SupplierChat: React.FC<SupplierChatProps> = ({
  supplierName = "AutoParts Pro",
  partRequest = "Front brake pads for 2018 Toyota Camry",
}) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi! I see you're looking for ${partRequest}. I have those in stock. Would you like me to send you a quote?`,
      sender: "supplier",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
    {
      id: "2",
      text: "Yes, please! I need them as soon as possible.",
      sender: "mechanic",
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    },
    {
      id: "3",
      text: "Great! I can offer you OEM quality brake pads for $89.99 + shipping. They're in stock and I can ship today. Would that work for you?",
      sender: "supplier",
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    },
  ]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: "mechanic",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      
      // Simulate supplier response
      setTimeout(() => {
        const responses = [
          "Thanks for your message! Let me check on that for you.",
          "I'll get back to you with more details shortly.",
          "That sounds good! I'll prepare the quote for you.",
          "Perfect! I'll process that right away.",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const systemResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: "supplier",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemResponse]);
      }, 1500);

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
        <View className="bg-blue-600 px-6 py-4">
          <View className="flex-row items-center">
            <Building2 size={24} color="white" />
            <View className="ml-3 flex-1">
              <Text className="text-lg font-semibold text-white">
                {supplierName}
              </Text>
              <Text className="text-blue-100 text-sm">
                Online • Responds quickly
              </Text>
            </View>
          </View>
        </View>

        {/* Part Request Info */}
        <View className="bg-blue-50 px-6 py-3 border-b border-blue-100">
          <Text className="text-sm text-blue-600 font-medium">
            Request: {partRequest}
          </Text>
        </View>

        {/* Messages */}
        <ScrollView className="flex-1 px-4 py-6">
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${
                message.sender === "mechanic" ? "items-end" : "items-start"
              }`}
            >
              <View className="flex-row items-start max-w-[80%]">
                {message.sender === "supplier" && (
                  <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-2 mt-1">
                    <Building2 size={16} color="#2563eb" />
                  </View>
                )}
                
                <View
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === "mechanic"
                      ? "bg-blue-600 rounded-br-md"
                      : "bg-gray-100 rounded-bl-md"
                  }`}
                >
                  <Text
                    className={`text-base leading-5 ${
                      message.sender === "mechanic" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {message.text}
                  </Text>
                </View>
                
                {message.sender === "mechanic" && (
                  <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center ml-2 mt-1">
                    <User size={16} color="#059669" />
                  </View>
                )}
              </View>
              
              <Text className={`text-xs text-gray-400 mt-1 px-2 ${
                message.sender === "mechanic" ? "text-right" : "text-left"
              }`}>
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
                placeholder="Type your message..."
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
                style={{ marginLeft: 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SupplierChat;