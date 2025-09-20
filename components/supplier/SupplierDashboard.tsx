import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  Search,
  Bell,
  Package,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Truck,
  ShoppingBag,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PartRequestCard from "../parts/PartRequestCard";

interface SupplierDashboardProps {
  supplierName?: string;
  unreadNotifications?: number;
  pendingRequests?: number;
  inProgressOrders?: number;
  completedOrders?: number;
  recentRequests?: Array<{
    id: string;
    partName: string;
    requestDate: string;
    status: "pending" | "quoted" | "accepted" | "declined";
    mechanicName: string;
    vehicleInfo: string;
  }>;
}

export default function SupplierDashboard({
  supplierName = "AutoParts Plus",
  unreadNotifications = 3,
  pendingRequests = 5,
  inProgressOrders = 8,
  completedOrders = 12,
  recentRequests = [
    {
      id: "1",
      partName: "Brake Pads (Toyota Camry 2019)",
      requestDate: "2023-06-15",
      status: "pending",
      mechanicName: "John Smith",
      vehicleInfo: "Toyota Camry 2019",
    },
    {
      id: "2",
      partName: "Oil Filter (Honda Civic 2020)",
      requestDate: "2023-06-14",
      status: "quoted",
      mechanicName: "Mike Johnson",
      vehicleInfo: "Honda Civic 2020",
    },
    {
      id: "3",
      partName: "Alternator (Ford F-150 2018)",
      requestDate: "2023-06-13",
      status: "accepted",
      mechanicName: "Sarah Williams",
      vehicleInfo: "Ford F-150 2018",
    },
  ],
}: SupplierDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderSidebar = () => (
    <View className="w-64 h-full bg-gray-100 border-r border-gray-200 p-4">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-blue-800">Partz Finda</Text>
        <Text className="text-sm text-gray-500">Supplier Portal</Text>
      </View>

      <View className="space-y-1">
        <TouchableOpacity
          className={`flex-row items-center p-3 rounded-lg ${activeTab === "dashboard" ? "bg-blue-100" : ""}`}
          onPress={() => setActiveTab("dashboard")}
        >
          <Package
            size={20}
            color={activeTab === "dashboard" ? "#1e40af" : "#64748b"}
          />
          <Text
            className={`ml-3 ${activeTab === "dashboard" ? "text-blue-800 font-medium" : "text-gray-600"}`}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center p-3 rounded-lg ${activeTab === "inventory" ? "bg-blue-100" : ""}`}
          onPress={() => setActiveTab("inventory")}
        >
          <ShoppingBag
            size={20}
            color={activeTab === "inventory" ? "#1e40af" : "#64748b"}
          />
          <Text
            className={`ml-3 ${activeTab === "inventory" ? "text-blue-800 font-medium" : "text-gray-600"}`}
          >
            Inventory
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center p-3 rounded-lg ${activeTab === "orders" ? "bg-blue-100" : ""}`}
          onPress={() => setActiveTab("orders")}
        >
          <Truck
            size={20}
            color={activeTab === "orders" ? "#1e40af" : "#64748b"}
          />
          <Text
            className={`ml-3 ${activeTab === "orders" ? "text-blue-800 font-medium" : "text-gray-600"}`}
          >
            Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center p-3 rounded-lg ${activeTab === "analytics" ? "bg-blue-100" : ""}`}
          onPress={() => setActiveTab("analytics")}
        >
          <BarChart3
            size={20}
            color={activeTab === "analytics" ? "#1e40af" : "#64748b"}
          />
          <Text
            className={`ml-3 ${activeTab === "analytics" ? "text-blue-800 font-medium" : "text-gray-600"}`}
          >
            Analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center p-3 rounded-lg ${activeTab === "settings" ? "bg-blue-100" : ""}`}
          onPress={() => setActiveTab("settings")}
        >
          <Settings
            size={20}
            color={activeTab === "settings" ? "#1e40af" : "#64748b"}
          />
          <Text
            className={`ml-3 ${activeTab === "settings" ? "text-blue-800 font-medium" : "text-gray-600"}`}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-auto">
        <TouchableOpacity className="flex-row items-center p-3 rounded-lg">
          <LogOut size={20} color="#ef4444" />
          <Text className="ml-3 text-red-500">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
      <View>
        <Text className="text-2xl font-bold text-gray-800">
          Welcome, {supplierName}
        </Text>
        <Text className="text-gray-500">
          Manage your parts requests and inventory
        </Text>
      </View>

      <View className="flex-row items-center space-x-4">
        <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
          <Search size={20} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity className="p-2 bg-gray-100 rounded-full relative">
          <Bell size={20} color="#64748b" />
          {unreadNotifications > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {unreadNotifications}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatCards = () => (
    <View className="flex-row justify-between p-4">
      <View className="bg-white rounded-xl p-4 shadow-sm flex-1 mr-4">
        <Text className="text-gray-500 text-sm">Pending Requests</Text>
        <Text className="text-2xl font-bold text-blue-800">
          {pendingRequests}
        </Text>
        <TouchableOpacity className="flex-row items-center mt-2">
          <Text className="text-blue-600 text-sm mr-1">View all</Text>
          <ChevronRight size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl p-4 shadow-sm flex-1 mr-4">
        <Text className="text-gray-500 text-sm">In Progress</Text>
        <Text className="text-2xl font-bold text-green-700">
          {inProgressOrders}
        </Text>
        <TouchableOpacity className="flex-row items-center mt-2">
          <Text className="text-blue-600 text-sm mr-1">View all</Text>
          <ChevronRight size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl p-4 shadow-sm flex-1">
        <Text className="text-gray-500 text-sm">Completed</Text>
        <Text className="text-2xl font-bold text-gray-700">
          {completedOrders}
        </Text>
        <TouchableOpacity className="flex-row items-center mt-2">
          <Text className="text-blue-600 text-sm mr-1">View all</Text>
          <ChevronRight size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecentRequests = () => (
    <View className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">Recent Requests</Text>
        <TouchableOpacity>
          <Text className="text-blue-600">View all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PartRequestCard
            partName={item.partName}
            requestDate={item.requestDate}
            status={item.status}
            mechanicName={item.mechanicName}
            vehicleInfo={item.vehicleInfo}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        scrollEnabled={false}
      />
    </View>
  );

  const renderInventorySection = () => (
    <View className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-gray-800">
          Inventory Status
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-600">Manage Inventory</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl p-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-500">Low Stock Items</Text>
          <View className="bg-orange-100 px-2 py-1 rounded">
            <Text className="text-orange-700 font-medium">12 items</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-500">Out of Stock</Text>
          <View className="bg-red-100 px-2 py-1 rounded">
            <Text className="text-red-700 font-medium">5 items</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500">Total SKUs</Text>
          <View className="bg-blue-100 px-2 py-1 rounded">
            <Text className="text-blue-700 font-medium">248 items</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 flex-row">
        {/* Sidebar - only visible on web */}
        {renderSidebar()}

        {/* Main Content */}
        <View className="flex-1">
          {renderHeader()}

          <ScrollView className="flex-1">
            {renderStatCards()}
            {renderRecentRequests()}
            {renderInventorySection()}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
