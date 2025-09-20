import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react-native";

interface AuthChoiceProps {
  onRoleSelect?: (role: "mechanic" | "supplier") => void;
  onAuthenticate?: (
    role: "mechanic" | "supplier",
    type: "signin" | "register",
    credentials: { email: string; password: string; name?: string },
  ) => void;
}

export default function AuthChoice({
  onRoleSelect = () => {},
  onAuthenticate = () => {},
}: AuthChoiceProps) {
  const [selectedRole, setSelectedRole] = useState<
    "mechanic" | "supplier" | null
  >(null);
  const [authType, setAuthType] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRoleSelect = (role: "mechanic" | "supplier") => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  const handleSubmit = () => {
    if (!selectedRole) return;

    const credentials =
      authType === "register" ? { email, password, name } : { email, password };

    onAuthenticate(selectedRole, authType, credentials);

    // For demo purposes, navigate to the appropriate dashboard
    if (selectedRole === "mechanic") {
      router.push("/mechanic/dashboard");
    } else {
      router.push("/supplier/dashboard");
    }
  };

  const toggleAuthType = () => {
    setAuthType(authType === "signin" ? "register" : "signin");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 w-full bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-8">
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/images/icon.png")}
            className="w-24 h-24 mb-4"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-blue-600">Partz Finda</Text>
          <Text className="text-gray-500 text-center mt-2">
            Connect with auto parts suppliers and get the parts you need
          </Text>
        </View>

        {!selectedRole ? (
          <View className="space-y-6">
            <Text className="text-xl font-semibold text-center mb-4">
              I am a...
            </Text>

            <TouchableOpacity
              className="bg-blue-500 p-6 rounded-xl flex-row items-center justify-between"
              onPress={() => handleRoleSelect("mechanic")}
            >
              <View className="flex-row items-center">
                <User size={24} color="white" />
                <Text className="text-white text-lg font-semibold ml-3">
                  Mechanic
                </Text>
              </View>
              <ChevronRight size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-700 p-6 rounded-xl flex-row items-center justify-between"
              onPress={() => handleRoleSelect("supplier")}
            >
              <View className="flex-row items-center">
                <Building2 size={24} color="white" />
                <Text className="text-white text-lg font-semibold ml-3">
                  Parts Supplier
                </Text>
              </View>
              <ChevronRight size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-6">
            <View className="items-center mb-4">
              <Text className="text-xl font-semibold">
                {authType === "signin" ? "Sign In" : "Create Account"}
              </Text>
              <Text className="text-gray-500 mt-1">
                {selectedRole === "mechanic"
                  ? "Mechanic Account"
                  : "Supplier Account"}
              </Text>
            </View>

            {authType === "register" && (
              <View className="space-y-2">
                <Text className="text-gray-700 font-medium">Full Name</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                  <User size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-2 text-base"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            )}

            <View className="space-y-2">
              <Text className="text-gray-700 font-medium">Email</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <Mail size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-gray-700 font-medium">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <Lock size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className="bg-blue-600 py-3 rounded-lg items-center mt-4"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold text-lg">
                {authType === "signin" ? "Sign In" : "Create Account"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center mt-4"
              onPress={toggleAuthType}
            >
              <Text className="text-blue-600">
                {authType === "signin"
                  ? "Don't have an account? Register"
                  : "Already have an account? Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center mt-6"
              onPress={() => setSelectedRole(null)}
            >
              <Text className="text-gray-500">Go back to role selection</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
