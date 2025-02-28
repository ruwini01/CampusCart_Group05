import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BuyAndSellPosts from '../../../components/BuyAndSellPosts';
import SearchInput from '../../../components/SearchInput';

const BuyAndSellHome = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1">
      <Text className="font-semibold text-xl mb-6 px-6">Items to Sell</Text>
      <View className="mb-6 px-6">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>
      <BuyAndSellPosts searchQuery={searchQuery} />
    </SafeAreaView>
  );
};

export default BuyAndSellHome;