import { Text, Button } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import FormField from '../../../components/FormField';
import * as MailComposer from 'expo-mail-composer';

const Home = () => {
  const { userEmail } = useLocalSearchParams(); // Get user email from params
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      alert("Email services are not available on this device.");
      return;
    }

    await MailComposer.composeAsync({
      recipients: [userEmail],  // Recipient (To)
      subject,                  // Email Subject
      body: message,            // Email Message
    });

    alert("Email Sent!");
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="font-semibold text-xl mb-6">Emails</Text>

      <Text className="font-semibold text-xl mb-6">From: campuscart05@gmail.com (Admin)</Text>

      <Text className="font-semibold text-xl mb-6">To:</Text>
      <FormField
        value={userEmail}
        editable={true}
      />

      <Text className="font-semibold text-xl mb-6">Subject:</Text>
      <FormField
        placeholder="Enter subject"
        value={subject}
        onChangeText={setSubject}
      />

      <Text className="font-semibold text-xl mb-6">Message:</Text>
      <FormField
        placeholder="Enter your message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Button title="Send Email"  className="flex-row justify-between" onPress={sendEmail} fontStyle="Montserrat_600SemiBold" textStyles="text-white" />
   
    </SafeAreaView>
  );
};

export default Home;
