import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BordingAccommodationPosts from '../../../components/BordingAccommodationPosts';

const BordingHousesHome = () => {
  return (
    <SafeAreaView className="flex-1">
      <Text className="font-semibold text-xl mb-6 px-6">Available Bording Houses</Text>
      <BordingAccommodationPosts />
    </SafeAreaView>
  );
};

export default BordingHousesHome;
