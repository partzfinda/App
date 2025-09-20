import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react-native";

interface PartRequestCardProps {
  partName?: string;
  partNumber?: string;
  requestDate?: string;
  status?: "pending" | "approved" | "declined" | "shipped";
  supplierName?: string;
  onPress?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

const PartRequestCard: React.FC<PartRequestCardProps> = ({
  partName = "Brake Pads",
  partNumber = "BP-2023-456",
  requestDate = "2023-05-15",
  status = "pending",
  supplierName = "AutoParts Plus",
  onPress = () => console.log("Card pressed"),
  onAccept = () => console.log("Request accepted"),
  onDecline = () => console.log("Request declined"),
}) => {
  // Status color mapping
  const statusColors = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    declined: "bg-red-500",
    shipped: "bg-blue-500",
  };

  // Status text mapping
  const statusText = {
    pending: "Pending",
    approved: "Approved",
    declined: "Declined",
    shipped: "Shipped",
  };

  // Status icon mapping
  const StatusIcon = () => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} color="#10b981" />;
      case "declined":
        return <AlertCircle size={16} color="#ef4444" />;
      case "shipped":
        return <CheckCircle size={16} color="#3b82f6" />;
      default:
        return <Clock size={16} color="#f59e0b" />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{partName}</Text>
          <Text className="text-sm text-gray-500 mt-1">{partNumber}</Text>
        </View>
        <View
          className={`px-2 py-1 rounded-full flex-row items-center ${statusColors[status]}`}
        >
          <StatusIcon />
          <Text className="text-xs text-white ml-1 font-medium">
            {statusText[status]}
          </Text>
        </View>
      </View>

      <View className="mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs text-gray-500">Supplier</Text>
            <Text className="text-sm font-medium text-gray-700">
              {supplierName}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-gray-500">Requested on</Text>
            <Text className="text-sm font-medium text-gray-700">
              {requestDate}
            </Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </View>
      </View>

      {status === "pending" && (
        <View className="flex-row mt-3 pt-3 border-t border-gray-100">
          <TouchableOpacity
            onPress={onAccept}
            className="flex-1 bg-green-500 rounded-md py-2 mr-2 items-center"
          >
            <Text className="text-white font-medium">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDecline}
            className="flex-1 bg-gray-200 rounded-md py-2 ml-2 items-center"
          >
            <Text className="text-gray-700 font-medium">Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PartRequestCard;
