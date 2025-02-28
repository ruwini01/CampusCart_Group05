import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LostPosts from '../../../components/LostPosts';
import SearchInput from '../../../components/SearchInput';

const LostHome = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1">
      <Text className="font-semibold text-xl mb-6 px-6">Lost Items</Text>
      <View className="mb-6 px-6">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>
      <LostPosts searchQuery={searchQuery} />
    </SafeAreaView>
  );
};

export default LostHome;