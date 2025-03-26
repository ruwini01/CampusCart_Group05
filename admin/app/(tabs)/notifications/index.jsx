import {Text,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard,Alert} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageBox from "../../../components/MessageBox";
import SendMessage from "../../../components/SendMessage";
import FormField from "../../../components/FormField";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Notification = () => {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Error", "Please enter both title and message");
      return;
    }
  
    setIsLoading(true);
    console.log("sending broadcast message");
    
    try {
      // Get the admin token - use 'adminToken' instead of 'token'
      const token = await AsyncStorage.getItem('adminToken');
      
      // Make sure we have a token
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${apiUrl}/notifications/broadcast-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Make sure to use Bearer format
        },
        body: JSON.stringify({
          title: title.trim(),
          body: message.trim()
        })
      });
      
      const data = await response.json();
      
      console.log("Response status:", response.status);
      console.log("Response data:", data);
      
      if (!response.ok) {
        throw new Error(data.msg || data.message || 'Failed to send notification');
      }
      
      // Show success message
      Alert.alert("Success", data.message || "Broadcast message sent successfully");
      
      // Clear form fields
      setTitle('');
      setMessage('');
      
    } catch (error) {
      console.error('Error sending broadcast:', error);
      Alert.alert("Error", error.message || "Failed to send broadcast message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 p-4">
          <Text className="font-semibold text-xl mb-6">Broadcast Messages</Text>

          <Text className="font-semibold text-xl mb-6">Message:</Text>

          <FormField
            placeholder="Enter Title"
            value={title}
            onChangeText={setTitle}
            otherStyles={"mb-4"}
          />
          <MessageBox
            placeholder="Enter your message"
            value={message}
            onChangeText={setMessage}
            multiline={true}
            numberOfLines={4}
          />

          <SendMessage
            handlePress={sendMessage}
            fontStyle="Montserrat_600SemiBold"
            textStyles="text-white"
            isLoading={isLoading}
          />
          
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Notification;