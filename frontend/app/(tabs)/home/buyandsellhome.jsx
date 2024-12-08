import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BuyAndSellPosts from '../../../components/BuyAndSellPosts';

const BuyAndSellHome = () => {
  return (
    <SafeAreaView className="flex-1">
      <Text className="font-semibold text-xl mb-6 px-6">Items to Sell</Text>
      <BuyAndSellPosts />
    </SafeAreaView>
  );
};

export default BuyAndSellHome;
