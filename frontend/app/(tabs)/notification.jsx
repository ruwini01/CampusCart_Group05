import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationList from '../../components/NotificationList';

const Notification = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="mx-6 my-2">
        <Text className="font-semibold text-xl">Notifications</Text>
      </View>
      <NotificationList />
    </SafeAreaView>
  );
};

export default Notification;
