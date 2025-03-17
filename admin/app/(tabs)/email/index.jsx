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
import FormField from "../../../components/FormField";
import MessageBox from "../../../components/MessageBox";
import SendMail from "../../../components/SendMail";
import * as MailComposer from "expo-mail-composer";

const Home = () => {
  const { userEmail: initialEmail } = useLocalSearchParams(); // Get initial email from params
  const [userEmail, setUserEmail] = useState(initialEmail || ""); // Store in state for editing

  //const { userEmail } = useLocalSearchParams(); // Get user email from params
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = async () => {
    if (!userEmail) {
      alert("Recipient email is missing.");
      return;
    }

    if (!subject.trim() || !message.trim()) {
      alert("Please enter both subject and message.");
      return;
    }

    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      alert("Email services are not available on this device.");
      return;
    }

    try {
      await MailComposer.composeAsync({
        recipients: userEmail ? [userEmail] : [], // Ensure it's an array
        subject,
        body: message,
      });

      alert("Email Sent Successfully!");
      setSubject("");
      setMessage("");
    } catch (error) {
      alert("Failed to send email. Please try again.");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 p-4">
          <Text className="font-semibold text-xl mb-6">Emails</Text>

          <Text className="font-semibold text-xl mb-6">To:</Text>
          <FormField
            placeholder="Enter recipient email"
            value={userEmail}
            onChangeText={(text) => setUserEmail(text)} // Updates the state
            editable={true}
          />

          <Text className="font-semibold text-xl mb-6">Subject:</Text>
          <FormField
            placeholder="Enter subject"
            value={subject}
            onChangeText={setSubject}
          />

          <Text className="font-semibold text-xl mb-6">Message:</Text>
          <MessageBox
            placeholder="Enter your message"
            value={message}
            onChangeText={setMessage}
            multiline={true}
            numberOfLines={4}
          />
          <SendMail
            handlePress={sendEmail}
            fontStyle="Montserrat_600SemiBold"
            textStyles="text-white"
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Home;
