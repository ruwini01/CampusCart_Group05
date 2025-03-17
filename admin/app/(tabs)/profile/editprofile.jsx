import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../../components/FormField";
import SaveButton from "../../../components/SaveButton";
import axios from "react-native-axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        `${apiUrl}/admin/changepassword`,
        { currentPassword, newPassword },
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        Alert.alert("Error", response.data.message || "Password change failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while changing the password.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <ScrollView>
        <View>
          <Text className="font-semibold text-xl mb-6">Change Password</Text>

          <View className="mb-4">
            <Text className="text-base pb-1">Current Password</Text>
            <FormField
              value={currentPassword}
              handleChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry
            />
          </View>

          <View className="mb-4">
            <Text className="text-base pb-1">New Password</Text>
            <FormField
              value={newPassword}
              handleChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
            />
          </View>

          <View className="mb-6">
            <Text className="text-base pb-1">Confirm New Password</Text>
            <FormField
              value={confirmNewPassword}
              handleChangeText={setConfirmNewPassword}
              placeholder="Confirm new password"
              secureTextEntry
            />
          </View>

          <SaveButton
            handlePress={handleChangePassword}
            fontStyle="Montserrat_600SemiBold"
            textStyles="text-white"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
