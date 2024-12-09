import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LostPosts from '../../../components/LostPosts';

const LostHome = () => {
  return (
    <SafeAreaView className="flex-1">
      <Text className="font-semibold text-xl mb-6 px-6">Lost items</Text>
      <LostPosts />
    </SafeAreaView>
  );
};

export default LostHome;