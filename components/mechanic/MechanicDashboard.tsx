import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Search, Plus, Bell, Settings } from "lucide-react-native";
import PartRequestCard from "../parts/PartRequestCard";

interface MechanicDashboardProps {
  userName?: string;
  activeRequests?: Array<{
    id: string;
    partName: string;
    requestDate: string;
    status: "pending" | "quoted" | "confirmed" | "shipped" | "delivered";
    supplier?: {
      name: string;
      id: string;
    };
  }>;
  onCreateRequest?: () => void;
  onSearchParts?: () => void;
  onViewSuppliers?: () => void;
  onViewNotifications?: () => void;
  onViewSettings?: () => void;
}

const MechanicDashboard: React.FC<MechanicDashboardProps> = ({
  userName = "John Mechanic",
  activeRequests = [
    {
      id: "1",
      partName: "Brake Pads (Front)",
      requestDate: "2023-10-15",
      status: "quoted",
      supplier: {
        name: "AutoParts Plus",
        id: "sup1",
      },
    },
    {
      id: "2",
      partName: "Oil Filter",
      requestDate: "2023-10-14",
      status: "confirmed",
      supplier: {
        name: "Parts Warehouse",
        id: "sup2",
      },
    },
    {
      id: "3",
      partName: "Spark Plugs (Set of 4)",
      requestDate: "2023-10-12",
      status: "shipped",
      supplier: {
        name: "AutoParts Plus",
        id: "sup1",
      },
    },
    {
      id: "4",
      partName: "Air Filter",
      requestDate: "2023-10-10",
      status: "delivered",
      supplier: {
        name: "Parts Warehouse",
        id: "sup2",
      },
    },
    {
      id: "5",
      partName: "Alternator",
      requestDate: "2023-10-08",
      status: "pending",
      supplier: null,
    },
  ],
  onCreateRequest = () => console.log("Create new request"),
  onSearchParts = () => console.log("Search parts"),
  onViewSuppliers = () => console.log("View suppliers"),
  onViewNotifications = () => console.log("View notifications"),
  onViewSettings = () => console.log("View settings"),
}) => {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "active" | "completed"
  >("all");

  // Filter requests based on active tab
  const filteredRequests = activeRequests.filter((request) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return request.status === "pending";
    if (activeTab === "active")
      return ["quoted", "confirmed", "shipped"].includes(request.status);
    if (activeTab === "completed") return request.status === "delivered";
    return true;
  });

  // Count requests by status
  const pendingCount = activeRequests.filter(
    (r) => r.status === "pending",
  ).length;
  const activeCount = activeRequests.filter((r) =>
    ["quoted", "confirmed", "shipped"].includes(r.status),
  ).length;
  const completedCount = activeRequests.filter(
    (r) => r.status === "delivered",
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="bg-blue-600 px-4 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white text-lg font-bold">
                Welcome back,
              </Text>
              <Text className="text-white text-xl font-bold">{userName}</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                onPress={onViewNotifications}
                className="bg-blue-500 p-2 rounded-full mr-3"
              >
                <Bell size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onViewSettings}
                className="bg-blue-500 p-2 rounded-full"
              >
                <Settings size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Summary */}
          <View className="flex-row justify-between bg-white rounded-lg p-3 shadow-sm">
            <View className="items-center flex-1">
              <Text className="text-gray-500 text-xs">Pending</Text>
              <Text className="text-blue-600 font-bold text-lg">
                {pendingCount}
              </Text>
            </View>
            <View className="items-center flex-1 border-x border-gray-200">
              <Text className="text-gray-500 text-xs">Active</Text>
              <Text className="text-blue-600 font-bold text-lg">
                {activeCount}
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-gray-500 text-xs">Completed</Text>
              <Text className="text-blue-600 font-bold text-lg">
                {completedCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between px-4 py-4">
          <TouchableOpacity
            onPress={onCreateRequest}
            className="bg-blue-600 flex-row items-center px-4 py-2 rounded-lg flex-1 mr-2"
          >
            <Plus size={20} color="white" />
            <Text className="text-white font-semibold ml-2">New Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSearchParts}
            className="bg-white border border-gray-300 flex-row items-center px-4 py-2 rounded-lg flex-1 ml-2"
          >
            <Search size={20} color="#4B5563" />
            <Text className="text-gray-700 font-semibold ml-2">
              Search Parts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row border-b border-gray-200 px-4">
          {["all", "pending", "active", "completed"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`py-3 px-4 ${activeTab === tab ? "border-b-2 border-blue-600" : ""}`}
            >
              <Text
                className={`${activeTab === tab ? "text-blue-600 font-semibold" : "text-gray-500"} capitalize`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Request List */}
        <ScrollView className="flex-1 px-4 pt-2">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <PartRequestCard
                key={request.id}
                partName={request.partName}
                requestDate={request.requestDate}
                status={request.status}
                supplierName={request.supplier?.name}
              />
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-500 text-center">
                No {activeTab !== "all" ? activeTab : ""} requests found.
              </Text>
              {activeTab !== "all" && (
                <TouchableOpacity onPress={() => setActiveTab("all")}>
                  <Text className="text-blue-600 mt-2">View all requests</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View className="h-6" />
        </ScrollView>

        {/* View Suppliers Button */}
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={onViewSuppliers}
            className="bg-gray-100 border border-gray-300 py-3 rounded-lg items-center"
          >
            <Text className="text-gray-700 font-semibold">
              Browse Suppliers
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MechanicDashboard;
