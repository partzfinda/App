import React, { useState } from "react";
import { View, Text, Image, SafeAreaView, StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useColorScheme } from "nativewind";
import AuthChoice from "../components/auth/AuthChoice";
import MechanicDashboard from "../components/mechanic/MechanicDashboard";
import SupplierDashboard from "../components/supplier/SupplierDashboard";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { colorScheme } = useColorScheme();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"mechanic" | "supplier" | null>(
    null,
  );

  // Handle authentication
  const handleAuthentication = (type: "mechanic" | "supplier") => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  // Handle sign out
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserType(null);
  };

  // Hide splash screen when fonts are loaded
  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      {!isAuthenticated ? (
        <View className="flex-1 justify-center items-center p-4">
          <View className="w-full max-w-md">
            <View className="items-center mb-8">
              <Image
                source={require("../assets/images/icon.png")}
                style={{ width: 120, height: 120 }}
                className="rounded-xl mb-4"
              />
              <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                Partz Finda
              </Text>
              <Text className="text-slate-600 dark:text-slate-300 text-center mt-2">
                Connect mechanics with auto parts suppliers
              </Text>
            </View>

            <AuthChoice onAuthenticate={handleAuthentication} />
          </View>
        </View>
      ) : (
        <>
          {userType === "mechanic" && (
            <MechanicDashboard onSignOut={handleSignOut} />
          )}

          {userType === "supplier" && (
            <SupplierDashboard onSignOut={handleSignOut} />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
