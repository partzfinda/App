import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      // Listen for auth state changes to set the user ID
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // If no user is signed in, sign in anonymously as a fallback.
          signInAnonymously(firebaseAuth)
            .then((userCredential) => {
              setUserId(userCredential.user.uid);
              console.log('Signed in anonymously. User ID:', userCredential.user.uid);
            })
            .catch(console.error);
        }
        setIsDbReady(true);
      });

      return () => unsubscribe(); // Cleanup the listener on component unmount
    } catch (e) {
      console.error('Error initializing Firebase:', e);
    }
  }, []);

  useEffect(() => {
    if (isDbReady && db && userId) {
      console.log('Firebase is ready, setting user profile document.');
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userRef = doc(db, 'artifacts', appId, 'users', userId);
      setDoc(userRef, { lastLogin: new Date() }, { merge: true }).catch(
        console.error
      );
    }
  }, [isDbReady, db, userId]);

  // Auto-scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAuthError('');
    } catch (error: any) {
      console.error("Error during Google sign-in:", error);
      // Provide a more user-friendly error message for the common `auth/unauthorized-domain` issue.
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("Sign-in failed. This is a security feature that prevents phishing and will work correctly when the app is hosted on a live domain.");
      } else {
        setAuthError(error.message);
      }
    }
  };

  const handleGithubSignIn = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAuthError('');
    } catch (error: any) {
      console.error("Error during GitHub sign-in:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("Sign-in failed. This is a security feature that prevents phishing and will work correctly when the app is hosted on a live domain.");
      } else {
        setAuthError(error.message);
      }
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAuthError('');
    } catch (error: any) {
      console.error("Error during Facebook sign-in:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("Sign-in failed. This is a security feature that prevents phishing and will work correctly when the app is hosted on a live domain.");
      } else {
        setAuthError(error.message);
      }
    }
  };

  const handleAppleSignIn = async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      await signInWithPopup(auth, provider);
      setAuthError('');
    } catch (error: any) {
      console.error("Error during Apple sign-in:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError("Sign-in failed. This is a security feature that prevents phishing and will work correctly when the app is hosted on a live domain.");
      } else {
        setAuthError(error.message);
      }
    }
  };

  const handleEmailSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAuthError('');
    } catch (error: any) {
      console.error("Error during email sign-up:", error);
      setAuthError(error.message);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthError('');
    } catch (error: any) {
      console.error("Error during email sign-in:", error);
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserId(''); // Clear user ID on sign out
      setCurrentScreen('request'); // Go back to landing screen
      setMessages([]); // Clear messages
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

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
      const apiKey = '';
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
          <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 overflow-y-auto">
            <div className="flex flex-col items-center mt-12 mb-8">
              <div className="flex items-center mb-4">
                <svg
                  height="40"
                  width="40"
                  viewBox="0 0 24 24"
                  fill="#9CA3AF"
                >
                  <path d="M18.92 6.01c-.8.8-1.92 1.41-3.12 1.57-.48 2.01-1.63 3.65-3.08 4.49v.01c-1.39.81-2.91 1.05-4.22.95-.56-2.18-1.57-4.14-2.81-5.63-1.07 1.34-1.78 2.89-2.09 4.54-1.89-1.9-3.03-4.52-3.03-7.44h22.9c0 2.92-1.14 5.54-3.03 7.44-.31-1.65-1.02-3.2-2.09-4.54-1.24 1.49-2.25 3.45-2.81 5.63-1.31.1-2.83-.14-4.22-.95v-.01c-1.45-.84-2.6-2.48-3.08-4.49-1.2.16-2.32-.41-3.12-1.57-1.49-1.9-2.45-4.52-2.45-7.44h22.9c0 2.92-1.14 5.54-3.03 7.44z" />
                </svg>
                <span className="text-3xl font-bold text-gray-100 ml-2">
                  Partz Finda
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2">What part do you need?</h1>
              <p className="text-sm text-gray-400 text-center max-w-sm">
                Describe the car part you're looking for and I'll help you
                find exactly what you need
              </p>
            </div>

            <div className="w-full flex flex-col items-center mb-8">
              <div className="flex w-full max-w-xl items-center bg-gray-700 rounded-full px-5 py-3 shadow-lg">
                <input
                  type="text"
                  className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  placeholder="I need a set of front brake pads for a 2018 Toyota Camry..."
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(requestText);
                    }
                  }}
                />
                <button
                  onClick={() => handleSendMessage(requestText)}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'Ask Gemini ✨'}
                </button>
              </div>
              <div className="flex flex-wrap justify-center mt-4 max-w-xl">
                <button
                  onClick={() =>
                    handleSuggestedPrompt('Brake pads for a Honda Civic')
                  }
                  className="bg-gray-800 text-gray-400 text-sm font-medium py-2 px-4 rounded-full m-1 hover:bg-gray-700 transition-colors duration-200"
                >
                  Brake pads for Honda Civic
                </button>
                <button
                  onClick={() => handleSuggestedPrompt('Engine oil filter')}
                  className="bg-gray-800 text-gray-400 text-sm font-medium py-2 px-4 rounded-full m-1 hover:bg-gray-700 transition-colors duration-200"
                >
                  Engine oil filter
                </button>
                <button
                  onClick={() =>
                    handleSuggestedPrompt('Headlight bulb replacement')
                  }
                  className="bg-gray-800 text-gray-400 text-sm font-medium py-2 px-4 rounded-full m-1 hover:bg-gray-700 transition-colors duration-200"
                >
                  Headlight bulb replacement
                </button>
                <button
                  onClick={() => handleSuggestedPrompt('Transmission fluid')}
                  className="bg-gray-800 text-gray-400 text-sm font-medium py-2 px-4 rounded-full m-1 hover:bg-gray-700 transition-colors duration-200"
                >
                  Transmission fluid
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              <button
                onClick={() =>
                  handleSuggestedPrompt(
                    'Provide expert recommendations for a car part'
                  )
                }
                className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-2xl shadow-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg
                  height="48"
                  width="48"
                  viewBox="0 0 24 24"
                  fill="#9CA3AF"
                  className="mb-3"
                >
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z" />
                </svg>
                <h2 className="text-lg font-bold">
                  Expert Recommendations
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Get professional advice on the right parts for your vehicle
                </p>
              </button>
              <button
                onClick={() =>
                  handleSuggestedPrompt('Check vehicle compatibility for a car part')
                }
                className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-2xl shadow-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg
                  height="48"
                  width="48"
                  viewBox="0 0 24 24"
                  fill="#9CA3AF"
                  className="mb-3"
                >
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z" />
                </svg>
                <h2 className="text-lg font-bold">
                  Vehicle Compatibility
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Ensure perfect fit with our comprehensive vehicle database
                </p>
              </button>
              <button
                onClick={() =>
                  handleSuggestedPrompt('Provide installation guide for a car part')
                }
                className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-2xl shadow-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <svg
                  height="48"
                  width="48"
                  viewBox="0 0 24 24"
                  fill="#9CA3AF"
                  className="mb-3"
                >
                  <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm-1 15h2v2h-2zm-1.8-6.6l.8.8c.95.95 1.6 1.65 1.95 2.15.35.5.55 1.05.55 1.7 0 .8-.25 1.5-.75 2s-1.15.8-1.95.8c-.8 0-1.5-.2-2-.6s-.75-1-.75-1.6h2c0 .25.1.45.2.6s.25.2.45.2.35-.1.45-.2.2-.4.2-.6c0-.5-.15-1-.55-1.5s-1.15-1.15-2.05-2.05l-.8-.8c-.6-.6-.9-1.2-.9-2.05 0-1.2.45-2.2 1.35-3s2.15-1.2 3.85-1.2c1.7 0 3.25.4 4.65 1.2s2.5 1.8 3.25 3.2h-2.15c-.65-1.2-1.65-2.1-3-2.7s-2.8-.9-4.3-.9c-1.6 0-3.05.35-4.35 1.05s-2.25 1.75-2.95 3z" />
                </svg>
                <h2 className="text-lg font-bold">
                  Installation Guide
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Step-by-step instructions for safe and proper installation
                </p>
              </button>
            </div>
            
            <div className="flex flex-col items-center mt-8 space-y-4 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-400">Or sign in to save your chats</h2>
              {authError && <p className="text-red-500 text-center">{authError}</p>}
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.5 12.001c0-.789-.068-1.554-.184-2.298H12.24v4.321h5.882a5.109 5.109 0 01-2.213 3.359v2.806h3.61c2.115-1.947 3.321-4.75 3.321-8.238z" fill="#4285F4"/>
                  <path d="M12.24 22.001c2.92 0 5.378-.968 7.171-2.617l-3.61-2.806c-1.026.697-2.35.986-3.561.986-2.73 0-5.048-1.841-5.875-4.32H2.766v2.894a9.99 9.99 0 009.474 7.973z" fill="#34A853"/>
                  <path d="M6.365 13.928c-.28-.847-.442-1.745-.442-2.678s.162-1.831.442-2.678V5.688H2.766a9.99 9.99 0 000 10.624l3.599-2.384z" fill="#FBBC05"/>
                  <path d="M12.24 5.92c1.498 0 2.846.516 3.901 1.5l3.197-3.197C17.618 1.488 15.16 0 12.24 0a9.99 9.99 0 00-9.474 6.03l3.599 2.384c.827-2.479 3.145-4.32 5.875-4.32z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
              <button
                onClick={handleGithubSignIn}
                className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.111.82-.257.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.756-1.334-1.756-1.09-.744.082-.729.082-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.836 2.809 1.305 3.491.996.107-.775.418-1.305.762-1.605-2.665-.3-5.466-1.33-5.466-5.931 0-1.31.467-2.381 1.236-3.22-.124-.3-1.605-4.11-.3-5.093 0 0 1-.32 3.3.616 2.84-.784 5.86-.784 8.7 0 2.298-.936 3.297-.616 3.297-.616 1.304.983-.3 4.793-.3 5.093.77.839 1.233 1.91 1.233 3.22 0 4.61-2.805 5.626-5.474 5.922.428.369.812 1.101.812 2.219 0 1.606-.015 2.897-.015 3.28 0 .323.218.694.825.576C20.565 21.801 24 17.302 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Sign in with GitHub
              </button>
              <button
                onClick={handleFacebookSignIn}
                className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-700 hover:bg-blue-800 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 0H9.5c-4.43 0-8 3.57-8 8v8c0 4.43 3.57 8 8 8H14c4.43 0 8-3.57 8-8V8c0-4.43-3.57-8-8-8zm2.422 7.732h-1.922v-1.12c0-.52.23-.742.793-.742h1.129V3.886L14.718 3.88C13.256 3.88 12.062 4.664 12.062 6.556v1.176h-1.996v2.333h1.996v6.23h2.333V10.065h1.922l.244-2.333z" />
                </svg>
                Sign in with Facebook
              </button>
              <button
                onClick={handleAppleSignIn}
                className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-2.486 0-4.973 1.026-6.758 3.076-2.02 2.385-2.825 5.53-.787 8.324.935 1.258 2.08 2.37 3.36 3.396 1.13.91 2.296 1.76 3.5 2.502.66.41 1.34.79 2.04 1.135 1.77.87 3.638 1.405 5.568 1.405-.24-1.35-.91-2.585-1.98-3.61-.83-.8-1.74-1.54-2.73-2.19-.94-.6-1.89-1.21-2.86-1.85-.92-.6-1.82-1.22-2.69-1.89-.92-.69-1.81-1.42-2.67-2.19-.88-.79-1.71-1.63-2.48-2.52-1.22-1.4-1.91-3.03-1.91-4.75 0-3.35 2.58-6.11 5.92-6.11 1.76 0 3.39.75 4.54 2.11.2.25.4.52.59.8.03.04.06.09.09.13.06.08.13.16.19.24.4-.55.85-1.07 1.34-1.56 1.21-1.21 2.68-1.91 4.2-1.91 3.56 0 6.45 2.89 6.45 6.45 0 2.2-.95 4.19-2.55 5.68-1.37 1.28-3.14 2.05-5.06 2.05-1.02 0-2.01-.25-2.92-.72-.9-.47-1.69-1.12-2.36-1.89-.4-.46-.77-.96-1.1-1.47l-.1-.13-.03-.04c-.33-.5-.65-.99-.95-1.48-.44-.73-.83-1.48-1.19-2.26-.06-.15-.12-.3-.17-.45-.04-.12-.08-.24-.12-.36-.02-.07-.04-.14-.06-.2-1.15-2.5-1.16-5.32-.01-7.85 2.32-5.1 8.86-7.39 13.97-5.07 2.45 1.12 4.23 3.38 4.78 6.01.21 1.02.16 2.07-.15 3.09-.32 1.02-.85 1.96-1.57 2.81-1.19 1.38-2.69 2.22-4.32 2.42-.51.06-1.01.07-1.5.01-1.24-.15-2.44-.7-3.47-1.6-1.17-.98-2.11-2.21-2.73-3.6-.62-1.39-.89-2.87-.78-4.36z"/>
                </svg>
                Sign in with Apple
              </button>
            </div>
            
            <div className="flex flex-col items-center mt-8 space-y-4 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-gray-400">Or sign in with email</h2>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleEmailSignIn}
                  className="flex-1 px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={handleEmailSignUp}
                  className="flex-1 px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="flex flex-col h-screen bg-gray-900 text-white">
            <div className="flex items-center p-4 bg-gray-800 shadow-md">
              <button onClick={() => setCurrentScreen('request')} className="text-white mr-4">
                <svg
                  height="24"
                  width="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold flex-1 text-center">Your Request</h1>
              <span className="text-xs text-gray-500 ml-4">User ID: {userId}</span>
              <button onClick={handleSignOut} className="ml-4 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">
                Sign Out
              </button>
            </div>

            {isLoading && messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-10 w-10 text-gray-400 mx-auto mb-4 rounded-full border-4 border-gray-400 border-t-transparent"></div>
                  <p className="text-gray-400">Loading...</p>
                </div>
              </div>
            ) : (
              <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-sm ${msg.sender === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700 mr-auto'}`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-center">
                    <div className="animate-spin h-6 w-6 text-gray-400 rounded-full border-2 border-gray-400 border-t-transparent"></div>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-gray-800">
              <div className="flex items-center bg-gray-700 rounded-full px-5 py-3 shadow-lg">
                <input
                  type="text"
                  className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                  placeholder="Reply..."
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(requestText);
                    }
                  }}
                />
                <button
                  onClick={() => handleSendMessage(requestText)}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? '...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderScreen();
};

export default App;