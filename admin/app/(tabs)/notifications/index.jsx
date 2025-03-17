import {
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import MessageBox from "../../../components/MessageBox";
import SendMessage from "../../../components/SendMessage";

const Notification = () => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    console.log("sending broadcast message");
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
          />
          
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default Notification;
