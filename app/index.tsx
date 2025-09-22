import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
} from 'firebase/firestore';

declare const __firebase_config: string;
declare const __initial_auth_token: string;
declare const __app_id: string;

interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: Date;
}

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('request');
  const [requestText, setRequestText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [userId, setUserId] = useState<string>('');
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    // Firebase initialization
    console.log('Initializing Firebase...');
    try {
      const firebaseConfig = JSON.parse(
        typeof __firebase_config !== 'undefined' ? __firebase_config : '{}'
      );
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // Authenticate with custom token or anonymously
      const token =
        typeof __initial_auth_token !== 'undefined'
          ? __initial_auth_token
          : '';
      if (token) {
        signInWithCustomToken(firebaseAuth, token)
          .then((userCredential) => {
            setUserId(userCredential.user.uid);
            setIsDbReady(true);
            console.log(
              'Signed in with custom token. User ID:',
              userCredential.user.uid
            );
          })
          .catch((error) => {
            console.error('Error signing in with custom token:', error);
            signInAnonymously(firebaseAuth)
              .then((userCredential) => {
                setUserId(userCredential.user.uid);
                setIsDbReady(true);
                console.log(
                  'Signed in anonymously. User ID:',
                  userCredential.user.uid
                );
              })
              .catch(console.error);
          });
      } else {
        signInAnonymously(firebaseAuth)
          .then((userCredential) => {
            setUserId(userCredential.user.uid);
            setIsDbReady(true);
            console.log(
              'Signed in anonymously. User ID:',
              userCredential.user.uid
            );
          })
          .catch(console.error);
      }
    } catch (e) {
      console.error('Error initializing Firebase:', e);
    }
  }, []);

  useEffect(() => {
    if (isDbReady && db && userId) {
      console.log('Firebase is ready, setting user profile document.');
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      // Corrected the document path to have an even number of segments.
      const userRef = doc(db, 'artifacts', appId, 'users', userId);
      setDoc(userRef, { lastLogin: new Date() }, { merge: true }).catch(
        console.error
      );
    }
  }, [isDbReady, db, userId]);

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setRequestText('');

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    // Corrected the collection path.
    const chatCollectionRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      userId,
      'chats'
    );

    try {
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
      };
      const apiKey = 'AIzaSyDBwSYmYzdA9kmhr5KptPHEWIhxlkbvby0'; // <<<--- ADD YOUR API KEY HERE
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
      const geminiResponseText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response found.';

      const geminiMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'gemini',
        text: geminiResponseText,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, geminiMessage]);

      const chatDocRef = doc(chatCollectionRef);
      await setDoc(chatDocRef, {
        messages: [
          {
            sender: 'user',
            text: userMessage.text,
            timestamp: userMessage.timestamp.toISOString(),
          },
          {
            sender: 'gemini',
            text: geminiMessage.text,
            timestamp: geminiMessage.timestamp.toISOString(),
          },
        ],
      });

      setCurrentScreen('chat');
    } catch (error) {
      console.error('Error calling Gemini API or saving to Firestore:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'gemini',
        text: "Sorry, I'm having trouble with that request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      setCurrentScreen('chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setRequestText(prompt);
    handleSendMessage(prompt);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'request':
        return (
          <ScrollView style={styles.container}>
            <SafeAreaView>
              <View style={styles.centered}>
                <View style={styles.logoContainer}>
                  <Svg
                    height="40"
                    width="40"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                  >
                    <Path d="M18.92 6.01c-.8.8-1.92 1.41-3.12 1.57-.48 2.01-1.63 3.65-3.08 4.49v.01c-1.39.81-2.91 1.05-4.22.95-.56-2.18-1.57-4.14-2.81-5.63-1.07 1.34-1.78 2.89-2.09 4.54-1.89-1.9-3.03-4.52-3.03-7.44h22.9c0 2.92-1.14 5.54-3.03 7.44-.31-1.65-1.02-3.2-2.09-4.54-1.24 1.49-2.25 3.45-2.81 5.63-1.31.1-2.83-.14-4.22-.95v-.01c-1.45-.84-2.6-2.48-3.08-4.49-1.2.16-2.32-.41-3.12-1.57-1.49-1.9-2.45-4.52-2.45-7.44h22.9c0 2.92-1.14 5.54-3.03 7.44z" />
                  </Svg>
                  <Text style={styles.appName}>Partz Finda</Text>
                </View>
                <Text style={styles.title}>What part do you need?</Text>
                <Text style={styles.subtitle}>
                  Describe the car part you're looking for and I'll help you
                  find exactly what you need
                </Text>
              </View>

              <View style={styles.inputSection}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="I need a set of front brake pads for a 2018 Toyota Camry..."
                    placeholderTextColor="#9CA3AF"
                    value={requestText}
                    onChangeText={setRequestText}
                  />
                  <TouchableOpacity
                    onPress={() => handleSendMessage(requestText)}
                    style={styles.sendButton}
                    disabled={isLoading}
                  >
                    <Text style={styles.sendButtonText}>
                      {isLoading ? '...' : 'Ask Gemini ✨'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.suggestionsContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      handleSuggestedPrompt('Brake pads for a Honda Civic')
                    }
                    style={styles.suggestionButton}
                  >
                    <Text style={styles.suggestionText}>
                      Brake pads for Honda Civic
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSuggestedPrompt('Engine oil filter')}
                    style={styles.suggestionButton}
                  >
                    <Text style={styles.suggestionText}>
                      Engine oil filter
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      handleSuggestedPrompt('Headlight bulb replacement')
                    }
                    style={styles.suggestionButton}
                  >
                    <Text style={styles.suggestionText}>
                      Headlight bulb replacement
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSuggestedPrompt('Transmission fluid')}
                    style={styles.suggestionButton}
                  >
                    <Text style={styles.suggestionText}>
                      Transmission fluid
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.featureCardsContainer}>
                <TouchableOpacity
                  onPress={() =>
                    handleSuggestedPrompt(
                      'Provide expert recommendations for a car part'
                    )
                  }
                  style={styles.featureCard}
                >
                  <Svg
                    height="48"
                    width="48"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                    style={{ marginBottom: 12 }}
                  >
                    <Path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z" />
                  </Svg>
                  <Text style={styles.featureCardTitle}>
                    Expert Recommendations
                  </Text>
                  <Text style={styles.featureCardSubtitle}>
                    Get professional advice on the right parts for your vehicle
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleSuggestedPrompt(
                      'Check vehicle compatibility for a car part'
                    )
                  }
                  style={styles.featureCard}
                >
                  <Svg
                    height="48"
                    width="48"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                    style={{ marginBottom: 12 }}
                  >
                    <Path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z" />
                  </Svg>
                  <Text style={styles.featureCardTitle}>
                    Vehicle Compatibility
                  </Text>
                  <Text style={styles.featureCardSubtitle}>
                    Ensure perfect fit with our comprehensive vehicle database
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleSuggestedPrompt(
                      'Provide installation guide for a car part'
                    )
                  }
                  style={styles.featureCard}
                >
                  <Svg
                    height="48"
                    width="48"
                    viewBox="0 0 24 24"
                    fill="#9CA3AF"
                    style={{ marginBottom: 12 }}
                  >
                    <Path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z" />
                  </Svg>
                  <Text style={styles.featureCardTitle}>
                    Installation Guide
                  </Text>
                  <Text style={styles.featureCardSubtitle}>
                    Step-by-step instructions for safe and proper installation
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ScrollView>
        );
      case 'chat':
        return (
          <SafeAreaView style={styles.container}>
            <View style={styles.chatHeader}>
              <TouchableOpacity onPress={() => setCurrentScreen('request')}>
                <Svg height="24" width="24" viewBox="0 0 24 24" fill="white">
                  <Path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
                </Svg>
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.title}>Your Request</Text>
              </View>
            </View>
            {isLoading && messages.length === 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9CA3AF" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <ScrollView style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      styles.message,
                      msg.sender === 'user'
                        ? styles.userMessage
                        : styles.geminiMessage,
                    ]}
                  >
                    <Text
                      style={
                        msg.sender === 'user'
                          ? styles.userMessageText
                          : styles.geminiMessageText
                      }
                    >
                      {msg.text}
                    </Text>
                  </View>
                ))}
                {isLoading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#9CA3AF" />
                  </View>
                )}
              </ScrollView>
            )}
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Reply..."
                placeholderTextColor="#9CA3AF"
                value={requestText}
                onChangeText={setRequestText}
              />
              <TouchableOpacity
                onPress={() => handleSendMessage(requestText)}
                style={styles.sendButton}
                disabled={isLoading}
              >
                <Text style={styles.sendButtonText}>
                  {isLoading ? '...' : 'Send'}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        );
      default:
        return null;
    }
  };

  return <View style={styles.root}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    padding: 24,
  },
  centered: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F3F4F6',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F3F4F6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    maxWidth: 320,
  },
  inputSection: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    backgroundColor: '#4B5563',
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    color: 'white',
    backgroundColor: 'transparent',
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginLeft: 8,
    backgroundColor: '#007AFF',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    maxWidth: 480,
  },
  suggestionButton: {
    backgroundColor: '#2B3441',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },
  suggestionText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '500',
  },
  featureCardsContainer: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  featureCard: {
    backgroundColor: '#2B3441',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F3F4F6',
  },
  featureCardSubtitle: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#9CA3AF',
    marginTop: 16,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#2B3441',
    borderRadius: 8,
    padding: 16,
  },
  message: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#4B5563',
    alignSelf: 'flex-end',
  },
  geminiMessage: {
    backgroundColor: '#1F2937',
    alignSelf: 'flex-start',
  },
  userMessageText: {
    color: 'white',
  },
  geminiMessageText: {
    color: '#D1D5DB',
  },
  chatInputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#4B5563',
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatInput: {
    flex: 1,
    color: 'white',
    backgroundColor: 'transparent',
  },
});

export default App;
