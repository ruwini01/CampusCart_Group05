import { Text, View } from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BordingAccommodationPosts from '../../../components/BordingAccommodationPosts';
import SearchInput from '../../../components/SearchInput';

const BordingHousesHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SafeAreaView className="flex-1">
      <Text className="font-semibold text-xl mb-6 px-6">Available Bording Houses</Text>
      <View className="mb-6 px-6">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>
      <BordingAccommodationPosts searchQuery={searchQuery} />
    </SafeAreaView>
  );
};

export default BordingHousesHome;