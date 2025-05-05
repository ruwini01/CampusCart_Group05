import { Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Bookmark from '../../../components/Bookmark';

const Home = () => {
  return (
    <SafeAreaView className="flex-1">
      <Text className="font-semibold text-xl mb-6 px-6">Bookmarked Posts</Text>
      <Bookmark />
    </SafeAreaView>
  );
};

export default Home;
